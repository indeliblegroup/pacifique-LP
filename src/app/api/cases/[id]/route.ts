import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { canEditCase, canDeleteCases } from '@/lib/permissions';
import { updateCaseSchema } from '@/lib/validations';

// GET /api/cases/[id] - Get a single case
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();

    const { id } = await params;
    const caseData = await prisma.case.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
          include: {
            uploadedBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        emails: {
          orderBy: { createdAt: 'desc' },
          include: {
            sentBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        parties: true,
        mediationSessions: {
          orderBy: { sessionDate: 'desc' },
        },
      },
    });

    if (!caseData) {
      return NextResponse.json({ error: 'Processo não encontrado' }, { status: 404 });
    }

    // Check permissions
    if (!canEditCase(user.role, caseData.assignedToId || '', user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(caseData);
  } catch (error: any) {
    console.error('Error fetching case:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// PATCH /api/cases/[id] - Update a case
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();

    const { id } = await params;
    // Check if case exists
    const existingCase = await prisma.case.findUnique({
      where: { id },
    });

    if (!existingCase) {
      return NextResponse.json({ error: 'Processo não encontrado' }, { status: 404 });
    }

    // Check permissions
    if (!canEditCase(user.role, existingCase.assignedToId || '', user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateCaseSchema.parse(body);

    const updatedCase = await prisma.case.update({
      where: { id },
      data: validatedData,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'CASE_UPDATED',
        description: `Processo ${updatedCase.caseNumber} atualizado`,
        userId: user.id,
        caseId: updatedCase.id,
      },
    });

    // If status changed, log that too
    if (validatedData.status && validatedData.status !== existingCase.status) {
      await prisma.activity.create({
        data: {
          type: 'CASE_STATUS_CHANGED',
          description: `Status alterado de ${existingCase.status} para ${validatedData.status}`,
          userId: user.id,
          caseId: updatedCase.id,
          metadata: JSON.stringify({
            oldStatus: existingCase.status,
            newStatus: validatedData.status,
          }),
        },
      });
    }

    return NextResponse.json(updatedCase);
  } catch (error: any) {
    console.error('Error updating case:', error);

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

// DELETE /api/cases/[id] - Delete (archive) a case
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();

    if (!canDeleteCases(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const existingCase = await prisma.case.findUnique({
      where: { id },
    });

    if (!existingCase) {
      return NextResponse.json({ error: 'Processo não encontrado' }, { status: 404 });
    }

    // Archive instead of delete
    const archivedCase = await prisma.case.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'CASE_UPDATED',
        description: `Processo ${archivedCase.caseNumber} arquivado`,
        userId: user.id,
        caseId: archivedCase.id,
      },
    });

    return NextResponse.json({ message: 'Processo arquivado com sucesso' });
  } catch (error: any) {
    console.error('Error deleting case:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
