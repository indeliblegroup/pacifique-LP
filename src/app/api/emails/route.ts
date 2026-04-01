import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { sendEmail, validateEmails, parseEmailList } from '@/lib/email';

// GET /api/emails - List emails (optionally filtered by case)
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const caseId = searchParams.get('caseId');

    const where: any = {};

    if (caseId) {
      where.caseId = caseId;
    }

    const skip = (page - 1) * limit;

    const [emails, total] = await Promise.all([
      prisma.email.findMany({
        where,
        skip,
        take: limit,
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
        orderBy: { createdAt: 'desc' },
      }),
      prisma.email.count({ where }),
    ]);

    return NextResponse.json({
      data: emails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST /api/emails - Send an email
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const { to, cc, subject, bodyHtml, bodyText, caseId, templateId } = body;

    // Validate required fields
    if (!to || !subject || !bodyHtml) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: to, subject, bodyHtml' },
        { status: 400 }
      );
    }

    // Parse email lists
    const toEmails = Array.isArray(to) ? to : parseEmailList(to);
    const ccEmails = cc ? (Array.isArray(cc) ? cc : parseEmailList(cc)) : [];

    // Validate emails
    const toValidation = validateEmails(toEmails);
    if (!toValidation.valid) {
      return NextResponse.json({ error: toValidation.error }, { status: 400 });
    }

    if (ccEmails.length > 0) {
      const ccValidation = validateEmails(ccEmails);
      if (!ccValidation.valid) {
        return NextResponse.json({ error: ccValidation.error }, { status: 400 });
      }
    }

    // Send email via Resend
    let resendId: string | undefined;
    let sentAt: Date | undefined;
    let status: 'SENT' | 'DRAFT' | 'FAILED' = 'DRAFT';

    try {
      const result = await sendEmail({
        to: toEmails,
        cc: ccEmails.length > 0 ? ccEmails : undefined,
        subject,
        html: bodyHtml,
        text: bodyText,
      });

      resendId = result.id;
      sentAt = new Date();
      status = 'SENT';
    } catch (error: any) {
      console.error('Error sending email:', error);
      // Continue to save the email record even if sending failed
      status = 'FAILED';
    }

    // Save email record
    const email = await prisma.email.create({
      data: {
        toEmails: JSON.stringify(toEmails),
        ccEmails: ccEmails.length > 0 ? JSON.stringify(ccEmails) : null,
        subject,
        bodyHtml,
        bodyText: bodyText || null,
        status,
        resendId,
        sentAt,
        sentById: user.id,
        caseId: caseId || null,
        templateId: templateId || null,
      },
      include: {
        sentBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Log activity if associated with a case
    if (caseId) {
      await prisma.activity.create({
        data: {
          type: 'EMAIL_SENT',
          description: `Email "${subject}" enviado`,
          userId: user.id,
          caseId,
        },
      });
    }

    return NextResponse.json(email, { status: 201 });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
