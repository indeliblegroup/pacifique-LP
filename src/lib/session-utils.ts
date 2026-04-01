// Session management utilities

export const SESSION_TYPE_LABELS = {
  JOINT: 'Sessão Conjunta',
  INDIVIDUAL_REQUESTING: 'Sessão Individual - Requerente',
  INDIVIDUAL_REQUESTED: 'Sessão Individual - Requerido',
} as const;

export const SESSION_STATUS_LABELS = {
  SCHEDULED: 'Agendada',
  COMPLETED: 'Concluída',
  CANCELLED: 'Cancelada',
  RESCHEDULED: 'Reagendada',
} as const;

export const SESSION_STATUS_COLORS = {
  SCHEDULED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  RESCHEDULED: 'bg-yellow-100 text-yellow-800',
} as const;

export const SESSION_TYPE_COLORS = {
  JOINT: 'bg-purple-100 text-purple-800',
  INDIVIDUAL_REQUESTING: 'bg-indigo-100 text-indigo-800',
  INDIVIDUAL_REQUESTED: 'bg-cyan-100 text-cyan-800',
} as const;

/**
 * Get sessions that are happening within the next N days
 */
export function getUpcomingSessions(sessions: any[], days: number = 7) {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + days);

  return sessions.filter((session) => {
    const sessionDate = new Date(session.sessionDate);
    return (
      session.status === 'SCHEDULED' &&
      sessionDate >= now &&
      sessionDate <= future
    );
  });
}

/**
 * Check if a session is happening today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a session is overdue
 */
export function isOverdue(session: any): boolean {
  if (session.status !== 'SCHEDULED') return false;
  const sessionDate = new Date(session.sessionDate);
  const now = new Date();
  return sessionDate < now;
}

/**
 * Format duration in minutes to readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

/**
 * Generate calendar grid for a given month
 */
export function generateCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  const endDate = new Date(lastDay);

  // Start from the first day of the week
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // End on the last day of the week
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days: Date[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

/**
 * Get sessions for a specific date
 */
export function getSessionsForDate(sessions: any[], date: Date) {
  return sessions.filter((session) => {
    const sessionDate = new Date(session.sessionDate);
    return (
      sessionDate.getDate() === date.getDate() &&
      sessionDate.getMonth() === date.getMonth() &&
      sessionDate.getFullYear() === date.getFullYear()
    );
  });
}
