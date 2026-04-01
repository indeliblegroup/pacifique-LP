'use client';

import { useState } from 'react';
import { PartyList } from './party-list';
import { PartyForm } from './party-form';
import { UserPlus } from 'lucide-react';

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

interface CasePartiesClientProps {
  caseId: string;
  initialParties: Party[];
}

export function CasePartiesClient({ caseId, initialParties }: CasePartiesClientProps) {
  const [parties, setParties] = useState<Party[]>(initialParties);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);

  const fetchParties = async () => {
    try {
      const response = await fetch(`/api/parties?caseId=${caseId}`);
      if (response.ok) {
        const data = await response.json();
        setParties(data);
      }
    } catch (error) {
      console.error('Error fetching parties:', error);
    }
  };

  const handleAddClick = () => {
    setEditingParty(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (party: Party) => {
    setEditingParty(party);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingParty(null);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingParty(null);
    fetchParties();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <PartyList
            parties={parties}
            onEdit={handleEditClick}
            onDelete={fetchParties}
          />
        </div>
      </div>

      <button
        onClick={handleAddClick}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors"
      >
        <UserPlus className="h-5 w-5" />
        <span className="font-medium">Adicionar Parte</span>
      </button>

      {isFormOpen && (
        <PartyForm
          caseId={caseId}
          party={editingParty}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
