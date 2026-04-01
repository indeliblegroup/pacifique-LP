'use client';

import { useState } from 'react';
import { Users, Edit, Trash2, Mail, Phone, MapPin, FileText } from 'lucide-react';

interface Party {
  id: string;
  type: 'REQUESTING' | 'REQUESTED';
  name: string;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: Date;
}

interface PartyListProps {
  parties: Party[];
  onEdit: (party: Party) => void;
  onDelete?: () => void;
}

const PARTY_TYPE_LABELS = {
  REQUESTING: 'Parte Requerente',
  REQUESTED: 'Parte Requerida',
};

const PARTY_TYPE_COLORS = {
  REQUESTING: 'bg-blue-100 text-blue-800',
  REQUESTED: 'bg-purple-100 text-purple-800',
};

export function PartyList({ parties, onEdit, onDelete }: PartyListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (partyId: string, partyName: string) => {
    if (!confirm(`Tem certeza que deseja remover a parte "${partyName}"?`)) {
      return;
    }

    setDeletingId(partyId);

    try {
      const response = await fetch(`/api/parties/${partyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao remover parte');
      }

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setDeletingId(null);
    }
  };

  const requestingParties = parties.filter((p) => p.type === 'REQUESTING');
  const requestedParties = parties.filter((p) => p.type === 'REQUESTED');

  const renderPartyCard = (party: Party) => (
    <div
      key={party.id}
      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-base font-semibold text-gray-900">{party.name}</h4>
            <span
              className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${
                PARTY_TYPE_COLORS[party.type]
              }`}
            >
              {PARTY_TYPE_LABELS[party.type]}
            </span>
          </div>

          <div className="space-y-1.5">
            {party.cpf && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>{party.cpf}</span>
              </div>
            )}

            {party.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a
                  href={`mailto:${party.email}`}
                  className="hover:text-primary hover:underline truncate"
                >
                  {party.email}
                </a>
              </div>
            )}

            {party.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a
                  href={`tel:${party.phone}`}
                  className="hover:text-primary hover:underline"
                >
                  {party.phone}
                </a>
              </div>
            )}

            {party.address && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{party.address}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(party)}
            className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(party.id, party.name)}
            disabled={deletingId === party.id}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            title="Remover"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (parties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-heading font-semibold text-primary">Partes</h3>
        </div>
        <p className="text-sm text-gray-500 text-center py-8">
          Nenhuma parte cadastrada ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-heading font-semibold text-primary">
          Partes ({parties.length})
        </h3>
      </div>

      <div className="space-y-6">
        {/* Requesting Parties */}
        {requestingParties.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Parte Requerente ({requestingParties.length})
            </h4>
            <div className="space-y-3">
              {requestingParties.map((party) => renderPartyCard(party))}
            </div>
          </div>
        )}

        {/* Requested Parties */}
        {requestedParties.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Parte Requerida ({requestedParties.length})
            </h4>
            <div className="space-y-3">
              {requestedParties.map((party) => renderPartyCard(party))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
