import { requireAuth } from '@/lib/auth-helpers';
import { canEditCase } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { EmailComposer } from '@/components/admin/emails/email-composer';
import { EmailList } from '@/components/admin/emails/email-list';

async function getCaseWithEmails(id: string) {
  return await prisma.case.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
        },
      },
      emails: {
        orderBy: { createdAt: 'desc' },
        include: {
          sentBy: {
            select: {
              id: true,
              name: true,
            },
          },
          template: {
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

export default async function CaseEmailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;
  const caseData = await getCaseWithEmails(id);

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
            Emails
          </h1>
          <p className="mt-1 text-sm text-text-body">
            {caseData.caseNumber} - {caseData.title}
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Composer */}
        <div>
          <EmailComposer
            caseId={id}
            caseData={{
              caseNumber: caseData.caseNumber,
              title: caseData.title,
              requestingParty: caseData.requestingParty,
              requestedParty: caseData.requestedParty,
              assignedTo: caseData.assignedTo,
            }}
          />
        </div>

        {/* Email History */}
        <div>
          <EmailList emails={caseData.emails} />
        </div>
      </div>
    </div>
  );
}
