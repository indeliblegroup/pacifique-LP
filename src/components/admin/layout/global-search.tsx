'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, FileText, Users, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface SearchResult {
  type: 'case' | 'user' | 'document';
  id: string;
  title: string;
  subtitle?: string;
  url: string;
}

interface SearchResponse {
  cases: Array<{
    id: string;
    caseNumber: string;
    title: string;
    status: string;
  }>;
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    caseId: string;
    type: string;
  }>;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Search API call
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');

      const data: SearchResponse = await response.json();

      const searchResults: SearchResult[] = [
        ...data.cases.map((c) => ({
          type: 'case' as const,
          id: c.id,
          title: `${c.caseNumber} - ${c.title}`,
          subtitle: c.status,
          url: `/admin/cases/${c.id}`,
        })),
        ...data.users.map((u) => ({
          type: 'user' as const,
          id: u.id,
          title: u.name,
          subtitle: `${u.email} · ${u.role}`,
          url: `/admin/users/${u.id}/edit`,
        })),
        ...data.documents.map((d) => ({
          type: 'document' as const,
          id: d.id,
          title: d.name,
          subtitle: d.type,
          url: `/admin/cases/${d.caseId}/documents`,
        })),
      ];

      setResults(searchResults);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  // Navigate to selected result
  const navigateToResult = (result: SearchResult) => {
    router.push(result.url);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      navigateToResult(results[selectedIndex]);
    }
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'case':
        return <FileText className="h-4 w-4 text-primary" />;
      case 'user':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'document':
        return <FileText className="h-4 w-4 text-green-600" />;
    }
  };

  const getCategoryLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'case':
        return 'Processos';
      case 'user':
        return 'Usuários';
      case 'document':
        return 'Documentos';
    }
  };

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">Buscar</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-white border border-gray-300 rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-24">
          <div
            ref={searchRef}
            className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar processos, usuários, documentos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 text-sm outline-none"
              />
              {isLoading && <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />}
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Search results */}
            <div className="max-h-96 overflow-y-auto">
              {query && results.length === 0 && !isLoading && (
                <div className="py-12 text-center text-sm text-gray-500">
                  Nenhum resultado encontrado
                </div>
              )}

              {results.length > 0 && (
                <div className="py-2">
                  {Object.entries(groupedResults).map(([type, items]) => (
                    <div key={type}>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                        {getCategoryLabel(type as SearchResult['type'])}
                      </div>
                      {items.map((result, index) => {
                        const globalIndex = results.findIndex((r) => r.id === result.id);
                        return (
                          <button
                            key={result.id}
                            onClick={() => navigateToResult(result)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                              selectedIndex === globalIndex
                                ? 'bg-primary/10'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {getIcon(result.type)}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {result.title}
                              </div>
                              {result.subtitle && (
                                <div className="text-xs text-gray-500 truncate">
                                  {result.subtitle}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {!query && (
                <div className="py-12 text-center text-sm text-gray-500">
                  Digite para buscar
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">↑↓</kbd>
                  <span>Navegar</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">↵</kbd>
                  <span>Selecionar</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">esc</kbd>
                  <span>Fechar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
