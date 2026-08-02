// scripts/audit-lisibilite.mjs
//
// Mesure la longueur de phrase des pages construites, et liste les phrases
// dépassant un seuil.
//
// Usage : node scripts/audit-lisibilite.mjs [--seuil 25] [--page <chemin>] [--json]
// Prérequis : `npm run build`, qui remplit dist/.
//
// ─────────────────────────────────────────────────────────────────────────────
// Ce que le script mesure, et ce qu'il ne mesure pas
//
// Il compte les mots entre deux ponctuations fortes, sur le seul texte éditorial
// de la page. Les libellés d'interface — boutons, étiquettes, éléments de
// navigation, cartes de chiffres — ne sont pas des phrases : les compter tirerait
// la moyenne vers le bas et masquerait exactement ce qu'on cherche.
//
// Il ne calcule pas d'indice de lisibilité global (Flesch et consorts). Ces
// indices sont calibrés sur l'anglais, et leur transposition au français donne
// des scores que rien ne permet d'interpréter. La longueur de phrase, elle, est
// directement actionnable : une phrase de quarante mots se coupe.
// ─────────────────────────────────────────────────────────────────────────────
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');

const args = process.argv.slice(2);
const SEUIL = Number(args[args.indexOf('--seuil') + 1]) || 25;
const CIBLE_MOYENNE = 20;

/**
 * Blocs porteurs de prose. Les titres en sont exclus : ce sont des étiquettes
 * de trois à six mots, et les compter comme des phrases faisait tomber la
 * moyenne d'ensemble de plusieurs mots sans que rien n'ait été réécrit.
 */
const BLOCS_PROSE = /<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;

function decoder(s) {
  return s
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));
}

/** Paragraphes éditoriaux d'une page, en texte brut. */
function proseDe(html) {
  let x = html.replace(/<script[\s\S]*?<\/script>/g, '');
  x = x.replace(/<style[\s\S]*?<\/style>/g, '');
  x = x.replace(/<!--[\s\S]*?-->/g, '');
  // En-tête et pied de page sont partagés : les inclure comparerait les pages
  // sur leur boilerplate au lieu de leur contenu.
  x = x.replace(/<header[\s\S]*?<\/header>/gi, '').replace(/<footer[\s\S]*?<\/footer>/gi, '');

  const blocs = [];
  for (const m of x.matchAll(BLOCS_PROSE)) {
    const texte = decoder(m[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    if (texte) blocs.push(texte);
  }
  return blocs;
}

/**
 * Découpe en phrases. Les abréviations courantes du corpus — nombres décimaux,
 * « M. », « etc. » — ne doivent pas produire de fausses coupures.
 */
function phrasesDe(bloc) {
  return bloc
    .replace(/(\d)[.,](\d)/g, '$1․$2')
    .replace(/\b(M|Mme|Dr|etc|env|réf|art)\./gi, '$1․')
    .split(/(?<=[.!?…])\s+(?=[A-ZÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ«"])/)
    .map((p) => p.replace(/․/g, '.').trim())
    .filter(Boolean);
}

function mots(phrase) {
  return phrase.split(/\s+/).filter((m) => /[\p{L}\p{N}]/u.test(m)).length;
}

async function fichiersHtml(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await fichiersHtml(p)));
    else if (e.name.endsWith('.html') && !['app.html', '404.html'].includes(e.name)) out.push(p);
  }
  return out;
}

async function mesurer(fichier) {
  const html = await readFile(fichier, 'utf-8');
  const phrases = proseDe(html).flatMap(phrasesDe);
  // Une « phrase » de deux mots est un fragment d'interface passé au travers.
  const retenues = phrases.filter((p) => mots(p) >= 3);
  const longueurs = retenues.map(mots);
  const total = longueurs.reduce((a, b) => a + b, 0);
  const longues = retenues
    .map((p, i) => ({ phrase: p, mots: longueurs[i] }))
    .filter((x) => x.mots > SEUIL)
    .sort((a, b) => b.mots - a.mots);

  return {
    url: '/' + path.relative(distDir, fichier).replace(/\.html$/, '').replace(/^index$/, ''),
    phrases: retenues.length,
    mots: total,
    moyenne: retenues.length ? total / retenues.length : 0,
    max: longueurs.length ? Math.max(...longueurs) : 0,
    longues,
  };
}

async function main() {
  const cible = args.includes('--page') ? args[args.indexOf('--page') + 1] : null;
  // `--page /` vise l'accueil, servi par dist/index.html et non par un fichier
  // homonyme : sans ce cas particulier, le script cherchait « dist/.html ».
  const chemin = cible ? cible.replace(/^\//, '').replace(/\/$/, '') || 'index' : null;
  const fichiers = chemin
    ? [path.join(distDir, chemin + '.html')]
    : await fichiersHtml(distDir);

  const pages = (await Promise.all(fichiers.map(mesurer))).sort((a, b) => b.moyenne - a.moyenne);

  if (args.includes('--json')) {
    console.log(JSON.stringify(pages.map(({ longues, ...r }) => r), null, 2));
    return;
  }

  if (cible) {
    const p = pages[0];
    console.log(`\n${p.url} — ${p.phrases} phrases, ${p.moyenne.toFixed(1)} mots en moyenne, max ${p.max}\n`);
    console.log(`Phrases de plus de ${SEUIL} mots (${p.longues.length}) :\n`);
    for (const l of p.longues) console.log(`  [${l.mots}] ${l.phrase}\n`);
    return;
  }

  const totalPhrases = pages.reduce((s, p) => s + p.phrases, 0);
  const totalMots = pages.reduce((s, p) => s + p.mots, 0);
  const totalLongues = pages.reduce((s, p) => s + p.longues.length, 0);

  console.log(
    `\nLisibilité — ${pages.length} pages\n` +
      `Cible : moyenne < ${CIBLE_MOYENNE} mots par phrase · aucune phrase de plus de ${SEUIL} mots\n`
  );
  console.log('page'.padEnd(48) + 'phrases'.padStart(8) + 'moyenne'.padStart(9) + 'max'.padStart(6) + `  >${SEUIL}`);
  console.log('─'.repeat(78));
  for (const p of pages.slice(0, 20)) {
    console.log(
      p.url.padEnd(48) +
        String(p.phrases).padStart(8) +
        p.moyenne.toFixed(1).padStart(9) +
        String(p.max).padStart(6) +
        String(p.longues.length).padStart(6) +
        (p.moyenne > CIBLE_MOYENNE ? '  ←' : '')
    );
  }
  if (pages.length > 20) console.log(`  … ${pages.length - 20} autres pages`);
  console.log('─'.repeat(78));
  console.log(
    'ensemble'.padEnd(48) +
      String(totalPhrases).padStart(8) +
      (totalMots / totalPhrases).toFixed(1).padStart(9) +
      String(Math.max(...pages.map((p) => p.max))).padStart(6) +
      String(totalLongues).padStart(6)
  );
  console.log(
    `\n${pages.filter((p) => p.moyenne <= CIBLE_MOYENNE).length}/${pages.length} page(s) sous la moyenne cible.` +
      ` ${totalLongues} phrase(s) de plus de ${SEUIL} mots au total.\n`
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
