// Accès typé à la source unique des communes.
//
// Pourquoi un JSON et non un tableau TypeScript : `scripts/prerender.mjs` est un
// module Node en .mjs, qui ne peut pas importer du TypeScript. Un JSON est lu
// tel quel par Node comme par Vite, ce qui évite une étape de compilation
// intermédiaire ET évite surtout de maintenir deux listes de communes — le
// piège que la spécification demandait explicitement d'éviter.
import donnees from './communes.json';
// Même raison pour les pages satellites : une liste JSON, lue à l'identique par
// le client Vite et par les scripts Node du build.
import satellites from './pages-satellites.json';

/** Pages satellites déclarées par le dépôt. Voir `pageSatellite()`. */
const PAGES_SATELLITES = new Set<string>(satellites.pages);

/**
 * Même liste, exportée pour le contrôle de build : il vérifie que chacune de
 * ces pages est réellement servie, sans quoi une entrée périmée ferait sauter
 * une commune du pré-rendu.
 */
export const PAGES_SATELLITES_DECLAREES: readonly string[] = satellites.pages;

/**
 * Règles d'autorisation de stationnement, relevées sur la source officielle de
 * la commune ou de sa zone de police.
 *
 * Chaque champ facultatif vaut `null` quand la commune ne publie pas
 * l'information — jamais une valeur plausible. Un délai ou un tarif inventé se
 * retrouverait sur une page que des clients lisent avant d'organiser leur
 * déménagement : le coût d'une erreur y est sans commune mesure avec celui
 * d'une case vide. En l'absence de donnée, la page retombe sur une formulation
 * générique mais vraie.
 */
export interface AutorisationStationnement {
  /** Autorité compétente, telle qu'elle se nomme sur la source. */
  autorite: string;
  /** Canal d'introduction : plateforme, e-mail, formulaire papier… */
  procedure: string;
  /** Délai minimum publié, en toutes lettres. */
  delai: string | null;
  /** Montant publié, repris tel quel, unité comprise. */
  cout: string | null;
  /** Règle de pose de la signalisation, si la commune en publie une. */
  signalisation: string | null;
  /** Page officielle d'où proviennent les champs ci-dessus. */
  sourceUrl: string;
  /**
   * Formulaire de demande, quand il vit sur une URL distincte de `sourceUrl`.
   * Absent tant qu'une URL n'a pas été relevée : une URL devinée produit un 404
   * sortant, ce qui est pire que pas de lien du tout.
   */
  urlFormulaire?: string;
  /**
   * Texte du lien vers `sourceUrl`, rédigé à la main pour cette commune.
   *
   * L'ancre était auparavant composée : « information officielle publiée par
   * {autorite} », soit le même patron répété sur cinquante et une pages. Une
   * ancre qui se devine par formule n'apporte aucun signal — elle en retire,
   * en signalant la génération automatique. Elle reprend donc ici le libellé
   * réel de la ressource : le nom de la plateforme, du formulaire ou du
   * règlement tel qu'il se présente sur le site de la commune.
   */
  libelleSource: string;
  dateVerification: string;
  /**
   * Verrou de publication. `'human'` : un humain a relu la fiche et engage sa
   * responsabilité dessus. `null` : donnée collectée mais non relue.
   *
   * Une fiche non relue n'est PAS rendue : la page retombe sur le texte
   * générique, sans lien externe. La raison n'est pas éditoriale mais
   * pratique — un délai ou une redevance erronés font prendre une amende au
   * client, et c'est un coût sans commune mesure avec celui d'un paragraphe
   * moins précis. Le passage à `'human'` est un acte manuel.
   */
  verifiePar: 'human' | null;
}

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
   * Digue à Oupeye, et NON le siège social voie du Belvédère à Seraing. La
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
  /**
   * Sections rédigées propres à la commune, rendues en H2 suivi de paragraphes.
   *
   * `informationsLocales` ne prend que des puces courtes : une commune sur
   * laquelle il y a réellement quelque chose à raconter — le siège social à
   * Seraing, le relief de Chaudfontaine — n'y tenait pas. C'est ce qui a
   * permis de migrer les pages satellites sans perdre leur prose.
   *
   * `contenu` accepte plusieurs paragraphes, séparés par une ligne vide.
   */
  sectionsLocales?: Array<{ titre: string; contenu: string }>;
  /**
   * Règles d'autorisation de stationnement de la commune. Absent tant que la
   * source officielle n'a pas été relevée ; `todoDonneesLocales` dit alors ce
   * qui reste à vérifier.
   */
  autorisationStationnement?: AutorisationStationnement;
  /**
   * Questions fréquentes RÉDIGÉES pour cette commune, en texte libre.
   *
   * Les quatre questions étaient auparavant composées par une fonction unique,
   * à partir de gabarits à trous. Le procédé produisait, sur soixante-dix
   * pages, des réponses dont quatre-vingt-seize mots étaient strictement
   * identiques — « Appelez le 04 264 50 16 ou remplissez le formulaire en
   * ligne. Nous organisons une visite technique gratuite… ». Un gabarit à
   * variables reste un gabarit : remplacer la distance et le nom de la commune
   * ne fait pas une réponse différente, et Google mesure ce qui est écrit, pas
   * l'intention de personnalisation.
   *
   * La question pertinente n'est d'ailleurs pas la même partout : le
   * stationnement en centre dense à Seraing, l'accès aux fermes isolées en
   * Hesbaye, la neige de plateau à Waimes, les rues en pente à Liège. Ces
   * questions ne se dérivent d'aucune formule.
   *
   * Règles :
   *  · 3 à 5 questions, dont au moins deux qui n'auraient pas de sens sur une
   *    autre commune ;
   *  · rien qui ne soit déjà vérifié ailleurs dans la fiche — les réponses
   *    reformulent des faits relevés, elles n'en produisent pas ;
   *  · le texte affiché et le balisage FAQPage viennent de ce champ, donc sont
   *    identiques mot pour mot par construction.
   *
   * Absent, la page retombe sur les questions génériques d'avant, qui restent
   * vraies. La commune est alors listée dans reports/faq-a-completer.md.
   */
  faqLocale?: Array<{ question: string; reponse: string }>;
  /** Ce qu'il reste à vérifier auprès de la commune, en clair. */
  todoDonneesLocales?: string;
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
 * Page satellite de la commune, si elle existe RÉELLEMENT dans cette version
 * du code.
 *
 * `pageExistante` vient de Supabase. Quand une page satellite est supprimée du
 * dépôt, la valeur reste en base et devient fausse : le pré-rendu saute alors
 * une commune dont plus rien ne sert l'URL, et le déploiement s'interrompt sur
 * deux 404. Le cas s'est produit sur Herstal et Seraing.
 *
 * Le symétrique est tout aussi cassant. Retirer la valeur en base avant que le
 * code correspondant soit en ligne fait servir la satellite là où le contrôle
 * de build attend une page commune. Les deux échecs ont été observés à un jour
 * d'intervalle.
 *
 * La cause commune : le fait « cette page existe » était lu dans la base alors
 * qu'il appartient au dépôt. Il y est désormais, et la base peut être en avance
 * ou en retard sans rien casser.
 */
