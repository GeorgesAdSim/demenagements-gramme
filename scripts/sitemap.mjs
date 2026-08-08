// scripts/sitemap.mjs
//
// Génère dist/sitemap.xml à partir des pages RÉELLEMENT pré-rendues.
//
// Remplace le sitemap maintenu à la main (public/sitemap.xml) et la fonction
// `completerSitemap()` de prerender.mjs. Deux défauts corrigés, dans cet ordre
// d'importance :
//
//  1. `lastmod` valait `new Date()`. Le fichier public/ étant recopié à chaque
//     `vite build`, les 69 URL de communes étaient réinsérées à chaque build
//     avec la date du jour. Search Console a vu ces pages « modifiées » le
//     4 puis le 7 août sans qu'une ligne de leur contenu ait bougé. Un site qui
//     déplace son `lastmod` sans raison apprend à Google, en quelques
//     itérations, à ne plus le lire du tout — et c'est le seul signal de
//     fraîcheur qu'un sitemap transporte.
//
//     `lastmod` suit désormais un hachage du CONTENU rendu (texte visible +
//     title + meta description). Hachage inchangé, on réutilise la date
//     stockée ; hachage différent, on écrit la date du jour. Le magasin
//     data/sitemap-lastmod.json est versionné : c'est lui qui porte la mémoire,
//     pas le build.
//
//  2. Les 70 pages communes étaient déclarées d'un bloc. Voir
//     data/sitemap-waves.json.
//
// Les garde-fous de fin de fichier font ÉCHOUER le build. Un sitemap est lu par
// une machine qui ne pardonne pas : une URL en 404 dedans coûte plus cher que
// dix URL manquantes.
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { texteVisible } from './seo-dup-report.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'https://www.demenagements-gramme.be';

const CHEMIN_PAGES = path.join(root, 'data/sitemap-pages.json');
const CHEMIN_VAGUES = path.join(root, 'data/sitemap-waves.json');
const CHEMIN_LASTMOD = path.join(root, 'data/sitemap-lastmod.json');

/** Clés du fichier de vagues qui déclarent réellement une vague. */
const VAGUES = ['wave1', 'wave2', 'wave3', 'wave4', 'wave5'];

/** Chemin du fichier pré-rendu qui sert une URL. Inverse de « Pretty URLs ». */
function fichierDe(distDir, url) {
  return url === '/' ? path.join(distDir, 'index.html') : path.join(distDir, `${url.slice(1)}.html`);
}

/**
 * Empreinte du contenu d'une page.
 *
 * Volontairement calculée sur le texte VISIBLE, le title et la meta
 * description — et sur rien d'autre. Le HTML livré contient les URL d'assets
 * hachées par Vite, qui changent à chaque build sans que le contenu bouge :
 * les inclure ramènerait exactement le défaut qu'on corrige.
 */
export function empreinteContenu(html) {
  const title = (html.match(/<title[^>]*>(.*?)<\/title>/s) ?? [, ''])[1].trim();
  const desc = (html.match(/name="description"[^>]*content="([^"]*)"/) ?? [, ''])[1];
  return createHash('sha256')
    .update(`${title}\n${desc}\n${texteVisible(html)}`)
    .digest('hex')
    .slice(0, 16);
}

async function lireJson(chemin) {
  return JSON.parse(await readFile(chemin, 'utf-8'));
}

/**
 * Slugs de communes déclarés dans les vagues non vides, dans l'ordre des
 * vagues. Lève si un slug apparaît deux fois — une commune déclarée dans deux
 * vagues produirait deux entrées <url> pour la même page.
 */
function slugsActifs(vagues, erreurs) {
  const vus = new Map();
  const actifs = [];
  for (const nom of VAGUES) {
    for (const slug of vagues[nom] ?? []) {
      if (vus.has(slug)) {
        erreurs.push(`data/sitemap-waves.json : « ${slug} » apparaît dans ${vus.get(slug)} et dans ${nom}.`);
        continue;
      }
      vus.set(slug, nom);
      actifs.push({ slug, vague: nom });
    }
  }
  // Une commune listée à la fois dans une vague et dans la réserve signale une
  // vague ouverte sans vider la réserve : la prochaine vague la reprendrait.
  for (const slug of vagues.enAttente ?? []) {
    if (vus.has(slug)) {
      erreurs.push(
        `data/sitemap-waves.json : « ${slug} » est à la fois dans ${vus.get(slug)} et dans enAttente — ` +
        `retire-le de enAttente en ouvrant la vague.`
      );
    }
  }
  return actifs;
}

