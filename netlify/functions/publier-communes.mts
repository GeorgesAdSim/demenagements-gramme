// netlify/functions/publier-communes.mts
//
// Déclenche un déploiement Netlify depuis le back-office.
//
// Pourquoi une fonction serveur plutôt qu'un appel direct depuis l'admin :
// l'URL d'un build hook Netlify EST le secret. Quiconque la connaît peut
// déclencher des déploiements en boucle. Exposée dans le bundle via une
// variable VITE_, elle serait lisible par n'importe quel visiteur — y compris
// sur les pages publiques, puisque Vite inline ces variables à la compilation.
// Ici elle reste côté serveur, et l'appelant doit prouver qu'il est connecté au
// back-office.
import type { Config } from '@netlify/functions';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

function repondre(statut: number, corps: Record<string, unknown>): Response {
  return new Response(JSON.stringify(corps), { status: statut, headers: JSON_HEADERS });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return repondre(405, { erreur: 'Méthode non autorisée.' });
  }

  const hook = process.env.NETLIFY_BUILD_HOOK_URL;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseCle = process.env.VITE_SUPABASE_ANON_KEY;

  if (!hook) {
    return repondre(500, {
      erreur: 'Publication non configurée : la variable NETLIFY_BUILD_HOOK_URL est absente.',
    });
  }
  if (!supabaseUrl || !supabaseCle) {
    return repondre(500, {
      erreur: 'Publication non configurée : les variables Supabase sont absentes côté serveur.',
    });
  }

  // Le jeton est celui de la session Supabase du back-office. On ne le décode
  // pas nous-mêmes : une vérification de signature écrite à la main est le
  // genre de code où une erreur passe inaperçue. On demande à Supabase qui est
  // le porteur du jeton, ce qui valide signature et expiration du même coup.
  const entete = req.headers.get('authorization') ?? '';
  const jeton = entete.startsWith('Bearer ') ? entete.slice(7) : '';
  if (!jeton) {
    return repondre(401, { erreur: 'Authentification requise.' });
  }

  let utilisateur: string | undefined;
  try {
    const rep = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: supabaseCle, Authorization: `Bearer ${jeton}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!rep.ok) {
      return repondre(401, { erreur: 'Session expirée ou invalide. Reconnecte-toi.' });
    }
    utilisateur = (await rep.json())?.email;
  } catch {
    return repondre(503, { erreur: "Impossible de vérifier la session pour l'instant." });
  }

  try {
    // Le corps du POST est repris tel quel par Netlify comme « trigger title »
    // dans la liste des déploiements : on y met qui a publié, ce qui rend
    // l'historique lisible plutôt qu'une suite de builds anonymes.
    const rep = await fetch(hook, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ trigger_title: `Publication back-office — ${utilisateur ?? 'inconnu'}` }),
      signal: AbortSignal.timeout(15000),
    });
    if (!rep.ok) {
      return repondre(502, { erreur: `Netlify a refusé le déclenchement (HTTP ${rep.status}).` });
    }
  } catch {
    return repondre(503, { erreur: 'Netlify est injoignable pour le moment. Réessaie dans un instant.' });
  }

  return repondre(202, {
    ok: true,
    // 202 et non 200 : le déploiement est accepté, pas terminé. L'interface doit
    // dire « en cours » et non « publié », sous peine de laisser croire que les
    // modifications sont en ligne alors que le build démarre à peine.
    message: 'Déploiement lancé. Les modifications seront en ligne dans deux à trois minutes.',
  });
}

export const config: Config = {
  path: '/api/publier-communes',
};
