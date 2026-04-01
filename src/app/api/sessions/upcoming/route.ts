import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/sessions/upcoming - Get upcoming sessions (next 7 days)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);

    const where: any = {
      status: 'SCHEDULED',
      sessionDate: {
        gte: now,
        lte: future,
      },
    };

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
            nucleus: true,
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
    console.error('Error fetching upcoming sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
