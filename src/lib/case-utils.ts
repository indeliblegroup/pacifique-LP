import 'server-only';
import { prisma } from '@/lib/prisma';

// Re-export constants for backward compatibility
export { NUCLEUS_LABELS, STATUS_LABELS, STATUS_COLORS } from './case-constants';

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
