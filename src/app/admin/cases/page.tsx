import { requireAuth } from '@/lib/auth-helpers';
import { canCreateCases } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import CasesListClient from '@/components/admin/cases/cases-list-client';

async function getInitialCases(userId: string, userRole: string) {
  const where: any = {};

  // Conciliators can only see their assigned cases
  if (userRole === 'CONCILIATOR') {
    where.assignedToId = userId;
  }

  const limit = 20;
  const page = 1;
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
          },
        },
        _count: {
          select: {
            documents: true,
            emails: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.case.count({ where }),
  ]);

  // Serialize dates for client component
  const serializedCases = cases.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    closedAt: c.closedAt?.toISOString() || null,
  }));

  return {
    data: serializedCases,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getUsers() {
  return await prisma.user.findMany({
    where: {
      status: 'ACTIVE',
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: 'asc' },
  });
}

export default async function CasesPage() {
  const user = await requireAuth();
  const [{ data, pagination }, users] = await Promise.all([
    getInitialCases(user.id, user.role),
    getUsers(),
  ]);

  return (
    <CasesListClient
      canCreate={canCreateCases(user.role)}
      initialData={data}
      initialPagination={pagination}
      users={users}
    />
  );
}
