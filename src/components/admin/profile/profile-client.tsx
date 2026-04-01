'use client';

import { useState } from 'react';
import { User, Mail, Phone, Calendar, Clock, Shield } from 'lucide-react';
import { ROLE_LABELS } from '@/lib/permissions';
import { EditProfileForm } from './edit-profile-form';
import { ChangePasswordForm } from './change-password-form';

interface ProfileClientProps {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    phone: string | null;
    status: string;
    createdAt: Date;
    lastLoginAt: Date | null;
  };
}

export function ProfileClient({ user }: ProfileClientProps) {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900">
          Meu Perfil
        </h1>
        <p className="text-gray-600 mt-1">
          Gerencie suas informações pessoais e configurações de conta
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{ROLE_LABELS[user.role as keyof typeof ROLE_LABELS]}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Telefone</p>
                <p className="text-sm text-gray-900">{user.phone || 'Não informado'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Papel</p>
                <p className="text-sm text-gray-900">{ROLE_LABELS[user.role as keyof typeof ROLE_LABELS]}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Membro desde</p>
                <p className="text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {user.lastLoginAt && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Último acesso</p>
                  <p className="text-sm text-gray-900">
                    {new Date(user.lastLoginAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}{' '}
                    às{' '}
                    {new Date(user.lastLoginAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              onClick={() => setShowEditProfile(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Editar Perfil
            </button>
            <button
              onClick={() => setShowChangePassword(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Alterar Senha
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditProfile && (
        <EditProfileForm
          user={{
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
          }}
          onClose={() => setShowEditProfile(false)}
        />
      )}

      {showChangePassword && (
        <ChangePasswordForm onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
}
