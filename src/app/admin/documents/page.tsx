import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import DocumentsListClient from '@/components/admin/documents/documents-list-client';

async function getInitialDocuments() {
  const limit = 50;
  const page = 1;
  const skip = (page - 1) * limit;

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        case: {
          select: {
            id: true,
            caseNumber: true,
            title: true,
          },
        },
      },
    }),
    prisma.document.count(),
  ]);

  // Serialize dates for client component
  const serializedDocuments = documents.map(doc => ({
    ...doc,
    createdAt: doc.createdAt.toISOString(),
  }));

  return {
    data: serializedDocuments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export default async function DocumentsPage() {
  await requireAuth();
  const { data, pagination } = await getInitialDocuments();

  return (
    <DocumentsListClient
      initialData={data}
      initialPagination={pagination}
    />
  );
}
