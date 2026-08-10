/**
 * Ligne de la table `gramme_media`, en snake_case comme Postgres la renvoie.
 *
 * À ne pas confondre avec la table `media`, qui ne contient plus que quelques
 * lignes pointant vers d'anciennes URL WordPress et n'est plus alimentée. Le
 * bucket Storage s'appelle lui aussi `media` : `supabase.storage.from('media')`
 * est correct, `supabase.from('media')` ne l'est pas.
 */
export interface LigneMedia {
  id: string;
  filename: string;
  original_name: string | null;
  public_url: string;
  mime_type: string;
  size_bytes: number;
  alt_text: string | null;
  created_at: string;
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Nom lisible d'un média. `filename` est le nom généré à l'upload
 * (`1735…-a3f2.jpg`) : illisible. On affiche `original_name`, en gardant
 * `filename` en repli pour les lignes importées qui n'en ont pas.
 */
export function displayName(m: LigneMedia): string {
  return m.original_name || m.filename;
}
