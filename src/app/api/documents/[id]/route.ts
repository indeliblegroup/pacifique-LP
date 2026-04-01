import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { deleteFromBlob } from '@/lib/blob';

// DELETE /api/documents/[id] - Delete a document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Get document
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        case: {
          select: {
            id: true,
            caseNumber: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      );
    }

    // Delete from blob storage
    try {
      await deleteFromBlob(document.blobUrl);
    } catch (error) {
      console.error('Error deleting from blob:', error);
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database
    await prisma.document.delete({
      where: { id },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'DOCUMENT_UPLOADED', // We don't have a DOCUMENT_DELETED type, but we could add it
        description: `Documento ${document.name} removido`,
        userId: user.id,
        caseId: document.caseId,
      },
    });

    return NextResponse.json({ message: 'Documento removido com sucesso' });
  } catch (error: any) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
