import type { Config } from '@netlify/functions';
// Coordonnées reprises de la source unique du dépôt plutôt que recopiées ici.
// L'entreprise a déménagé de Herstal vers Seraing en août 2026, et ce fichier
// annonçait encore l'ancienne adresse — dans un message qui part chez le
// client. C'est exactement la divergence contre laquelle entreprise.ts met en
// garde dans son propre commentaire d'entête.
import { ENTREPRISE, ADRESSE_COURTE } from '../../src/data/entreprise';

const RESEND_API_URL = 'https://api.resend.com/emails';

interface DevisPayload {
  service: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cityFrom: string;
  cityTo: string;
  date: string;
  volume: string;
  message: string;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return new Response('Email service not configured', { status: 500 });
  }

  let payload: DevisPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { service, firstName, lastName, email, phone, cityFrom, cityTo, date, volume, message } = payload;

  // Les valeurs du formulaire sont écrites telles quelles dans du HTML. Sans
  // échappement, un `<` ou un `&` saisi par un visiteur casse la mise en page,
  // et une balise déposée dans le champ message se retrouve interprétée dans la
  // boîte du destinataire. Rien de spectaculaire dans un mail interne, mais
  // l'accusé de réception part chez le client : autant ne pas lui envoyer du
  // balisage qu'il aurait lui-même écrit.
  const ech = (v: unknown): string =>
    String(v ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  // Une adresse exploitable conditionne deux choses : le `reply_to` du mail
  // interne, et l'existence même de l'accusé de réception.
  const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email ?? '');

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #132073; padding: 24px 32px;">
        <h1 style="color: #F0B800; margin: 0; font-size: 22px;">Nouvelle demande de devis</h1>
        <p style="color: white; margin: 6px 0 0; font-size: 14px;">Déménagements Gramme</p>
      </div>
      <div style="padding: 32px; background: #f9f9f9; border: 1px solid #e5e5e5;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px; width: 40%;">Service</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; font-weight: bold; color: #132073;">${ech(service)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Nom</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; font-weight: bold;">${ech(firstName)} ${ech(lastName)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5;"><a href="mailto:${ech(email)}" style="color: #132073;">${ech(email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Téléphone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5;"><a href="tel:${ech(phone)}" style="color: #132073;">${ech(phone)}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Départ</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5;">${ech(cityFrom)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Arrivée</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5;">${ech(cityTo)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Date souhaitée</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5;">${ech(date || 'Non précisée')}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Volume estimé</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5;">${ech(volume || 'Non précisé')}</td>
          </tr>
          ${message ? `
          <tr>
            <td style="padding: 10px 0; color: #666; font-size: 13px; vertical-align: top;">Message</td>
            <td style="padding: 10px 0; white-space: pre-wrap;">${ech(message)}</td>
          </tr>
          ` : ''}
        </table>
      </div>
      <div style="padding: 16px 32px; background: #132073; text-align: center;">
        <p style="color: #F0B800; margin: 0; font-size: 12px;">© Déménagements Gramme — ${ech(ENTREPRISE.email)}</p>
      </div>
    </div>
  `;

  // Les deux destinataires reçoivent chaque demande, ensemble et dès le premier
  // envoi.
  //
  // Ce n'était pas le cas : `georgescordewiener@gmail.com` ne figurait que dans
  // la seconde tentative, celle qui ne part QUE si la première échoue. Tant que
  // le domaine n'était pas vérifié chez Resend, la première échouait toujours
  // et l'adresse recevait tout — ce qui masquait le problème. Depuis que
  // `demenagements-gramme.be` est vérifié (DKIM `resend._domainkey` et SPF sur
  // `send.`), la première réussit, la seconde ne part plus, et l'adresse ne
  // reçoit plus rien. Un repli n'est pas un destinataire.
  const DESTINATAIRES = ['js@groupespiroux.com', 'georgescordewiener@gmail.com'];

  const attempts = [
    {
      from: 'Gramme Devis <noreply@demenagements-gramme.be>',
      to: DESTINATAIRES,
    },
    // Dernier recours si le domaine vérifié est refusé — panne Resend, quota,
    // ou vérification révoquée. `onboarding@resend.dev` est l'expéditeur de
    // secours de Resend : il ne peut écrire qu'au titulaire du compte, d'où
    // l'unique destinataire. Mieux vaut une notification incomplète que pas de
    // notification du tout.
    {
      from: 'Gramme Devis <onboarding@resend.dev>',
      to: ['georgescordewiener@gmail.com'],
    },
  ];

  let sent = false;
  for (const attempt of attempts) {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...attempt,
        // `reply_to` seulement si l'adresse est exploitable. Toutes les
        // demandes n'en portent pas : le rappel de l'estimateur de volume ne
        // collecte qu'un téléphone. Une adresse vide ou fantaisiste envoyée
        // ici fait rejeter le message ENTIER par Resend — on perdrait la
        // notification pour un champ facultatif.
        ...(emailValide ? { reply_to: email } : {}),
        subject: `Nouveau devis — ${service} — ${firstName} ${lastName}`,
        html: htmlBody,
      }),
    });
    if (res.ok) { sent = true; break; }
    console.error('Resend error:', await res.text());
  }

  if (!sent) {
    return new Response('Email send failed', { status: 502 });
  }

  // ---------------------------------------------------------------------------
  // Accusé de réception au demandeur
  //
  // Envoyé APRÈS la notification interne, et seulement si celle-ci est partie :
  // c'est elle qui déclenche le rappel commercial, elle passe donc d'abord. Si
  // Resend refuse tout, on ne confirme rien à un client dont la demande n'a
  // prévenu personne.
  //
  // Pas de repli sur `onboarding@resend.dev` ici : cet expéditeur de secours ne
  // peut écrire qu'au titulaire du compte Resend, jamais à un client. Une seule
  // tentative, depuis le domaine vérifié.
  //
  // Son échec ne change pas la réponse renvoyée au site. La demande est en base
  // et l'entreprise est prévenue : l'essentiel a eu lieu. Renvoyer une erreur
  // ferait croire au visiteur que sa demande n'est pas passée.
  const accuseEnvoye = await envoyerAccuse();

  return new Response(JSON.stringify({ ok: true, accuse: accuseEnvoye }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

  async function envoyerAccuse(): Promise<boolean> {
    // Le rappel demandé depuis l'estimateur de volume ne collecte qu'un
    // téléphone : il n'y a personne à qui écrire, et ce n'est pas une anomalie.
    if (!emailValide) return false;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #132073; padding: 24px 32px;">
          <h1 style="color: #F0B800; margin: 0; font-size: 22px;">Nous avons bien reçu votre demande</h1>
          <p style="color: white; margin: 6px 0 0; font-size: 14px;">Déménagements Gramme — depuis 1948</p>
        </div>
        <div style="padding: 32px; background: #f9f9f9; border: 1px solid #e5e5e5;">
          <p style="margin: 0 0 16px; font-size: 15px; color: #333;">Bonjour ${ech(firstName)},</p>
          <p style="margin: 0 0 16px; font-size: 15px; color: #333; line-height: 1.6;">
            Merci pour votre demande de devis. Elle nous est bien parvenue et un membre
            de notre équipe vous recontacte <strong>sous 24 heures ouvrables</strong>.
          </p>
          <p style="margin: 0 0 24px; font-size: 15px; color: #333; line-height: 1.6;">
            Si votre déménagement est urgent, n'hésitez pas à nous appeler directement
            au <a href="tel:${ech(ENTREPRISE.telephone.lien)}" style="color: #132073; font-weight: bold;">${ech(ENTREPRISE.telephone.affichage)}</a>.
          </p>

          <p style="margin: 0 0 8px; font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Récapitulatif de votre demande</p>
          <table style="width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e5e5;">
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 13px; width: 42%;">Service</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${ech(service)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 13px;">Départ</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${ech(cityFrom)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 13px;">Arrivée</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${ech(cityTo)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 13px;">Date souhaitée</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${ech(date || 'Non précisée')}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #666; font-size: 13px;">Volume estimé</td>
              <td style="padding: 10px 14px; font-size: 14px;">${ech(volume || 'Non précisé')}</td>
            </tr>
          </table>

          <p style="margin: 20px 0 0; font-size: 13px; color: #888; line-height: 1.6;">
            Une erreur dans ce récapitulatif ? Répondez simplement à ce message,
            il arrive directement chez nous.
          </p>
        </div>
        <div style="padding: 16px 32px; background: #132073; text-align: center;">
          <p style="color: #F0B800; margin: 0 0 4px; font-size: 12px;">Déménagements Gramme — ${ech(ADRESSE_COURTE)}</p>
          <p style="color: #ffffff; margin: 0; font-size: 12px;">${ech(ENTREPRISE.telephone.affichage)} — ${ech(ENTREPRISE.email)}</p>
        </div>
      </div>
    `;

    try {
      const res = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Déménagements Gramme <noreply@demenagements-gramme.be>',
          to: [email],
          // Une réponse du client doit atterrir dans la boîte de l'entreprise,
          // pas dans un `noreply` que personne ne relève.
          reply_to: ENTREPRISE.email,
          subject: 'Votre demande de devis — Déménagements Gramme',
          html,
        }),
      });
      if (!res.ok) {
        console.error('Resend error (accusé de réception):', await res.text());
        return false;
      }
      return true;
    } catch (e) {
      console.error('Resend injoignable (accusé de réception):', e);
      return false;
    }
  }
}

export const config: Config = {
  path: '/api/send-devis-email',
};