export function pageSatellite(commune: CommuneSEO): string | undefined {
  return commune.pageExistante && PAGES_SATELLITES.has(commune.pageExistante)
    ? commune.pageExistante
    : undefined;
}

/**
 * Communes pour lesquelles une page locale doit réellement être générée :
 * publiées et sans page satellite antérieure.
 */
export function getCommunesAGenerer(): CommuneSEO[] {
  return getPublishedCommunes().filter((c) => !pageSatellite(c));
}

/** URL canonique de la commune : sa page satellite si elle existe, sinon la page générée. */
export function communeUrl(commune: CommuneSEO): string {
  return pageSatellite(commune) ?? cheminCommune(commune.id);
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

      // Fiche stationnement : la donnée qui, si elle est fausse, coûte une
      // amende au client. Les contrôles portent donc sur ce qui la rend
      // publiable, pas sur son exhaustivité.
      const a = c.autorisationStationnement;
      if (a) {
        if (!a.sourceUrl?.trim()) {
          problemes.push({ commune: c.id, gravite: 'erreur', message: 'autorisationStationnement sans sourceUrl' });
        } else if (!/^https:\/\/[^/]+\.be(\/|$)/.test(a.sourceUrl)) {
          // Domaines .be officiels uniquement : site communal, zone de police,
          // portail régional. Ni raccourcisseur, ni URL de recherche.
          problemes.push({ commune: c.id, gravite: 'erreur', message: `sourceUrl « ${a.sourceUrl} » n'est pas une URL https d'un domaine .be` });
        }
        if (!a.libelleSource?.trim()) {
          problemes.push({ commune: c.id, gravite: 'erreur', message: 'autorisationStationnement sans libelleSource — l\'ancre du lien doit être rédigée, pas composée' });
        }
        if (a.verifiePar !== 'human' && a.verifiePar !== null) {
          problemes.push({ commune: c.id, gravite: 'erreur', message: `verifiePar vaut « ${a.verifiePar} » — attendu "human" ou null` });
        }
        if (a.verifiePar === null) {
          problemes.push({ commune: c.id, gravite: 'avertissement', message: 'fiche stationnement collectée mais non relue (verifiePar: null) — texte générique servi' });
        }
        if (a.urlFormulaire && !/^https:\/\/[^/]+\.be(\/|$)/.test(a.urlFormulaire)) {
          problemes.push({ commune: c.id, gravite: 'erreur', message: `urlFormulaire « ${a.urlFormulaire} » n'est pas une URL https d'un domaine .be` });
        }
      }

      // FAQ locale : entre 3 et 5 questions. Deux, c'est une section qui ne
      // vaut pas son titre ; au-delà de cinq, le balisage FAQPage devient une
      // liste que Google tronque et que personne ne lit.
      if (c.faqLocale) {
        const n = c.faqLocale.length;
        if (n < 3 || n > 5) {
          problemes.push({ commune: c.id, gravite: 'erreur', message: `faqLocale : ${n} question(s) — il en faut entre 3 et 5` });
        }
        for (const [i, qr] of c.faqLocale.entries()) {
          if (!qr.question?.trim() || !qr.reponse?.trim()) {
            problemes.push({ commune: c.id, gravite: 'erreur', message: `faqLocale[${i}] : question ou réponse vide` });
          }
        }
        const questions = c.faqLocale.map((q) => q.question.trim());
        if (new Set(questions).size !== questions.length) {
          problemes.push({ commune: c.id, gravite: 'erreur', message: 'faqLocale : deux questions identiques' });
        }
      } else if (!pageSatellite(c)) {
        // Une commune servie par une satellite n'a pas de page générée : sa FAQ
        // vit dans la satellite, pas ici.
        problemes.push({ commune: c.id, gravite: 'avertissement', message: 'sans faqLocale — FAQ générique servie, voir reports/faq-a-completer.md' });
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
