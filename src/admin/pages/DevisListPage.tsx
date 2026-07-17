import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Archive, Trash2, X, Loader as Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const STATUS_CLASSES: Record<string, string> = {
  new: 'bg-[#F0B800]/20 text-[#132073]',
  read: 'bg-gray-100 text-gray-600',
  replied: 'bg-green-100 text-green-700',
  archived: 'bg-gray-200 text-gray-400',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'Nouveau',
  read: 'Lu',
  replied: 'Répondu',
  archived: 'Archivé',
};

const SERVICE_CLASSES: Record<string, string> = {
  demenagement: 'bg-blue-100 text-blue-700',
  transport: 'bg-orange-100 text-orange-700',
  'garde-meuble': 'bg-green-100 text-green-700',
};

const SERVICE_LABELS: Record<string, string> = {
  demenagement: 'Déménagement',
  transport: 'Transport',
  'garde-meuble': 'Garde-Meubles',
};

const VOLUME_LABELS: Record<string, string> = {
  '<20': '< 20m3',
  '20-50': '20-50m3',
  '50-100': '50-100m3',
  unknown: 'Inconnu',
};

const FILTERS = [
  { value: 'all', label: 'Tous' },
  { value: 'new', label: 'Nouveau' },
  { value: 'read', label: 'Lu' },
  { value: 'replied', label: 'Répondu' },
  { value: 'archived', label: 'Archivé' },
];

interface DevisItem {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  service_type: string;
  departure_city: string;
  arrival_city: string;
  move_date: string;
  volume: string;
  message: string;
  status: string;
  created_at: string;
  response_notes: string;
}

