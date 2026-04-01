import { getCurrentUser } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { FolderOpen, FileText, Mail, Users, Calendar, Clock, MapPin, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { SESSION_STATUS_LABELS, SESSION_STATUS_COLORS } from '@/lib/session-utils';
import { STATUS_LABELS, NUCLEUS_LABELS } from '@/lib/case-utils';
import { CaseStatus, CaseNucleus } from '@prisma/client';
import { AnalyticsCharts } from '@/components/admin/dashboard/analytics-charts';

async function getStats() {
  const [casesCount, documentsCount, emailsCount, usersCount] = await Promise.all([
    prisma.case.count(),
    prisma.document.count(),
    prisma.email.count(),
    prisma.user.count(),
  ]);

  return {
    casesCount,
    documentsCount,
    emailsCount,
    usersCount,
  };
}

async function getUpcomingSessions(userId: string, userRole: string) {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + 7);

  const where: any = {
    status: 'SCHEDULED',
    sessionDate: {
      gte: now,
      lte: future,
    },
  };

  // If user is not admin, only show sessions for cases they're assigned to
  if (userRole !== 'ADMIN') {
    where.case = {
      assignedToId: userId,
    };
  }

  return await prisma.mediationSession.findMany({
    where,
    include: {
      case: {
        select: {
          id: true,
          caseNumber: true,
          title: true,
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
    take: 5,
  });
}

// Chart Data Functions
async function getCasesByStatus() {
  const cases = await prisma.case.groupBy({
    by: ['status'],
    _count: true,
  });

  return cases.map((item) => ({
    name: STATUS_LABELS[item.status as CaseStatus],
    value: item._count,
    status: item.status,
  }));
}

async function getCasesByNucleus() {
  const cases = await prisma.case.groupBy({
    by: ['nucleus'],
    _count: true,
  });

  return cases.map((item) => ({
    name: NUCLEUS_LABELS[item.nucleus as CaseNucleus],
    value: item._count,
    nucleus: item.nucleus,
  })).sort((a, b) => b.value - a.value);
}

async function getMonthlyActivity() {
  const monthsData = [];

  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const count = await prisma.case.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    monthsData.push({
      month: format(date, 'MMM'),
      count,
    });
  }

  return monthsData;
}

async function getSuccessRate() {
  const [agreementCount, negativeCount, activeCount] = await Promise.all([
    prisma.case.count({ where: { status: 'AGREEMENT_REACHED' } }),
    prisma.case.count({ where: { status: 'NEGATIVE_TERM' } }),
    prisma.case.count({
      where: {
        status: {
          in: ['DRAFT', 'INVITE_SENT', 'INVITE_ACCEPTED', 'INTERVIEW_PHASE', 'SESSION_SCHEDULED', 'IN_MEDIATION']
        }
      }
    }),
  ]);

  const total = agreementCount + negativeCount + activeCount;

  return {
    data: [
      { name: 'Acordo Alcançado', value: agreementCount },
      { name: 'Termo Negativo', value: negativeCount },
      { name: 'Em Andamento', value: activeCount },
    ],
    total,
    successRate: total > 0 ? Math.round((agreementCount / (agreementCount + negativeCount)) * 100) : 0,
  };
}

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [stats, upcomingSessions, casesByStatus, casesByNucleus, monthlyActivity, successRate] = await Promise.all([
    getStats(),
    getUpcomingSessions(user.id, user.role),
    getCasesByStatus(),
    getCasesByNucleus(),
    getMonthlyActivity(),
    getSuccessRate(),
  ]);

  const statCards = [
    {
      name: 'Processos',
      value: stats.casesCount,
      icon: FolderOpen,
      color: 'bg-blue-500',
    },
    {
      name: 'Documentos',
      value: stats.documentsCount,
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      name: 'Emails Enviados',
      value: stats.emailsCount,
      icon: Mail,
      color: 'bg-purple-500',
    },
    {
      name: 'Usuários',
      value: stats.usersCount,
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-primary">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-text-body">
          Bem-vindo(a), {user?.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
            >
              <dt>
                <div className={`absolute rounded-md ${stat.color} p-3`}>
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      {/* Upcoming Sessions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-primary">
            Próximas Sessões
          </h2>
          <Link
            href="/admin/calendar"
            className="text-sm text-primary hover:text-primary/80"
          >
            Ver calendário
          </Link>
        </div>

        {upcomingSessions.length > 0 ? (
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <Link
                key={session.id}
                href={`/admin/cases/${session.case.id}/sessions`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">
                      {session.case.caseNumber}
                    </p>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {session.case.title}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {format(new Date(session.sessionDate), "dd/MM/yyyy 'às' HH:mm")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{session.duration}min</span>
                      </div>
                    </div>
                    {session.location && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{session.location}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        SESSION_STATUS_COLORS[session.status as keyof typeof SESSION_STATUS_COLORS]
                      }`}
                    >
                      {SESSION_STATUS_LABELS[session.status as keyof typeof SESSION_STATUS_LABELS]}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">
            Nenhuma sessão agendada para os próximos 7 dias.
          </p>
        )}
      </div>

      {/* Analytics Charts */}
      <div className="mt-8">
        <h2 className="text-lg font-heading font-semibold text-primary mb-4">
          Análise de Dados
        </h2>

        {stats.casesCount > 0 ? (
          <AnalyticsCharts
            casesByStatus={casesByStatus}
            casesByNucleus={casesByNucleus}
            monthlyActivity={monthlyActivity}
            successRate={successRate}
          />
        ) : (
          <div className="bg-white rounded-lg shadow p-12">
            <div className="flex flex-col items-center justify-center text-gray-400">
              <BarChart3 className="h-16 w-16 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum dado ainda</h3>
              <p className="text-sm text-center max-w-md">
                Comece criando processos para visualizar análises e estatísticas
              </p>
              <Link
                href="/admin/cases/new"
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Criar Processo
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Welcome message */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-heading font-semibold text-primary mb-4">
          Sistema de Gestão PACIFIQUE!
        </h2>
        <div className="prose prose-sm text-text-body">
          <p>
            Este é o sistema de backoffice da Câmara Privada de Conciliação e
            Mediação PACIFIQUE!
          </p>
          <p className="mt-2">
            Utilize o menu lateral para navegar entre as diferentes funcionalidades:
          </p>
          <ul className="mt-2 space-y-1">
            <li><strong>Processos:</strong> Gerencie os processos de mediação e conciliação</li>
            <li><strong>Calendário:</strong> Agende e gerencie sessões de mediação</li>
            <li><strong>Documentos:</strong> Faça upload e organize documentos dos processos</li>
            <li><strong>Emails:</strong> Envie cartas convite e notificações às partes</li>
            <li><strong>Usuários:</strong> Administre usuários e permissões do sistema</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
