import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Archive, Trash2, X, AlertTriangle, Loader as Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '../../lib/supabase';
import { computeTotals } from '../../lib/volumeBareme';
import InventaireEditable from '../components/InventaireEditable';
import {
  estContactable,
  estCorrigee,
  estPerimee,
  piecesRetenues,
  urlsPhotosSignees,
  volumeRetenu,
  type LigneEstimation,
  type PieceAnalysee,
} from '../lib/estimations';

// Les quatre valeurs de `estimations_statut_valide`. Toute entrée ajoutée ici
// doit d'abord l'être dans la contrainte, sinon l'update part et la base la
// rejette — c'est le défaut du bouton « Archiver » de DevisListPage.
const STATUS_CLASSES: Record<string, string> = {
  new: 'bg-[#F0B800]/20 text-[#132073]',
  read: 'bg-gray-100 text-gray-600',
  traite: 'bg-green-100 text-green-700',
  archived: 'bg-gray-200 text-gray-400',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'Nouvelle',
  read: 'Lue',
  traite: 'Traitée',
  archived: 'Archivée',
};

const FILTERS = [
  { value: 'all', label: 'Toutes' },
  { value: 'new', label: 'Nouvelle' },
  { value: 'read', label: 'Lue' },
  { value: 'traite', label: 'Traitée' },
  { value: 'archived', label: 'Archivée' },
];

const CONFIANCE_CLASSES: Record<string, string> = {
  high: 'bg-green-100 text-green-700',
  medium: 'bg-[#F0B800]/20 text-[#132073]',
  low: 'bg-red-100 text-red-700',
};

const CONFIANCE_LABELS: Record<string, string> = {
  high: 'Élevée',
  medium: 'Moyenne',
  low: 'Faible',
};

const LOGEMENT_LABELS: Record<string, string> = {
  appartement: 'Appartement',
  maison: 'Maison',
  studio: 'Studio',
  bureau: 'Bureau',
};

function m3(v: number | null | undefined) {
  return v === null || v === undefined ? '-' : `${Number(v).toFixed(1)} m³`;
}

