import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { canCreateCases } from '@/lib/permissions';
import { createCaseSchema } from '@/lib/validations';
import { generateCaseNumber } from '@/lib/case-utils';

// GET /api/cases - List all cases
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const status = searchParams.get('status');
    const nucleus = searchParams.get('nucleus');
    const assignedToId = searchParams.get('assignedTo') || searchParams.get('assignedToId');
    const search = searchParams.get('search');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const where: any = {};

    // Multi-select status filter
    if (status) {
      const statusValues = status.split(',');
      where.status = { in: statusValues };
    }

    // Multi-select nucleus filter
    if (nucleus) {
      const nucleusValues = nucleus.split(',');
      where.nucleus = { in: nucleusValues };
    }

    // Assigned user filter
    if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    // Date range filter
    if (from || to) {
      where.createdAt = {};
      if (from) {
        where.createdAt.gte = new Date(from);
      }
      if (to) {
        // Add one day to include the entire 'to' date
        const toDate = new Date(to);
        toDate.setDate(toDate.getDate() + 1);
        where.createdAt.lt = toDate;
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { caseNumber: { contains: search } },
        { title: { contains: search } },
        { requestingParty: { contains: search } },
        { requestedParty: { contains: search } },
      ];
    }

    // Conciliators can only see cases assigned to them
    if (user.role === 'CONCILIATOR') {
      where.assignedToId = user.id;
    }

    const skip = (page - 1) * limit;

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        skip,
        take: limit,
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
          _count: {
            select: {
              documents: true,
              emails: true,
              activities: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.case.count({ where }),
    ]);

    return NextResponse.json({
      data: cases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST /api/cases - Create a new case
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!canCreateCases(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createCaseSchema.parse(body);

    // Generate case number
    const caseNumber = await generateCaseNumber();

    const newCase = await prisma.case.create({
      data: {
        caseNumber,
        title: validatedData.title,
        description: validatedData.description,
        nucleus: validatedData.nucleus,
        requestingParty: validatedData.requestingParty,
        requestedParty: validatedData.requestedParty,
        assignedToId: validatedData.assignedToId,
        createdById: user.id,
      },
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
        type: 'CASE_CREATED',
        description: `Processo ${newCase.caseNumber} criado`,
        userId: user.id,
        caseId: newCase.id,
      },
    });

    return NextResponse.json(newCase, { status: 201 });
  } catch (error: any) {
    console.error('Error creating case:', error);

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