export default function DevisListPage() {
  const [filter, setFilter] = useState('all');
  const [devis, setDevis] = useState<DevisItem[]>([]);
  const [selected, setSelected] = useState<DevisItem | null>(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevis();
  }, []);

  async function fetchDevis() {
    setLoading(true);
    const { data } = await supabase
      .from('devis_requests')
      .select('*')
      .order('created_at', { ascending: false });
    setDevis((data as DevisItem[]) || []);
    setLoading(false);
  }

  const filtered = filter === 'all' ? devis : devis.filter((d) => d.status === filter);

  const handleStatusChange = async (id: string, status: string) => {
    await supabase.from('devis_requests').update({ status }).eq('id', id);
    setDevis((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cette demande ?')) return;
    await supabase.from('devis_requests').delete().eq('id', id);
    setDevis((prev) => prev.filter((d) => d.id !== id));
  };

  const handleMarkResponded = async (id: string) => {
    await supabase.from('devis_requests').update({ status: 'replied', response_notes: response }).eq('id', id);
    setDevis((prev) => prev.map((d) => d.id === id ? { ...d, status: 'replied', response_notes: response } : d));
    setSelected(null);
    setResponse('');
  };

  const openDetail = (d: DevisItem) => {
    setSelected(d);
    setResponse(d.response_notes || '');
    if (d.status === 'new') {
      handleStatusChange(d.id, 'read');
    }
  };

  return (
    <div className="font-sans">
      <div className="bg-white border-b border-[#E5E3DF] px-4 lg:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <h1 className="font-black uppercase text-[#132073] text-xl">DEMANDES DE DEVIS</h1>
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filter === f.value
                  ? 'bg-[#132073] text-[#F0B800]'
                  : 'bg-white border border-[#E5E3DF] text-[#85868C] hover:border-[#132073]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#132073]" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl mx-4 lg:mx-8 mt-6 mb-8 border border-[#E5E3DF] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F4F2EE] text-left">
                  <th className="px-4 py-3 font-bold text-[#132073]">Nom</th>
                  <th className="px-4 py-3 font-bold text-[#132073]">Service</th>
                  <th className="px-4 py-3 font-bold text-[#132073] hidden lg:table-cell">Trajet</th>
                  <th className="px-4 py-3 font-bold text-[#132073] hidden md:table-cell">Date</th>
                  <th className="px-4 py-3 font-bold text-[#132073] hidden md:table-cell">Volume</th>
                  <th className="px-4 py-3 font-bold text-[#132073]">Statut</th>
                  <th className="px-4 py-3 font-bold text-[#132073]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-t border-[#E5E3DF] hover:bg-[#F4F2EE]/50"
                  >
                    <td className="px-4 py-3 font-bold text-[#132073]">{d.firstname} {d.lastname}</td>
                    <td className="px-4 py-3">
                      <span className={`${SERVICE_CLASSES[d.service_type] || 'bg-gray-100 text-gray-600'} rounded-full px-3 py-1 text-xs font-bold`}>
                        {SERVICE_LABELS[d.service_type] || d.service_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#85868C] hidden lg:table-cell">
                      {d.departure_city} &rarr; {d.arrival_city}
                    </td>
                    <td className="px-4 py-3 text-[#85868C] hidden md:table-cell">
                      {d.created_at ? format(new Date(d.created_at), 'dd/MM/yyyy', { locale: fr }) : '-'}
                    </td>
                    <td className="px-4 py-3 text-[#85868C] hidden md:table-cell">
                      {VOLUME_LABELS[d.volume] || d.volume}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${STATUS_CLASSES[d.status] || STATUS_CLASSES.new} rounded-full px-3 py-1 text-xs font-bold`}>
                        {STATUS_LABELS[d.status] || d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openDetail(d)} className="text-[#132073] hover:text-[#F0B800]">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleStatusChange(d.id, 'archived')} className="text-[#85868C] hover:text-[#132073]">
                          <Archive className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(d.id)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-[#85868C]">
                      Aucune demande trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => { setSelected(null); setResponse(''); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-black uppercase text-[#132073] text-lg">
                  Demande de {selected.firstname} {selected.lastname}
                </h2>
                <button onClick={() => { setSelected(null); setResponse(''); }}>
                  <X className="w-5 h-5 text-[#85868C]" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div><span className="text-[#85868C]">Email</span><p className="font-bold text-[#132073]">{selected.email}</p></div>
                <div><span className="text-[#85868C]">Téléphone</span><p className="font-bold text-[#132073]">{selected.phone}</p></div>
                <div><span className="text-[#85868C]">Service</span><p className="font-bold text-[#132073]">{SERVICE_LABELS[selected.service_type] || selected.service_type}</p></div>
                <div><span className="text-[#85868C]">Volume</span><p className="font-bold text-[#132073]">{VOLUME_LABELS[selected.volume] || selected.volume}</p></div>
                <div><span className="text-[#85868C]">Départ</span><p className="font-bold text-[#132073]">{selected.departure_city}</p></div>
                <div><span className="text-[#85868C]">Arrivée</span><p className="font-bold text-[#132073]">{selected.arrival_city}</p></div>
                <div><span className="text-[#85868C]">Date souhaitée</span><p className="font-bold text-[#132073]">{selected.move_date || '-'}</p></div>
                <div><span className="text-[#85868C]">Reçu le</span><p className="font-bold text-[#132073]">{selected.created_at ? format(new Date(selected.created_at), 'dd/MM/yyyy HH:mm', { locale: fr }) : '-'}</p></div>
              </div>

              <div className="bg-[#F4F2EE] rounded-xl p-4 mb-6">
                <span className="text-[#85868C] text-xs uppercase tracking-widest block mb-2">Message</span>
                <p className="text-[#333333] text-sm">{selected.message || '-'}</p>
              </div>

              <div className="mb-6">
                <label className="block text-[13px] font-bold text-[#132073] mb-1">Réponse interne</label>
                <textarea
                  rows={3}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Ajouter une note..."
                  className="w-full border border-[#E5E3DF] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#132073] resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleMarkResponded(selected.id)}
                  className="bg-[#132073] text-[#F0B800] font-bold uppercase rounded-lg px-6 py-2.5 text-sm hover:bg-[#0D1B5E] transition-colors"
                >
                  Marquer comme répondu
                </button>
                <button
                  onClick={() => { handleStatusChange(selected.id, 'archived'); setSelected(null); }}
                  className="border border-[#E5E3DF] text-[#85868C] font-bold uppercase rounded-lg px-6 py-2.5 text-sm hover:bg-[#F4F2EE] transition-colors"
                >
                  Archiver
                </button>
                <button
                  onClick={() => { setSelected(null); setResponse(''); }}
                  className="text-[#85868C] font-bold uppercase rounded-lg px-6 py-2.5 text-sm hover:text-[#132073] transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
