import { requireAuth } from '@/lib/auth-helpers';
import { canManageUsers } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import UsersListClient from '@/components/admin/users/users-list-client';

async function getInitialUsers() {
  const limit = 20;
  const page = 1;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        phone: true,
        createdAt: true,
        lastLoginAt: true,
      },
    }),
    prisma.user.count(),
  ]);

  // Serialize dates for client component
  const serializedUsers = users.map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    status: u.status,
    phone: u.phone,
    createdAt: u.createdAt.toISOString(),
    lastLoginAt: u.lastLoginAt?.toISOString() || null,
  }));

  return {
    data: serializedUsers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export default async function UsersPage() {
  const user = await requireAuth();

  if (!canManageUsers(user.role)) {
    redirect('/admin');
  }

  const { data, pagination } = await getInitialUsers();

  return (
    <UsersListClient
      initialData={data}
      initialPagination={pagination}
    />
  );
}
