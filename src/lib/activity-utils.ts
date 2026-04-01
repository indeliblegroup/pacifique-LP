// Activity type labels and colors for the audit log

import type { ActivityType } from '@prisma/client';

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  CASE_CREATED: 'Processo Criado',
  CASE_UPDATED: 'Processo Atualizado',
  CASE_STATUS_CHANGED: 'Status do Processo Alterado',
  CASE_ASSIGNED: 'Processo Atribuído',
  DOCUMENT_UPLOADED: 'Documento Enviado',
  EMAIL_SENT: 'Email Enviado',
  USER_CREATED: 'Usuário Criado',
  USER_UPDATED: 'Usuário Atualizado',
  MEDIATION_SESSION_SCHEDULED: 'Sessão de Mediação Agendada',
  SESSION_SCHEDULED: 'Sessão Agendada',
  SESSION_UPDATED: 'Sessão Atualizada',
  SESSION_COMPLETED: 'Sessão Concluída',
  SESSION_CANCELLED: 'Sessão Cancelada',
  SESSION_RESCHEDULED: 'Sessão Reagendada',
  SESSION_DELETED: 'Sessão Deletada',
  NOTE_ADDED: 'Nota Adicionada',
};

export const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  CASE_CREATED: 'bg-blue-100 text-blue-800',
  CASE_UPDATED: 'bg-blue-100 text-blue-800',
  CASE_STATUS_CHANGED: 'bg-indigo-100 text-indigo-800',
  CASE_ASSIGNED: 'bg-purple-100 text-purple-800',
  DOCUMENT_UPLOADED: 'bg-green-100 text-green-800',
  EMAIL_SENT: 'bg-cyan-100 text-cyan-800',
  USER_CREATED: 'bg-orange-100 text-orange-800',
  USER_UPDATED: 'bg-orange-100 text-orange-800',
  MEDIATION_SESSION_SCHEDULED: 'bg-pink-100 text-pink-800',
  SESSION_SCHEDULED: 'bg-pink-100 text-pink-800',
  SESSION_UPDATED: 'bg-pink-100 text-pink-800',
  SESSION_COMPLETED: 'bg-green-100 text-green-800',
  SESSION_CANCELLED: 'bg-red-100 text-red-800',
  SESSION_RESCHEDULED: 'bg-yellow-100 text-yellow-800',
  SESSION_DELETED: 'bg-red-100 text-red-800',
  NOTE_ADDED: 'bg-gray-100 text-gray-800',
};

export const ACTIVITY_TYPE_ICONS: Record<ActivityType, string> = {
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
