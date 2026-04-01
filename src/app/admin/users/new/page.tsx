import { requireAuth } from '@/lib/auth-helpers';
import { canManageUsers } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { UserForm } from '@/components/admin/users/user-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NewUserPage() {
  const user = await requireAuth();

  if (!canManageUsers(user.role)) {
    redirect('/admin');
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Usuários
        </Link>
        <h1 className="text-2xl font-heading font-bold text-primary">
          Novo Usuário
        </h1>
        <p className="mt-1 text-sm text-text-body">
          Crie um novo usuário no sistema
        </p>
      </div>

      {/* Form */}
      <UserForm />
    </div>
  );
}
