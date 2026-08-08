/**
 * Mesure des conversions — point unique d'envoi vers la couche de données.
 *
 * GA4 sait déjà compter les vues de page. Ce qu'il ne sait pas, c'est combien
 * de visiteurs demandent un devis : sans ça, on arbitre les priorités du site
 * sur du trafic, jamais sur des demandes.
 *
 * Trois événements sortent d'ici, et de nulle part ailleurs :
 *   generate_lead     — le formulaire de devis est parti, et la base l'a accepté
 *   clic_telephone    — un lien `tel:` a été suivi
 *   estimation_photos — départ vers l'estimateur de volume
 *
 * Le formulaire de devis s'insère depuis quatre fichiers qui ne partagent aucun
 * code. D'où ce module : l'appel est écrit une fois, et une correction de
 * paramètre ne se fait pas en quatre endroits qu'on finirait par désaccorder.
 */

import { lireConsentement } from './consentement';

interface FenetreMesuree extends Window {
  dataLayer?: unknown[];
}

type Parametres = Record<string, string | number | undefined>;

/**
 * D'où vient la demande de devis. Sert à savoir lequel des quatre formulaires
 * convertit, et donc lequel mérite d'être travaillé.
 */
export type SourceDevis =
  | 'formulaire-contact'   // ContactForm — accueil, communes, zones, satellites, services
  | 'contact-devis'        // /contact-devis
  | 'contact'              // /contact
  | 'estimation-rappel';   // rappel demandé depuis l'estimateur de volume

/** Le lien vers l'estimateur existe à trois endroits, qui ne valent pas pareil. */
export type EmplacementEstimation = 'hero' | 'formulaire' | 'navigation';

/**
 * Pousse un événement, ou ne fait rien.
 *
 * Deux verrous. Le rendu serveur d'abord : `scripts/prerender.mjs` exécute le
 * même code sans `window`. Le consentement ensuite — Consent Mode retient déjà
 * les balises côté Google, mais un `dataLayer` qui se remplit quand personne
 * n'a rien accordé n'apporte rien et rend le débogage illisible.
 *
 * `null` — visiteur qui ne s'est pas encore prononcé — vaut refus, comme
 * partout ailleurs dans le site : le refus est le repli, jamais l'acceptation.
 * Conséquence assumée : une demande envoyée bannière encore ouverte n'est pas
 * comptée.
 */
function pousser(evenement: string, parametres: Parametres = {}): void {
  if (typeof window === 'undefined') return;
  if (lireConsentement() !== 'accepted') return;

  const w = window as FenetreMesuree;
  (w.dataLayer = w.dataLayer || []).push({
    event: evenement,
    page_origine: window.location.pathname,
    ...parametres,
  });
}

/**
 * Demande de devis enregistrée.
 *
 * À n'appeler **qu'après** le retour sans erreur de l'insertion Supabase :
 * comptée avant, la conversion inclurait tous les envois qui échouent.
 *
 * Aucun paramètre ne doit identifier la personne — ni e-mail, ni téléphone, ni
 * adresse. GA4 l'interdit, et c'est une donnée personnelle.
 */
export function mesurerDevisEnvoye(source: SourceDevis, serviceType?: string): void {
  pousser('generate_lead', { source_formulaire: source, service_type: serviceType });
}

/** Départ vers l'estimateur de volume — le différenciateur du site. */
export function mesurerEstimationPhotos(emplacement: EmplacementEstimation): void {
  pousser('estimation_photos', { emplacement });
}

/**
 * Installe l'écouteur des clics sur les liens `tel:`.
 *
 * Le numéro apparaît dans vingt fichiers, dont un qui le construit à la volée.
 * Les instrumenter un par un, c'est vingt occasions d'en oublier un et une
 * certitude que le prochain lien ajouté ne sera pas couvert. Un écouteur
 * délégué sur le document les prend tous, présents et futurs.
 *
 * Retourne la fonction de retrait, à rendre à `useEffect`.
 */
export function installerMesureTelephone(): () => void {
  const auClic = (ev: MouseEvent) => {
    const cible = ev.target;
    if (!(cible instanceof Element)) return;
    const lien = cible.closest<HTMLAnchorElement>('a[href^="tel:"]');
    if (!lien) return;
    pousser('clic_telephone', { numero_appele: lien.getAttribute('href')?.slice(4) });
  };

  document.addEventListener('click', auClic);
  return () => document.removeEventListener('click', auClic);
}
