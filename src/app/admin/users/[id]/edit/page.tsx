import { requireAuth } from '@/lib/auth-helpers';
import { canManageUsers } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UserForm } from '@/components/admin/users/user-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

async function getUser(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      phone: true,
    },
  });
}

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();

  if (!canManageUsers(user.role)) {
    redirect('/admin');
  }

  const { id } = await params;
  const targetUser = await getUser(id);

  if (!targetUser) {
    redirect('/admin/users');
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Usuários
        </Link>
        <h1 className="text-2xl font-heading font-bold text-primary">
          Editar Usuário
        </h1>
        <p className="mt-1 text-sm text-text-body">
          Atualize as informações de {targetUser.name}
        </p>
      </div>

      {/* Form */}
      <UserForm user={targetUser} isEdit />
    </div>
  );
}
