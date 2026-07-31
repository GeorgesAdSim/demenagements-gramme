// scripts/generer-lot-communes.mjs
//
// Prépare un lot de communes à la publication : écrit src/data/communes.json et
// le SQL correspondant, DEPUIS LA MÊME SOURCE, en une seule passe. C'est le
// point : la table Supabase est la source de vérité, mais le build consomme le
// JSON. Générer les deux séparément, c'est accepter qu'ils divergent un jour
// sans que rien ne le signale.
//
// Usage :
//   node scripts/generer-lot-communes.mjs waremme
//
// Le nom du lot désigne scripts/lots/<nom>.mjs. Le script est relançable : à
// données identiques il réécrit exactement le même fichier, donc un diff vide.
//
// ─────────────────────────────────────────────────────────────────────────────
// Ce que ce script refuse de faire
//
// Il n'écrit JAMAIS `statut` depuis le fichier de lot. Le statut est déduit des
// données présentes, en rejouant les contraintes CHECK de la table. Une commune
// à qui il manque une distance ou une troisième limitrophe retombe en brouillon
// toute seule, sans qu'on ait à y penser — et sans qu'un oubli puisse la faire
// passer en publication.
//
// Il refuse aussi un relevé de distance dont la vitesse implicite sort de la
// plage observée, sauf mention explicite de confirmation. Voir CONTROLE_VITESSE.
// ─────────────────────────────────────────────────────────────────────────────
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DISTANCES, ORIGINE, controlerVitesse, CONTROLE_VITESSE } from './distances.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Les distances et leur contrôle de cohérence vivent dans scripts/distances.mjs.
// Hors plage, le script ÉCHOUE, à moins que la ligne du relevé ne porte une
// justification écrite : une valeur aberrante ne doit jamais être retenue par
// distraction, seulement par décision relisible.

/** Ordre des clés imposé par scripts/sync-communes.mjs — un écart produirait un diff à chaque build. */
const ORDRE = ['id', 'nom', 'arrondissement', 'codesPostaux', 'distanceDepotKm',
  'tempsTrajetEstimeMin', 'villages', 'communesVoisines', 'introductionLocale',
  'informationsLocales', 'dateVerification', 'pageExistante', 'statut'];

/** Champs optionnels que sync-communes n'écrit pas quand ils sont vides. */
const OPTIONNELS = ['arrondissement', 'introductionLocale', 'dateVerification', 'pageExistante'];

const erreurs = [];

/**
 * Rejoue les contraintes CHECK de public.communes. Renvoie la liste des raisons
 * de NE PAS publier — vide si la commune est publiable.
 *
 * Volontairement une copie des règles SQL plutôt qu'un import : ce script doit
 * pouvoir tourner sans accès réseau à la base, et la duplication est ici le
 * moindre mal. `scripts/verify-build.mjs` contrôle l'accord des deux au build.
 */
function raisonsDeNePasPublier(c) {
  const r = [];
  const n = c.communesVoisines.length;
  if (n < 3 || n > 5) r.push(`${n} limitrophe(s) en province de Liège — il en faut 3 à 5`);
  if (c.distanceDepotKm === null) r.push('distance depuis le dépôt non relevée');
  if (c.tempsTrajetEstimeMin === null) r.push('temps de trajet non relevé');
  if (!c.introductionLocale?.trim() && !c.informationsLocales?.length && !c.villages.length) {
    r.push('aucun contenu local (ni introduction, ni informations, ni villages)');
  }
  return r;
}

const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const tableau = (a) => (a.length ? `array[${a.map(q).join(', ')}]::text[]` : `'{}'`);
const nombre = (n) => (n === null ? 'null' : String(n));

