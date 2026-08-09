/**
 * Notification e-mail d'une demande de devis.
 *
 * Pourquoi ce fichier existe : quatre écrans insèrent dans `devis_requests` —
 * le formulaire commun (accueil, pages communes, satellites), /contact,
 * /contact-devis et le rappel de l'estimateur de volume. Un seul appelait la
 * fonction d'envoi. Les trois autres enregistraient la demande et affichaient
 * « merci » sans prévenir personne, depuis toujours.
 *
 * Personne ne s'en est aperçu parce que rien ne le disait : la demande est bien
 * en base, le visiteur voit une confirmation, et l'échec d'envoi n'apparaît
 * nulle part. Recopier l'appel dans les trois écrans manquants aurait rétabli
 * le service en laissant la cause en place — le quatrième formulaire ajouté un
 * jour aurait reproduit la panne. D'où un point d'appel unique.
 *
 * L'envoi reste volontairement « au mieux » : il ne bloque pas la confirmation
 * et n'échoue jamais bruyamment côté visiteur. La demande est déjà en base, qui
 * reste la source de vérité ; faire échouer l'écran parce qu'un e-mail n'est
 * pas parti perdrait un client pour rien.
 *
 * En revanche il ne se tait plus : un refus s'écrit dans la console du
 * navigateur. C'est peu, mais c'est la différence entre une panne qu'on
 * diagnostique en une minute et une demi-journée de recherche.
 */

export interface DevisANotifier {
  /** Libellé du service, tel qu'il doit apparaître dans l'e-mail. */
  service: string;
  firstName: string;
  lastName: string;
  /** Adresse du demandeur. Sert de `reply_to` si elle est exploitable. */
  email: string;
  phone: string;
  cityFrom: string;
  cityTo: string;
  date: string;
  volume: string;
  message: string;
}

export function notifierDevis(devis: DevisANotifier): void {
  fetch('/api/send-devis-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(devis),
  })
    .then(async (rep) => {
      if (!rep.ok) {
        console.error(
          `[devis] notification refusée (HTTP ${rep.status}) :`,
          await rep.text().catch(() => ''),
        );
      }
    })
    .catch((e) => {
      // Typiquement : page servie depuis un serveur de développement, où
      // /api/send-devis-email n'existe pas. La demande est en base malgré tout.
      console.error('[devis] notification injoignable :', e);
    });
}
