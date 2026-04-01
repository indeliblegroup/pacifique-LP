import { prisma } from '@/lib/prisma';

/**
 * Generates a unique case number in the format: PAC-YYYY-NNNNNN
 * Example: PAC-2026-000001
 */
export async function generateCaseNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `PAC-${year}-`;

  // Get the last case number for this year
  const lastCase = await prisma.case.findFirst({
    where: {
      caseNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      caseNumber: 'desc',
    },
    select: {
      caseNumber: true,
    },
  });

  let sequence = 1;

  if (lastCase) {
    // Extract the sequence number from the last case
    const parts = lastCase.caseNumber.split('-');
    const lastSequence = parseInt(parts[2], 10);
    sequence = lastSequence + 1;
  }

  // Format with leading zeros (6 digits)
  const sequenceStr = sequence.toString().padStart(6, '0');

  return `${prefix}${sequenceStr}`;
}

// Nucleus labels in Portuguese
export const NUCLEUS_LABELS: Record<string, string> = {
  CONSUMIDOR_AEREO: 'Consumidor Aéreo',
  CONSUMIDOR_BANCARIO: 'Consumidor Bancário',
  DIREITO_SAUDE: 'Direito de Saúde',
  DIREITO_FAMILIA: 'Direito de Família',
  DIREITO_SUCESSOES: 'Direito de Sucessões',
  PRATICAS_RESTAURATIVAS: 'Práticas Restaurativas',
  DEMANDAS_EMPRESARIAIS: 'Demandas Empresariais Estratégicas',
};

// Status labels in Portuguese
export const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Rascunho',
  INVITE_SENT: 'Convite Enviado',
  INVITE_ACCEPTED: 'Convite Aceito',
  INTERVIEW_PHASE: 'Fase de Entrevistas',
  SESSION_SCHEDULED: 'Sessão Agendada',
  IN_MEDIATION: 'Em Mediação',
  AGREEMENT_REACHED: 'Acordo Alcançado',
  NEGATIVE_TERM: 'Termo Negativo',
  CLOSED: 'Fechado',
  ARCHIVED: 'Arquivado',
};

// Status colors for UI
export const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  INVITE_SENT: 'bg-blue-100 text-blue-800',
  INVITE_ACCEPTED: 'bg-cyan-100 text-cyan-800',
  INTERVIEW_PHASE: 'bg-purple-100 text-purple-800',
  SESSION_SCHEDULED: 'bg-indigo-100 text-indigo-800',
  IN_MEDIATION: 'bg-yellow-100 text-yellow-800',
  AGREEMENT_REACHED: 'bg-green-100 text-green-800',
  NEGATIVE_TERM: 'bg-orange-100 text-orange-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  ARCHIVED: 'bg-gray-100 text-gray-600',
};
