// Accès typé à la source unique des communes.
//
// Pourquoi un JSON et non un tableau TypeScript : `scripts/prerender.mjs` est un
// module Node en .mjs, qui ne peut pas importer du TypeScript. Un JSON est lu
// tel quel par Node comme par Vite, ce qui évite une étape de compilation
// intermédiaire ET évite surtout de maintenir deux listes de communes — le
// piège que la spécification demandait explicitement d'éviter.
import donnees from './communes.json';

export interface CommuneSEO {
  /** Slug unique, stable, sans accent. Sert de segment d'URL. */
  id: string;
  nom: string;
  /** Arrondissement administratif, issu du fichier source du client. */
  arrondissement: string;
  /** Tableau : une commune fusionnée couvre souvent plusieurs codes postaux. */
  codesPostaux: string[];
  /** Distance routière depuis le dépôt de Herstal. `null` si non mesurée. */
  distanceDepotKm: number | null;
  /** Temps de trajet indicatif. `null` si non mesuré. */
  tempsTrajetEstimeMin: number | null;
  villages: string[];
  /** Slugs uniquement, pour ne pas dupliquer les noms. */
  communesVoisines: string[];
  introductionLocale?: string;
  informationsLocales?: string[];
  /** Date à laquelle Gramme a validé les données locales. */
  dateVerification?: string;
  /**
   * `draft` : page accessible mais en noindex, absente du sitemap et de la page
   * des zones. `published` : données locales réelles et vérifiées.
   */
  statut: 'draft' | 'published';
}

export const COMMUNES: CommuneSEO[] = (donnees as { communes: CommuneSEO[] }).communes;

export function getCommuneBySlug(slug: string): CommuneSEO | undefined {
  return COMMUNES.find((c) => c.id === slug);
}

export function getPublishedCommunes(): CommuneSEO[] {
  return COMMUNES.filter((c) => c.statut === 'published')
    .slice()
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
}

/** Résout les slugs voisins en objets. Les slugs inconnus sont ignorés. */
export function getNeighborCommunes(commune: CommuneSEO): CommuneSEO[] {
  return commune.communesVoisines
    .map((slug) => getCommuneBySlug(slug))
    .filter((c): c is CommuneSEO => Boolean(c));
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation
//
// Volontairement exportée comme fonction pure plutôt que jetée à l'import : le
// pré-rendu et le contrôle de build l'appellent, mais une donnée incomplète ne
// doit pas casser le site en développement.
// ─────────────────────────────────────────────────────────────────────────────

export interface ProblemeCommune {
  commune: string;
  gravite: 'erreur' | 'avertissement';
  message: string;
}

/** Contenu local minimal exigé pour qu'une page puisse passer en `published`. */
function aDuContenuLocal(c: CommuneSEO): boolean {
  return Boolean(
    c.introductionLocale?.trim() ||
    (c.informationsLocales && c.informationsLocales.length > 0) ||
    c.villages.length > 0
  );
}

export function validerCommunes(communes: CommuneSEO[] = COMMUNES): ProblemeCommune[] {
  const problemes: ProblemeCommune[] = [];
  const vus = new Map<string, number>();

  for (const c of communes) {
    vus.set(c.id, (vus.get(c.id) ?? 0) + 1);
  }
  for (const [id, n] of vus) {
    if (n > 1) problemes.push({ commune: id, gravite: 'erreur', message: `slug présent ${n} fois` });
  }

  const connus = new Set(communes.map((c) => c.id));

  for (const c of communes) {
    if (c.communesVoisines.includes(c.id)) {
      problemes.push({ commune: c.id, gravite: 'erreur', message: 'se référence elle-même comme voisine' });
    }

    for (const v of c.communesVoisines) {
      if (!connus.has(v)) {
        problemes.push({ commune: c.id, gravite: 'erreur', message: `voisine inexistante : « ${v} »` });
      }
    }

    // La règle 3-5 voisines ne s'applique qu'aux pages réellement publiées :
    // une commune en brouillon n'a pas encore de maillage renseigné.
    if (c.statut === 'published') {
      const n = c.communesVoisines.length;
      if (n < 3 || n > 5) {
        problemes.push({ commune: c.id, gravite: 'erreur', message: `${n} voisine(s) — il en faut entre 3 et 5` });
      }
      if (!aDuContenuLocal(c)) {
        problemes.push({ commune: c.id, gravite: 'erreur', message: 'publiée sans contenu local (ni introduction, ni informations, ni villages)' });
      }
      if (c.distanceDepotKm === null) {
        problemes.push({ commune: c.id, gravite: 'erreur', message: 'publiée sans distance depuis le dépôt' });
      }
      if (c.tempsTrajetEstimeMin === null) {
        problemes.push({ commune: c.id, gravite: 'erreur', message: 'publiée sans temps de trajet estimé' });
      }
      if (c.codesPostaux.length === 0) {
        problemes.push({ commune: c.id, gravite: 'avertissement', message: 'publiée sans code postal' });
      }
      if (!c.dateVerification) {
        problemes.push({ commune: c.id, gravite: 'avertissement', message: 'publiée sans date de vérification des données' });
      }
    }
  }

  return problemes;
}
