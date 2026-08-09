// ============================================================================
// Copie des données d'un projet Supabase vers un autre, tables du site
// seulement.
//
//   SOURCE=<ref> CIBLE=<ref> node scripts/migration-supabase/02-copier-donnees.mjs
//   SOURCE=<ref> CIBLE=<ref> node scripts/migration-supabase/02-copier-donnees.mjs --appliquer
//
// Les références de projet se passent par l'environnement plutôt qu'en dur :
// celle de la source appartient à une autre application, et ce dépôt est
// public.
//
// À blanc par défaut : il lit, compare et annonce ce qu'il ferait, sans rien
// écrire. C'est le mode dans lequel on le lance la première fois, et autant de
// fois qu'on veut.
//
// Les clés service_role sont demandées au CLI Supabase au moment de l'exécution
// et ne quittent jamais la mémoire du processus : rien n'est écrit sur le
// disque, rien n'apparaît à l'écran. Le CLI doit être connecté
// (`supabase login`) — il l'est déjà sur ce Mac.
//
// Idempotent : tout passe par un upsert sur la clé primaire. Le relancer ne
// duplique rien, et c'est ce qui permet de rejouer le delta après la bascule.
// ============================================================================
import { execFileSync } from 'node:child_process';

const SOURCE = process.env.SOURCE;
const CIBLE = process.env.CIBLE;
const APPLIQUER = process.argv.includes('--appliquer');

if (!SOURCE || !CIBLE) {
  console.error('SOURCE et CIBLE doivent porter les références des deux projets Supabase.');
  console.error('  SOURCE=abcdefghijklmnop CIBLE=qrstuvwxyz012345 node scripts/migration-supabase/02-copier-donnees.mjs');
  process.exit(1);
}
if (SOURCE === CIBLE) {
  console.error('SOURCE et CIBLE désignent le même projet.');
  process.exit(1);
}

// `volume_estimations` n'est pas dans la liste : ses 15 lignes et les 18
// dossiers de photos associés sont des essais internes. La table est créée par
// la migration, elle démarre vide.
//
// L'ordre n'a pas d'importance — aucune clé étrangère ne relie ces tables entre
// elles, c'est ce que le relevé des 94 contraintes du projet a établi.
const TABLES = [
  // `communes` d'abord : la cible en porte une copie figée au 17 avril 2026,
  // 26 communes publiées contre 71 aujourd'hui. L'upsert la remet à niveau.
  'communes',
  'pages',
  'devis_requests',
  'media',
  'gramme_media',
  'site_settings',
];

function cleService(ref) {
  const brut = execFileSync('supabase', ['projects', 'api-keys', '--project-ref', ref, '-o', 'json'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  const cle = JSON.parse(brut).find(k => k.name === 'service_role')?.api_key;
  if (!cle) throw new Error(`clé service_role introuvable pour ${ref} — « supabase login » a-t-il été fait ?`);
  return cle;
}

const projet = (ref, cle) => ({
  ref,
  base: `https://${ref}.supabase.co/rest/v1`,
  entetes: { apikey: cle, Authorization: `Bearer ${cle}`, 'Content-Type': 'application/json' },
});

async function lire(p, table) {
  // Pagination explicite : PostgREST plafonne les réponses, et un plafond
  // silencieux sur une copie donnerait une base incomplète qui a l'air complète.
  const lignes = [];
  const PAS = 1000;
  for (let debut = 0; ; debut += PAS) {
    const r = await fetch(`${p.base}/${table}?select=*&order=id.asc`, {
      headers: { ...p.entetes, Range: `${debut}-${debut + PAS - 1}` },
    });
    if (!r.ok) throw new Error(`lecture ${table} sur ${p.ref} : HTTP ${r.status} ${await r.text()}`);
    const lot = await r.json();
    lignes.push(...lot);
    if (lot.length < PAS) break;
  }
  return lignes;
}

async function compter(p, table) {
  const r = await fetch(`${p.base}/${table}?select=id&limit=0`, {
    headers: { ...p.entetes, Prefer: 'count=exact' },
  });
  if (!r.ok) return null;
  return Number(r.headers.get('content-range')?.split('/')[1] ?? 0);
}

async function upsert(p, table, lignes) {
  const PAQUET = 100;
  for (let i = 0; i < lignes.length; i += PAQUET) {
    const r = await fetch(`${p.base}/${table}`, {
      method: 'POST',
      headers: { ...p.entetes, Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(lignes.slice(i, i + PAQUET)),
    });
    if (!r.ok) throw new Error(`écriture ${table} : HTTP ${r.status} ${await r.text()}`);
  }
}

// --- Exécution ---------------------------------------------------------------
const source = projet(SOURCE, cleService(SOURCE));
const cible = projet(CIBLE, cleService(CIBLE));

console.log(APPLIQUER
  ? 'MODE RÉEL — les données seront écrites dans le projet Gramme.\n'
  : 'À blanc — rien ne sera écrit. Ajouter --appliquer pour exécuter.\n');

console.log('table'.padEnd(18) + 'source'.padStart(8) + 'cible avant'.padStart(13) + 'cible après'.padStart(13));
console.log('─'.repeat(52));

let souci = false;
for (const table of TABLES) {
  const lignes = await lire(source, table);
  const avant = await compter(cible, table);

  if (avant === null) {
    console.log(`${table.padEnd(18)}${String(lignes.length).padStart(8)}${'ABSENTE'.padStart(13)}`);
    console.log(`  → la table n'existe pas encore sur la cible : appliquer d'abord les migrations.`);
    souci = true;
    continue;
  }

  // `pages` a des horodatages nullables côté hub, NOT NULL côté cible : on
  // comble plutôt que de faire échouer la copie sur une ligne ancienne.
  const preparees = lignes.map(l => ({
    ...l,
    ...(table === 'pages' ? {
      created_at: l.created_at ?? new Date().toISOString(),
      updated_at: l.updated_at ?? l.created_at ?? new Date().toISOString(),
    } : {}),
  }));

  if (APPLIQUER) await upsert(cible, table, preparees);
  const apres = APPLIQUER ? await compter(cible, table) : avant;

  console.log(`${table.padEnd(18)}${String(lignes.length).padStart(8)}${String(avant).padStart(13)}${String(apres).padStart(13)}`);

  if (APPLIQUER && apres < lignes.length) {
    console.log(`  → ATTENTION : ${lignes.length - apres} ligne(s) manquante(s) après copie.`);
    souci = true;
  }
}

console.log();
if (souci) {
  console.log('Des points d\'attention ci-dessus. Ne pas basculer les variables Netlify tant qu\'ils ne sont pas levés.');
  process.exitCode = 1;
} else if (APPLIQUER) {
  console.log('Copie terminée. Contrôle suivant : lancer le script à blanc,');
  console.log('les colonnes « source » et « cible après » doivent coïncider.');
} else {
  console.log('Relancer avec --appliquer pour écrire.');
}
