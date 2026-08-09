// ============================================================================
// Contrôle d'après-bascule : le site en ligne parle-t-il au bon projet, et les
// trois flux publics tiennent-ils ?
//
//   node scripts/migration-supabase/03-verifier-bascule.mjs <ref-attendue>
//
// À lancer APRÈS avoir changé les variables Netlify et laissé le déploiement se
// terminer. Le script ne fait aucune supposition : il télécharge le bundle
// réellement servi, en extrait l'URL Supabase et la clé anonyme, et interroge
// le projet avec elles. C'est la seule façon de savoir ce que le site fait
// vraiment — une variable changée dans Netlify ne prouve pas qu'un build l'ait
// reprise.
//
// Aucune donnée personnelle n'est rapatriée : comptages seulement, et la sonde
// d'insertion est volontairement invalide pour qu'aucune ligne ne soit créée.
// ============================================================================

const SITE = 'https://www.demenagements-gramme.be';
const ATTENDUE = process.argv[2];

if (!ATTENDUE) {
  console.error('Usage : node scripts/migration-supabase/03-verifier-bascule.mjs <ref-du-projet-attendu>');
  process.exit(1);
}

let echecs = 0;
const controle = (ok, libelle, detail = '') => {
  if (!ok) echecs++;
  console.log(`  ${ok ? 'ok   ' : 'ÉCHEC'} ${libelle}${detail ? '   ' + detail : ''}`);
};

// --- 1. Ce que le bundle servi contient réellement --------------------------
const html = await (await fetch(SITE, { cache: 'no-store' })).text();
const asset = html.match(/src="(\/assets\/index-[^"]+\.js)"/)?.[1];
if (!asset) { console.error('Bundle introuvable dans le HTML de la page d\'accueil.'); process.exit(1); }

const bundle = await (await fetch(`${SITE}${asset}`, { cache: 'no-store' })).text();
const url = bundle.match(/https:\/\/([a-z]{20})\.supabase\.co/)?.[1];
const cle = bundle.match(/eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/)?.[0];

console.log(`Bundle servi : ${asset}`);
console.log(`Projet visé  : ${url ?? 'introuvable'}\n`);

controle(url === ATTENDUE, 'le site pointe sur le projet attendu',
  url === ATTENDUE ? '' : `→ ${url}, un ancien build est encore servi`);
if (url !== ATTENDUE || !cle) {
  console.log('\nInutile d\'aller plus loin tant que le bundle ne vise pas le bon projet.');
  process.exit(1);
}

const API = `https://${url}.supabase.co/rest/v1`;
const H = { apikey: cle, Authorization: `Bearer ${cle}`, 'Content-Type': 'application/json' };
const compter = r => Number(r.headers.get('content-range')?.split('/')[1] ?? -1);

console.log('\n── les trois flux publics ──');

// --- 2. Le build lit les communes -------------------------------------------
const communes = await fetch(`${API}/communes?select=id&limit=0`, { headers: { ...H, Prefer: 'count=exact' } });
controle(compter(communes) >= 80, 'communes lisibles (le build en dépend)', `${compter(communes)} lignes`);

// --- 3. Le site lit sa page d'accueil ---------------------------------------
const accueil = await fetch(
  `${API}/pages?select=content&slug=eq.accueil&page_type=eq.site&status=eq.published&limit=0`,
  { headers: { ...H, Prefer: 'count=exact' } });
controle(compter(accueil) === 1, 'la page accueil répond', `${compter(accueil)} ligne`);

const pages = await fetch(`${API}/pages?select=id&limit=0`, { headers: { ...H, Prefer: 'count=exact' } });
controle(compter(pages) > 0 && compter(pages) < 20,
  'seules les pages publiées sont exposées', `${compter(pages)} sur 43 en base`);

// --- 4. Le formulaire dépose, et rien d'autre -------------------------------
// La sonde doit prouver que le chemin d'insertion est ouvert SANS créer de
// demande fantôme. On envoie donc une charge incomplète : `firstname`,
// `lastname`, `email`, `phone` et les deux villes sont NOT NULL, l'insertion
// ne peut pas aboutir.
//
// Le choix du motif d'échec compte. Une première version s'appuyait sur une
// contrainte CHECK sur `volume` — mais cette contrainte n'existe que sur le
// projet cible, écrite par la migration. Lancée contre le projet d'origine, la
// sonde a créé une vraie ligne. Une sonde ne doit jamais reposer sur ce
// qu'elle est chargée de vérifier ; NOT NULL, lui, précède la migration.
//
// Lecture du résultat :
//   23502  violation de NOT NULL  → le privilège existe, le chemin est ouvert
//   42501  permission denied      → le chemin est fermé
const depot = await fetch(`${API}/devis_requests`, {
  method: 'POST', headers: { ...H, Prefer: 'return=representation' },
  body: JSON.stringify({ service_type: 'demenagement' }),
});
const corpsDepot = await depot.json().catch(() => ({}));
controle(corpsDepot.code === '23502', 'le formulaire de devis peut déposer',
  `code ${corpsDepot.code ?? depot.status}`);

// Filet : si un jour toutes les colonnes devenaient nullables, la sonde
// créerait une ligne. On ne peut pas la supprimer avec la clé publique — le
// moins qu'on puisse faire est de dire laquelle.
if (depot.ok) {
  const id = Array.isArray(corpsDepot) ? corpsDepot[0]?.id : corpsDepot?.id;
  console.log(`  ⚠ la sonde a créé une ligne dans devis_requests — à supprimer : id ${id}`);
  echecs++;
}

const lecture = await fetch(`${API}/devis_requests?select=id&limit=0`, { headers: H });
controle(lecture.status === 401 || lecture.status === 403,
  'les demandes de devis restent illisibles', `HTTP ${lecture.status}`);

for (const t of ['site_settings', 'media', 'gramme_media', 'volume_estimations', 'admin_users']) {
  const r = await fetch(`${API}/${t}?select=id&limit=0`, { headers: H });
  controle(r.status === 401 || r.status === 403, `${t} inaccessible`, `HTTP ${r.status}`);
}

console.log();
if (echecs) {
  console.log(`${echecs} contrôle(s) en échec. Revenir aux anciennes variables Netlify est`);
  console.log('immédiat : le projet d\'origine n\'a pas été touché.');
  process.exitCode = 1;
} else {
  console.log('Bascule confirmée. Le projet d\'origine peut rester en place quelques jours,');
  console.log('le temps de pouvoir revenir en arrière en changeant deux variables.');
}
