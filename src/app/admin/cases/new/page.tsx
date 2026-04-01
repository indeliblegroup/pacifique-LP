import { requireAuth } from '@/lib/auth-helpers';
import { canCreateCases } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CaseForm } from '@/components/admin/cases/case-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

async function getUsers() {
  return await prisma.user.findMany({
    where: {
      status: 'ACTIVE',
      role: {
        in: ['LAWYER', 'CONCILIATOR'],
      },
    },
    select: {
      id: true,
      name: true,
      role: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export default async function NewCasePage() {
  const user = await requireAuth();

  if (!canCreateCases(user.role)) {
    redirect('/admin/cases');
  }

  const users = await getUsers();

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/cases"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Processos
        </Link>
        <h1 className="text-2xl font-heading font-bold text-primary">
          Novo Processo
        </h1>
        <p className="mt-1 text-sm text-text-body">
          Crie um novo processo de mediação ou conciliação
        </p>
      </div>

      {/* Form */}
      <CaseForm users={users} />
    </div>
  );
}
