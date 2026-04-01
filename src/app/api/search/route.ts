import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

// GET /api/search - Global search across cases, users, and documents
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        cases: [],
        users: [],
        documents: [],
      });
    }

    const searchTerm = query.trim();

    // Search cases
    const casesWhere: any = {
      OR: [
        { caseNumber: { contains: searchTerm } },
        { title: { contains: searchTerm } },
        { requestingParty: { contains: searchTerm } },
        { requestedParty: { contains: searchTerm } },
      ],
    };

    // Conciliators can only see their assigned cases
    if (user.role === 'CONCILIATOR') {
      casesWhere.assignedToId = user.id;
    }

    const cases = await prisma.case.findMany({
      where: casesWhere,
      select: {
        id: true,
        caseNumber: true,
        title: true,
        status: true,
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    // Search users (only for admins and lawyers)
    let users: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
    }> = [];

    if (user.role === 'ADMIN' || user.role === 'LAWYER') {
      users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { email: { contains: searchTerm } },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        take: 5,
        orderBy: { name: 'asc' },
      });
    }

    // Search documents
    const documentsWhere: any = {
      OR: [
        { name: { contains: searchTerm } },
        { description: { contains: searchTerm } },
      ],
    };

    // Conciliators can only see documents from their assigned cases
    if (user.role === 'CONCILIATOR') {
      const assignedCaseIds = cases.map((c) => c.id);
      documentsWhere.caseId = { in: assignedCaseIds };
    }

    const documents = await prisma.document.findMany({
      where: documentsWhere,
      select: {
        id: true,
        name: true,
        type: true,
        caseId: true,
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      cases,
      users,
      documents,
    });
  } catch (error: any) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
