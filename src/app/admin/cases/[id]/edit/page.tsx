import { requireAuth } from '@/lib/auth-helpers';
import { canEditCase } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CaseForm } from '@/components/admin/cases/case-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

async function getCase(id: string) {
  return await prisma.case.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      nucleus: true,
      requestingParty: true,
      requestedParty: true,
      assignedToId: true,
    },
  });
}

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

export default async function EditCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;
  const caseData = await getCase(id);
  const users = await getUsers();

  if (!caseData) {
    redirect('/admin/cases');
  }

  // Check permissions
  if (!canEditCase(user.role, caseData.assignedToId || '', user.id)) {
    redirect('/admin/cases');
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/admin/cases/${id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Detalhes
        </Link>
        <h1 className="text-2xl font-heading font-bold text-primary">
          Editar Processo
        </h1>
        <p className="mt-1 text-sm text-text-body">
          Atualize as informações do processo
        </p>
      </div>

      {/* Form */}
      <CaseForm caseData={caseData} users={users} isEdit />
    </div>
  );
}
