// scripts/prerender.mjs
//
// Pré-rendu statique des pages publiques après le build Vite.
// Rôle : injecter, dans le HTML livré par Netlify, le <title>, la meta
// description, le canonical, les balises Open Graph/Twitter et le JSON-LD
// (LocalBusiness, FAQPage, Article, BreadcrumbList) — au lieu de les laisser
// être injectés en JavaScript après montage (ce qui les rendait invisibles
// aux robots qui n'exécutent pas de JS : partages sociaux, certains crawlers).
//
// Usage : node scripts/prerender.mjs
// Prérequis : avoir déjà lancé `vite build` (dist/) et
// `vite build --ssr src/entry-server.tsx --outDir dist-server` (dist-server/).
//
// ⚠️ Garder cette liste de routes synchronisée avec src/entry-server.tsx.
// Le sitemap, lui, n'a plus à être tenu en parallèle : il est généré à partir
// des pages effectivement écrites ici (voir scripts/sitemap.mjs).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { genererSitemap } from './sitemap.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const distServerDir = path.join(root, 'dist-server');

// Communes lues depuis la source unique, et non recopiées ici : c'est
// exactement le doublon que la spécification demandait d'éviter. Le JSON est
// lisible par Node sans compilation, contrairement à src/data/communes.ts.
const { communes } = JSON.parse(
  await readFile(path.join(root, 'src/data/communes.json'), 'utf-8')
);

// Pages satellites réellement déclarées par le dépôt. Même liste que celle
// consommée par src/data/communes.ts : le fait « cette page existe » appartient
// au code, pas à la base.
const SATELLITES = new Set(
  JSON.parse(await readFile(path.join(root, 'src/data/pages-satellites.json'), 'utf-8')).pages
);

// Seules les communes publiées ET sans page satellite antérieure reçoivent une
// page pré-rendue.
//
// Les 82 communes en brouillon ne sont volontairement PAS déployées. Livrer 82
// pages quasi vides en noindex, c'est produire exactement le motif de pages
// satellites sans valeur que Google sanctionne, et cela ferait exploser le
// contrôle des pages orphelines. Une commune en brouillon reste consultable en
// `npm run dev` pour relecture ; elle n'existe en production qu'une fois ses
// données locales vérifiées.
const COMMUNES_PUBLIEES = communes
  // `pageExistante` n'est retenue que si la page satellite existe réellement
  // dans cette version du code. La valeur vient de Supabase et survit à la
  // suppression d'une satellite : s'y fier aveuglément faisait sauter le
  // pré-rendu de communes dont plus rien ne servait l'URL.
  .filter((c) => c.statut === 'published' && !(c.pageExistante && SATELLITES.has(c.pageExistante)))
  .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));

// Les pages communes vivent sous /demenagement/demenagement-<slug>, même
// convention que les satellites déjà publiées. Le préfixe est écrit ici et
// dans src/data/communes.ts (PREFIXE_COMMUNE) ; le contrôle de build compare
// les deux, une divergence est bloquante.
const ROUTES_COMMUNES = [
  '/zones-intervention',
  ...COMMUNES_PUBLIEES.map((c) => `/demenagement/demenagement-${c.id}`),
];

const ROUTES = [
  '/',
  '/demenagement',
  '/garde-meubles',
  '/blog',
  '/monte-meubles',
  '/estimation-volume',
  '/demenagement/demenageur-liege',
  '/demenagement/demenagement-liege',
  '/demenagement/demenagement-entreprise',
  '/demenagement/demenagement-piano',
  '/demenagement/demenagement-international',
  '/demenagement/demontage-remontage-meubles',
  '/garde-meubles/garde-meubles-liege',
  '/garde-meubles/prix-garde-meubles-liege',
  '/blog/6-conseils-reussir-demenagement-liege',
  '/blog/preparer-enfants-demenagement-liege',
  '/blog/6-erreurs-eviter-demenagement-liege',
  '/contact',
  '/contact-devis',
  '/mentions-legales',
  '/politique-confidentialite',
  '/conditions-generales',
  '/protection-donnees',
  ...ROUTES_COMMUNES,
];

