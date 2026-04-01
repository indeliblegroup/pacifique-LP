import { Resend } from 'resend';

// Lazy initialization to avoid errors during build time
let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

/**
 * Substitutes variables in template with actual values
 * Example: "Hello {{name}}" with {name: "John"} => "Hello John"
 */
export function substituteVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value || '');
  });

  return result;
}

/**
 * Extracts variable names from template
 * Example: "Hello {{name}}, your order {{orderId}}" => ["name", "orderId"]
 */
export function extractVariables(template: string): string[] {
  const regex = /{{(\w+)}}/g;
  const variables: string[] = [];
  let match;

  while ((match = regex.exec(template)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }

  return variables;
}

/**
 * Sends an email using Resend
 */
export async function sendEmail({
  to,
  cc,
  subject,
  html,
  text,
}: {
  to: string[];
  cc?: string[];
  subject: string;
  html: string;
  text?: string;
}): Promise<{ id: string }> {
  const from = process.env.RESEND_FROM_EMAIL || 'noreply@pacifique.com.br';
  const resendClient = getResend();

  const result = await resendClient.emails.send({
    from,
    to,
    cc,
    subject,
    html,
    text,
  });

  if (!result.data) {
    throw new Error('Failed to send email');
  }

  return { id: result.data.id };
}

/**
 * Gets common case variables for email templates
 */
export function getCaseVariables(caseData: {
  caseNumber: string;
  title: string;
  requestingParty: string;
  requestedParty: string;
  assignedTo?: { name: string } | null;
}): Record<string, string> {
  return {
    caseNumber: caseData.caseNumber,
    caseTitle: caseData.title,
    requestingParty: caseData.requestingParty,
    requestedParty: caseData.requestedParty,
    mediatorName: caseData.assignedTo?.name || 'Não atribuído',
  };
}

/**
 * Validates email addresses
 */
export function validateEmails(emails: string[]): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  for (const email of emails) {
    if (!emailRegex.test(email.trim())) {
      return {
        valid: false,
        error: `Email inválido: ${email}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Parses comma-separated email list
 */
export function parseEmailList(emailString: string): string[] {
  return emailString
    .split(',')
    .map((email) => email.trim())
    .filter((email) => email.length > 0);
}
