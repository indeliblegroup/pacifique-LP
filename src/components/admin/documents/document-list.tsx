'use client';

import { useState } from 'react';
import { FileText, Download, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Document {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  blobUrl: string;
  sizeBytes: number;
  createdAt: Date;
  uploadedBy: {
    id: string;
    name: string;
  };
}

interface DocumentListProps {
  caseId: string;
  documents: Document[];
  onDelete?: () => void;
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

export function DocumentList({ caseId, documents, onDelete }: DocumentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (documentId: string) => {
    if (!confirm('Tem certeza que deseja remover este documento?')) {
      return;
    }

    setDeletingId(documentId);

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao remover documento');
      }

      if (onDelete) {
        onDelete();
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (url: string, name: string) => {
    window.open(url, '_blank');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-heading font-semibold text-primary mb-4">
          Documentos
        </h3>
        <p className="text-sm text-gray-500 text-center py-8">
          Nenhum documento enviado ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-heading font-semibold text-primary mb-4">
        Documentos ({documents.length})
      </h3>

      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800">
                      {DOCUMENT_TYPE_LABELS[doc.type] || doc.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(doc.sizeBytes)}
                    </span>
                  </div>
                  {doc.description && (
                    <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Enviado por {doc.uploadedBy.name} em{' '}
                    {format(new Date(doc.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleDownload(doc.blobUrl, doc.name)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    title="Remover"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
