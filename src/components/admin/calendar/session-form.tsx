'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

interface SessionFormProps {
  caseId?: string;
  sessionId?: string;
  initialData?: {
    sessionDate: string;
    duration: number;
    location?: string;
    type: string;
    conductedById?: string;
    notes?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface User {
  id: string;
  name: string;
  role: string;
}

export function SessionForm({
  caseId,
  sessionId,
  initialData,
  onSuccess,
  onCancel,
}: SessionFormProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [sessionDate, setSessionDate] = useState(
    initialData?.sessionDate
      ? format(new Date(initialData.sessionDate), "yyyy-MM-dd'T'HH:mm")
      : ''
  );
  const [duration, setDuration] = useState(initialData?.duration || 60);
  const [location, setLocation] = useState(initialData?.location || '');
  const [type, setType] = useState(initialData?.type || 'JOINT');
  const [conductedById, setConductedById] = useState(initialData?.conductedById || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load users (mediators/conciliators)
  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data.filter((u: User) => u.role !== 'ADMIN'));
        }
      } catch (error) {
        console.error('Error loading users:', error);
      }
    }
    loadUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!sessionDate) {
      setError('Data e hora da sessão são obrigatórias');
      return;
    }

    if (!caseId && !sessionId) {
      setError('Case ID ou Session ID são obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        caseId,
        sessionDate: new Date(sessionDate).toISOString(),
        duration,
        location: location || undefined,
        type,
        conductedById: conductedById || undefined,
        notes: notes || undefined,
      };

      const url = sessionId ? `/api/sessions/${sessionId}` : '/api/sessions';
      const method = sessionId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar sessão');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Session Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Calendar className="inline h-4 w-4 mr-1" />
          Data e Hora <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          required
        />
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Clock className="inline h-4 w-4 mr-1" />
          Duração (minutos) <span className="text-red-500">*</span>
        </label>
        <select
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
        >
          <option value={30}>30 minutos</option>
          <option value={60}>1 hora</option>
          <option value={90}>1 hora e 30 minutos</option>
          <option value={120}>2 horas</option>
          <option value={180}>3 horas</option>
        </select>
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Users className="inline h-4 w-4 mr-1" />
          Tipo de Sessão <span className="text-red-500">*</span>
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
        >
          <option value="JOINT">Sessão Conjunta</option>
          <option value="INDIVIDUAL_REQUESTING">Sessão Individual - Requerente</option>
          <option value="INDIVIDUAL_REQUESTED">Sessão Individual - Requerido</option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <MapPin className="inline h-4 w-4 mr-1" />
          Local / Link
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="URL do Google Meet, Zoom, ou endereço físico"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Conducted By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Responsável pela Condução
        </label>
        <select
          value={conductedById}
          onChange={(e) => setConductedById(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
        >
          <option value="">Selecione...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role === 'LAWYER' ? 'Advogado' : 'Conciliador'})
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observações
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Notas ou observações sobre a sessão..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Salvando...' : sessionId ? 'Atualizar Sessão' : 'Agendar Sessão'}
        </button>
      </div>
    </form>
  );
}
