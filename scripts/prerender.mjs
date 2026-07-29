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
// ⚠️ Garder cette liste de routes synchronisée avec src/entry-server.tsx
// et public/sitemap.xml.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const distServerDir = path.join(root, 'dist-server');

const ROUTES = [
  '/',
  '/demenagement',
  '/garde-meubles',
  '/blog',
  '/monte-meubles',
  '/demenagement/demenageur-liege',
  '/demenagement/demenagement-liege',
  '/demenagement/demenagement-seraing',
  '/demenagement/demenagement-herstal',
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
];

async function main() {
  if (!existsSync(distDir)) {
    throw new Error('dist/ introuvable — lance `vite build` avant le pré-rendu.');
  }
  if (!existsSync(distServerDir)) {
    throw new Error('dist-server/ introuvable — lance `vite build --ssr src/entry-server.tsx --outDir dist-server` avant le pré-rendu.');
  }

  const template = await readFile(path.join(distDir, 'index.html'), 'utf-8');

  // Coquille vide conservée AVANT d'écraser dist/index.html par l'accueil
  // pré-rendu. Elle sert de cible au fallback SPA de l'admin (/admin/*) :
  // sans elle, l'admin s'afficherait une fraction de seconde par-dessus le
  // HTML de la page d'accueil.
  await writeFile(path.join(distDir, 'app.html'), template, 'utf-8');

  const ssrEntryPath = path.join(distServerDir, 'entry-server.js');
  const { render } = await import(pathToFileUrl(ssrEntryPath));

  let ok = 0;
  const failures = [];

  // '/404' n'est pas une route de l'application : le catch-all de
  // entry-server.tsx renvoie NotFoundPage, que Netlify sert automatiquement
  // avec un vrai statut HTTP 404 pour toute URL inconnue.
  for (const route of [...ROUTES, '/404']) {
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

  console.log(`Pré-rendu terminé : ${ok}/${ROUTES.length + 1} pages (${ROUTES.length} routes + 404).`);
  if (failures.length > 0) {
    console.error('Échecs :');
    for (const f of failures) console.error(`  - ${f.route}: ${f.error}`);
    process.exitCode = 1;
  }
}

function pathToFileUrl(p) {
  return new URL(`file://${p}`).href;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
