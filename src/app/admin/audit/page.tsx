'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  FolderPlus,
  FolderEdit,
  ArrowRightLeft,
  UserCheck,
  FileUp,
  Mail,
  UserPlus,
  UserCog,
  CalendarPlus,
  CalendarClock,
  CalendarCheck,
  CalendarX,
  FileText,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { ACTIVITY_TYPE_LABELS, ACTIVITY_TYPE_COLORS } from '@/lib/activity-utils';
import type { ActivityType } from '@prisma/client';

// Icon mapping
const ACTIVITY_ICONS: Record<string, any> = {
  FolderPlus,
  FolderEdit,
  ArrowRightLeft,
  UserCheck,
  FileUp,
  Mail,
  UserPlus,
  UserCog,
  CalendarPlus,
  CalendarClock,
  CalendarCheck,
  CalendarX,
  FileText,
};

const getActivityIcon = (type: ActivityType) => {
  const iconMap: Record<ActivityType, string> = {
    CASE_CREATED: 'FolderPlus',
    CASE_UPDATED: 'FolderEdit',
    CASE_STATUS_CHANGED: 'ArrowRightLeft',
    CASE_ASSIGNED: 'UserCheck',
    DOCUMENT_UPLOADED: 'FileUp',
    EMAIL_SENT: 'Mail',
    USER_CREATED: 'UserPlus',
    USER_UPDATED: 'UserCog',
    MEDIATION_SESSION_SCHEDULED: 'CalendarPlus',
    SESSION_SCHEDULED: 'CalendarPlus',
    SESSION_UPDATED: 'CalendarClock',
    SESSION_COMPLETED: 'CalendarCheck',
    SESSION_CANCELLED: 'CalendarX',
    SESSION_RESCHEDULED: 'CalendarClock',
    SESSION_DELETED: 'CalendarX',
    NOTE_ADDED: 'FileText',
  };

  return ACTIVITY_ICONS[iconMap[type]] || FileText;
};

interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  metadata: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  case: {
    id: string;
    caseNumber: string;
    title: string;
  } | null;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function AuditLogPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [caseSearch, setCaseSearch] = useState('');

  // Expanded metadata
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());

  // Fetch users for filter dropdown
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        if (response.status === 403) {
          router.push('/admin');
          return;
        }
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    }
    fetchUsers();
  }, [router]);

  // Fetch activities
  useEffect(() => {
    async function fetchActivities() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '50',
        });

        if (selectedUserId) params.append('userId', selectedUserId);
        if (selectedTypes.length > 0) params.append('types', selectedTypes.join(','));
        if (fromDate) params.append('fromDate', fromDate);
        if (toDate) params.append('toDate', toDate);
        if (caseSearch) params.append('caseId', caseSearch);

        const response = await fetch(`/api/audit?${params}`);

        if (response.status === 403) {
          router.push('/admin');
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch activities');

        const data = await response.json();
        setActivities(data.activities);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, [page, selectedUserId, selectedTypes, fromDate, toDate, caseSearch, router]);

  const toggleMetadata = (activityId: string) => {
    const newExpanded = new Set(expandedActivities);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedActivities(newExpanded);
  };

  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
    setPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setSelectedUserId('');
    setSelectedTypes([]);
    setFromDate('');
    setToDate('');
    setCaseSearch('');
    setPage(1);
  };

  const hasActiveFilters = selectedUserId || selectedTypes.length > 0 || fromDate || toDate || caseSearch;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-primary">
          Auditoria
        </h1>
        <p className="mt-1 text-sm text-text-body">
          Histórico completo de atividades do sistema
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full px-6 py-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-900">Filtros</span>
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-1 text-xs bg-primary text-white rounded-full">
                {[selectedUserId, ...selectedTypes, fromDate, toDate, caseSearch].filter(Boolean).length}
              </span>
            )}
          </div>
          {showFilters ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {showFilters && (
          <div className="px-6 pb-6 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* User Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuário
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => {
                    setSelectedUserId(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="">Todos</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* From Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Final
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpar Filtros
                </button>
              </div>
            </div>

            {/* Activity Type Multi-select */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Atividade
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {Object.entries(ACTIVITY_TYPE_LABELS).map(([type, label]) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Activities Timeline */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow">
          {activities.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {activities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                const isExpanded = expandedActivities.has(activity.id);
                const hasMetadata = !!activity.metadata;

                return (
                  <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {/* Type Badge */}
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                ACTIVITY_TYPE_COLORS[activity.type]
                              }`}
                            >
                              {ACTIVITY_TYPE_LABELS[activity.type]}
                            </span>

                            {/* Description */}
                            <p className="mt-2 text-sm text-gray-900">
                              {activity.description}
                            </p>

                            {/* User and Case Links */}
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                              {activity.user && (
                                <div>
                                  <span className="font-medium">Usuário:</span>{' '}
                                  <Link
                                    href={`/admin/users/${activity.user.id}/edit`}
                                    className="text-primary hover:text-primary/80 underline"
                                  >
                                    {activity.user.name}
                                  </Link>
                                </div>
                              )}
                              {activity.case && (
                                <div>
                                  <span className="font-medium">Processo:</span>{' '}
                                  <Link
                                    href={`/admin/cases/${activity.case.id}`}
                                    className="text-primary hover:text-primary/80 underline"
                                  >
                                    {activity.case.caseNumber}
                                  </Link>
                                </div>
                              )}
                            </div>

                            {/* Metadata */}
                            {hasMetadata && (
                              <div className="mt-3">
                                <button
                                  onClick={() => toggleMetadata(activity.id)}
                                  className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="h-3 w-3" />
                                      Ocultar detalhes
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="h-3 w-3" />
                                      Ver detalhes
                                    </>
                                  )}
                                </button>
                                {isExpanded && (
                                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                                    {JSON.stringify(JSON.parse(activity.metadata || '{}'), null, 2)}
                                  </pre>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Timestamp */}
                          <div className="flex-shrink-0 text-right">
                            <p className="text-xs text-gray-500">
                              {format(new Date(activity.createdAt), "dd/MM/yyyy")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(activity.createdAt), "HH:mm:ss")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {hasActiveFilters
                  ? 'Nenhuma atividade encontrada com os filtros selecionados.'
                  : 'Nenhuma atividade registrada ainda.'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando página {page} de {totalPages} ({total} atividades no total)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
