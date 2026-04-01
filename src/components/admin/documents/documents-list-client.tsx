'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { FileText, Download } from 'lucide-react';
import Pagination from '@/components/admin/shared/pagination';

interface Document {
  id: string;
  name: string;
  type: string;
  sizeBytes: number;
  blobUrl: string;
  createdAt: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  case: {
    id: string;
    caseNumber: string;
    title: string;
  } | null;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface DocumentsListClientProps {
  initialData: Document[];
  initialPagination: PaginationData;
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  CARTA_CONVITE: 'Carta Convite',
  TERMO_ACORDO: 'Termo de Acordo',
  TERMO_NEGATIVO: 'Termo Negativo',
  PROCURACAO: 'Procuração',
  RG: 'RG',
  CPF: 'CPF',
  COMPROVANTE_RESIDENCIA: 'Comprovante de Residência',
  OUTROS: 'Outros',
};

export default function DocumentsListClient({
  initialData,
  initialPagination,
}: DocumentsListClientProps) {
  const [documents, setDocuments] = useState<Document[]>(initialData);
  const [pagination, setPagination] = useState<PaginationData>(initialPagination);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/documents?page=${page}&limit=${pagination.limit}`);
      if (!response.ok) throw new Error('Failed to fetch documents');

      const data = await response.json();
      setDocuments(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchDocuments(page);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-primary">
          Documentos
        </h1>
        <p className="mt-1 text-sm text-text-body">
          Todos os documentos enviados no sistema
        </p>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tamanho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enviado por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc) => {
                const sizeInKB = (doc.sizeBytes / 1024).toFixed(2);
                const sizeInMB = (doc.sizeBytes / 1024 / 1024).toFixed(2);
                const displaySize = doc.sizeBytes > 1024 * 1024
                  ? `${sizeInMB} MB`
                  : `${sizeInKB} KB`;

                return (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900 max-w-xs truncate">
                          {doc.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {DOCUMENT_TYPE_LABELS[doc.type] || doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {doc.case ? (
                        <Link
                          href={`/admin/cases/${doc.case.id}`}
                          className="text-primary hover:text-primary/80"
                        >
                          {doc.case.caseNumber}
                        </Link>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {displaySize}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {doc.uploadedBy.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(doc.createdAt), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a
                        href={doc.blobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {documents.length === 0 && !loading && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum documento enviado ainda.</p>
            </div>
          )}
        </div>

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
