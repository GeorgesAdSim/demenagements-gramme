import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Loader as Loader2, Plus, Trash2, TriangleAlert, CircleCheck, Lock, ExternalLink,
} from 'lucide-react';
import {
  lireCommune, enregistrerCommune, type LigneCommune, type ModifCommune,
} from '../lib/communes';

const NAVY = '#132073';

/** Champ en lecture seule, avec la raison affichée plutôt que laissée à deviner. */
function ChampVerrouille({ libelle, valeur, raison }: { libelle: string; valeur: string; raison: string }) {
  return (
    <div>
      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#85868C] mb-1.5">
        <Lock className="w-3 h-3" />
        {libelle}
      </span>
      <p className="text-[#132073] text-sm bg-[#FAFAF8] border border-[#E5E3DF] rounded-lg px-3 py-2.5">
        {valeur || '—'}
      </p>
      <p className="text-[11px] text-[#85868C] mt-1">{raison}</p>
    </div>
  );
}

/** Liste de textes éditable — utilisée pour les particularités et les villages. */
function ListeEditable({
  libelle, aide, valeurs, onChange, placeholder, multiligne,
}: {
  libelle: string;
  aide: string;
  valeurs: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  multiligne?: boolean;
}) {
  const id = libelle.toLowerCase().replace(/[^a-z]+/g, '-');
  return (
    <div>
      <label htmlFor={`${id}-0`} className="block text-[11px] font-bold uppercase tracking-wider text-[#132073] mb-1.5">
        {libelle}
      </label>
      <p className="text-[12px] text-[#85868C] mb-2">{aide}</p>
      <div className="space-y-2">
        {valeurs.map((v, i) => (
          <div key={i} className="flex gap-2">
            {multiligne ? (
              <textarea
                id={`${id}-${i}`}
                value={v}
                rows={2}
                onChange={(e) => onChange(valeurs.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder={placeholder}
                className="flex-1 border border-[#E5E3DF] rounded-lg px-3 py-2 text-sm text-[#132073] focus:border-[#132073] outline-none resize-y"
              />
            ) : (
              <input
                id={`${id}-${i}`}
                type="text"
                value={v}
                onChange={(e) => onChange(valeurs.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder={placeholder}
                className="flex-1 border border-[#E5E3DF] rounded-lg px-3 py-2 text-sm text-[#132073] focus:border-[#132073] outline-none"
              />
            )}
            <button
              type="button"
              onClick={() => onChange(valeurs.filter((_, j) => j !== i))}
              aria-label={`Supprimer l'entrée ${i + 1}`}
              className="text-[#85868C] hover:text-[#8B1A10] transition-colors px-2 self-start pt-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...valeurs, ''])}
        className="mt-2 inline-flex items-center gap-1.5 text-[#132073] text-sm font-bold hover:underline"
      >
        <Plus className="w-4 h-4" />
        Ajouter
      </button>
    </div>
  );
}

export default function CommuneEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [commune, setCommune] = useState<LigneCommune | null>(null);
  const [modif, setModif] = useState<ModifCommune | null>(null);
  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'erreur'; texte: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    lireCommune(id)
      .then((c) => {
        setCommune(c);
        if (c) {
          setModif({
            introduction_locale: c.introduction_locale,
            informations_locales: c.informations_locales ?? [],
            villages: c.villages ?? [],
            statut: c.statut,
          });
        }
      })
      .catch((e) => setMessage({ type: 'erreur', texte: e.message }))
      .finally(() => setChargement(false));
  }, [id]);

  async function enregistrer() {
    if (!id || !modif) return;
    setEnregistrement(true);
    setMessage(null);
    // Les entrées vides sont retirées avant envoi : une puce vide sur la page
    // publique est un défaut visible, et la contrainte de contenu de la base
    // compterait un tableau de chaînes vides comme du contenu.
    const propre: ModifCommune = {
      ...modif,
      introduction_locale: modif.introduction_locale?.trim() || null,
      informations_locales: modif.informations_locales.map((s) => s.trim()).filter(Boolean),
      villages: modif.villages.map((s) => s.trim()).filter(Boolean),
    };
    try {
      await enregistrerCommune(id, propre);
      setModif(propre);
      setMessage({
        type: 'ok',
        texte: 'Enregistré. Les modifications ne seront en ligne qu\'après un clic sur « Publier les modifications ».',
      });
    } catch (e) {
      setMessage({ type: 'erreur', texte: (e as Error).message });
    } finally {
      setEnregistrement(false);
    }
  }

  if (chargement) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: NAVY }} />
      </div>
    );
  }

  if (!commune || !modif) {
    return (
      <div className="mx-4 lg:mx-8 mt-8">
        <p className="text-[#8B1A10] text-sm mb-4">Commune introuvable.</p>
        <button onClick={() => navigate('/admin/communes')} className="text-[#132073] font-bold text-sm hover:underline">
          Retour à la liste
        </button>
      </div>
    );
  }

  const url = commune.page_existante ?? `/demenagement/demenagement-${commune.id}`;

  return (
    <div className="pb-16">
      <div className="bg-white border-b border-[#E5E3DF] px-4 lg:px-8 py-5 flex flex-wrap items-center gap-4">
        <button
          onClick={() => navigate('/admin/communes')}
          className="inline-flex items-center gap-2 text-[#85868C] hover:text-[#132073] text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Communes
        </button>
        <h1 className="font-bold text-[#132073] text-lg uppercase tracking-wide">{commune.nom}</h1>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[#85868C] hover:text-[#132073] text-[13px] transition-colors"
        >
          <code className="font-mono">{url}</code>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={enregistrer}
          disabled={enregistrement}
          className="ml-auto bg-[#F0B800] text-[#132073] font-bold uppercase rounded-md px-5 py-2 text-sm hover:bg-[#EAB000] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {enregistrement && <Loader2 className="w-4 h-4 animate-spin" />}
          Enregistrer
        </button>
      </div>

      {message && (
        <div
          className={`mx-4 lg:mx-8 mt-4 rounded-xl px-4 py-3 text-sm flex items-start gap-2 ${
            message.type === 'ok'
              ? 'bg-[#E8F5E9] border border-[#A5D6A7] text-[#1B5E20]'
              : 'bg-[#FDECEA] border border-[#F5C6C2] text-[#8B1A10]'
          }`}
        >
          {message.type === 'ok'
            ? <CircleCheck className="w-5 h-5 shrink-0 mt-0.5" />
            : <TriangleAlert className="w-5 h-5 shrink-0 mt-0.5" />}
          <span>{message.texte}</span>
        </div>
      )}

      <div className="mx-4 lg:mx-8 mt-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

        <div className="bg-white rounded-xl border border-[#E5E3DF] p-6 space-y-7">
          <div>
            <label htmlFor="intro" className="block text-[11px] font-bold uppercase tracking-wider text-[#132073] mb-1.5">
              Introduction locale
            </label>
            <p className="text-[12px] text-[#85868C] mb-2">
              Deux à trois phrases, affichées en tête de page. C'est le passage que les moteurs de
              réponse citent le plus volontiers : mieux vaut y mettre un fait concret sur la commune
              qu'une formule commerciale.
            </p>
            <textarea
              id="intro"
              rows={4}
              value={modif.introduction_locale ?? ''}
              onChange={(e) => setModif({ ...modif, introduction_locale: e.target.value })}
              placeholder={`Nos déménageurs interviennent quotidiennement à ${commune.nom}…`}
              className="w-full border border-[#E5E3DF] rounded-lg px-3 py-2.5 text-sm text-[#132073] focus:border-[#132073] outline-none resize-y"
            />
          </div>

          <ListeEditable
            libelle={`Ce qui change à ${commune.nom}`}
            aide="Les particularités concrètes du terrain : accès, type de bâti, stationnement, dénivelé. C'est ce bloc qui distingue vraiment la page de celle d'un concurrent — n'y mets que ce que tes équipes constatent réellement."
            valeurs={modif.informations_locales}
            onChange={(v) => setModif({ ...modif, informations_locales: v })}
            placeholder="Rues étroites du centre imposant un véhicule de faible gabarit."
            multiligne
          />

          <ListeEditable
            libelle="Villages et sections desservis"
            aide="Les anciennes communes fusionnées. Aucun concurrent ne descend à ce niveau de détail, c'est un avantage réel — mais un village inventé se remarque immédiatement chez un lecteur local."
            valeurs={modif.villages}
            onChange={(v) => setModif({ ...modif, villages: v })}
            placeholder="Nom du village"
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E5E3DF] p-5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#132073] mb-3">Publication</h2>
            <label htmlFor="statut" className="block text-[12px] text-[#85868C] mb-2">
              Une commune en brouillon n'est pas déployée du tout : son URL renvoie une page 404
              tant qu'elle n'est pas publiée.
            </label>
            <select
              id="statut"
              value={modif.statut}
              onChange={(e) => setModif({ ...modif, statut: e.target.value as 'draft' | 'published' })}
              className="w-full border border-[#E5E3DF] rounded-lg px-3 py-2.5 text-sm text-[#132073] focus:border-[#132073] outline-none"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publiée</option>
            </select>
            <p className="text-[11px] text-[#85868C] mt-2">
              Enregistrer ne met rien en ligne. Il faut ensuite cliquer sur « Publier les
              modifications » depuis la liste des communes.
            </p>
          </div>

          {/* Champs verrouillés. Le verrou n'est pas une limitation technique mais
              une décision : ces valeurs sont mesurées ou relevées à une source,
              et une saisie libre les transformerait en estimations. */}
          <div className="bg-white rounded-xl border border-[#E5E3DF] p-5 space-y-5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#132073]">
              Données vérifiées
            </h2>
            <ChampVerrouille
              libelle="Distance depuis le dépôt"
              valeur={commune.distance_depot_km === null ? '' : `${commune.distance_depot_km} km · ${commune.temps_trajet_estime_min} min`}
              raison="Relevé sur Google Maps. Modifiable uniquement après une nouvelle mesure — une distance saisie de mémoire finit affichée sur la page et dans le balisage."
            />
            <ChampVerrouille
              libelle="Communes limitrophes"
              valeur={(commune.communes_voisines ?? []).join(', ')}
              raison="Détermine les liens entre pages. Une commune ajoutée à tort crée un lien géographiquement faux."
            />
            <ChampVerrouille
              libelle="Codes postaux"
              valeur={(commune.codes_postaux ?? []).join(' · ')}
              raison="Repris dans le balisage Schema.org lu par Google."
            />
            <ChampVerrouille
              libelle="Arrondissement"
              valeur={commune.arrondissement ?? ''}
              raison="Sert au regroupement sur la page des zones d'intervention."
            />
            {commune.date_verification && (
              <ChampVerrouille
                libelle="Données vérifiées le"
                valeur={commune.date_verification}
                raison="Date du dernier relevé des données ci-dessus."
              />
            )}
            {commune.page_existante && (
              <ChampVerrouille
                libelle="Page dédiée existante"
                valeur={commune.page_existante}
                raison="Cette commune est portée par une page antérieure déjà indexée. Aucune page n'est générée pour elle, pour ne pas mettre deux URL du site en concurrence sur la même requête."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
