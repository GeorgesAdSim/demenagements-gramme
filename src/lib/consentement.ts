/**
 * Consentement aux cookies — source unique de la décision.
 *
 * Le bandeau précédent écrivait « accepted » ou « refused » dans le
 * localStorage, et **personne ne lisait cette valeur**. Aucun script n'était
 * conditionné dessus : le bouton « Refuser » ne refusait rien. C'était sans
 * conséquence tant qu'aucun traceur n'existait ; avec Tag Manager en place,
 * c'en est une.
 *
 * Ce module fait le lien entre la décision de l'utilisateur et Consent Mode v2.
 * L'état par défaut est posé dans index.html, avant le chargement du conteneur —
 * ici on ne fait que le mettre à jour.
 */

export const CLE_CONSENTEMENT = 'gramme_cookie_consent';

export type Consentement = 'accepted' | 'refused' | null;

type Gtag = (...args: unknown[]) => void;

interface FenetreMesuree extends Window {
  dataLayer?: unknown[];
  gtag?: Gtag;
}

function gtag(...args: unknown[]): void {
  const w = window as FenetreMesuree;
  // `gtag` est défini par le script d'index.html. En son absence — test unitaire,
  // rendu serveur — on pousse directement dans la file, que GTM lira à son tour.
  if (typeof w.gtag === 'function') w.gtag(...args);
  else (w.dataLayer = w.dataLayer || []).push(args);
}

/** Décision mémorisée, ou `null` si l'utilisateur ne s'est pas encore prononcé. */
export function lireConsentement(): Consentement {
  try {
    const v = localStorage.getItem(CLE_CONSENTEMENT);
    return v === 'accepted' || v === 'refused' ? v : null;
  } catch {
    // Navigation privée stricte : on considère qu'aucun choix n'a été fait, et
    // rien n'est mesuré. Le refus est le repli, jamais l'acceptation.
    return null;
  }
}

/**
 * Enregistre la décision et la transmet à Consent Mode.
 *
 * `functionality_storage` et `security_storage` restent accordés dans les deux
 * cas : ce sont les cookies techniques que le site utilise pour fonctionner, et
 * qui ne relèvent pas du consentement.
 */
export function enregistrerConsentement(decision: 'accepted' | 'refused'): void {
  try {
    localStorage.setItem(CLE_CONSENTEMENT, decision);
  } catch { /* on applique quand même la décision pour la session en cours */ }

  const accorde = decision === 'accepted' ? 'granted' : 'denied';
  gtag('consent', 'update', {
    analytics_storage: accorde,
    ad_storage: accorde,
    ad_user_data: accorde,
    ad_personalization: accorde,
  });

  // Événement dédié : il permet de déclencher une balise dans GTM au moment
  // exact du consentement, sans attendre la page suivante.
  (window as FenetreMesuree).dataLayer?.push({
    event: 'consentement_cookies',
    consentement_mesure: decision === 'accepted' ? 'accorde' : 'refuse',
  });
}

/**
 * Efface la décision pour que la bannière se represente.
 *
 * Le RGPD exige qu'un consentement puisse être retiré aussi simplement qu'il a
 * été donné : c'est ce que sert le lien « Gérer mes cookies » du pied de page.
 * Le retrait remet immédiatement la mesure à l'arrêt, sans attendre le choix
 * suivant.
 */
export function reinitialiserConsentement(): void {
  try {
    localStorage.removeItem(CLE_CONSENTEMENT);
  } catch { /* rien à effacer */ }
  gtag('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.dispatchEvent(new CustomEvent('gramme:rouvrir-consentement'));
}
