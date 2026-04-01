import { requireAuth } from '@/lib/auth-helpers';
import { canEditCase } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DocumentUpload } from '@/components/admin/documents/document-upload';
import { DocumentList } from '@/components/admin/documents/document-list';

async function getCaseWithDocuments(id: string) {
  return await prisma.case.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
        },
      },
      documents: {
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

export default async function CaseDocumentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;
  const caseData = await getCaseWithDocuments(id);

  if (!caseData) {
    redirect('/admin/cases');
  }

  // Check permissions
  if (!canEditCase(user.role, caseData.assignedToId || '', user.id)) {
    redirect('/admin/cases');
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/admin/cases/${id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o Processo
        </Link>

        <div>
          <h1 className="text-2xl font-heading font-bold text-primary">
            Documentos
          </h1>
          <p className="mt-1 text-sm text-text-body">
            {caseData.caseNumber} - {caseData.title}
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Upload */}
        <div>
          <DocumentUpload caseId={id} />
        </div>

        {/* Document List */}
        <div>
          <DocumentList caseId={id} documents={caseData.documents} />
        </div>
      </div>
    </div>
  );
}
