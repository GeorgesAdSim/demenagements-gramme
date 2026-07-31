// scripts/appliquer-distances.mjs
//
// Applique scripts/distances.mjs aux 84 communes : réécrit src/data/communes.json
// et produit le SQL correspondant, depuis la même source et en une seule passe.
//
// Usage :
//   node scripts/appliquer-distances.mjs
//
// Pourquoi ce script existe séparément du générateur de lots : une distance ne
// dépend pas du lot éditorial auquel une commune appartient, elle dépend de
// l'adresse du dépôt. Quand cette adresse change, ce sont les 84 qui se refont
// d'un coup — y compris celles des arrondissements dont le lot n'a pas encore
// été écrit. Passer par les lots aurait laissé Verviers avec l'ancienne origine
// pendant des semaines, sans que rien ne le signale.
//
// Ce script NE TOUCHE PAS au statut. Il refuse d'ailleurs de vider une distance
// sur une commune publiée : la contrainte communes_publiee_mesuree la rejetterait
// en base, et une page en ligne perdrait son chiffre sans prévenir.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DISTANCES, ORIGINE, DATE_RELEVE, controlerVitesse } from './distances.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Ordre des clés imposé par scripts/sync-communes.mjs. */
const ORDRE = ['id', 'nom', 'arrondissement', 'codesPostaux', 'distanceDepotKm',
  'tempsTrajetEstimeMin', 'villages', 'communesVoisines', 'introductionLocale',
  'informationsLocales', 'dateVerification', 'pageExistante', 'statut'];
const OPTIONNELS = ['arrondissement', 'introductionLocale', 'dateVerification', 'pageExistante'];

const q = (s) => `'${String(s).replace(/'/g, "''")}'`;

async function main() {
  const erreurs = [];
  const cheminJson = path.join(root, 'src/data/communes.json');
  const base = JSON.parse(await readFile(cheminJson, 'utf-8'));
  const parId = new Map(base.communes.map((c) => [c.id, c]));

  for (const id of Object.keys(DISTANCES)) {
    if (!parId.has(id)) erreurs.push(`${id} : présente dans le relevé mais absente de la table`);
  }

  const changes = [];
  for (const c of base.communes) {
    const entree = DISTANCES[c.id];

    if (!entree) {
      // Une commune publiée doit garder une distance : la contrainte SQL
      // l'exige, et sa page l'affiche.
      if (c.statut === 'published') {
        erreurs.push(`${c.id} : publiée mais absente du relevé — sa distance serait perdue`);
      }
      continue;
    }

    const m = controlerVitesse(c.id, entree, erreurs);
    if (c.distanceDepotKm !== m.km || c.tempsTrajetEstimeMin !== m.min) {
      changes.push({
        id: c.id, nom: c.nom, statut: c.statut,
        avant: [c.distanceDepotKm, c.tempsTrajetEstimeMin],
        apres: [m.km, m.min],
      });
    }
    c.distanceDepotKm = m.km;
    c.tempsTrajetEstimeMin = m.min;
  }

  if (erreurs.length) {
    console.error(`\n  ${erreurs.length} ERREUR(S) — rien n'a été écrit :`);
    for (const e of erreurs) console.error(`    ✗ ${e}`);
    console.error('');
    process.exit(1);
  }

  const communes = base.communes
    .map((c) => {
      const out = {};
      for (const k of ORDRE) {
        const v = c[k];
        if (v === undefined) continue;
        if (OPTIONNELS.includes(k) && !v) continue;
        if (k === 'informationsLocales' && !v?.length) continue;
        out[k] = v;
      }
      return out;
    })
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));

  await writeFile(cheminJson, JSON.stringify({ communes }, null, 2) + '\n', 'utf-8');

  const majs = Object.entries(DISTANCES).map(([id, [km, min]]) =>
    `update public.communes set distance_depot_km = ${km}, temps_trajet_estime_min = ${min} where id = ${q(id)};`
  );

  const sql = `-- ============================================================================
-- Distances depuis le dépôt — ${Object.keys(DISTANCES).length} communes
--
-- ⚠️ FICHIER GÉNÉRÉ par scripts/appliquer-distances.mjs — ne pas modifier à la
-- main. Corrige scripts/distances.mjs et relance le script.
--
-- Origine : ${ORIGINE}
-- Relevé  : ${DATE_RELEVE}, Google Maps, premier itinéraire proposé.
--
-- C'est le dépôt d'où partent les camions, et non le siège social rue des
-- Naiveux à Herstal, d'où venaient les 37 premiers relevés. Ceux-là annonçaient
-- Herstal à 0 km et décrivaient mal les frais d'approche.
--
-- ⚠️ À exécuter AVANT de merger la branche. Si Netlify build alors que la table
-- porte encore les anciennes valeurs, sync-communes réécrira le JSON avec
-- celles-ci — sans erreur, puisque c'est son comportement normal.
--
-- ${changes.length} commune(s) changent de valeur.
-- ============================================================================

begin;

${majs.join('\n')}

commit;

-- Contrôle : aucune commune publiée ne doit avoir de distance nulle.
select count(*) as publiees_sans_distance
from public.communes
where statut = 'published' and (distance_depot_km is null or temps_trajet_estime_min is null);
`;

  await writeFile(path.join(root, 'supabase/seed', 'distances.sql'), sql, 'utf-8');

  console.log(`\n  Origine : ${ORIGINE} (relevé du ${DATE_RELEVE})`);
  console.log(`  ${Object.keys(DISTANCES).length} communes · ${changes.length} valeur(s) modifiée(s)\n`);

  const notables = changes
    .map((c) => ({ ...c, ecart: c.avant[0] === null ? null : c.apres[0] - c.avant[0] }))
    .sort((a, b) => Math.abs(b.ecart ?? 0) - Math.abs(a.ecart ?? 0));

  for (const c of notables.filter((x) => x.ecart !== null).slice(0, 6)) {
    console.log(`    ${c.id.padEnd(24)} ${c.avant[0]} → ${c.apres[0]} km  (${c.ecart > 0 ? '+' : ''}${c.ecart})  ${c.statut}`);
  }
  const nouvelles = notables.filter((x) => x.ecart === null).length;
  if (nouvelles) console.log(`    … et ${nouvelles} commune(s) mesurée(s) pour la première fois.`);

  console.log(`\n  JSON → src/data/communes.json`);
  console.log(`  SQL  → supabase/seed/distances.sql\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
