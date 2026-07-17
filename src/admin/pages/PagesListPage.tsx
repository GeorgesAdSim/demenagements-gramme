import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Search, Loader as Loader2, Globe, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const COCON_COLORS: Record<string, string> = {
  demenagement: 'bg-blue-100 text-blue-700',
  transport: 'bg-orange-100 text-orange-700',
  'garde-meuble': 'bg-green-100 text-green-700',
  general: 'bg-gray-100 text-gray-600',
};

const COCON_LABELS: Record<string, string> = {
  demenagement: 'Déménagement',
  transport: 'Transport',
  'garde-meuble': 'Garde-meuble',
  general: 'Général',
};

const SITE_PAGE_LABELS: Record<string, string> = {
  accueil: 'Page d\'accueil',
  demenagements: 'Déménagements',
  'garde-meubles': 'Garde-Meubles',
  transports: 'Transports',
  contact: 'Contact',
  'mentions-legales': 'Mentions Légales',
  confidentialite: 'Confidentialité',
  cgv: 'CGV',
};

interface Page {
  id: string;
  title: string;
  slug: string;
  cocon: string;
  status: string;
  updated_at: string;
  page_type: string;
  is_deletable: boolean;
}

export default function PagesListPage() {
  const navigate = useNavigate();
  const [filterCocon, setFilterCocon] = useState('Tous');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const perPage = 8;

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    setLoading(true);
    const { data } = await supabase
      .from('pages')
      .select('id, title, slug, cocon, status, updated_at, page_type, is_deletable')
      .order('updated_at', { ascending: false });
    setPages(data || []);
    setLoading(false);
  }

  const sitePages = pages.filter((p) => p.page_type === 'site');
  const customPages = pages.filter((p) => p.page_type !== 'site');

  const filtered = customPages.filter((p) => {
    if (filterCocon !== 'Tous' && p.cocon !== filterCocon) return false;
    if (filterStatus === 'published' && p.status !== 'published') return false;
    if (filterStatus === 'draft' && p.status !== 'draft') return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cette page ?')) return;
    await supabase.from('pages').delete().eq('id', id);
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="font-sans">
      <div className="bg-white border-b border-[#E5E3DF] px-8 py-5 flex items-center justify-between">
        <h1 className="font-black uppercase text-[#132073] text-xl">GESTION DES PAGES</h1>
        <button
          onClick={() => navigate('/admin/pages/new/edit')}
          className="bg-[#F0B800] text-[#132073] font-bold uppercase rounded-md px-5 py-2 text-sm hover:bg-[#EAB000] transition-colors"
        >
          + NOUVELLE PAGE
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#132073]" />
        </div>
      ) : (
        <>
          <div className="mx-4 lg:mx-8 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-[#132073]" />
              <h2 className="font-bold text-[#132073] text-lg uppercase">Pages du site</h2>
              <span className="bg-[#132073] text-[#F0B800] rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                {sitePages.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {sitePages.map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => navigate(`/admin/site-pages/${p.id}/edit`)}
                  className="bg-white rounded-xl border border-[#E5E3DF] p-4 text-left hover:border-[#132073] hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#132073] text-sm group-hover:text-[#F0B800] transition-colors">
                      {SITE_PAGE_LABELS[p.slug] || p.title}
                    </span>
                    <Pencil className="w-3.5 h-3.5 text-[#85868C] group-hover:text-[#132073] transition-colors" />
                  </div>
                  <code className="font-mono text-[11px] text-[#85868C]">/{p.slug === 'accueil' ? '' : p.slug}</code>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mx-4 lg:mx-8 mt-10 mb-2">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#132073]" />
              <h2 className="font-bold text-[#132073] text-lg uppercase">Pages personnalisées</h2>
              <span className="bg-gray-100 text-[#85868C] rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                {customPages.length}
              </span>
            </div>
          </div>

          <div className="bg-white border-y border-[#E5E3DF] px-8 py-3 flex flex-wrap gap-4 items-center">
            <select
              value={filterCocon}
              onChange={(e) => { setFilterCocon(e.target.value); setPage(1); }}
              className="border border-[#E5E3DF] rounded-lg px-3 py-2 text-sm outline-none"
            >
              <option value="Tous">Tous les cocons</option>
              <option value="demenagement">Déménagement</option>
              <option value="transport">Transport</option>
              <option value="garde-meuble">Garde-meuble</option>
              <option value="general">Général</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              className="border border-[#E5E3DF] rounded-lg px-3 py-2 text-sm outline-none"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
            </select>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#85868C]" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Rechercher une page..."
                className="w-full border border-[#E5E3DF] rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-[#132073]"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl mx-4 lg:mx-8 mt-4 border border-[#E5E3DF] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F4F2EE] text-left">
                    <th className="px-4 py-3 font-bold text-[#132073]">Titre</th>
                    <th className="px-4 py-3 font-bold text-[#132073] hidden lg:table-cell">Slug</th>
                    <th className="px-4 py-3 font-bold text-[#132073] hidden md:table-cell">Cocon</th>
                    <th className="px-4 py-3 font-bold text-[#132073]">Statut</th>
                    <th className="px-4 py-3 font-bold text-[#132073] hidden md:table-cell">Modifié</th>
                    <th className="px-4 py-3 font-bold text-[#132073]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p, i) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-t border-[#E5E3DF] hover:bg-[#F4F2EE]/50"
                    >
                      <td className="px-4 py-3 font-bold text-[#132073]">{p.title}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <code className="font-mono text-[13px] text-[#85868C]">{p.slug}</code>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`${COCON_COLORS[p.cocon] || 'bg-gray-100 text-gray-600'} rounded-full px-3 py-1 text-xs font-bold`}>
                          {COCON_LABELS[p.cocon] || p.cocon}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                          p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {p.status === 'published' ? 'Publié' : 'Brouillon'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#85868C] hidden md:table-cell">
                        {p.updated_at ? format(new Date(p.updated_at), 'dd MMM yyyy', { locale: fr }) : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/admin/pages/${p.id}/edit`)}
                            className="text-[#132073] hover:text-[#F0B800] transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {p.is_deletable !== false && (
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {visible.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-[#85868C]">
                        Aucune page trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mx-8 mt-6 mb-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-[#E5E3DF] text-sm font-bold text-[#132073] disabled:opacity-40 hover:bg-white transition-colors"
              >
                Précédent
              </button>
              <span className="text-sm text-[#85868C]">Page {page} sur {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-[#E5E3DF] text-sm font-bold text-[#132073] disabled:opacity-40 hover:bg-white transition-colors"
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
