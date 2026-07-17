import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Menu, X, Loader as Loader2 } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../lib/AuthContext';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F2EE]">
        <Loader2 className="w-8 h-8 animate-spin text-[#132073]" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#F4F2EE] font-sans overflow-hidden">
      <div className="hidden lg:block h-full">
        <AdminSidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full w-60">
            <AdminSidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden bg-white border-b border-[#E5E3DF] px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)}>
            {mobileOpen ? <X className="w-6 h-6 text-navy" /> : <Menu className="w-6 h-6 text-navy" />}
          </button>
          <picture>
            <source srcSet="/logo-gramme.webp" type="image/webp" />
            <img src="/logo-gramme.jpeg" alt="Gramme" className="h-7 w-auto object-contain" />
          </picture>
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
