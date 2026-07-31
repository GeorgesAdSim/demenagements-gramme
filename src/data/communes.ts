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
  /**
   * Arrondissement administratif, issu du fichier source du client. Conservé
   * en optionnel bien qu'absent de l'interface validée : c'est une donnée
   * réelle du fichier Excel, et le seul moyen de regrouper 84 communes en
   * sections lisibles sur la page des zones d'intervention.
   */
  arrondissement?: string;
  /** Tableau : une commune fusionnée couvre souvent plusieurs codes postaux. */
  codesPostaux: string[];
  /**
   * Distance routière depuis le dépôt d'où partent les camions — rue de la
   * Digue à Oupeye, et NON le siège social rue des Naiveux à Herstal. La
   * confusion entre les deux avait faussé les 37 premiers relevés.
   * `null` si non mesurée.
   */
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
   * URL d'une page satellite déjà publiée et indexée pour cette commune.
   *
   * Quand elle est renseignée, aucune page /zones-intervention/ n'est générée :
   * la page existante reste l'unique URL du site sur la requête. Deux pages
   * du même domaine visant « déménagement <commune> » se prendraient les
   * signaux l'une à l'autre.
   */
  pageExistante?: string;
  /**
   * `draft` : page accessible mais en noindex, absente du sitemap et de la page
   * des zones. `published` : données locales réelles et vérifiées.
   */
  statut: 'draft' | 'published';
}

export const COMMUNES: CommuneSEO[] = (donnees as { communes: CommuneSEO[] }).communes;

/** Alias conservant le nom employé dans la spécification. */
export const communesData = COMMUNES;

/**
 * Page index listant l'ensemble des communes. Reste à la racine : son intention
 * est navigationnelle, et « zones d'intervention » est bien le terme que sa
 * propre URL doit porter.
 */
export const RACINE_ZONES = '/zones-intervention';

/**
 * Les pages communes vivent sous /demenagement/demenagement-<slug>, exactement
 * comme les satellites déjà publiées.
 *
 * Deux raisons, dans cet ordre d'importance. D'abord une seule convention pour
 * tout le site : /demenagement/demenagement-seraing et
 * /zones-intervention/huy côte à côte, c'étaient deux grammaires d'URL pour un
 * même type de page. Ensuite le silo : /demenagement existe déjà comme page
 * mère, les communes en héritent du regroupement thématique. La présence du
 * mot-clé dans l'URL, elle, ne pèse que très peu au classement — c'est le
 * bénéfice le plus visible mais le plus faible des trois.
 *
 * ⚠️ React Router 6 n'accepte pas de segment partiellement dynamique : le motif
 * `/demenagement/demenagement-:slug` ne matche jamais (vérifié sur 6.26). La
 * route déclarée est donc `/demenagement/:slug` et le préfixe est découpé par
 * `slugDepuisSegment` ci-dessous.
 */
export const PREFIXE_COMMUNE = 'demenagement-';
export const RACINE_COMMUNES = '/demenagement';

/** Chemin d'une page commune générée, sans tenir compte des satellites. */
export function cheminCommune(slug: string): string {
  return `${RACINE_COMMUNES}/${PREFIXE_COMMUNE}${slug}`;
}

/**
 * Extrait le slug de commune d'un segment d'URL. Renvoie `undefined` si le
 * segment ne porte pas le préfixe attendu, afin que /demenagement/n-importe-quoi
 * tombe en 404 plutôt que d'être traité comme une commune inconnue.
 */
export function slugDepuisSegment(segment: string | undefined): string | undefined {
  if (!segment || !segment.startsWith(PREFIXE_COMMUNE)) return undefined;
  const slug = segment.slice(PREFIXE_COMMUNE.length);
  return slug || undefined;
}

export function getCommuneBySlug(slug: string): CommuneSEO | undefined {
  return COMMUNES.find((c) => c.id === slug);
}

export function getPublishedCommunes(): CommuneSEO[] {
  return COMMUNES.filter((c) => c.statut === 'published')
    .slice()
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
}

/**
 * Communes pour lesquelles une page locale doit réellement être générée :
 * publiées et sans page satellite antérieure.
 */
export function getCommunesAGenerer(): CommuneSEO[] {
  return getPublishedCommunes().filter((c) => !c.pageExistante);
}

/** URL canonique de la commune : sa page satellite si elle existe, sinon la page générée. */
export function communeUrl(commune: CommuneSEO): string {
  return commune.pageExistante ?? cheminCommune(commune.id);
}

/**
 * Voisines réellement liables. Filtre sur `published` — proposé par Georges et
 * retenu : une commune en brouillon est servie en noindex, y renvoyer un lien
 * interne dépenserait du maillage vers une page que Google ignore.
 */
export function getNeighborCommunes(commune: CommuneSEO): CommuneSEO[] {
  return commune.communesVoisines
    .map((slug) => getCommuneBySlug(slug))
    .filter((c): c is CommuneSEO => c !== undefined && c.statut === 'published');
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

  const connus = new Map(communes.map((c) => [c.id, c]));

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

      // Le maillage n'existe que si au moins une voisine est publiée. Une page
      // locale isolée ne reçoit ni ne transmet de signal : c'est le défaut
      // classique des grappes de pages locales publiées commune par commune
      // plutôt que par zone contiguë.
      const voisinesPubliees = c.communesVoisines.filter((v) => connus.get(v)?.statut === 'published');
      if (voisinesPubliees.length === 0) {
        problemes.push({ commune: c.id, gravite: 'avertissement', message: 'aucune voisine publiée — la page n\'aura aucun lien de maillage local' });
      }
    }
  }

  return problemes;
}

/**
 * « de Ans » ou « d'Ans » ? Élision devant voyelle.
 *
 * Sans ce traitement, les pages affichent « Les villages de Ans que nous
 * desservons » et « autour de Esneux ». Sur vingt-deux pages publiées, une
 * faute de liaison à chaque section donne l'impression d'un site fabriqué à la
 * chaîne — exactement ce qu'on cherche à ne pas laisser croire.
 *
 * Le h reste aspiré en usage belge : on écrit « de Herstal » et « de Huy », pas
 * « d'Herstal ». Seules les voyelles déclenchent l'élision.
 */
export function deCommune(nom: string): string {
  return /^[aeiouyàâäéèêëîïôöùûü]/i.test(nom) ? `d'${nom}` : `de ${nom}`;
}
