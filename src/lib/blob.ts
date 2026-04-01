import { put, del, head } from '@vercel/blob';

// Allowed file types
export const ALLOWED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
} as const;

export const ALLOWED_MIME_TYPES = Object.keys(ALLOWED_FILE_TYPES);

// Max file size: 10MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Validates file type and size
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido. Permitidos: PDF, DOCX, PNG, JPG`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Arquivo muito grande. Tamanho máximo: 10MB`,
    };
  }

  return { valid: true };
}

/**
 * Uploads a file to Vercel Blob storage
 */
export async function uploadToBlob(
  file: File,
  pathname: string
): Promise<{ url: string; key: string }> {
  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  return {
    url: blob.url,
    key: blob.pathname,
  };
}

/**
 * Deletes a file from Vercel Blob storage
 */
export async function deleteFromBlob(url: string): Promise<void> {
  await del(url);
}

/**
 * Gets file metadata from Vercel Blob
 */
export async function getBlobMetadata(url: string) {
  return await head(url);
}

/**
 * Generates a unique filename with timestamp
 */
export function generateFilename(originalName: string, caseNumber: string): string {
  const timestamp = Date.now();
  const extension = originalName.substring(originalName.lastIndexOf('.'));
  const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
  const sanitized = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '-');

  return `${caseNumber}/${timestamp}-${sanitized}${extension}`;
}
