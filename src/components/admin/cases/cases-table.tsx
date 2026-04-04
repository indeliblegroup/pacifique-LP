'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Search, Loader2 } from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS, NUCLEUS_LABELS } from '@/lib/case-constants';
import { CaseFilters } from './case-filters';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface Case {
  id: string;
  caseNumber: string;
  title: string;
  nucleus: string;
  status: string;
  requestingParty: string;
  requestedParty: string;
  createdAt: string;
  assignedTo?: {
    id: string;
    name: string;
  } | null;
  _count: {
    documents: number;
    emails: number;
  };
}

interface User {
  id: string;
  name: string;
}

interface CasesTableProps {
  initialCases: Case[];
  users: User[];
}

export function CasesTable({ initialCases, users }: CasesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [cases, setCases] = useState<Case[]>(initialCases);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch cases when filters or search change
  useEffect(() => {
    const fetchCases = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams(searchParams.toString());

        if (debouncedSearch) {
          params.set('search', debouncedSearch);
        } else {
          params.delete('search');
        }

        const response = await fetch(`/api/cases?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch cases');

        const data = await response.json();
        setCases(data.data || data);
      } catch (error) {
        console.error('Error fetching cases:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, [debouncedSearch, searchParams]);

  // Update URL with search query
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }

    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl);
  }, [debouncedSearch, pathname, router, searchParams]);

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        {/* Search input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por número, título, partes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Filters */}
        <CaseFilters users={users} />
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Núcleo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsável
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Criado em
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cases.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/admin/cases/${c.id}`}
                    className="text-sm font-medium text-primary hover:text-primary/80"
                  >
                    {c.caseNumber}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {c.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {c._count.documents} docs · {c._count.emails} emails
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {NUCLEUS_LABELS[c.nucleus]}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      STATUS_COLORS[c.status]
                    }`}
                  >
                    {STATUS_LABELS[c.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {c.assignedTo?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(c.createdAt), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/cases/${c.id}`}
                    className="text-primary hover:text-primary/80"
                  >
                    Ver detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cases.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchQuery || searchParams.toString()
                ? 'Nenhum processo encontrado com os critérios selecionados.'
                : 'Nenhum processo encontrado.'}
            </p>
          </div>
        )}

        {isLoading && cases.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
