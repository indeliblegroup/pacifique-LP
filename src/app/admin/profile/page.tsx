import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProfileClient } from '@/components/admin/profile/profile-client';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  // Fetch full user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      status: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  if (!user) {
    redirect('/auth/login');
  }

  return <ProfileClient user={user} />;
}
