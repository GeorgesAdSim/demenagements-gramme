// Pages de service rédigées, avec verrou de publication.
//
// Pourquoi ce fichier plutôt que deux composants React : les deux pages du lot
// P1 — /vide-maison et /prix-demenagement — ont la même mécanique et un contenu
// différent. Écrire deux composants revenait à recréer, sur des pages de
// service, exactement la duplication de gabarit que le chantier des communes a
// passé quatre lots à retirer.
//
// ⚠️ VERROU. Une page n'est routée au pré-rendu, listée au sitemap et affichée
// dans la navigation que si `verifiePar === 'human'`. Tant que ce n'est pas le
// cas, elle n'existe qu'en `npm run dev`, pour relecture.
//
// La raison est la même que pour les fiches d'autorisation de stationnement :
// ces pages annoncent des prix. Un tarif faux sur une page de tarifs coûte plus
// cher qu'une page absente, commercialement et juridiquement. Le passage à
// `'human'` est un acte manuel, qui suppose que chaque chiffre a été confirmé
// par Gramme.
//
// Les chiffres relevés sur une source tierce ne valent PAS validation : ils
// peuvent servir à préparer la liste à confirmer, jamais à remplir la page.

export interface SectionService {
  titre: string;
  /**
   * Paragraphes séparés par une ligne vide. Vide tant que la rédaction n'a pas
   * eu lieu : une section sans contenu n'est pas rendue, plutôt que d'afficher
   * un titre suivi de rien.
   */
  contenu: string;
}

export interface PageService {
  /** Chemin servi, sans slash final. */
  slug: string;
  /** Requête principale visée. Sert la relecture, pas le rendu. */
  focusKeyword: string;
  /** Requêtes secondaires, pour la relecture éditoriale. */
  secondaires: string[];
  meta: { title: string; description: string };
  /** `serviceType` du balisage schema.org. Terme métier. */
  serviceType: string;
  /** Nom de la prestation telle qu'elle est proposée. */
  nomService: string;
  /**
   * Bloc de tête destiné à l'extraction — 50 à 60 mots, avec les entités
   * nommées. Vide tant que les données manquent : c'est le paragraphe qui
   * contient les chiffres.
   */
  answerCapsule: string;
  sections: SectionService[];
  faq: Array<{ question: string; reponse: string }>;
  /**
   * Fourchette validée, pour l'`AggregateOffer`. Absente tant qu'aucun chiffre
   * n'est confirmé — un prix inventé dans un balisage remonte tel quel dans les
   * résultats enrichis, où il devient une promesse.
   */
  offre?: { prixMin: number; prixMax: number; unite?: string };
  /** Liens sortants attendus, vérifiés à la relecture. */
  maillageSortant: Array<{ libelle: string; to: string }>;
  /** Verrou de publication. Voir l'en-tête du fichier. */
  verifiePar: 'human' | null;
  /**
   * Ce qu'il reste à obtenir de Gramme. Tant que la liste n'est pas vide, la
   * page ne peut pas passer à `'human'` — le contrôle de build le vérifie.
   */
  donneesManquantes: string[];
}

export const PAGES_SERVICE: PageService[] = [
  {
    slug: '/vide-maison',
    focusKeyword: 'vide maison',
    secondaires: ['vide maison prix', 'vider une maison', 'débarras maison', 'débarras succession'],
    meta: { title: '', description: '' },
    serviceType: 'Vide-maison et débarras',
    nomService: 'Vide-maison et débarras en province de Liège',
    answerCapsule: '',
    sections: [
      { titre: "Qu'est-ce qu'un vide-maison, et dans quels cas y recourir", contenu: '' },
      { titre: 'Comment se déroule un vide-maison avec Gramme', contenu: '' },
      { titre: "Prix d'un vide-maison : ce qui fait varier la facture", contenu: '' },
      { titre: 'Vide-maison, débarras ou déménagement : lequel correspond à votre situation', contenu: '' },
      { titre: 'Que deviennent les meubles et les objets', contenu: '' },
      { titre: 'Vide-maison après une succession : les précautions à prendre', contenu: '' },
    ],
    faq: [],
    maillageSortant: [
      { libelle: 'zones d’intervention', to: '/zones-intervention' },
      { libelle: 'garde-meubles', to: '/garde-meubles' },
    ],
    verifiePar: null,
    donneesManquantes: [
      'Gramme propose-t-il ce service seul, ou avec un partenaire débarras ?',
      'Base de prix : forfait, au m³, à la journée ? Ordre de grandeur pour une maison moyenne.',
      'Devenir des biens : rachat, reprise en déduction, don, évacuation seule ?',
      'Nettoyage et remise en état : inclus ou en option ?',
      "Délai d'intervention typique.",
    ],
  },
  {
    slug: '/prix-demenagement',
    focusKeyword: 'prix déménagement',
    secondaires: ['combien coûte un déménagement', 'tarif déménageur', 'devis déménagement', 'déménagement pas cher'],
    meta: { title: '', description: '' },
    serviceType: 'Déménagement',
    nomService: 'Prix d’un déménagement en province de Liège',
    answerCapsule: '',
    sections: [
      { titre: 'Combien coûte un déménagement en Belgique : les fourchettes par type de logement', contenu: '' },
      { titre: 'Les six facteurs qui font varier le prix', contenu: '' },
      { titre: 'Prix selon le logement : studio, appartement, maison', contenu: '' },
      { titre: 'Formule économique, standard ou clé en main', contenu: '' },
      { titre: "Ce qui est inclus dans un devis Gramme, et ce qui ne l'est pas", contenu: '' },
      { titre: 'Comment réduire la facture sans sacrifier la prestation', contenu: '' },
      { titre: 'Estimez votre volume en photos', contenu: '' },
    ],
    faq: [],
    maillageSortant: [
      { libelle: 'estimateur de volume par photos', to: '/estimation-volume' },
      { libelle: 'demande de devis', to: '/contact-devis' },
    ],
    verifiePar: null,
    donneesManquantes: [
      "Fourchettes réelles par type de logement, sur la zone d'intervention.",
      'Ce que couvre exactement chaque formule.',
      'Base de facturation : volume, heures, forfait ?',
      'Assurance incluse : plafond et franchise.',
      'Suppléments les plus fréquents et leur ordre de grandeur.',
    ],
  },
];

