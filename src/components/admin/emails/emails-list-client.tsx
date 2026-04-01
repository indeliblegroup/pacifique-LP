'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Mail } from 'lucide-react';
import Pagination from '@/components/admin/shared/pagination';

interface Email {
  id: string;
  subject: string;
  toEmails: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
  sentBy: {
    id: string;
    name: string;
  };
  case: {
    id: string;
    caseNumber: string;
    title: string;
  } | null;
  template: {
    id: string;
    name: string;
  } | null;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface EmailsListClientProps {
  initialData: Email[];
  initialPagination: PaginationData;
}

export default function EmailsListClient({
  initialData,
  initialPagination,
}: EmailsListClientProps) {
  const [emails, setEmails] = useState<Email[]>(initialData);
  const [pagination, setPagination] = useState<PaginationData>(initialPagination);
  const [loading, setLoading] = useState(false);

  const fetchEmails = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/emails?page=${page}&limit=${pagination.limit}`);
      if (!response.ok) throw new Error('Failed to fetch emails');

      const data = await response.json();
      setEmails(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchEmails(page);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-primary">
          Emails
        </h1>
        <p className="mt-1 text-sm text-text-body">
          Histórico de emails enviados
        </p>
      </div>

      {/* Emails List */}
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
                  Assunto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Para
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enviado por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emails.map((email) => {
                const toEmails = JSON.parse(email.toEmails) as string[];

                return (
                  <tr key={email.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900 max-w-xs truncate">
                          {email.subject}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {toEmails[0]}
                      {toEmails.length > 1 && (
                        <span className="text-xs text-gray-400">
                          {' '}
                          +{toEmails.length - 1}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {email.case ? (
                        <Link
                          href={`/admin/cases/${email.case.id}`}
                          className="text-primary hover:text-primary/80"
                        >
                          {email.case.caseNumber}
                        </Link>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          email.status === 'SENT'
                            ? 'bg-green-100 text-green-800'
                            : email.status === 'FAILED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {email.status === 'SENT'
                          ? 'Enviado'
                          : email.status === 'FAILED'
                          ? 'Falhou'
                          : 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {email.sentBy.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(
                        new Date(email.sentAt || email.createdAt),
                        'dd/MM/yyyy HH:mm'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {emails.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum email enviado ainda.</p>
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
