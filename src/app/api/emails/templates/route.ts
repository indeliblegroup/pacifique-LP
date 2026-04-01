import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { canManageTemplates } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { createEmailTemplateSchema } from '@/lib/validations';

// GET /api/emails/templates - List all email templates
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    const templates = await prisma.emailTemplate.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(templates);
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST /api/emails/templates - Create a new email template
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!canManageTemplates(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createEmailTemplateSchema.parse(body);

    const template = await prisma.emailTemplate.create({
      data: validatedData,
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error: any) {
    console.error('Error creating template:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