function entree({ url, lastmod, changefreq, priority }) {
  return (
    `  <url>\n` +
    `    <loc>${BASE_URL}${url}</loc>\n` +
    `    <lastmod>${lastmod}</lastmod>\n` +
    `    <changefreq>${changefreq}</changefreq>\n` +
    `    <priority>${priority}</priority>\n` +
    `  </url>`
  );
}

/**
 * @param {object} options
 * @param {string} options.distDir            dossier des pages pré-rendues
 * @param {(slug:string)=>string} options.cheminCommune  URL d'une commune
 * @param {Set<string>} options.communesGenerees  slugs réellement pré-rendus
 * @param {Array<{url:string,changefreq:string,priority:string}>} [options.pagesSupplementaires]
 *        pages de service ayant passé leur verrou de relecture — hors vagues,
 *        qui ne concernent que les communes
 * @param {string} options.aujourdhui         date du jour, ISO court
 * @returns {Promise<{erreurs:string[], urls:string[], modifiees:string[]}>}
 */
export async function genererSitemap({ distDir, cheminCommune, communesGenerees, pagesSupplementaires = [], aujourdhui }) {
  const erreurs = [];
  const [config, vagues, magasin] = await Promise.all([
    lireJson(CHEMIN_PAGES),
    lireJson(CHEMIN_VAGUES),
    existsSync(CHEMIN_LASTMOD) ? lireJson(CHEMIN_LASTMOD) : Promise.resolve({}),
  ]);

  const actifs = slugsActifs(vagues, erreurs);

  // Un slug de vague qui ne correspond à aucune page générée est une faute de
  // frappe ou une commune repassée en brouillon : dans les deux cas le sitemap
  // annoncerait une URL en 404.
  for (const { slug, vague } of actifs) {
    if (!communesGenerees.has(slug)) {
      erreurs.push(
        `data/sitemap-waves.json : « ${slug} » (${vague}) ne correspond à aucune page commune générée — ` +
        `commune inconnue, en brouillon, ou servie par une page satellite.`
      );
    }
  }

  const candidats = [
    ...config.pages.map((p) => ({ ...p })),
    ...pagesSupplementaires,
    ...actifs
      .filter(({ slug }) => communesGenerees.has(slug))
      .map(({ slug }) => ({ url: cheminCommune(slug), changefreq: 'monthly', priority: '0.7' })),
  ];

  const doublons = candidats.map((c) => c.url).filter((u, i, t) => t.indexOf(u) !== i);
  for (const u of new Set(doublons)) {
    erreurs.push(`sitemap : ${u} déclarée deux fois (data/sitemap-pages.json et une vague ?).`);
  }

  const magasinSuivant = {};
  const modifiees = [];
  const entrees = [];

  for (const page of candidats) {
    const fichier = fichierDe(distDir, page.url);
    if (!existsSync(fichier)) {
      erreurs.push(`sitemap : ${page.url} n'a pas de page pré-rendue (${path.relative(root, fichier)} absent).`);
      continue;
    }
    const empreinte = empreinteContenu(await readFile(fichier, 'utf-8'));
    const precedent = magasin[page.url];

    let lastmod;
    if (precedent && precedent.contentHash === empreinte) {
      lastmod = precedent.lastmod;
    } else {
      lastmod = aujourdhui;
      if (precedent) modifiees.push(page.url);
    }

    magasinSuivant[page.url] = { contentHash: empreinte, lastmod };
    entrees.push(entree({ ...page, lastmod }));
  }

  if (erreurs.length) return { erreurs, urls: [], modifiees: [] };

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<!-- Généré par scripts/sitemap.mjs — ne pas modifier à la main.\n` +
    `     Périmètre des pages : data/sitemap-pages.json et data/sitemap-waves.json.\n` +
    `     Dates de dernière modification : data/sitemap-lastmod.json. -->\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${entrees.join('\n')}\n` +
    `</urlset>\n`;

  await writeFile(path.join(distDir, 'sitemap.xml'), xml, 'utf-8');

  // Le magasin est réécrit trié, pour que le diff Git d'un lot ne montre que
  // les pages dont le contenu a réellement bougé.
  const trie = Object.fromEntries(Object.keys(magasinSuivant).sort().map((k) => [k, magasinSuivant[k]]));
  await writeFile(CHEMIN_LASTMOD, `${JSON.stringify(trie, null, 2)}\n`, 'utf-8');

  return { erreurs, urls: candidats.map((p) => p.url), modifiees };
}
