'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { SessionList } from './session-list';
import { SessionForm } from './session-form';

interface Session {
  id: string;
  sessionDate: Date;
  duration: number;
  location?: string | null;
  type: string;
  status: string;
  notes?: string | null;
  outcome?: string | null;
  case: {
    id: string;
    caseNumber: string;
    title: string;
  };
  conductedBy?: {
    id: string;
    name: string;
  } | null;
}

interface CaseSessionsClientProps {
  caseId: string;
  initialSessions: Session[];
}

export function CaseSessionsClient({ caseId, initialSessions }: CaseSessionsClientProps) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [showForm, setShowForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Reload sessions
  const loadSessions = async () => {
    try {
      const response = await fetch(`/api/sessions?caseId=${caseId}`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleCreateSession = () => {
    setSelectedSession(null);
    setShowForm(true);
  };

  const handleEditSession = (session: Session) => {
    setSelectedSession(session);
    setShowForm(true);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta sessão?')) {
      return;
    }

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadSessions();
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao excluir sessão');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Erro ao excluir sessão');
    }
  };

  const handleCompleteSession = async (sessionId: string) => {
    const outcome = prompt('Descreva o resultado da sessão:');
    if (outcome === null) return;

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COMPLETED',
          outcome: outcome || undefined,
        }),
      });

      if (response.ok) {
        await loadSessions();
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao marcar sessão como concluída');
      }
    } catch (error) {
      console.error('Error completing session:', error);
      alert('Erro ao marcar sessão como concluída');
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta sessão?')) {
      return;
    }

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'CANCELLED',
        }),
      });

      if (response.ok) {
        await loadSessions();
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao cancelar sessão');
      }
    } catch (error) {
      console.error('Error cancelling session:', error);
      alert('Erro ao cancelar sessão');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedSession(null);
    loadSessions();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedSession(null);
  };

  return (
    <div>
      {/* Actions */}
      <div className="mb-6">
        <button
          onClick={handleCreateSession}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agendar Nova Sessão
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-heading font-semibold text-primary mb-4">
              {selectedSession ? 'Editar Sessão' : 'Nova Sessão'}
            </h2>

            <SessionForm
              caseId={caseId}
              sessionId={selectedSession?.id}
              initialData={
                selectedSession
                  ? {
                      sessionDate: new Date(selectedSession.sessionDate).toISOString(),
                      duration: selectedSession.duration,
                      location: selectedSession.location || undefined,
                      type: selectedSession.type,
                      conductedById: selectedSession.conductedBy?.id,
                      notes: selectedSession.notes || undefined,
                    }
                  : undefined
              }
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      {/* Sessions List */}
      <SessionList
        sessions={sessions}
        onEdit={handleEditSession}
        onDelete={handleDeleteSession}
        onComplete={handleCompleteSession}
        onCancel={handleCancelSession}
        showCaseInfo={false}
      />
    </div>
  );
}
