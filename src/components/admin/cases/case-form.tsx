'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NUCLEUS_LABELS } from '@/lib/case-utils';

interface CaseFormProps {
  caseData?: {
    id: string;
    title: string;
    description?: string | null;
    nucleus: string;
    requestingParty: string;
    requestedParty: string;
    assignedToId?: string | null;
  };
  users: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  isEdit?: boolean;
}

export function CaseForm({ caseData, users, isEdit = false }: CaseFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: caseData?.title || '',
    description: caseData?.description || '',
    nucleus: caseData?.nucleus || 'CONSUMIDOR_AEREO',
    requestingParty: caseData?.requestingParty || '',
    requestedParty: caseData?.requestedParty || '',
    assignedToId: caseData?.assignedToId || '',
  });

  // Filter users who can be assigned (Lawyers and Conciliators)
  const assignableUsers = users.filter(
    (u) => u.role === 'LAWYER' || u.role === 'CONCILIATOR'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const url = isEdit ? `/api/cases/${caseData?.id}` : '/api/cases';
      const method = isEdit ? 'PATCH' : 'POST';

      const body: any = {
        title: formData.title,
        description: formData.description || undefined,
        nucleus: formData.nucleus,
        requestingParty: formData.requestingParty,
        requestedParty: formData.requestedParty,
        assignedToId: formData.assignedToId || undefined,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar processo');
      }

      router.push(`/admin/cases/${data.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título do Processo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Ex: Mediação de conflito contratual"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Breve descrição do caso..."
          />
        </div>

        {/* Nucleus */}
        <div>
          <label htmlFor="nucleus" className="block text-sm font-medium text-gray-700">
            Núcleo de Atuação <span className="text-red-500">*</span>
          </label>
          <select
            id="nucleus"
            required
            value={formData.nucleus}
            onChange={(e) => setFormData({ ...formData, nucleus: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            {Object.entries(NUCLEUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="requestingParty" className="block text-sm font-medium text-gray-700">
              Parte Requerente <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="requestingParty"
              required
              value={formData.requestingParty}
              onChange={(e) =>
                setFormData({ ...formData, requestingParty: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Nome da parte requerente"
            />
          </div>

          <div>
            <label htmlFor="requestedParty" className="block text-sm font-medium text-gray-700">
              Parte Requerida <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="requestedParty"
              required
              value={formData.requestedParty}
              onChange={(e) =>
                setFormData({ ...formData, requestedParty: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Nome da parte requerida"
            />
          </div>
        </div>

        {/* Assigned To */}
        <div>
          <label htmlFor="assignedToId" className="block text-sm font-medium text-gray-700">
            Atribuir a
          </label>
          <select
            id="assignedToId"
            value={formData.assignedToId}
            onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="">Não atribuído</option>
            {assignableUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role === 'LAWYER' ? 'Advogado' : 'Conciliador'})
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Selecione o advogado ou conciliador responsável por este processo
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar Processo'}
        </button>
      </div>
    </form>
  );
}