async function main() {
  if (!existsSync(distDir)) {
    throw new Error('dist/ introuvable — lance `vite build` avant le pré-rendu.');
  }
  if (!existsSync(distServerDir)) {
    throw new Error('dist-server/ introuvable — lance `vite build --ssr src/entry-server.tsx --outDir dist-server` avant le pré-rendu.');
  }

  const template = await readFile(path.join(distDir, 'index.html'), 'utf-8');

  // Garde-fou : dist/index.html sert à la fois de gabarit et de cible du
  // pré-rendu de l'accueil. Relancé sans `vite build` préalable, le script
  // prendrait pour gabarit l'accueil déjà pré-rendu et recopierait ses balises
  // — canonical de l'accueil compris — dans les 27 autres pages. Le contrôle de
  // build le détecte, mais autant échouer ici avec un message clair.
  // On teste l'absence du point d'injection exact — la même chaîne que celle
  // remplacée plus bas. Un test « le root n'est pas vide » se déclencherait à
  // tort, `</div>` commençant lui aussi par un caractère non blanc.
  if (!template.includes('<div id="root"></div>')) {
    throw new Error(
      'dist/index.html est déjà pré-rendu : relance `npm run build:client` avant le pré-rendu, ' +
      'sinon toutes les pages héritent des balises de l\'accueil.'
    );
  }

  // Coquille vide conservée AVANT d'écraser dist/index.html par l'accueil
  // pré-rendu. Elle sert de cible au fallback SPA de l'admin (/admin/*) :
  // sans elle, l'admin s'afficherait une fraction de seconde par-dessus le
  // HTML de la page d'accueil.
  await writeFile(path.join(distDir, 'app.html'), template, 'utf-8');

  const ssrEntryPath = path.join(distServerDir, 'entry-server.js');
  const { render, pagesServicePubliees } = await import(pathToFileUrl(ssrEntryPath));

  // Pages de service rédigées, et seulement celles qui ont passé le verrou de
  // relecture. Une page en brouillon n'est pas écrite : son URL tombe donc en
  // 404 en production, ce qui est le comportement voulu — mieux vaut une page
  // absente qu'une page de tarifs sans tarifs.
  const ROUTES_SERVICE = pagesServicePubliees().map((p) => p.slug);
  const TOUTES_ROUTES = [...ROUTES, ...ROUTES_SERVICE];

  let ok = 0;
  const failures = [];

  // '/404' n'est pas une route de l'application : le catch-all de
  // entry-server.tsx renvoie NotFoundPage, que Netlify sert automatiquement
  // avec un vrai statut HTTP 404 pour toute URL inconnue.
  for (const route of [...TOUTES_ROUTES, '/404']) {
    try {
      const { html, helmet } = render(route);

      const headTags = [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
      ].join('\n');

      let finalHtml = template
        // On retire le <title> statique du template pour éviter un doublon
        // avec celui injecté par Helmet ci-dessous.
        .replace(/<title>.*?<\/title>/s, '')
        .replace('</head>', `${headTags}\n  </head>`)
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

      // On écrit des fichiers PLATS (`garde-meubles.html`) et non des dossiers
      // (`garde-meubles/index.html`).
      //
      // Raison : avec l'option « Pretty URLs » de Netlify (activée par défaut),
      // un dossier contenant un index.html déclenche une redirection 301 de
      // /garde-meubles vers /garde-meubles/. Or le canonical et le sitemap
      // utilisent la forme SANS slash final — le canonical pointait donc vers
      // une URL qui redirige, et les outils d'audit classaient la page comme
      // non indexable.
      //
      // Avec un fichier plat, Netlify sert /garde-meubles directement en 200,
      // sans redirection : canonical, sitemap et URL servie coïncident enfin.
      const outPath = route === '/'
        ? path.join(distDir, 'index.html')
        : path.join(distDir, `${route.replace(/^\//, '')}.html`);

      await mkdir(path.dirname(outPath), { recursive: true });
      await writeFile(outPath, finalHtml, 'utf-8');
      ok++;
    } catch (err) {
      failures.push({ route, error: err?.message || String(err) });
    }
  }

  console.log(`Pré-rendu terminé : ${ok}/${TOUTES_ROUTES.length + 1} pages (${TOUTES_ROUTES.length} routes + 404).`);
  console.log(`  dont ${ROUTES_COMMUNES.length} page(s) de zones et ${ROUTES_SERVICE.length} page(s) de service rédigée(s).`);
  if (failures.length > 0) {
    console.error('Échecs :');
    for (const f of failures) console.error(`  - ${f.route}: ${f.error}`);
    process.exitCode = 1;
    return;
  }

  // Le sitemap est généré APRÈS le pré-rendu, et à partir de lui : c'est la
  // seule façon de garantir qu'aucune URL déclarée n'est en 404, et de calculer
  // le `lastmod` sur le contenu réellement livré.
  const { erreurs, urls, modifiees } = await genererSitemap({
    distDir,
    cheminCommune: (slug) => `/demenagement/demenagement-${slug}`,
    communesGenerees: new Set(COMMUNES_PUBLIEES.map((c) => c.id)),
    // Les pages de service publiées entrent au sitemap sans condition de vague :
    // les vagues ne concernent que les pages communes.
    pagesSupplementaires: ROUTES_SERVICE.map((url) => ({ url, changefreq: 'monthly', priority: '0.8' })),
    aujourdhui: new Date().toISOString().slice(0, 10),
  });

  if (erreurs.length > 0) {
    console.error('Sitemap — génération interrompue :');
    for (const e of erreurs) console.error(`  ✗ ${e}`);
    process.exitCode = 1;
    return;
  }

  const communesDeclarees = urls.filter((u) => u.startsWith('/demenagement/demenagement-')).length;
  console.log(`  sitemap : ${urls.length} URL déclarées, dont ${communesDeclarees} sous /demenagement/.`);
  console.log(
    modifiees.length === 0
      ? '  sitemap : aucun lastmod déplacé — contenu inchangé depuis le dernier build.'
      : `  sitemap : ${modifiees.length} lastmod mis à jour (contenu modifié) : ${modifiees.slice(0, 5).join(', ')}${modifiees.length > 5 ? '…' : ''}`
  );
  console.log('  sitemap : pense à committer data/sitemap-lastmod.json si des dates ont bougé.');
}

function pathToFileUrl(p) {
  return new URL(`file://${p}`).href;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