/**
 * Pages réellement publiables : relues, et sans donnée manquante.
 *
 * Consommée par le pré-rendu, le générateur de sitemap et la navigation. Une
 * page absente d'ici n'est servie nulle part en production, et son URL tombe
 * en 404 — ce qui est le comportement voulu pour un brouillon.
 */
export function pagesServicePubliees(): PageService[] {
  return PAGES_SERVICE.filter((p) => p.verifiePar === 'human' && p.donneesManquantes.length === 0);
}

export function pageServiceParSlug(slug: string): PageService | undefined {
  return PAGES_SERVICE.find((p) => p.slug === slug);
}

export interface ProblemePageService {
  slug: string;
  gravite: 'erreur' | 'avertissement';
  message: string;
}

/**
 * Contrôles de cohérence, appelés par scripts/verify-build.mjs.
 *
 * Le cas qui compte : une page marquée relue alors qu'il lui manque encore des
 * données, ou dont une section est vide. Ce serait une page mince publiée, soit
 * exactement le motif que tout le chantier précédent a servi à corriger.
 */
export function validerPagesService(pages: PageService[] = PAGES_SERVICE): ProblemePageService[] {
  const problemes: ProblemePageService[] = [];

  for (const p of pages) {
    const publiable = p.verifiePar === 'human';

    if (publiable && p.donneesManquantes.length > 0) {
      problemes.push({
        slug: p.slug,
        gravite: 'erreur',
        message: `marquée relue alors que ${p.donneesManquantes.length} donnée(s) métier manquent encore`,
      });
    }

    if (publiable) {
      if (!p.meta.title.trim()) problemes.push({ slug: p.slug, gravite: 'erreur', message: 'title absent' });
      if (!p.meta.description.trim()) problemes.push({ slug: p.slug, gravite: 'erreur', message: 'meta description absente' });
      if (!p.answerCapsule.trim()) problemes.push({ slug: p.slug, gravite: 'erreur', message: 'answer capsule absente' });
      const vides = p.sections.filter((s) => !s.contenu.trim()).map((s) => s.titre);
      if (vides.length) {
        problemes.push({ slug: p.slug, gravite: 'erreur', message: `${vides.length} section(s) sans contenu : ${vides.join(' · ')}` });
      }
      if (p.faq.length < 5) {
        problemes.push({ slug: p.slug, gravite: 'erreur', message: `${p.faq.length} question(s) de FAQ — il en faut au moins 5` });
      }
    } else {
      problemes.push({
        slug: p.slug,
        gravite: 'avertissement',
        message: `brouillon — non routée, non listée au sitemap, absente de la navigation (${p.donneesManquantes.length} donnée(s) à obtenir)`,
      });
    }

    const questions = p.faq.map((q) => q.question.trim());
    if (new Set(questions).size !== questions.length) {
      problemes.push({ slug: p.slug, gravite: 'erreur', message: 'deux questions de FAQ identiques' });
    }
  }

  const slugs = PAGES_SERVICE.map((p) => p.slug);
  for (const s of slugs.filter((x, i) => slugs.indexOf(x) !== i)) {
    problemes.push({ slug: s, gravite: 'erreur', message: 'slug déclaré deux fois' });
  }

  return problemes;
}
