// Role-based permission helpers

export type Role = 'ADMIN' | 'LAWYER' | 'CONCILIATOR';

export function isAdmin(role: string): boolean {
  return role === 'ADMIN';
}

export function isLawyer(role: string): boolean {
  return role === 'LAWYER';
}

export function isConciliator(role: string): boolean {
  return role === 'CONCILIATOR';
}

// Permission checks
export function canManageUsers(role: string): boolean {
  return isAdmin(role);
}

export function canCreateCases(role: string): boolean {
  return isAdmin(role) || isLawyer(role);
}

export function canEditCase(role: string, caseOwnerId: string, userId: string): boolean {
  if (isAdmin(role) || isLawyer(role)) return true;
  if (isConciliator(role) && caseOwnerId === userId) return true;
  return false;
}

export function canDeleteCases(role: string): boolean {
  return isAdmin(role);
}

export function canUploadDocuments(role: string): boolean {
  return true; // All authenticated users can upload
}

export function canSendEmails(role: string): boolean {
  return true; // All authenticated users can send emails
}

export function canManageTemplates(role: string): boolean {
  return isAdmin(role) || isLawyer(role);
}

export function canViewAuditLogs(role: string): boolean {
  return isAdmin(role);
}

// Role display names (Portuguese)
export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrador',
  LAWYER: 'Advogado',
  CONCILIATOR: 'Conciliador',
};

// Role colors for UI
export const ROLE_COLORS: Record<Role, string> = {
  ADMIN: 'bg-purple-100 text-purple-800',
  LAWYER: 'bg-blue-100 text-blue-800',
  CONCILIATOR: 'bg-green-100 text-green-800',
};
