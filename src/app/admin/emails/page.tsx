import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import EmailsListClient from '@/components/admin/emails/emails-list-client';

async function getInitialEmails() {
  const limit = 50;
  const page = 1;
  const skip = (page - 1) * limit;

  const [emails, total] = await Promise.all([
    prisma.email.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        sentBy: {
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
        template: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.email.count(),
  ]);

  // Serialize dates for client component
  const serializedEmails = emails.map(email => ({
    ...email,
    sentAt: email.sentAt?.toISOString() || null,
    createdAt: email.createdAt.toISOString(),
  }));

  return {
    data: serializedEmails,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export default async function EmailsPage() {
  await requireAuth();
  const { data, pagination } = await getInitialEmails();

  return (
    <EmailsListClient
      initialData={data}
      initialPagination={pagination}
    />
  );
}
