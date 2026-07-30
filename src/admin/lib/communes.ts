import { supabase } from '../../lib/supabase';

/**
 * Ligne de la table `communes`, en snake_case comme Postgres la renvoie.
 *
 * Volontairement distincte de `CommuneSEO` du site public : celle-ci décrit la
 * base, celle-là décrit le JSON consommé par le build. Les confondre revient à
 * laisser une convention de nommage fuir d'une couche à l'autre, et c'est au
 * premier renommage de colonne que ça se paie.
 */
export interface LigneCommune {
  id: string;
  nom: string;
  arrondissement: string | null;
  codes_postaux: string[];
  distance_depot_km: number | null;
  temps_trajet_estime_min: number | null;
  villages: string[];
  communes_voisines: string[];
  introduction_locale: string | null;
  informations_locales: string[];
  date_verification: string | null;
  page_existante: string | null;
  statut: 'draft' | 'published';
  updated_at: string;
}

/** Champs que le back-office autorise à modifier. Voir le commentaire dans CommuneEditorPage. */
export interface ModifCommune {
  introduction_locale: string | null;
  informations_locales: string[];
  villages: string[];
  statut: 'draft' | 'published';
}

export async function listerCommunes(): Promise<LigneCommune[]> {
  const { data, error } = await supabase
    .from('communes')
    .select('*')
    .order('nom', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as LigneCommune[];
}

export async function lireCommune(id: string): Promise<LigneCommune | null> {
  const { data, error } = await supabase.from('communes').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as LigneCommune) ?? null;
}

/**
 * Les contraintes CHECK de la base renvoient un message technique du genre
 * « violates check constraint "communes_publiee_maillee" ». On les traduit, sinon
 * l'utilisateur du back-office reste devant un mur.
 */
const MESSAGES: Array<[string, string]> = [
  ['communes_publiee_mesuree',
    'Impossible de publier : la distance depuis le dépôt et le temps de trajet doivent être mesurés. Ils ne peuvent pas être estimés.'],
  ['communes_publiee_maillee',
    'Impossible de publier : il faut entre 3 et 5 communes limitrophes pour que le maillage interne fonctionne.'],
  ['communes_publiee_avec_contenu',
    'Impossible de publier : il faut au moins une introduction locale, une particularité, ou un village desservi.'],
  ['communes_pas_auto_voisine',
    'Une commune ne peut pas se citer elle-même comme limitrophe.'],
  ['communes_distances_positives',
    'Les distances et les temps de trajet ne peuvent pas être négatifs.'],
  ['communes_statut_valide',
    'Statut inconnu. Seuls « brouillon » et « publié » existent.'],
  ['voisine inexistante',
    'Une des communes limitrophes ne figure pas dans la liste des 84 communes.'],
];

export function messageLisible(brut: string): string {
  for (const [motif, message] of MESSAGES) {
    if (brut.includes(motif)) return message;
  }
  return brut;
}

export async function enregistrerCommune(id: string, modif: ModifCommune): Promise<void> {
  const { error } = await supabase.from('communes').update(modif).eq('id', id);
  if (error) throw new Error(messageLisible(error.message));
}

/**
 * Demande un déploiement. L'URL du build hook n'est jamais côté client : la
 * fonction Netlify la détient et vérifie la session avant de déclencher.
 */
export async function publier(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const jeton = data.session?.access_token;
  if (!jeton) throw new Error('Session expirée. Reconnecte-toi avant de publier.');

  const rep = await fetch('/api/publier-communes', {
    method: 'POST',
    headers: { Authorization: `Bearer ${jeton}` },
  });
  const corps = await rep.json().catch(() => ({}));
  if (!rep.ok) throw new Error(corps.erreur || `Échec de la publication (HTTP ${rep.status}).`);
  return corps.message as string;
}
