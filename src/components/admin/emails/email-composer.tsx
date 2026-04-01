'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { substituteVariables, getCaseVariables } from '@/lib/email';

interface EmailComposerProps {
  caseId?: string;
  caseData?: {
    caseNumber: string;
    title: string;
    requestingParty: string;
    requestedParty: string;
    assignedTo?: { name: string } | null;
  };
  onEmailSent?: () => void;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string | null;
  variablesJson?: string | null;
}

export function EmailComposer({ caseId, caseData, onEmailSent }: EmailComposerProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load templates
  useEffect(() => {
    async function loadTemplates() {
      try {
        const response = await fetch('/api/emails/templates');
        if (response.ok) {
          const data = await response.json();
          setTemplates(data);
        }
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    }
    loadTemplates();
  }, []);

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);

    if (!templateId) {
      setSubject('');
      setBodyHtml('');
      return;
    }

    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    // Get case variables if available
    let variables: Record<string, string> = {};
    if (caseData) {
      variables = getCaseVariables(caseData);
    }

    // Substitute variables in template
    const substitutedSubject = substituteVariables(template.subject, variables);
    const substitutedBody = substituteVariables(template.bodyHtml, variables);

    setSubject(substitutedSubject);
    setBodyHtml(substitutedBody);
  };

  const handleSend = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!to.trim()) {
      setError('O campo "Para" é obrigatório');
      return;
    }

    if (!subject.trim()) {
      setError('O campo "Assunto" é obrigatório');
      return;
    }

    if (!bodyHtml.trim()) {
      setError('O corpo do email é obrigatório');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          cc: cc || undefined,
          subject,
          bodyHtml,
          caseId: caseId || undefined,
          templateId: selectedTemplateId || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar email');
      }

      setSuccess('Email enviado com sucesso!');

      // Reset form
      setTo('');
      setCc('');
      setSubject('');
      setBodyHtml('');
      setSelectedTemplateId('');

      if (onEmailSent) {
        onEmailSent();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-heading font-semibold text-primary mb-4">
        Compor Email
      </h3>

      <div className="space-y-4">
        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template (opcional)
          </label>
          <select
            value={selectedTemplateId}
            onChange={(e) => handleTemplateSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="">Selecione um template...</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        {/* To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Para <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="email@example.com, outro@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separe múltiplos emails com vírgula
          </p>
        </div>

        {/* CC */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CC
          </label>
          <input
            type="text"
            value={cc}
            onChange={(e) => setCc(e.target.value)}
            placeholder="email@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assunto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Assunto do email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensagem <span className="text-red-500">*</span>
          </label>
          <textarea
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
            rows={10}
            placeholder="Corpo do email..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Pode incluir HTML básico
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={isSending}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          {isSending ? 'Enviando...' : 'Enviar Email'}
        </button>
      </div>
    </div>
  );
}
