'use client';

import { Calendar, Clock, MapPin, User, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  SESSION_STATUS_LABELS,
  SESSION_STATUS_COLORS,
  SESSION_TYPE_LABELS,
  SESSION_TYPE_COLORS,
  formatDuration,
  isToday,
  isOverdue,
} from '@/lib/session-utils';

interface Session {
  id: string;
  sessionDate: Date;
  duration: number;
  location?: string | null;
  type: string;
  status: string;
  notes?: string | null;
  outcome?: string | null;
  case: {
    id: string;
    caseNumber: string;
    title: string;
  };
  conductedBy?: {
    id: string;
    name: string;
  } | null;
}

interface SessionListProps {
  sessions: Session[];
  onEdit?: (session: Session) => void;
  onDelete?: (sessionId: string) => void;
  onComplete?: (sessionId: string) => void;
  onCancel?: (sessionId: string) => void;
  showCaseInfo?: boolean;
}

export function SessionList({
  sessions,
  onEdit,
  onDelete,
  onComplete,
  onCancel,
  showCaseInfo = true,
}: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">Nenhuma sessão agendada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const sessionDate = new Date(session.sessionDate);
        const isTodaySession = isToday(sessionDate);
        const isOverdueSession = isOverdue(session);

        return (
          <div
            key={session.id}
            className={`
              bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow
              ${isTodaySession ? 'ring-2 ring-primary' : ''}
              ${isOverdueSession ? 'bg-red-50' : ''}
            `}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left: Session Info */}
              <div className="flex-1 min-w-0">
                {showCaseInfo && (
                  <div className="mb-2">
                    <Link
                      href={`/admin/cases/${session.case.id}`}
                      className="text-sm font-medium text-primary hover:text-primary/80"
                    >
                      {session.case.caseNumber}
                    </Link>
                    <p className="text-sm text-gray-600 truncate">{session.case.title}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className={isTodaySession ? 'font-semibold text-primary' : ''}>
                      {format(sessionDate, "dd/MM/yyyy 'às' HH:mm")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(session.duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      SESSION_STATUS_COLORS[session.status as keyof typeof SESSION_STATUS_COLORS]
                    }`}
                  >
                    {SESSION_STATUS_LABELS[session.status as keyof typeof SESSION_STATUS_LABELS]}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      SESSION_TYPE_COLORS[session.type as keyof typeof SESSION_TYPE_COLORS]
                    }`}
                  >
                    {SESSION_TYPE_LABELS[session.type as keyof typeof SESSION_TYPE_LABELS]}
                  </span>
                  {isTodaySession && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary text-white">
                      Hoje
                    </span>
                  )}
                  {isOverdueSession && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-600 text-white">
                      Atrasada
                    </span>
                  )}
                </div>

                {session.location && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    {session.location.startsWith('http') ? (
                      <a
                        href={session.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Link da reunião
                      </a>
                    ) : (
                      <span>{session.location}</span>
                    )}
                  </div>
                )}

                {session.conductedBy && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Conduzida por {session.conductedBy.name}</span>
                  </div>
                )}

                {session.notes && (
                  <p className="text-sm text-gray-600 mt-2 italic">{session.notes}</p>
                )}

                {session.outcome && (
                  <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-2 rounded">
                    <strong>Resultado:</strong> {session.outcome}
                  </p>
                )}
              </div>

              {/* Right: Actions */}
              <div className="flex flex-col gap-2">
                {session.status === 'SCHEDULED' && onComplete && (
                  <button
                    onClick={() => onComplete(session.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    title="Marcar como concluída"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                )}

                {session.status === 'SCHEDULED' && onCancel && (
                  <button
                    onClick={() => onCancel(session.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Cancelar sessão"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                )}

                {onEdit && (
                  <button
                    onClick={() => onEdit(session)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    title="Editar sessão"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                )}

                {onDelete && session.status !== 'COMPLETED' && (
                  <button
                    onClick={() => onDelete(session.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Excluir sessão"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
