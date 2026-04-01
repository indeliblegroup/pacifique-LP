import { Sidebar } from '@/components/admin/layout/sidebar';
import { Header } from '@/components/admin/layout/header';
import { SessionProvider } from '@/components/admin/providers/session-provider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <Header />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="py-6 px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