export default function EstimationsListPage() {
  const [estimations, setEstimations] = useState<LigneEstimation[]>([]);
  const [filter, setFilter] = useState('all');
  const [contactablesSeules, setContactablesSeules] = useState(false);
  const [selected, setSelected] = useState<LigneEstimation | null>(null);
  const [notes, setNotes] = useState('');
  const [inventaire, setInventaire] = useState<PieceAnalysee[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [photosEtat, setPhotosEtat] = useState<'vide' | 'chargement' | 'ok' | 'erreur'>('vide');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEstimations();
  }, []);

  async function fetchEstimations() {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('volume_estimations')
      .select('*')
      .order('created_at', { ascending: false });
    if (fetchError) {
      setError(`Impossible de charger les estimations : ${fetchError.message}`);
      setEstimations([]);
    } else {
      setEstimations((data as LigneEstimation[]) || []);
    }
    setLoading(false);
  }

  const filtered = estimations
    .filter((e) => filter === 'all' || e.status === filter)
    .filter((e) => !contactablesSeules || estContactable(e));

  const anonymes = estimations.filter((e) => !estContactable(e)).length;

  // Recalcul du barème à chaque frappe : c'est tout l'intérêt d'éditer
  // l'inventaire plutôt que de saisir un nombre. La confiance ne sert qu'à la
  // fourchette, le volume central n'en dépend pas.
  const totalRecalcule = selected
    ? computeTotals(inventaire, selected.confidence || 'low').volumeFinal
    : 0;

  async function majStatut(id: string, status: string) {
    const { error: majError } = await supabase
      .from('volume_estimations')
      .update({ status })
      .eq('id', id);
    if (majError) {
      setError(`Changement de statut refusé : ${majError.message}`);
      return;
    }
    setEstimations((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
  }

  async function enregistrerFiche(e: LigneEstimation) {
    // Le volume enregistré est recalculé par le barème à partir de l'inventaire
    // corrigé — jamais saisi. Tant que l'opérateur n'a rien touché, on ne pose
    // ni correction ni volume ajusté : la valeur du modèle continue de faire foi.
    const modifie = JSON.stringify(inventaire) !== JSON.stringify(piecesRetenues(e));
    const corrige = modifie || estCorrigee(e);

    const patch = {
      notes: notes.trim() || null,
      corrected_items: corrige ? { rooms: inventaire } : null,
      volume_ajuste: corrige ? Number(totalRecalcule.toFixed(1)) : null,
      manually_adjusted: corrige,
      status: 'traite',
    };
    const { error: majError } = await supabase
      .from('volume_estimations')
      .update(patch)
      .eq('id', e.id);
    if (majError) {
      setError(`Enregistrement refusé : ${majError.message}`);
      return;
    }
    setEstimations((prev) => prev.map((x) => (x.id === e.id ? { ...x, ...patch } : x)));
    fermer();
  }

  async function supprimer(id: string) {
    if (!window.confirm('Supprimer cette estimation ? Les photos resteront dans le Storage.')) return;
    const { error: supprError } = await supabase.from('volume_estimations').delete().eq('id', id);
    if (supprError) {
      setError(`Suppression refusée : ${supprError.message}`);
      return;
    }
    setEstimations((prev) => prev.filter((e) => e.id !== id));
  }

  async function ouvrirFiche(e: LigneEstimation) {
    setSelected(e);
    setNotes(e.notes || '');
    // Copie profonde : l'édition ne doit pas modifier la ligne du tableau tant
    // que rien n'est enregistré.
    setInventaire(JSON.parse(JSON.stringify(piecesRetenues(e))));
    setPhotos([]);

    if (e.status === 'new') majStatut(e.id, 'read');

    const paths = e.photos_paths ?? [];
    if (!paths.length) {
      setPhotosEtat('vide');
      return;
    }
    setPhotosEtat('chargement');
    try {
      setPhotos(await urlsPhotosSignees(paths));
      setPhotosEtat('ok');
    } catch (err) {
      setPhotosEtat('erreur');
      setError(`Photos illisibles : ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  function fermer() {
    setSelected(null);
    setNotes('');
    setInventaire([]);
    setPhotos([]);
    setPhotosEtat('vide');
  }

  return (
    <div className="font-sans">
      <div className="bg-white border-b border-[#E5E3DF] px-4 lg:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <h1 className="font-black uppercase text-[#132073] text-xl">ESTIMATIONS DE VOLUME</h1>
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

      <div className="bg-white border-b border-[#E5E3DF] px-4 lg:px-8 py-3 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-[#333333] cursor-pointer">
          <input
            type="checkbox"
            checked={contactablesSeules}
            onChange={(e) => setContactablesSeules(e.target.checked)}
          />
          Avec coordonnées seulement
        </label>
        {/* Le nombre d'anonymes n'est pas du bruit : c'est la mesure de
            l'abandon de l'estimateur, visiteurs partis sans laisser de contact. */}
        <span className="text-[#85868C] text-[13px]">
          {anonymes} estimation(s) sans coordonnées — non traitables
        </span>
      </div>

      {error && (
        <div className="mx-4 lg:mx-8 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-red-700 text-sm font-bold">Erreur</p>
          <p className="text-red-600 text-xs mt-1 break-words">{error}</p>
        </div>
      )}

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
                  <th className="px-4 py-3 font-bold text-[#132073]">Reçue le</th>
                  <th className="px-4 py-3 font-bold text-[#132073] hidden md:table-cell">Logement</th>
                  <th className="px-4 py-3 font-bold text-[#132073]">Volume</th>
                  <th className="px-4 py-3 font-bold text-[#132073] hidden lg:table-cell">Confiance</th>
                  <th className="px-4 py-3 font-bold text-[#132073]">Contact</th>
                  <th className="px-4 py-3 font-bold text-[#132073]">Statut</th>
                  <th className="px-4 py-3 font-bold text-[#132073]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => (
                  <motion.tr
                    key={e.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i, 10) * 0.05 }}
                    className="border-t border-[#E5E3DF] hover:bg-[#F4F2EE]/50"
                  >
                    <td className="px-4 py-3 text-[#85868C]">
                      {e.created_at ? format(new Date(e.created_at), 'dd/MM/yyyy HH:mm', { locale: fr }) : '-'}
                      {estPerimee(e) && (
                        <span
                          className="ml-2 inline-flex items-center gap-1 text-red-600 text-[11px] font-bold"
                          title="Date de purge dépassée — cette ligne aurait dû être supprimée"
                        >
                          <AlertTriangle className="w-3 h-3" /> périmée
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#85868C] hidden md:table-cell">
                      {LOGEMENT_LABELS[e.housing_type || ''] || e.housing_type || '-'}
                      {e.rooms_count ? ` · ${e.rooms_count} pièce(s)` : ''}
                    </td>
                    <td className="px-4 py-3 font-bold text-[#132073]">
                      {m3(volumeRetenu(e))}
                      {e.volume_ajuste !== null && e.volume_ajuste !== undefined && (
                        <span className="ml-2 text-[11px] font-bold text-[#85868C]">ajusté</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`${CONFIANCE_CLASSES[e.confidence || ''] || 'bg-gray-100 text-gray-600'} rounded-full px-3 py-1 text-xs font-bold`}>
                        {CONFIANCE_LABELS[e.confidence || ''] || e.confidence || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#85868C]">
                      {estContactable(e) ? (e.lead_email || e.lead_phone) : <span className="italic">anonyme</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${STATUS_CLASSES[e.status] || STATUS_CLASSES.new} rounded-full px-3 py-1 text-xs font-bold`}>
                        {STATUS_LABELS[e.status] || e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => ouvrirFiche(e)} className="text-[#132073] hover:text-[#F0B800]" title="Ouvrir">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => majStatut(e.id, 'archived')} className="text-[#85868C] hover:text-[#132073]" title="Archiver">
                          <Archive className="w-4 h-4" />
                        </button>
                        <button onClick={() => supprimer(e.id)} className="text-red-400 hover:text-red-600" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-[#85868C]">
                      Aucune estimation trouvée
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
            onClick={fermer}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(ev) => ev.stopPropagation()}
              className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-black uppercase text-[#132073] text-lg">
                  Estimation du {selected.created_at ? format(new Date(selected.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr }) : '-'}
                </h2>
                <button onClick={fermer}><X className="w-5 h-5 text-[#85868C]" /></button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-6">
                <div><span className="text-[#85868C]">Logement</span><p className="font-bold text-[#132073]">{LOGEMENT_LABELS[selected.housing_type || ''] || selected.housing_type || '-'}</p></div>
                <div><span className="text-[#85868C]">Pièces</span><p className="font-bold text-[#132073]">{selected.rooms_count ?? '-'}</p></div>
                <div><span className="text-[#85868C]">Surface</span><p className="font-bold text-[#132073]">{selected.surface_m2 ? `${selected.surface_m2} m²` : '-'}</p></div>
                <div><span className="text-[#85868C]">Étage</span><p className="font-bold text-[#132073]">{selected.floor ?? '-'}{selected.has_elevator ? ' (ascenseur)' : ''}</p></div>
                <div><span className="text-[#85868C]">Email</span><p className="font-bold text-[#132073] break-words">{selected.lead_email || <span className="italic font-normal text-[#85868C]">non laissé</span>}</p></div>
                <div><span className="text-[#85868C]">Téléphone</span><p className="font-bold text-[#132073]">{selected.lead_phone || <span className="italic font-normal text-[#85868C]">non laissé</span>}</p></div>
                <div><span className="text-[#85868C]">Confiance</span><p className="font-bold text-[#132073]">{CONFIANCE_LABELS[selected.confidence || ''] || selected.confidence || '-'}</p></div>
                <div><span className="text-[#85868C]">Purge prévue</span><p className={`font-bold ${estPerimee(selected) ? 'text-red-600' : 'text-[#132073]'}`}>{selected.expires_at ? format(new Date(selected.expires_at), 'dd/MM/yyyy', { locale: fr }) : '-'}</p></div>
              </div>

              <div className="bg-[#F4F2EE] rounded-xl p-4 mb-6 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-[#85868C] text-xs uppercase tracking-widest block">Modèle</span>
                  <p className="font-black text-[#132073] text-lg">{m3(selected.volume_m3)}</p>
                </div>
                <div>
                  <span className="text-[#85868C] text-xs uppercase tracking-widest block">Fourchette</span>
                  <p className="font-bold text-[#333333]">{m3(selected.volume_min)} – {m3(selected.volume_max)}</p>
                </div>
                <div>
                  <span className="text-[#85868C] text-xs uppercase tracking-widest block">Retenu</span>
                  <p className="font-black text-[#132073] text-lg">{m3(totalRecalcule)}</p>
                  {/* L'écart n'est lisible que si les deux nombres sont côte à
                      côte : c'est lui, et pas le total, qui dit si le modèle
                      s'est trompé. */}
                  {selected.volume_m3 !== null && Math.abs(totalRecalcule - selected.volume_m3) >= 0.1 && (
                    <span className="text-[11px] font-bold text-[#85868C]">
                      {totalRecalcule > selected.volume_m3 ? '+' : '−'}
                      {Math.abs(totalRecalcule - selected.volume_m3).toFixed(1)} m³ vs modèle
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[#85868C] text-xs uppercase tracking-widest">
                    Inventaire {estCorrigee(selected) && '— corrigé'}
                  </span>
                  <span className="text-[#85868C] text-[11px]">
                    Quantités et remplissage éditables — le volume se recalcule
                  </span>
                </div>
                <InventaireEditable pieces={inventaire} onChange={setInventaire} />
              </div>

              <div className="mb-6">
                <span className="text-[#85868C] text-xs uppercase tracking-widest block mb-2">
                  Photos ({selected.photos_paths?.length ?? 0})
                </span>
                {photosEtat === 'chargement' && <Loader2 className="w-5 h-5 animate-spin text-[#132073]" />}
                {photosEtat === 'vide' && <p className="text-[#85868C] text-sm">Aucune photo conservée.</p>}
                {photosEtat === 'erreur' && <p className="text-red-600 text-sm">Photos illisibles — voir l'erreur en haut de page.</p>}
                {photosEtat === 'ok' && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {photos.map((url, k) => (
                      <a key={k} href={url} target="_blank" rel="noreferrer" className="block rounded-lg overflow-hidden border border-[#E5E3DF] aspect-square">
                        <img src={url} alt={`Photo ${k + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div>
                  <label className="block text-[13px] font-bold text-[#132073] mb-1">Note interne</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(ev) => setNotes(ev.target.value)}
                    placeholder="Ajouter une note..."
                    className="w-full border border-[#E5E3DF] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#132073] resize-none"
                  />
                </div>
              </div>

              {/* Log brut du modèle : conservé « pour calibration », pas destiné à
                  la lecture courante. Replié pour rester accessible sans encombrer. */}
              {selected.detected_items?.raw_model_output != null && (
                <details className="mb-6">
                  <summary className="cursor-pointer text-[#85868C] text-xs uppercase tracking-widest">
                    Log brut du modèle
                  </summary>
                  <pre className="mt-2 bg-[#F4F2EE] rounded-lg p-3 text-[11px] overflow-x-auto max-h-64">
                    {JSON.stringify(selected.detected_items.raw_model_output, null, 2)}
                  </pre>
                </details>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => enregistrerFiche(selected)}
                  className="bg-[#132073] text-[#F0B800] font-bold uppercase rounded-lg px-6 py-2.5 text-sm hover:bg-[#0D1B5E] transition-colors"
                >
                  Enregistrer et marquer traitée
                </button>
                <button
                  onClick={() => { majStatut(selected.id, 'archived'); fermer(); }}
                  className="border border-[#E5E3DF] text-[#85868C] font-bold uppercase rounded-lg px-6 py-2.5 text-sm hover:bg-[#F4F2EE] transition-colors"
                >
                  Archiver
                </button>
                <button
                  onClick={fermer}
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
