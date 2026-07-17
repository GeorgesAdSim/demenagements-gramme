import type { Config } from '@netlify/functions';

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
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; font-weight: bold; color: #132073;">${service}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Nom</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; font-weight: bold;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5;"><a href="mailto:${email}" style="color: #132073;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Téléphone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5;"><a href="tel:${phone}" style="color: #132073;">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Départ</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5;">${cityFrom}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Arrivée</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5;">${cityTo}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Date souhaitée</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5;">${date || 'Non précisée'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Volume estimé</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5;">${volume || 'Non précisé'}</td>
          </tr>
          ${message ? `
          <tr>
            <td style="padding: 10px 0; color: #666; font-size: 13px; vertical-align: top;">Message</td>
            <td style="padding: 10px 0; white-space: pre-wrap;">${message}</td>
          </tr>
          ` : ''}
        </table>
      </div>
      <div style="padding: 16px 32px; background: #132073; text-align: center;">
        <p style="color: #F0B800; margin: 0; font-size: 12px;">© Déménagements Gramme — contact@demenagements-gramme.be</p>
      </div>
    </div>
  `;

  // Tente d'abord le domaine vérifié ; si pas encore vérifié, fallback
  // sur resend.dev vers l'adresse du compte (seule autorisée avant vérif)
  const attempts = [
    {
      from: 'Gramme Devis <noreply@demenagements-gramme.be>',
      to: ['contact@demenagements-gramme.be'],
    },
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
        reply_to: email,
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

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const config: Config = {
  path: '/api/send-devis-email',
};
