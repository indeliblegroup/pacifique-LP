import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { updatePartySchema } from '@/lib/validations';
import { validateCPFOrCNPJ } from '@/lib/cpf-cnpj-utils';
import { canEditCase } from '@/lib/permissions';

// GET /api/parties/[id] - Get a single party
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const party = await prisma.party.findUnique({
      where: { id },
      include: {
        case: {
          select: {
            id: true,
            caseNumber: true,
            title: true,
            assignedToId: true,
          },
        },
      },
    });

    if (!party) {
      return NextResponse.json({ error: 'Parte não encontrada' }, { status: 404 });
    }

    // Check if user has access to this case
    if (
      user.role === 'CONCILIATOR' &&
      party.case.assignedToId !== user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(party);
  } catch (error: any) {
    console.error('Error fetching party:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// PUT /api/parties/[id] - Update a party
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Check if party exists
    const existingParty = await prisma.party.findUnique({
      where: { id },
      include: {
        case: {
          select: {
            id: true,
            assignedToId: true,
          },
        },
      },
    });

    if (!existingParty) {
      return NextResponse.json({ error: 'Parte não encontrada' }, { status: 404 });
    }

    // Check permissions
    if (
      !canEditCase(user.role, existingParty.case.assignedToId || '', user.id)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updatePartySchema.parse(body);

    // Validate CPF/CNPJ if provided
    if (validatedData.cpf && validatedData.cpf.trim()) {
      if (!validateCPFOrCNPJ(validatedData.cpf)) {
        return NextResponse.json(
          { error: 'CPF/CNPJ inválido' },
          { status: 400 }
        );
      }
    }

    const updatedParty = await prisma.party.update({
      where: { id },
      data: {
        ...(validatedData.type && { type: validatedData.type }),
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.cpf !== undefined && { cpf: validatedData.cpf || null }),
        ...(validatedData.email !== undefined && {
          email: validatedData.email || null,
        }),
        ...(validatedData.phone !== undefined && {
          phone: validatedData.phone || null,
        }),
        ...(validatedData.address !== undefined && {
          address: validatedData.address || null,
        }),
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
        description: `Informações da parte ${updatedParty.name} atualizadas`,
        userId: user.id,
        caseId: existingParty.case.id,
      },
    });

    return NextResponse.json(updatedParty);
  } catch (error: any) {
    console.error('Error updating party:', error);

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

// DELETE /api/parties/[id] - Delete a party
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Check if party exists
    const existingParty = await prisma.party.findUnique({
      where: { id },
      include: {
        case: {
          select: {
            id: true,
            assignedToId: true,
          },
        },
      },
    });

    if (!existingParty) {
      return NextResponse.json({ error: 'Parte não encontrada' }, { status: 404 });
    }

    // Check permissions
    if (
      !canEditCase(user.role, existingParty.case.assignedToId || '', user.id)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.party.delete({
      where: { id },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'CASE_UPDATED',
        description: `Parte ${existingParty.name} removida`,
        userId: user.id,
        caseId: existingParty.case.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting party:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
