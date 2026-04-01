'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Mail,
  Users,
  Calendar,
  LogOut,
  Shield,
  User,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Processos', href: '/admin/cases', icon: FolderOpen },
  { name: 'Calendário', href: '/admin/calendar', icon: Calendar },
  { name: 'Documentos', href: '/admin/documents', icon: FileText },
  { name: 'Emails', href: '/admin/emails', icon: Mail },
  { name: 'Usuários', href: '/admin/users', icon: Users },
  { name: 'Auditoria', href: '/admin/audit', icon: Shield, adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <div className="flex h-full w-64 flex-col bg-accent-deep">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-accent-deep/20">
        <h1 className="text-xl font-heading font-bold text-white">
          PACIFIQUE!
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          // Hide admin-only items from non-admin users
          if ('adminOnly' in item && item.adminOnly && userRole !== 'ADMIN') {
            return null;
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium
                transition-colors duration-150
                ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="px-4 pb-6 border-t border-white/10 pt-4">
        {/* Profile Link */}
        <Link
          href="/admin/profile"
          className={`
            group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium mb-2
            transition-colors duration-150
            ${
              pathname === '/admin/profile'
                ? 'bg-white/10 text-white'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }
          `}
        >
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {session?.user?.name || 'Usuário'}
            </p>
            <p className="text-xs text-white/50 truncate">Meu Perfil</p>
          </div>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors duration-150"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Sair
        </button>
      </div>
    </div>
  );
}
