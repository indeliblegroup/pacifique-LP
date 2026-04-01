'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, List, Grid } from 'lucide-react';
import { CalendarGrid } from '@/components/admin/calendar/calendar-grid';
import { SessionList } from '@/components/admin/calendar/session-list';
import { SessionForm } from '@/components/admin/calendar/session-form';

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

interface Case {
  id: string;
  caseNumber: string;
  title: string;
}

export default function CalendarPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showForm, setShowForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load sessions
  const loadSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load cases for the form
  const loadCases = async () => {
    try {
      const response = await fetch('/api/cases');
      if (response.ok) {
        const data = await response.json();
        setCases(data.cases || []);
      }
    } catch (error) {
      console.error('Error loading cases:', error);
    }
  };

  useEffect(() => {
    loadSessions();
    loadCases();
  }, []);

  const handleCreateSession = () => {
    setSelectedSession(null);
    setShowForm(true);
  };

  const handleEditSession = (session: Session) => {
    setSelectedSession(session);
    setSelectedCaseId(session.case.id);
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
    setSelectedCaseId('');
    loadSessions();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedSession(null);
    setSelectedCaseId('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3 animate-pulse" />
          <p className="text-gray-500">Carregando calendário...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-primary">Calendário</h1>
            <p className="mt-1 text-sm text-text-body">
              Gerencie as sessões de mediação e conciliação
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`
                  p-2 rounded transition-colors
                  ${viewMode === 'calendar' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'}
                `}
                title="Visualização em calendário"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`
                  p-2 rounded transition-colors
                  ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'}
                `}
                title="Visualização em lista"
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={handleCreateSession}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nova Sessão
            </button>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-heading font-semibold text-primary mb-4">
              {selectedSession ? 'Editar Sessão' : 'Nova Sessão'}
            </h2>

            {!selectedSession && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Processo <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Selecione um processo...</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(selectedSession || selectedCaseId) && (
              <SessionForm
                caseId={selectedCaseId || selectedSession?.case.id}
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
            )}

            {!selectedSession && !selectedCaseId && (
              <div className="flex justify-end">
                <button
                  onClick={handleFormCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === 'calendar' ? (
        <CalendarGrid
          sessions={sessions}
          onSessionClick={handleEditSession}
        />
      ) : (
        <SessionList
          sessions={sessions}
          onEdit={handleEditSession}
          onDelete={handleDeleteSession}
          onComplete={handleCompleteSession}
          onCancel={handleCancelSession}
        />
      )}
    </div>
  );
}
