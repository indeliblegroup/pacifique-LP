'use client';

import { Mail, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Email {
  id: string;
  toEmails: string;
  subject: string;
  status: string;
  sentAt: Date | null;
  createdAt: Date;
  sentBy: {
    id: string;
    name: string;
  };
  template?: {
    id: string;
    name: string;
  } | null;
}

interface EmailListProps {
  emails: Email[];
}

const STATUS_CONFIG = {
  SENT: {
    label: 'Enviado',
    icon: CheckCircle,
    color: 'text-green-600 bg-green-100',
  },
  FAILED: {
    label: 'Falhou',
    icon: XCircle,
    color: 'text-red-600 bg-red-100',
  },
  DRAFT: {
    label: 'Rascunho',
    icon: Clock,
    color: 'text-gray-600 bg-gray-100',
  },
};

export function EmailList({ emails }: EmailListProps) {
  if (emails.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-heading font-semibold text-primary mb-4">
          Histórico de Emails
        </h3>
        <p className="text-sm text-gray-500 text-center py-8">
          Nenhum email enviado ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-heading font-semibold text-primary mb-4">
        Histórico de Emails ({emails.length})
      </h3>

      <div className="space-y-3">
        {emails.map((email) => {
          const statusConfig = STATUS_CONFIG[email.status as keyof typeof STATUS_CONFIG];
          const StatusIcon = statusConfig?.icon || Mail;
          const toEmails = JSON.parse(email.toEmails) as string[];

          return (
            <div
              key={email.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {email.subject}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Para: {toEmails.join(', ')}
                      </p>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusConfig?.color}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig?.label}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>Enviado por {email.sentBy.name}</span>
                    <span>•</span>
                    <span>
                      {email.sentAt
                        ? format(new Date(email.sentAt), "dd/MM/yyyy 'às' HH:mm")
                        : format(new Date(email.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                    </span>
                    {email.template && (
                      <>
                        <span>•</span>
                        <span>Template: {email.template.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
