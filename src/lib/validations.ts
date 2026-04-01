import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  role: z.enum(['ADMIN', 'LAWYER', 'CONCILIATOR'], {
    message: 'Papel inválido',
  }),
  phone: z.string().optional(),
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
  role: z.enum(['ADMIN', 'LAWYER', 'CONCILIATOR']).optional(),
  phone: z.string().optional(),
  status: z.enum(['INVITED', 'ACTIVE', 'INACTIVE']).optional(),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
});

// Case validation schemas
export const createCaseSchema = z.object({
  title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres'),
  description: z.string().optional(),
  nucleus: z.enum([
    'CONSUMIDOR_AEREO',
    'CONSUMIDOR_BANCARIO',
    'DIREITO_SAUDE',
    'DIREITO_FAMILIA',
    'DIREITO_SUCESSOES',
    'PRATICAS_RESTAURATIVAS',
    'DEMANDAS_EMPRESARIAIS',
  ]),
  requestingParty: z.string().min(3, 'Nome da parte requerente inválido'),
  requestedParty: z.string().min(3, 'Nome da parte requerida inválido'),
  assignedToId: z.string().optional(),
});

export const updateCaseSchema = createCaseSchema.partial().extend({
  status: z
    .enum([
      'DRAFT',
      'INVITE_SENT',
      'INVITE_ACCEPTED',
      'INTERVIEW_PHASE',
      'SESSION_SCHEDULED',
      'IN_MEDIATION',
      'AGREEMENT_REACHED',
      'NEGATIVE_TERM',
      'CLOSED',
      'ARCHIVED',
    ])
    .optional(),
});

// Email template validation
export const createEmailTemplateSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  subject: z.string().min(3, 'Assunto deve ter no mínimo 3 caracteres'),
  bodyHtml: z.string().min(10, 'Corpo do email muito curto'),
  bodyText: z.string().optional(),
  description: z.string().optional(),
  variablesJson: z.string().optional(),
});

// Session validation schemas
export const createSessionSchema = z.object({
  caseId: z.string(),
  sessionDate: z.string().datetime('Data/hora inválida'),
  duration: z.number().min(15, 'Duração mínima: 15 minutos').max(480, 'Duração máxima: 8 horas'),
  location: z.string().optional(),
  type: z.enum(['JOINT', 'INDIVIDUAL_REQUESTING', 'INDIVIDUAL_REQUESTED']),
  conductedById: z.string().optional(),
  notes: z.string().optional(),
});

export const updateSessionSchema = z.object({
  sessionDate: z.string().datetime('Data/hora inválida').optional(),
  duration: z.number().min(15, 'Duração mínima: 15 minutos').max(480, 'Duração máxima: 8 horas').optional(),
  location: z.string().optional(),
  type: z.enum(['JOINT', 'INDIVIDUAL_REQUESTING', 'INDIVIDUAL_REQUESTED']).optional(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED']).optional(),
  conductedById: z.string().nullable().optional(),
  notes: z.string().optional(),
  outcome: z.string().optional(),
});

// Party validation schemas
export const createPartySchema = z.object({
  caseId: z.string().min(1, 'ID do processo é obrigatório'),
  type: z.enum(['REQUESTING', 'REQUESTED'], {
    message: 'Tipo de parte inválido',
  }),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const updatePartySchema = z.object({
  type: z.enum(['REQUESTING', 'REQUESTED']).optional(),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
  cpf: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateCaseInput = z.infer<typeof createCaseSchema>;
export type UpdateCaseInput = z.infer<typeof updateCaseSchema>;
export type CreateEmailTemplateInput = z.infer<typeof createEmailTemplateSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type CreatePartyInput = z.infer<typeof createPartySchema>;
export type UpdatePartyInput = z.infer<typeof updatePartySchema>;
