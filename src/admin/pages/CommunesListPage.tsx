import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Pencil, Loader as Loader2, Search, TriangleAlert, CircleCheck, Rocket,
} from 'lucide-react';
import { listerCommunes, publier, type LigneCommune } from '../lib/communes';

const NAVY = '#132073';

/** Ce qui empêche encore une commune d'être publiée, exprimé pour un humain. */
function manques(c: LigneCommune): string[] {
  const m: string[] = [];
  if (c.distance_depot_km === null || c.temps_trajet_estime_min === null) m.push('distance non mesurée');
  const v = c.communes_voisines?.length ?? 0;
  if (v < 3 || v > 5) m.push(`${v} limitrophe${v === 1 ? '' : 's'} sur 3 à 5`);
  if (!c.introduction_locale?.trim() && !c.informations_locales?.length && !c.villages?.length) {
    m.push('aucun contenu local');
  }
  return m;
}

export default function CommunesListPage() {
  const navigate = useNavigate();
  const [communes, setCommunes] = useState<LigneCommune[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [recherche, setRecherche] = useState('');
  const [filtre, setFiltre] = useState<'tous' | 'published' | 'draft' | 'publiables'>('tous');
  const [publication, setPublication] = useState<{ etat: 'idle' | 'en-cours' | 'ok' | 'erreur'; message?: string }>({ etat: 'idle' });

  useEffect(() => {
    listerCommunes()
      .then(setCommunes)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false));
  }, []);

  const filtrees = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return communes.filter((c) => {
      if (q && !c.nom.toLowerCase().includes(q) && !c.id.includes(q)) return false;
      if (filtre === 'published') return c.statut === 'published';
      if (filtre === 'draft') return c.statut !== 'published';
      // « Prêtes à publier » : le tri le plus utile au quotidien, il désigne
      // exactement les communes sur lesquelles il reste un clic à faire.
      if (filtre === 'publiables') return c.statut !== 'published' && manques(c).length === 0;
      return true;
    });
  }, [communes, recherche, filtre]);

  const publiees = communes.filter((c) => c.statut === 'published').length;
  const pretes = communes.filter((c) => c.statut !== 'published' && manques(c).length === 0).length;

  async function lancerPublication() {
    setPublication({ etat: 'en-cours' });
    try {
      const message = await publier();
      setPublication({ etat: 'ok', message });
    } catch (e) {
      setPublication({ etat: 'erreur', message: (e as Error).message });
    }
  }

  return (
    <div className="pb-12">
      <div className="bg-white border-b border-[#E5E3DF] px-4 lg:px-8 py-5 flex flex-wrap items-center gap-4">
        <h1 className="font-bold text-[#132073] text-lg uppercase tracking-wide">Communes</h1>
        <span className="bg-[#132073] text-[#F0B800] rounded-full px-2.5 py-0.5 text-[11px] font-bold">
          {publiees} publiée{publiees === 1 ? '' : 's'} sur {communes.length}
        </span>
        {pretes > 0 && (
          <button
            onClick={() => setFiltre('publiables')}
            className="bg-[#E8F5E9] text-[#1B5E20] rounded-full px-3 py-0.5 text-[11px] font-bold hover:bg-[#D4EDD6] transition-colors"
          >
            {pretes} prête{pretes === 1 ? '' : 's'} à publier
          </button>
        )}

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={lancerPublication}
            disabled={publication.etat === 'en-cours'}
            className="bg-[#F0B800] text-[#132073] font-bold uppercase rounded-md px-5 py-2 text-sm hover:bg-[#EAB000] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {publication.etat === 'en-cours'
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Rocket className="w-4 h-4" />}
            Publier les modifications
          </button>
        </div>
      </div>

      {/* Le retour de publication est volontairement explicite sur le délai :
          un message « publié » alors que le build démarre à peine ferait croire
          que les modifications sont en ligne, et la première vérification sur
          le site donnerait tort à l'outil. */}
      {publication.etat === 'ok' && (
        <div className="mx-4 lg:mx-8 mt-4 bg-[#E8F5E9] border border-[#A5D6A7] text-[#1B5E20] rounded-xl px-4 py-3 text-sm flex items-start gap-2">
          <CircleCheck className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{publication.message}</span>
        </div>
      )}
      {publication.etat === 'erreur' && (
        <div className="mx-4 lg:mx-8 mt-4 bg-[#FDECEA] border border-[#F5C6C2] text-[#8B1A10] rounded-xl px-4 py-3 text-sm flex items-start gap-2">
          <TriangleAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{publication.message}</span>
        </div>
      )}

      <div className="mx-4 lg:mx-8 mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#85868C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher une commune…"
            aria-label="Rechercher une commune"
            className="w-full border border-[#E5E3DF] rounded-lg py-2 pl-9 pr-4 text-sm text-[#132073] focus:border-[#132073] outline-none"
          />
        </div>
        {([
          ['tous', 'Toutes'],
          ['published', 'Publiées'],
          ['publiables', 'Prêtes à publier'],
          ['draft', 'Brouillons'],
        ] as const).map(([valeur, libelle]) => (
          <button
            key={valeur}
            onClick={() => setFiltre(valeur)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filtre === valeur
                ? 'bg-[#132073] text-white'
                : 'bg-white border border-[#E5E3DF] text-[#132073] hover:border-[#132073]'
            }`}
          >
            {libelle}
          </button>
        ))}
      </div>

      {chargement ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: NAVY }} />
        </div>
      ) : erreur ? (
        <div className="mx-4 lg:mx-8 mt-6 bg-[#FDECEA] border border-[#F5C6C2] text-[#8B1A10] rounded-xl px-4 py-3 text-sm">
          {erreur}
        </div>
      ) : (
        <div className="mx-4 lg:mx-8 mt-5 bg-white rounded-xl border border-[#E5E3DF] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E5E3DF] bg-[#FAFAF8]">
                {['Commune', 'Arrondissement', 'Dépôt', 'Limitrophes', 'Statut', ''].map((h) => (
                  <th key={h} className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-[#85868C]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrees.map((c, i) => {
                const bloquants = manques(c);
                return (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.01, 0.3) }}
                    className="border-b border-[#F0EFEC] last:border-0 hover:bg-[#FAFAF8]"
                  >
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#132073] text-sm">{c.nom}</span>
                      {c.page_existante && (
                        <span
                          className="ml-2 text-[10px] uppercase font-bold text-[#85868C] border border-[#E5E3DF] rounded px-1.5 py-0.5"
                          title={`Cette commune est portée par une page existante : ${c.page_existante}. Aucune page n'est générée pour elle.`}
                        >
                          page dédiée
                        </span>
                      )}
                      <code className="block font-mono text-[11px] text-[#85868C] mt-0.5">
                        /demenagement/demenagement-{c.id}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#67686E]">{c.arrondissement ?? '—'}</td>
                    <td className="py-3 px-4 text-sm text-[#67686E] whitespace-nowrap">
                      {c.distance_depot_km === null
                        ? <span className="text-[#B45309]">non mesuré</span>
                        : `${c.distance_depot_km} km · ${c.temps_trajet_estime_min} min`}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#67686E]">{c.communes_voisines?.length ?? 0}</td>
                    <td className="py-3 px-4">
                      {c.statut === 'published' ? (
                        <span className="bg-[#E8F5E9] text-[#1B5E20] rounded-full px-2.5 py-1 text-[11px] font-bold">
                          Publiée
                        </span>
                      ) : bloquants.length === 0 ? (
                        <span className="bg-[#FFF8E1] text-[#8D6E00] rounded-full px-2.5 py-1 text-[11px] font-bold">
                          Prête
                        </span>
                      ) : (
                        <span
                          className="bg-gray-100 text-[#67686E] rounded-full px-2.5 py-1 text-[11px] font-bold"
                          title={bloquants.join(' · ')}
                        >
                          Brouillon
                        </span>
                      )}
                      {bloquants.length > 0 && (
                        <span className="block text-[11px] text-[#85868C] mt-1">{bloquants.join(' · ')}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/communes/${c.id}/edit`)}
                        aria-label={`Modifier ${c.nom}`}
                        className="text-[#85868C] hover:text-[#132073] transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
              {filtrees.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-[#85868C]">
                    <MapPin className="w-6 h-6 mx-auto mb-2 opacity-40" />
                    Aucune commune ne correspond.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
