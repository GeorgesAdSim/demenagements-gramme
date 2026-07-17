import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Inbox, Image, Loader as Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const SERVICE_MAP: Record<string, string> = {
  demenagement: 'Déménagement',
  transport: 'Transport',
  'garde-meuble': 'Garde-Meubles',
};

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  new: { label: 'Nouveau', cls: 'bg-[#F0B800]/20 text-[#132073]' },
  read: { label: 'Lu', cls: 'bg-gray-100 text-gray-600' },
  replied: { label: 'Répondu', cls: 'bg-green-100 text-green-700' },
  archived: { label: 'Archivé', cls: 'bg-gray-200 text-gray-400' },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ pages: 0, newDevis: 0, media: 0 });
  const [recentDevis, setRecentDevis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const [pagesRes, devisNewRes, mediaRes, recentDevisRes] = await Promise.all([
      supabase.from('pages').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('devis_requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('gramme_media').select('id', { count: 'exact', head: true }),
      supabase.from('devis_requests').select('*').order('created_at', { ascending: false }).limit(5),
    ]);

    setStats({
      pages: pagesRes.count || 0,
      newDevis: devisNewRes.count || 0,
      media: mediaRes.count || 0,
    });
    setRecentDevis(recentDevisRes.data || []);
    setLoading(false);
  }

  const statCards = [
    { icon: FileText, value: stats.pages.toString(), label: 'Pages publiées', color: 'bg-[#F0B800]/20' },
    { icon: Inbox, value: stats.newDevis.toString(), label: 'Nouveaux devis', color: 'bg-red-100', badge: stats.newDevis > 0 },
    { icon: Image, value: stats.media.toString(), label: 'Fichiers médias', color: 'bg-[#F0B800]/20' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-8 h-8 animate-spin text-[#132073]" />
      </div>
    );
  }

  return (
    <div className="font-sans">
      <div className="bg-white border-b border-[#E5E3DF] px-8 py-5 flex items-center justify-between">
        <h1 className="font-black uppercase text-[#132073] text-xl">TABLEAU DE BORD</h1>
        <button
          onClick={() => navigate('/admin/pages/new/edit')}
          className="bg-[#F0B800] text-[#132073] font-bold uppercase rounded-md px-5 py-2 text-sm hover:bg-[#EAB000] transition-colors"
        >
          + NOUVELLE PAGE
        </button>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-4 lg:mx-8 mt-8"
      >
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            variants={fadeUp}
            className="bg-white rounded-2xl p-6 border border-[#E5E3DF] relative"
          >
            <div className={`absolute top-4 right-4 ${card.color} p-3 rounded-xl`}>
              <card.icon className="w-5 h-5 text-[#132073]" />
              {card.badge && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </div>
            <span className="font-black text-[2.5rem] text-[#132073] block">{card.value}</span>
            <span className="text-[#85868C] text-sm">{card.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <div className="bg-white rounded-2xl mx-4 lg:mx-8 mt-6 mb-8 p-6 border border-[#E5E3DF]">
        <h3 className="font-bold text-[#132073] mb-4">Derniers devis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F4F2EE] text-left">
                <th className="px-4 py-3 font-bold text-[#132073]">Nom</th>
                <th className="px-4 py-3 font-bold text-[#132073]">Service</th>
                <th className="px-4 py-3 font-bold text-[#132073] hidden md:table-cell">Ville</th>
                <th className="px-4 py-3 font-bold text-[#132073] hidden md:table-cell">Date</th>
                <th className="px-4 py-3 font-bold text-[#132073]">Statut</th>
                <th className="px-4 py-3 font-bold text-[#132073]">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentDevis.map((d, i) => {
                const st = STATUS_MAP[d.status] || STATUS_MAP.new;
                return (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-t border-[#E5E3DF]"
                  >
                    <td className="px-4 py-3 font-bold text-[#132073]">{d.firstname} {d.lastname}</td>
                    <td className="px-4 py-3 text-[#85868C]">{SERVICE_MAP[d.service_type] || d.service_type}</td>
                    <td className="px-4 py-3 text-[#85868C] hidden md:table-cell">{d.departure_city}</td>
                    <td className="px-4 py-3 text-[#85868C] hidden md:table-cell">
                      {d.created_at ? format(new Date(d.created_at), 'dd/MM/yyyy', { locale: fr }) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${st.cls} rounded-full px-3 py-1 text-xs font-bold`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate('/admin/devis')}
                        className="text-[#132073] font-bold text-xs hover:underline"
                      >
                        Voir
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
              {recentDevis.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#85868C]">
                    Aucun devis pour le moment
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
