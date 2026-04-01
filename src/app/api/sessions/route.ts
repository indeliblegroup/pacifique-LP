import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { createSessionSchema } from '@/lib/validations';
import { canEditCase } from '@/lib/permissions';

// GET /api/sessions - List all sessions (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('caseId');
    const status = searchParams.get('status');
    const from = searchParams.get('from'); // Start date
    const to = searchParams.get('to'); // End date

    const where: any = {};

    if (caseId) {
      where.caseId = caseId;
    }

    if (status) {
      where.status = status;
    }

    if (from || to) {
      where.sessionDate = {};
      if (from) where.sessionDate.gte = new Date(from);
      if (to) where.sessionDate.lte = new Date(to);
    }

    // If user is not admin, only show sessions for cases they're assigned to
    if (session.user.role !== 'ADMIN') {
      where.case = {
        assignedToId: session.user.id,
      };
    }

    const sessions = await prisma.mediationSession.findMany({
      where,
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
      orderBy: { sessionDate: 'asc' },
    });

    return NextResponse.json(sessions);
  } catch (error: any) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Create new session
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createSessionSchema.parse(body);

    // Check if user has permission to create session for this case
    const caseData = await prisma.case.findUnique({
      where: { id: validatedData.caseId },
      select: { id: true, assignedToId: true },
    });

    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    if (!canEditCase(session.user.role, caseData.assignedToId || '', session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create session
    const newSession = await prisma.mediationSession.create({
      data: {
        caseId: validatedData.caseId,
        sessionDate: new Date(validatedData.sessionDate),
        duration: validatedData.duration,
        location: validatedData.location,
        type: validatedData.type,
        conductedById: validatedData.conductedById,
        notes: validatedData.notes,
        status: 'SCHEDULED',
      },
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

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'SESSION_SCHEDULED',
        description: `Sessão agendada para ${new Date(validatedData.sessionDate).toLocaleString('pt-BR')}`,
        userId: session.user.id,
        caseId: validatedData.caseId,
        metadata: JSON.stringify({
          sessionId: newSession.id,
          sessionType: validatedData.type,
          duration: validatedData.duration,
        }),
      },
    });

    // Update case status if needed
    const currentCase = await prisma.case.findUnique({
      where: { id: validatedData.caseId },
      select: { status: true },
    });

    if (currentCase?.status === 'INTERVIEW_PHASE') {
      await prisma.case.update({
        where: { id: validatedData.caseId },
        data: { status: 'SESSION_SCHEDULED' },
      });
    }

    return NextResponse.json(newSession, { status: 201 });
  } catch (error: any) {
    console.error('Error creating session:', error);

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
