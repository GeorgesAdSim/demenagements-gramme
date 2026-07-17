import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Inbox, Image, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: FileText, label: 'Pages', path: '/admin/pages' },
  { icon: Inbox, label: 'Devis', path: '/admin/devis', badge: 3 },
  { icon: Image, label: 'Médias', path: '/admin/media' },
  { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const { user, signOut } = useAuth();

  return (
    <motion.aside
      initial={{ x: -240 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-60 bg-[#0D1020] h-full flex flex-col"
    >
      <div className="mx-4 mt-4">
        <div className="bg-white rounded-sm px-3 py-2 flex items-center">
          <img
            src="/logo-gramme.png"
            alt="Gramme"
            className="h-7 w-auto object-contain"
          />
        </div>
      </div>

      <nav className="flex-1 mt-8 px-3 space-y-1">
        {NAV_ITEMS.map(({ icon: Icon, label, path, badge }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#F0B800] text-[#0D1020] font-bold'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm">{label}</span>
            {badge && (
              <span className="ml-auto bg-[#F0B800] text-[#0D1020] rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-4 py-3">
        <p className="text-white/50 text-[13px] mb-2 truncate">{user?.email}</p>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl px-4 py-2 w-full transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </motion.aside>
  );
}
