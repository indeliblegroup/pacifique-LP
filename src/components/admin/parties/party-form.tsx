'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { formatCPFOrCNPJ, formatPhone, validateCPFOrCNPJ } from '@/lib/cpf-cnpj-utils';

interface PartyFormProps {
  caseId: string;
  party?: {
    id: string;
    type: 'REQUESTING' | 'REQUESTED';
    name: string;
    cpf?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function PartyForm({ caseId, party, onClose, onSuccess }: PartyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    type: party?.type || 'REQUESTING',
    name: party?.name || '',
    cpf: party?.cpf || '',
    email: party?.email || '',
    phone: party?.phone || '',
    address: party?.address || '',
  });

  const [cpfError, setCpfError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCpfError('');

    // Validate CPF/CNPJ if provided
    if (formData.cpf && formData.cpf.trim()) {
      if (!validateCPFOrCNPJ(formData.cpf)) {
        setCpfError('CPF/CNPJ inválido');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const url = party ? `/api/parties/${party.id}` : '/api/parties';
      const method = party ? 'PUT' : 'POST';

      const payload = party
        ? {
            type: formData.type,
            name: formData.name,
            cpf: formData.cpf || null,
            email: formData.email || null,
            phone: formData.phone || null,
            address: formData.address || null,
          }
        : {
            caseId,
            type: formData.type,
            name: formData.name,
            cpf: formData.cpf || null,
            email: formData.email || null,
            phone: formData.phone || null,
            address: formData.address || null,
          };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar parte');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCpfChange = (value: string) => {
    setCpfError('');
    setFormData({ ...formData, cpf: value });
  };

  const handleCpfBlur = () => {
    if (formData.cpf) {
      const formatted = formatCPFOrCNPJ(formData.cpf);
      setFormData({ ...formData, cpf: formatted });
    }
  };

  const handlePhoneBlur = () => {
    if (formData.phone) {
      const formatted = formatPhone(formData.phone);
      setFormData({ ...formData, phone: formatted });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-heading font-semibold text-primary">
            {party ? 'Editar Parte' : 'Adicionar Parte'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Parte <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as 'REQUESTING' | 'REQUESTED',
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              required
            >
              <option value="REQUESTING">Parte Requerente</option>
              <option value="REQUESTED">Parte Requerida</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              required
              minLength={3}
              placeholder="Ex: João da Silva ou Empresa LTDA"
            />
          </div>

          {/* CPF/CNPJ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF/CNPJ
            </label>
            <input
              type="text"
              value={formData.cpf}
              onChange={(e) => handleCpfChange(e.target.value)}
              onBlur={handleCpfBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary focus:border-primary ${
                cpfError ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
            />
            {cpfError && <p className="mt-1 text-sm text-red-600">{cpfError}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="exemplo@email.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              onBlur={handlePhoneBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="(00) 00000-0000"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço Completo
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Rua, número, complemento, bairro, cidade, UF, CEP"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Salvando...' : party ? 'Salvar Alterações' : 'Adicionar Parte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