async function main() {
  const nomLot = process.argv[2];
  if (!nomLot) {
    console.error('usage : node scripts/generer-lot-communes.mjs <nom-du-lot>');
    process.exit(1);
  }

  const cheminLot = path.join(root, 'scripts/lots', `${nomLot}.mjs`);
  let lot;
  try {
    lot = await import(new URL(`file://${cheminLot}`).href);
  } catch (e) {
    console.error(`lot « ${nomLot} » introuvable ou illisible : ${e.message}`);
    process.exit(1);
  }
  // Les distances ne viennent PAS du lot : elles ont une source unique, parce
  // qu'elles dépendent d'une seule adresse et se refont toutes ensemble.
  const { DATE_VERIFICATION, DONNEES } = lot;

  const cheminJson = path.join(root, 'src/data/communes.json');
  const base = JSON.parse(await readFile(cheminJson, 'utf-8'));
  const parId = new Map(base.communes.map((c) => [c.id, c]));

  // ── application du lot
  const rapport = [];
  for (const [id, d] of Object.entries(DONNEES)) {
    const c = parId.get(id);
    if (!c) { erreurs.push(`${id} : absente de la table des 84 communes`); continue; }

    const mesure = DISTANCES[id] ? controlerVitesse(id, DISTANCES[id], erreurs) : null;

    if (d.voisines.includes(id)) erreurs.push(`${id} : se cite elle-même comme limitrophe`);

    c.codesPostaux = [...d.cp].sort();
    c.villages = d.villages;
    c.communesVoisines = d.voisines;
    c.distanceDepotKm = mesure ? mesure.km : null;
    c.tempsTrajetEstimeMin = mesure ? mesure.min : null;
    if (d.intro) c.introductionLocale = d.intro;
    if (d.infos?.length) c.informationsLocales = d.infos;

    const raisons = raisonsDeNePasPublier(c);
    c.statut = raisons.length ? 'draft' : 'published';
    if (raisons.length) delete c.dateVerification;
    else c.dateVerification = DATE_VERIFICATION;

    rapport.push({ id, statut: c.statut, raisons, mesure });
  }

  // ── intégrité globale : toute voisine citée doit exister, sinon le trigger
  // Postgres rejettera la transaction entière et le SQL sera inapplicable.
  for (const c of base.communes) {
    for (const v of c.communesVoisines) {
      if (!parId.has(v)) erreurs.push(`${c.id} : cite une voisine inexistante « ${v} »`);
    }
  }

  if (erreurs.length) {
    console.error(`\n  ${erreurs.length} ERREUR(S) — rien n'a été écrit :`);
    for (const e of erreurs) console.error(`    ✗ ${e}`);
    console.error('');
    process.exit(1);
  }

  // ── écriture du JSON, à l'identique de ce que produirait sync-communes
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

  // ── écriture du SQL
  const publiees = rapport.filter((r) => r.statut === 'published');
  const brouillons = rapport.filter((r) => r.statut === 'draft');
  const totalPubliees = communes.filter((c) => c.statut === 'published').length;

  const majs = Object.keys(DONNEES).map((id) => {
    const c = parId.get(id);
    const d = DONNEES[id];

    // Les colonnes relevées sont toujours réécrites : elles se mesurent, et le
    // back-office les affiche en lecture seule. Personne ne peut les avoir
    // modifiées entre-temps.
    const set = [
      ['codes_postaux', tableau(c.codesPostaux)],
      ['villages', tableau(c.villages)],
      ['communes_voisines', tableau(c.communesVoisines)],
      ['distance_depot_km', nombre(c.distanceDepotKm)],
      ['temps_trajet_estime_min', nombre(c.tempsTrajetEstimeMin)],
      ['date_verification', c.dateVerification ? q(c.dateVerification) : 'null'],
      ['statut', q(c.statut)],
    ];

    // Les colonnes rédigées ne sont écrites QUE si le lot en fournit une valeur.
    // Sans cette condition, relancer le script après que Gramme a saisi des
    // particularités dans le back-office les effacerait — silencieusement, et
    // c'est le genre de perte qui détruit la confiance dans l'outil.
    if (d.intro) set.push(['introduction_locale', q(d.intro)]);
    if (d.infos?.length) set.push(['informations_locales', tableau(d.infos)]);

    const largeur = Math.max(...set.map(([k]) => k.length));
    return `update public.communes set\n` +
      set.map(([k, v]) => `  ${k.padEnd(largeur)} = ${v}`).join(',\n') +
      `\nwhere id = ${q(id)};`;
  });

  const sql = `-- ============================================================================
-- Lot « ${nomLot} » — ${publiees.length} commune(s) publiée(s), ${brouillons.length} maintenue(s) en brouillon
--
-- ⚠️ FICHIER GÉNÉRÉ par scripts/generer-lot-communes.mjs — ne pas modifier à la
-- main. Corrige scripts/lots/${nomLot}.mjs et relance le script.
--
-- Distances relevées depuis ${ORIGINE}.
--
-- Généré en même temps que src/data/communes.json, depuis la même source. Les
-- deux doivent rester identiques : au prochain build, sync-communes.mjs doit
-- afficher « identique au dépôt ». S'il annonce une mise à jour, ils ont
-- divergé — regarde avant de déployer.
--
-- ⚠️ À exécuter AVANT de merger la branche. Si Netlify build alors que la table
-- porte encore l'ancien état, sync-communes écrasera le JSON et les pages
-- disparaîtront du pré-rendu, sans erreur puisque c'est son comportement normal.
--
-- ⚠️ Une seule transaction : le trigger communes_valider_voisines est différé à
-- la validation, et ces communes se citent mutuellement. Ligne par ligne, il
-- échouerait.
${brouillons.length ? `--
-- Maintenues en brouillon, volontairement :
${brouillons.map((r) => `--   · ${r.id} — ${r.raisons.join(' ; ')}`).join('\n')}` : ''}
-- ============================================================================

begin;

${majs.join('\n\n')}

commit;

-- Contrôle : attendu ${communes.length} lignes et ${totalPubliees} publiée(s).
select count(*) as total, count(*) filter (where statut = 'published') as publiees
from public.communes;
`;

  await writeFile(path.join(root, 'supabase/seed', `lot-${nomLot}.sql`), sql, 'utf-8');

  // ── rapport
  const pub = new Set(communes.filter((c) => c.statut === 'published').map((c) => c.id));
  const entrants = new Map();
  for (const c of communes) {
    if (c.statut !== 'published') continue;
    for (const v of c.communesVoisines) if (pub.has(v)) entrants.set(v, (entrants.get(v) ?? 0) + 1);
  }

  console.log(`\n  Lot « ${nomLot} » — ${publiees.length} publiée(s), ${brouillons.length} en brouillon.\n`);
  for (const r of publiees) {
    const c = parId.get(r.id);
    const sortants = c.communesVoisines.filter((v) => pub.has(v)).length;
    const alerte = sortants === 0 ? '  ⚠ aucune voisine publiée' : '';
    console.log(`    ${r.id.padEnd(24)} ${c.distanceDepotKm} km/${c.tempsTrajetEstimeMin} min · ` +
      `${sortants} lien(s) sortant(s), ${entrants.get(r.id) ?? 0} entrant(s)${alerte}`);
  }
  if (brouillons.length) {
    console.log('');
    for (const r of brouillons) console.log(`    ${r.id.padEnd(24)} brouillon — ${r.raisons.join(' ; ')}`);
  }

  // Vitesses retenues hors plage : rappelées à chaque exécution pour qu'une
  // décision prise un jour reste visible et contestable le lendemain.
  const forcees = rapport.filter((r) => r.mesure?.confirmation);
  if (forcees.length) {
    console.log(`\n  Relevé(s) retenu(s) hors de la plage ${CONTROLE_VITESSE.min}-${CONTROLE_VITESSE.max} km/h :`);
    for (const r of forcees) {
      console.log(`    · ${r.id} — ${r.mesure.v.toFixed(1)} km/h — ${r.mesure.confirmation}`);
    }
  }

  console.log(`\n  ${totalPubliees} commune(s) publiée(s) sur ${communes.length}.`);
  console.log(`  JSON → src/data/communes.json`);
  console.log(`  SQL  → supabase/seed/lot-${nomLot}.sql\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
