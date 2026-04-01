import { requireAuth } from '@/lib/auth-helpers';
import { canEditCase } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { CaseSessionsClient } from '@/components/admin/calendar/case-sessions-client';

async function getCaseWithSessions(id: string) {
  return await prisma.case.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
        },
      },
      mediationSessions: {
        orderBy: { sessionDate: 'desc' },
        include: {
          conductedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

export default async function CaseSessionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;
  const caseData = await getCaseWithSessions(id);

  if (!caseData) {
    redirect('/admin/cases');
  }

  // Check permissions
  if (!canEditCase(user.role, caseData.assignedToId || '', user.id)) {
    redirect('/admin/cases');
  }

  // Transform sessions to include case info
  const sessions = caseData.mediationSessions.map((session) => ({
    ...session,
    case: {
      id: caseData.id,
      caseNumber: caseData.caseNumber,
      title: caseData.title,
    },
  }));

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/admin/cases/${id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o Processo
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-primary">
              Sessões de Mediação
            </h1>
            <p className="mt-1 text-sm text-text-body">
              {caseData.caseNumber} - {caseData.title}
            </p>
          </div>
        </div>
      </div>

      {/* Sessions Client Component */}
      <CaseSessionsClient caseId={id} initialSessions={sessions} />
    </div>
  );
}
