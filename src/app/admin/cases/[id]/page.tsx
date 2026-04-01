import { requireAuth } from '@/lib/auth-helpers';
import { canEditCase } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, FileText, Mail, Calendar, User, Users } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { STATUS_LABELS, STATUS_COLORS, NUCLEUS_LABELS } from '@/lib/case-utils';
import { CasePartiesClient } from '@/components/admin/parties/case-parties-client';

async function getCase(id: string) {
  return await prisma.case.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      documents: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      emails: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          sentBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      parties: {
        orderBy: { createdAt: 'asc' },
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          documents: true,
          emails: true,
          parties: true,
          mediationSessions: true,
        },
      },
    },
  });
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;
  const caseData = await getCase(id);

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
          href="/admin/cases"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Processos
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-primary">
              {caseData.caseNumber}
            </h1>
            <p className="mt-1 text-lg text-gray-900">{caseData.title}</p>
          </div>
          <Link
            href={`/admin/cases/${caseData.id}/edit`}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Editar
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-heading font-semibold text-primary mb-4">
              Informações do Processo
            </h2>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      STATUS_COLORS[caseData.status]
                    }`}
                  >
                    {STATUS_LABELS[caseData.status]}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Núcleo</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {NUCLEUS_LABELS[caseData.nucleus]}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Parte Requerente</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {caseData.requestingParty}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Parte Requerida</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {caseData.requestedParty}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Responsável</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {caseData.assignedTo?.name || 'Não atribuído'}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Criado em</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(caseData.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                </dd>
              </div>
            </dl>

            {caseData.description && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <dt className="text-sm font-medium text-gray-500 mb-2">Descrição</dt>
                <dd className="text-sm text-gray-900">{caseData.description}</dd>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-heading font-semibold text-primary mb-4">
              Linha do Tempo
            </h2>

            <div className="flow-root">
              <ul className="-mb-8">
                {caseData.activities.map((activity, idx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {idx !== caseData.activities.length - 1 && (
                        <span
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center ring-8 ring-white">
                            <User className="h-4 w-4 text-primary" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-900">
                              {activity.description}
                            </p>
                            {activity.user && (
                              <p className="text-xs text-gray-500">
                                por {activity.user.name}
                              </p>
                            )}
                          </div>
                          <div className="whitespace-nowrap text-right text-xs text-gray-500">
                            {format(new Date(activity.createdAt), 'dd/MM HH:mm')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {caseData.activities.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhuma atividade registrada ainda.
              </p>
            )}
          </div>

          {/* Parties Section */}
          <CasePartiesClient caseId={caseData.id} initialParties={caseData.parties} />
        </div>

        {/* Right Column - Quick Stats */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-heading font-semibold text-primary mb-4">
              Resumo
            </h2>

            <div className="space-y-4">
              <Link href={`/admin/cases/${caseData.id}/documents`}>
                <div className="flex items-center justify-between hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">Documentos</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {caseData._count.documents}
                  </span>
                </div>
              </Link>

              <Link href={`/admin/cases/${caseData.id}/emails`}>
                <div className="flex items-center justify-between hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">Emails</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {caseData._count.emails}
                  </span>
                </div>
              </Link>

              <Link href={`/admin/cases/${caseData.id}/sessions`}>
                <div className="flex items-center justify-between hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">Sessões</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {caseData._count.mediationSessions}
                  </span>
                </div>
              </Link>

              <div className="flex items-center justify-between -mx-2 px-2 py-1">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Partes</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {caseData._count.parties}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Documents */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-primary">
                Documentos Recentes
              </h2>
              <Link
                href={`/admin/cases/${caseData.id}/documents`}
                className="text-sm text-primary hover:text-primary/80"
              >
                Ver todos
              </Link>
            </div>

            {caseData.documents.length > 0 ? (
              <ul className="space-y-3">
                {caseData.documents.map((doc) => (
                  <li key={doc.id} className="text-sm">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(doc.createdAt), 'dd/MM/yyyy')}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-3">
                  Nenhum documento ainda
                </p>
                <Link
                  href={`/admin/cases/${caseData.id}/documents`}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Adicionar documento
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
