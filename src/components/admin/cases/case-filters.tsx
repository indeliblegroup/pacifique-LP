'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Filter, X } from 'lucide-react';
import { STATUS_LABELS, NUCLEUS_LABELS } from '@/lib/case-utils';

interface User {
  id: string;
  name: string;
}

interface CaseFiltersProps {
  users: User[];
}

export function CaseFilters({ users }: CaseFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<string[]>([]);
  const [nucleus, setNucleus] = useState<string[]>([]);
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Initialize from URL params
  useEffect(() => {
    const statusParam = searchParams.get('status');
    const nucleusParam = searchParams.get('nucleus');
    const assignedToParam = searchParams.get('assignedTo');
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');

    if (statusParam) setStatus(statusParam.split(','));
    if (nucleusParam) setNucleus(nucleusParam.split(','));
    if (assignedToParam) setAssignedTo(assignedToParam);
    if (fromParam) setDateFrom(fromParam);
    if (toParam) setDateTo(toParam);
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Remove all filter params
    params.delete('status');
    params.delete('nucleus');
    params.delete('assignedTo');
    params.delete('from');
    params.delete('to');

    // Add active filters
    if (status.length > 0) {
      params.set('status', status.join(','));
    }
    if (nucleus.length > 0) {
      params.set('nucleus', nucleus.join(','));
    }
    if (assignedTo) {
      params.set('assignedTo', assignedTo);
    }
    if (dateFrom) {
      params.set('from', dateFrom);
    }
    if (dateTo) {
      params.set('to', dateTo);
    }

    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setStatus([]);
    setNucleus([]);
    setAssignedTo('');
    setDateFrom('');
    setDateTo('');

    const params = new URLSearchParams(searchParams.toString());
    params.delete('status');
    params.delete('nucleus');
    params.delete('assignedTo');
    params.delete('from');
    params.delete('to');

    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const activeFilterCount =
    status.length +
    nucleus.length +
    (assignedTo ? 1 : 0) +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0);

  const toggleStatus = (value: string) => {
    setStatus((prev) =>
      prev.includes(value)
        ? prev.filter((s) => s !== value)
        : [...prev, value]
    );
  };

  const toggleNucleus = (value: string) => {
    setNucleus((prev) =>
      prev.includes(value)
        ? prev.filter((n) => n !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="relative">
      {/* Filter trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <Filter className="h-4 w-4" />
        <span>Filtros</span>
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center justify-center h-5 w-5 text-xs font-medium text-white bg-primary rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Filter panel */}
          <div className="absolute right-0 z-20 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Filtros Avançados
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {/* Status filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={status.includes(key)}
                        onChange={() => toggleStatus(key)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Nucleus filter */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Núcleo
                </label>
                <div className="space-y-2">
                  {Object.entries(NUCLEUS_LABELS).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={nucleus.includes(key)}
                        onChange={() => toggleNucleus(key)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Assigned user filter */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Responsável
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Todos</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date range filter */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Período de Criação
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      De
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Até
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Limpar tudo
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
