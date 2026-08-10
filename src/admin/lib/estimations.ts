import { supabase } from '../../lib/supabase';

/**
 * Une pièce analysée par le modèle, telle que l'Edge Function `estimate-volume`
 * la range dans `detected_items.rooms`.
 *
 * `readable` à false et `error` renseigné signalent une pièce dont l'analyse a
 * échoué : l'estimation globale est quand même produite, avec la confiance
 * rabaissée. C'est le cas que la fiche doit montrer en premier, parce que c'est
 * lui qui explique un volume manifestement faux.
 */
export interface PieceAnalysee {
  id: string;
  label: string;
  readable: boolean;
  items: { id: string; qty: number; fill: string | null; note: string | null }[];
  volume_meubles: number;
  volume_cache: number;
  confidence: string;
  warnings: string[];
  built_in: string[];
  special_handling: string[];
  error?: string;
}

/**
 * `detected_items` mélange deux choses de nature différente : le découpage par
 * pièce, destiné à être lu, et `raw_model_output`, le log brut conservé « pour
 * calibration ». Le second n'a pas sa place sous les yeux d'un opérateur, d'où
 * la distinction ici plutôt qu'un `any` qui laisserait les deux se confondre.
 */
export interface DetailsDetectes {
  rooms?: PieceAnalysee[];
  raw_model_output?: unknown;
}

/** Ligne de `volume_estimations`, en snake_case comme Postgres la renvoie. */
export interface LigneEstimation {
  id: string;
  housing_type: string | null;
  rooms_count: number | null;
  surface_m2: number | null;
  floor: number | null;
  has_elevator: boolean | null;
  detected_items: DetailsDetectes | null;
  volume_m3: number | null;
  volume_min: number | null;
  volume_max: number | null;
  volume_ajuste: number | null;
  confidence: string | null;
  manually_adjusted: boolean | null;
  lead_email: string | null;
  lead_phone: string | null;
  photos_paths: string[] | null;
  status: string;
  notes: string | null;
  created_at: string;
  expires_at: string;
}

/**
 * Le volume qui fait foi : la correction de l'opérateur si elle existe, sinon
 * celle du modèle. `volume_m3` n'est jamais réécrit — voir la migration
 * 20260810120000.
 */
export function volumeRetenu(e: LigneEstimation): number | null {
  return e.volume_ajuste ?? e.volume_m3;
}

/**
 * Les coordonnées arrivent par un second appel à l'Edge Function, après
 * l'analyse. Une estimation dont le visiteur est reparti sans les laisser est
 * donc parfaitement normale — et intraitable, puisque personne ne peut être
 * rappelé. La liste les sépare au lieu de les masquer : leur nombre mesure
 * l'abandon de l'estimateur.
 */
export function estContactable(e: LigneEstimation): boolean {
  return Boolean(e.lead_email || e.lead_phone);
}

export function pieces(e: LigneEstimation): PieceAnalysee[] {
  return e.detected_items?.rooms ?? [];
}

/** Une estimation dont la date de purge est passée mais que rien n'a supprimée. */
export function estPerimee(e: LigneEstimation): boolean {
  return Boolean(e.expires_at) && new Date(e.expires_at) < new Date();
}

/**
 * `volume-photos` est un bucket privé : `getPublicUrl` y renverrait une URL
 * morte. On passe donc par des URL signées, que la politique
 * `volume_photos_admin_lecture` rend générables depuis l'API authentifiée.
 *
 * Une heure de validité : assez pour consulter une fiche sans la recharger,
 * assez court pour qu'une URL qui fuite ne serve pas longtemps.
 */
export async function urlsPhotosSignees(paths: string[]): Promise<string[]> {
  if (!paths.length) return [];
  const { data, error } = await supabase.storage
    .from('volume-photos')
    .createSignedUrls(paths, 3600);
  if (error) throw new Error(error.message);
  return (data ?? [])
    .filter((d) => d.signedUrl)
    .map((d) => d.signedUrl as string);
}
