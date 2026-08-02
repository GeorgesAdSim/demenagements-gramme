// scripts/audit-communes.mjs
//
// Contrôle des pages communes après build : volume, ratio texte/HTML et
// similarité inter-pages.
//
// Usage : node scripts/audit-communes.mjs [--json]
// Prérequis : `npm run build`, qui remplit dist/.
//
// ─────────────────────────────────────────────────────────────────────────────
// Pourquoi la similarité se mesure hors boilerplate
//
// Le template commune sert ~50 Ko de HTML identiques sur chaque page : grille
// de services, bloc d'ancienneté, formulaire de devis, en-tête et pied de page.
// Mesurée sur la page entière, la similarité tourne mécaniquement autour de
// 95 % et ne dit plus rien de ce qui est réellement rédigé.
//
// On isole donc la seule section propre à la commune, délimitée par deux
// marqueurs stables du template : le H2 d'ouverture « Déménageur à X depuis
// 1948 » et le premier bloc mutualisé qui suit la section locale.
// ─────────────────────────────────────────────────────────────────────────────
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distCommunes = path.join(root, 'dist', 'demenagement');

/** Seuils d'acceptation du lot 3. */
const SEUILS = { mots: 950, ratio: 12, similarite: 60 };

/** Début et fin de la zone rédigée propre à la commune. */
const DEBUT = /Déménageur à .+? depuis 1948/;
const FIN = /Des solutions pour chaque besoin/i;

function texteBrut(html) {
  let x = html.replace(/<script[\s\S]*?<\/script>/g, '');
  x = x.replace(/<style[\s\S]*?<\/style>/g, '');
  x = x.replace(/<!--[\s\S]*?-->/g, '');
  x = x.replace(/<[^>]+>/g, ' ');
  return decoder(x).replace(/\s+/g, ' ').trim();
}

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

/** Texte de la seule zone rédigée, hors en-tête, hero et blocs mutualisés. */
function texteLocal(texte) {
  const d = texte.search(DEBUT);
  const f = texte.search(FIN);
  if (d === -1) return null;
  return texte.slice(d, f === -1 ? undefined : f).trim();
}

/** Empreinte en n-grammes de 5 mots, pour un Jaccard peu sensible à l'ordre. */
function shingles(texte, n = 5) {
  const mots = texte
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const s = new Set();
  for (let i = 0; i + n <= mots.length; i++) s.add(mots.slice(i, i + n).join(' '));
  return s;
}

function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let commun = 0;
  for (const x of a) if (b.has(x)) commun++;
  return (commun / (a.size + b.size - commun)) * 100;
}

async function main() {
  const fichiers = (await readdir(distCommunes))
    .filter((f) => f.startsWith('demenagement-') && f.endsWith('.html'));

  const pages = [];
  for (const f of fichiers) {
    const html = await readFile(path.join(distCommunes, f), 'utf-8');
    const texte = texteBrut(html);
    const local = texteLocal(texte);
    // Les pages services partagent le préfixe d'URL sans utiliser le template
    // commune : le marqueur d'ouverture y est absent, on les écarte.
    if (local === null) continue;
    pages.push({
      slug: f.replace(/^demenagement-|\.html$/g, ''),
      mots: texte.split(' ').length,
      motsLocaux: local.split(' ').length,
      ratio: (Buffer.byteLength(texte) / Buffer.byteLength(html)) * 100,
      empreinte: shingles(local),
    });
  }

  // Similarité maximale de chaque page avec les 5 pages les plus proches.
  for (const p of pages) {
    const scores = pages
      .filter((q) => q !== p)
      .map((q) => ({ slug: q.slug, score: jaccard(p.empreinte, q.empreinte) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    p.similariteMax = scores[0]?.score ?? 0;
    p.similariteMoy = scores.length ? scores.reduce((s, x) => s + x.score, 0) / scores.length : 0;
    p.plusProche = scores[0]?.slug ?? '—';
  }

  pages.sort((a, b) => a.slug.localeCompare(b.slug, 'fr'));

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(pages.map(({ empreinte, ...r }) => r), null, 2));
    return;
  }

  const ko = (v, seuil, sens) => (sens === '>' ? v > seuil : v < seuil);
  console.log(
    `\nAudit des pages communes — ${pages.length} pages\n` +
      `Seuils : > ${SEUILS.mots} mots · ratio > ${SEUILS.ratio} % · similarité < ${SEUILS.similarite} %\n`
  );
  console.log(
    'commune'.padEnd(28) +
      'mots'.padStart(6) +
      'locaux'.padStart(8) +
      'ratio'.padStart(8) +
      'simil.'.padStart(8) +
      '  plus proche'
  );
  console.log('─'.repeat(85));

  let echecs = 0;
  for (const p of pages) {
    const okM = ko(p.mots, SEUILS.mots, '>');
    const okR = ko(p.ratio, SEUILS.ratio, '>');
    const okS = ko(p.similariteMax, SEUILS.similarite, '<');
    if (!(okM && okR && okS)) echecs++;
    console.log(
      p.slug.padEnd(28) +
        String(p.mots).padStart(6) +
        String(p.motsLocaux).padStart(8) +
        `${p.ratio.toFixed(1)}%`.padStart(8) +
        `${p.similariteMax.toFixed(1)}%`.padStart(8) +
        `  ${p.plusProche}` +
        `   ${okM ? '' : 'mots '}${okR ? '' : 'ratio '}${okS ? '' : 'similarité'}`
    );
  }

  const moy = (f) => pages.reduce((s, p) => s + f(p), 0) / pages.length;
  console.log('─'.repeat(85));
  console.log(
    'moyenne'.padEnd(28) +
      moy((p) => p.mots).toFixed(0).padStart(6) +
      moy((p) => p.motsLocaux).toFixed(0).padStart(8) +
      `${moy((p) => p.ratio).toFixed(1)}%`.padStart(8) +
      `${moy((p) => p.similariteMax).toFixed(1)}%`.padStart(8)
  );
  console.log(
    `\n${pages.length - echecs}/${pages.length} page(s) au niveau des trois seuils.` +
      (echecs ? ` ${echecs} restante(s).\n` : '\n')
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
