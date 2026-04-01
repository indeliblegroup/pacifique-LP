import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { validateFile, uploadToBlob, generateFilename } from '@/lib/blob';

// POST /api/upload - Upload a file
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caseId = formData.get('caseId') as string;
    const documentType = formData.get('documentType') as string;
    const description = formData.get('description') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    if (!caseId) {
      return NextResponse.json({ error: 'ID do processo é obrigatório' }, { status: 400 });
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Check if case exists
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      select: { id: true, caseNumber: true },
    });

    if (!caseData) {
      return NextResponse.json({ error: 'Processo não encontrado' }, { status: 404 });
    }

    // Generate filename and upload to blob storage
    const filename = generateFilename(file.name, caseData.caseNumber);
    const { url, key } = await uploadToBlob(file, filename);

    // Create document record in database
    const document = await prisma.document.create({
      data: {
        caseId,
        name: file.name,
        type: (documentType || 'OUTROS') as any,
        description: description || null,
        blobUrl: url,
        blobKey: key,
        mimeType: file.type,
        sizeBytes: file.size,
        uploadedById: user.id,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'DOCUMENT_UPLOADED',
        description: `Documento ${file.name} enviado`,
        userId: user.id,
        caseId,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao fazer upload' },
      { status: 500 }
    );
  }
}
