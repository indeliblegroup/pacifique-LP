import { NextRequest, NextResponse } from 'next/server';
import { hash, compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { z } from 'zod';

// POST /api/users/me/password - Change current user's password
export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();

    const body = await request.json();

    // Validation schema
    const changePasswordSchema = z.object({
      currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
      newPassword: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
    });

    const validatedData = changePasswordSchema.parse(body);

    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        name: true,
        passwordHash: true,
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Usuário não encontrado ou sem senha cadastrada' },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await compare(
      validatedData.currentPassword,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Senha atual incorreta' },
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await hash(validatedData.newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'USER_UPDATED',
        description: `${user.name} alterou sua senha`,
        userId: currentUser.id,
        metadata: JSON.stringify({ passwordChange: true }),
      },
    });

    return NextResponse.json({ message: 'Senha alterada com sucesso' });
  } catch (error: any) {
    console.error('Error changing password:', error);

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
