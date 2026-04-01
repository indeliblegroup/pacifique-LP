import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { updateSessionSchema } from '@/lib/validations';
import { canEditCase } from '@/lib/permissions';

// GET /api/sessions/[id] - Get session by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const mediationSession = await prisma.mediationSession.findUnique({
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
        conductedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!mediationSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check permissions
    if (
      session.user.role !== 'ADMIN' &&
      mediationSession.case.assignedToId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(mediationSession);
  } catch (error: any) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/sessions/[id] - Update session
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateSessionSchema.parse(body);

    // Get existing session
    const existingSession = await prisma.mediationSession.findUnique({
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

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check permissions
    if (!canEditCase(session.user.role, existingSession.case.assignedToId || '', session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Build update data
    const updateData: any = {};
    if (validatedData.sessionDate) {
      updateData.sessionDate = new Date(validatedData.sessionDate);
    }
    if (validatedData.duration !== undefined) {
      updateData.duration = validatedData.duration;
    }
    if (validatedData.location !== undefined) {
      updateData.location = validatedData.location;
    }
    if (validatedData.type) {
      updateData.type = validatedData.type;
    }
    if (validatedData.status) {
      updateData.status = validatedData.status;
    }
    if (validatedData.conductedById !== undefined) {
      updateData.conductedById = validatedData.conductedById;
    }
    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes;
    }
    if (validatedData.outcome !== undefined) {
      updateData.outcome = validatedData.outcome;
    }

    // Update session
    const updatedSession = await prisma.mediationSession.update({
      where: { id },
      data: updateData,
      include: {
        case: {
          select: {
            id: true,
            caseNumber: true,
            title: true,
          },
        },
        conductedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Log activity based on status change
    if (validatedData.status) {
      let activityDescription = '';
      let activityType: any = 'SESSION_UPDATED';

      switch (validatedData.status) {
        case 'COMPLETED':
          activityDescription = 'Sessão marcada como concluída';
          activityType = 'SESSION_COMPLETED';
          break;
        case 'CANCELLED':
          activityDescription = 'Sessão cancelada';
          activityType = 'SESSION_CANCELLED';
          break;
        case 'RESCHEDULED':
          activityDescription = 'Sessão reagendada';
          activityType = 'SESSION_RESCHEDULED';
          break;
        default:
          activityDescription = 'Sessão atualizada';
      }

      await prisma.activity.create({
        data: {
          type: activityType,
          description: activityDescription,
          userId: session.user.id,
          caseId: existingSession.case.id,
          metadata: JSON.stringify({
            sessionId: id,
            changes: validatedData,
          }),
        },
      });

      // Update case status if session completed
      if (validatedData.status === 'COMPLETED') {
        const currentCase = await prisma.case.findUnique({
          where: { id: existingSession.case.id },
          select: { status: true },
        });

        if (currentCase?.status === 'SESSION_SCHEDULED') {
          await prisma.case.update({
            where: { id: existingSession.case.id },
            data: { status: 'IN_MEDIATION' },
          });
        }
      }
    }

    return NextResponse.json(updatedSession);
  } catch (error: any) {
    console.error('Error updating session:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/[id] - Delete session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get existing session
    const existingSession = await prisma.mediationSession.findUnique({
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

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check permissions
    if (!canEditCase(session.user.role, existingSession.case.assignedToId || '', session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete session
    await prisma.mediationSession.delete({
      where: { id },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'SESSION_DELETED',
        description: 'Sessão removida',
        userId: session.user.id,
        caseId: existingSession.case.id,
        metadata: JSON.stringify({
          sessionId: id,
          sessionDate: existingSession.sessionDate,
        }),
      },
    });

    return NextResponse.json({ message: 'Session deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
