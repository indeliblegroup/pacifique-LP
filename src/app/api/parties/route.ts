import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { createPartySchema } from '@/lib/validations';
import { validateCPFOrCNPJ } from '@/lib/cpf-cnpj-utils';
import { canEditCase } from '@/lib/permissions';

// GET /api/parties - List parties (with optional caseId filter)
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);

    const caseId = searchParams.get('caseId');

    const where: any = {};

    if (caseId) {
      where.caseId = caseId;

      // Check if user has access to this case
      const caseData = await prisma.case.findUnique({
        where: { id: caseId },
        select: { assignedToId: true },
      });

      if (!caseData) {
        return NextResponse.json(
          { error: 'Processo não encontrado' },
          { status: 404 }
        );
      }

      // Conciliators can only see parties for their cases
      if (user.role === 'CONCILIATOR' && caseData.assignedToId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const parties = await prisma.party.findMany({
      where,
      include: {
        case: {
          select: {
            id: true,
            caseNumber: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(parties);
  } catch (error: any) {
    console.error('Error fetching parties:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST /api/parties - Create a new party
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validatedData = createPartySchema.parse(body);

    // Check if case exists and user has access
    const caseData = await prisma.case.findUnique({
      where: { id: validatedData.caseId },
      select: { id: true, assignedToId: true },
    });

    if (!caseData) {
      return NextResponse.json(
        { error: 'Processo não encontrado' },
        { status: 404 }
      );
    }

    // Check permissions
    if (!canEditCase(user.role, caseData.assignedToId || '', user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Validate CPF/CNPJ if provided
    if (validatedData.cpf && validatedData.cpf.trim()) {
      if (!validateCPFOrCNPJ(validatedData.cpf)) {
        return NextResponse.json(
          { error: 'CPF/CNPJ inválido' },
          { status: 400 }
        );
      }
    }

    const newParty = await prisma.party.create({
      data: {
        caseId: validatedData.caseId,
        type: validatedData.type,
        name: validatedData.name,
        cpf: validatedData.cpf || null,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        address: validatedData.address || null,
      },
      include: {
        case: {
          select: {
            id: true,
            caseNumber: true,
            title: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'CASE_UPDATED',
        description: `Parte ${validatedData.type === 'REQUESTING' ? 'requerente' : 'requerida'} adicionada: ${validatedData.name}`,
        userId: user.id,
        caseId: validatedData.caseId,
      },
    });

    return NextResponse.json(newParty, { status: 201 });
  } catch (error: any) {
    console.error('Error creating party:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
