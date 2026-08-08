// scripts/verify-build.mjs
//
// Contrôle du dossier `dist/` AVANT déploiement. Lancé en dernière étape de
// `npm run build` : s'il échoue, le build Netlify échoue et rien n'est mis en
// ligne. C'est le garde-fou, pas une simple statistique.
//
// Chaque contrôle correspond à une régression réellement survenue en
// production, pas à une bonne pratique théorique :
//
//   1. Balises SEO absentes du HTML livré  -> le pré-rendu a silencieusement
//      produit une page vide (cas des pages qui bloquaient sur `loading`).
//   2. index.html en sous-dossier          -> « Pretty URLs » de Netlify
//      redirige /page vers /page/, le canonical pointe alors vers une URL qui
//      redirige et la page devient « non indexable ».
//   3. Catch-all `/*`                      -> toute URL inconnue répond 200 en
//      servant l'accueil (soft 404). Il vivait en double dans netlify.toml.
//   4. Ordre des règles de redirection     -> le splat Netlify matche aussi la
//      chaîne vide : /transport/* placé avant /transport capturait /transport.
//   5. URL du sitemap non servie           -> une URL indexée qui tombe en 404.
//
// Aucun accès réseau, aucun navigateur : simple analyse statique de dist/.
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const BASE = 'https://www.demenagements-gramme.be';

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

// ---------------------------------------------------------------- utilitaires

async function walk(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p, base)));
    else out.push(path.relative(base, p));
  }
  return out;
}

/** Chemin fichier -> URL servie par Netlify (inverse de « Pretty URLs »). */
const fileToUrl = (rel) =>
  rel === 'index.html' ? '/' : '/' + rel.replace(/\.html$/, '');

// ------------------------------------------------- modèle de routage Netlify

/**
 * Reproduit l'ordre de résolution de Netlify :
 *   1. règles forcées (`!`), dans l'ordre du fichier
 *   2. fichier statique correspondant
 *   3. règles non forcées, dans l'ordre du fichier
 *   4. sinon 404 (404.html)
 * Le splat `/*` matche aussi la chaîne vide — c'est précisément ce qui avait
 * fait capturer /transport par la règle /transport/*.
 */
function parseRedirects(text) {
  const rules = [];
  for (const line of text.split('\n')) {
    const clean = line.trim();
    if (!clean || clean.startsWith('#')) continue;
    const [from, to, code] = clean.split(/\s+/);
    if (!from || !to) continue;
    const forced = (code || '').endsWith('!');
    rules.push({
      from,
      to,
      status: parseInt((code || '200').replace('!', ''), 10) || 200,
      forced,
    });
  }
  return rules;
}

function matchRule(rule, url) {
  if (rule.from.endsWith('/*')) return url.startsWith(rule.from.slice(0, -2));
  return rule.from === url || rule.from === `${url}/`;
}

function resolve(url, rules, files) {
  for (const r of rules) if (r.forced && matchRule(r, url)) return { status: r.status, to: r.to };

  const candidates =
    url === '/' ? ['index.html'] : [url.slice(1), `${url.slice(1)}.html`, `${url.slice(1)}/index.html`];
  for (const c of candidates) if (files.includes(c)) return { status: 200, file: c };

  for (const r of rules) if (!r.forced && matchRule(r, url)) return { status: r.status, to: r.to };

  return { status: 404 };
}

// ---------------------------------------------------------------- contrôles

/**
 * Sous-classes de LocalBusiness employées par le site. Google impose `name` et
 * `address` sur chacune : voir le contrôle dans la boucle des pages.
 */
const TYPES_LOCAL_BUSINESS = new Set([
  'LocalBusiness', 'MovingCompany', 'Store', 'ProfessionalService',
]);

/** Aplatit un document JSON-LD en la liste de ses nœuds typés. */
function* noeudsDe(valeur) {
  if (Array.isArray(valeur)) {
    for (const v of valeur) yield* noeudsDe(v);
    return;
  }
  if (!valeur || typeof valeur !== 'object') return;
  if (typeof valeur['@type'] === 'string') yield valeur;
  for (const v of Object.values(valeur)) yield* noeudsDe(v);
}

async function main() {
  if (!existsSync(distDir)) {
    console.error('dist/ introuvable — lance le build avant la vérification.');
    process.exit(1);
  }

  const files = await walk(distDir);
  const pages = files.filter((f) => f.endsWith('.html'));
  const redirectsPath = path.join(distDir, '_redirects');
  const rules = existsSync(redirectsPath)
    ? parseRedirects(await readFile(redirectsPath, 'utf-8'))
    : [];

  // --- 1. Aucun index.html en sous-dossier (déclencherait la redirection slash)
  const nested = pages.filter((p) => p.endsWith('index.html') && p !== 'index.html');
  for (const p of nested) {
    err(`${p} : index.html en sous-dossier — Netlify ajoutera une redirection 301 vers le slash final, ce qui désaccorde le canonical. Génère un fichier plat.`);
  }

  // --- 2. Balises SEO de chaque page indexable
  for (const rel of pages.sort()) {
    if (rel === 'app.html' || rel === '404.html') continue;
    const html = await readFile(path.join(distDir, rel), 'utf-8');
    const url = fileToUrl(rel);
    const label = url;

    const title = (html.match(/<title[^>]*>(.*?)<\/title>/s) || [, ''])[1].trim();
    const desc = (html.match(/name="description"[^>]*content="([^"]*)"/) || [, ''])[1];
    const canonical = (html.match(/rel="canonical"[^>]*href="([^"]*)"/) || [, ''])[1];
    const h1Count = (html.match(/<h1[\b >]/g) || []).length;

    if (!title) err(`${label} : <title> absent ou vide — la page est probablement sortie vide du pré-rendu.`);
    if (!desc) err(`${label} : meta description absente.`);
    if (!canonical) err(`${label} : canonical absent.`);
    if (!html.includes('application/ld+json')) err(`${label} : aucun bloc JSON-LD.`);

    // Chaque bloc JSON-LD doit être du JSON valide, et tout nœud typé comme une
    // sous-classe de LocalBusiness doit porter `name` ET `address`.
    //
    // Google exige les deux sur ce type, et les valideurs lisent le TYPE, pas
    // l'intention. Une référence compacte à l'entreprise — @id, name, url — a
    // été servie sur 89 pages en se croyant un simple renvoi : les validateurs y
    // ont lu 89 déclarations LocalBusiness incomplètes. Le build ne disait rien ;
    // c'est un audit externe qui l'a signalé, trois semaines plus tard.
    for (const bloc of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      let donnees;
      try {
        donnees = JSON.parse(bloc[1]);
      } catch (e) {
        err(`${label} : bloc JSON-LD illisible (${e.message}).`);
        continue;
      }
      for (const noeud of noeudsDe(donnees)) {
        if (!TYPES_LOCAL_BUSINESS.has(noeud['@type'])) continue;
        for (const requis of ['name', 'address']) {
          if (!noeud[requis]) {
            err(
              `${label} : nœud ${noeud['@type']} sans "${requis}" — Google l'exige sur toute sous-classe ` +
              `de LocalBusiness, et le valideur lit le type, pas l'intention.`
            );
          }
        }
      }
    }
    if (h1Count === 0) err(`${label} : aucun <h1> — page vide au pré-rendu ?`);
    if (h1Count > 1) warn(`${label} : ${h1Count} <h1> (un seul attendu).`);

    // Le canonical doit désigner exactement l'URL servie, sans slash final.
    if (canonical) {
      const expected = `${BASE}${url}`;
      if (canonical !== expected) {
        err(`${label} : canonical "${canonical}" ne correspond pas à l'URL servie "${expected}".`);
      }
    }

    if (desc && (desc.length < 100 || desc.length > 170)) {
      warn(`${label} : meta description de ${desc.length} caractères (viser 100-170).`);
    }
    if (title && title.length > 65) {
      warn(`${label} : title de ${title.length} caractères, sera tronqué par Google (viser < 60).`);
    }
  }

  // --- 3. Page 404 : présente, noindex, et SANS canonical
  if (!files.includes('404.html')) {
    err('404.html absent — Netlify servirait une page d\'erreur générique.');
  } else {
    const html = await readFile(path.join(distDir, '404.html'), 'utf-8');
    if (!/name="robots"[^>]*content="[^"]*noindex/.test(html)) {
      err('404.html : robots noindex manquant.');
    }
    if (/rel="canonical"/.test(html)) {
      err('404.html : ne doit pas porter de canonical (page exclue de l\'index).');
    }
  }

  // --- 4. Coquille vide pour le fallback admin
  if (!files.includes('app.html')) {
    err('app.html absent — le fallback /admin/* servirait le HTML de l\'accueil.');
  } else {
    const html = await readFile(path.join(distDir, 'app.html'), 'utf-8');
    if (!/<div id="root"><\/div>/.test(html)) {
      err('app.html doit être une coquille vide (<div id="root"></div>).');
    }
  }

  // --- 5. Aucun catch-all, ni dans _redirects ni dans netlify.toml
  const globalCatchAll = rules.find((r) => r.from === '/*' && r.status === 200);
  if (globalCatchAll) {
    err(`_redirects : catch-all "/* -> ${globalCatchAll.to}" — toute URL inconnue répondrait 200 (soft 404). Limite le fallback à /admin/*.`);
  }
  const toml = await readFile(path.join(root, 'netlify.toml'), 'utf-8');
  if (/^\s*\[\[redirects\]\]/m.test(toml)) {
    err('netlify.toml contient des règles [[redirects]] — elles doublonnent public/_redirects et peuvent en annuler l\'effet. Regroupe tout dans _redirects.');
  }

  // --- 6. Ordre des règles : une règle exacte doit précéder son splat
  rules.forEach((rule, i) => {
    if (!rule.from.endsWith('/*')) return;
    const prefix = rule.from.slice(0, -2);
    const exactLater = rules.findIndex((r, j) => j > i && r.from === prefix);
    if (exactLater !== -1) {
      err(`_redirects : "${rule.from}" (ligne ${i + 1}) précède "${prefix}" (ligne ${exactLater + 1}). Le splat Netlify matche aussi la chaîne vide et capturera "${prefix}". Place l'URL exacte avant.`);
    }
  });

  // --- 7bis. llms.txt : présent, conforme, et sans lien mort
  //
  // Spec llmstxt.org : fichier Markdown à la racine, dont la SEULE section
  // obligatoire est un H1. Un lien mort ici induit en erreur les assistants
  // qui lisent ce fichier pour se repérer sur le site.
  const llmsPath = path.join(distDir, 'llms.txt');
  if (!existsSync(llmsPath)) {
    warn('llms.txt absent de dist/ — les assistants IA n\'ont pas de plan du site en Markdown.');
  } else {
    const llms = await readFile(llmsPath, 'utf-8');
    if (!/^#\s+\S/m.test(llms.split('\n')[0] || '')) {
      err('llms.txt : la première ligne doit être un titre H1 (seule section obligatoire de la spec).');
    }
    for (const m of llms.matchAll(/\]\((https:\/\/www\.demenagements-gramme\.be([^)]*))\)/g)) {
      const res = resolve(m[2] || '/', rules, files);
      if (res.status !== 200) {
        err(`llms.txt : le lien ${m[1]} renvoie ${res.status} — corrige-le ou retire-le.`);
      }
    }
  }

  // --- 7. Chaque URL du sitemap doit être servie en 200
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  let sitemapUrls = [];
  if (!existsSync(sitemapPath)) {
    err('sitemap.xml absent de dist/.');
  } else {
    const xml = await readFile(sitemapPath, 'utf-8');
    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    sitemapUrls = urls;
    if (!urls.length) err('sitemap.xml ne contient aucune URL.');
    for (const full of urls) {
      const url = full.replace(BASE, '') || '/';
      const res = resolve(url, rules, files);
      if (res.status === 404) {
        err(`sitemap : ${url} n'est servie par aucun fichier ni aucune règle — elle renverrait 404.`);
      } else if (res.status !== 200) {
        err(`sitemap : ${url} renvoie ${res.status} vers ${res.to} — une URL qui redirige n'a pas sa place dans le sitemap.`);
      }
      if (full.endsWith('/') && full !== `${BASE}/`) {
        warn(`sitemap : ${full} porte un slash final, incohérent avec les canonical.`);
      }
    }
  }

  // --- 8. Aucun lien interne ne doit pointer vers une URL qui redirige
  //
  // Un lien vers une 301 fait perdre un aller-retour au visiteur et dilue le
  // maillage interne. Surtout : si la redirection ramène à la page courante,
  // le lien ne mène nulle part — c'était le cas des trois « pages associées »
  // de /demenagement/demenagement-international.
  const linkIssues = new Map();
  for (const rel of pages) {
    const html = await readFile(path.join(distDir, rel), 'utf-8');
    const from = fileToUrl(rel);
    for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      const href = m[1];
      const res = resolve(href, rules, files);
      if (res.status >= 300 && res.status < 400) {
        const key = `${href} -> ${res.to}`;
        if (!linkIssues.has(key)) linkIssues.set(key, { pages: new Set(), self: false });
        linkIssues.get(key).pages.add(from);
        if (res.to === from) linkIssues.get(key).self = true;
      }
    }
  }
  for (const [key, { pages: srcs, self }] of linkIssues) {
    const where = srcs.size > 3 ? `${srcs.size} pages` : [...srcs].join(', ');
    if (self) {
      err(`lien interne "${key}" sur ${where} — la redirection ramène à la page courante, le lien ne mène nulle part.`);
    } else {
      warn(`lien interne "${key}" sur ${where} — pointe vers une redirection, vise directement la destination.`);
    }
  }

  // --- 9. Aucune page orpheline
  //
  // Une page présente au sitemap mais vers laquelle aucun lien interne ne
  // pointe est invisible pour qui navigue, et ne reçoit aucune autorité du
  // reste du site. C'était le cas de /demenagement/demenagement-piano :
  // pré-rendue, indexable, mais inatteignable autrement qu'en connaissant
  // son URL.
  const inbound = new Map();
  for (const rel of pages) {
    const html = await readFile(path.join(distDir, rel), 'utf-8');
    const from = fileToUrl(rel);
    for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      if (m[1] === from) continue; // auto-lien ignoré
      if (!inbound.has(m[1])) inbound.set(m[1], new Set());
      inbound.get(m[1]).add(from);
    }
  }
  for (const rel of pages) {
    if (rel === 'app.html' || rel === '404.html') continue;
    const url = fileToUrl(rel);
    if (url === '/') continue; // l'accueil est atteignable par le logo/domaine
    if (!inbound.has(url) || inbound.get(url).size === 0) {
      err(`${url} : page orpheline — aucun lien interne n'y mène. Ajoute-la aux pages associées ou à la navigation.`);
    }
  }

  // --- 12. Cohérence des données de communes et des pages locales
  //
  // Le validateur n'est pas réimplémenté ici : il est importé du bundle SSR
  // déjà compilé, seule implémentation des règles (voir src/entry-server.tsx).
  try {
    const { validerCommunes, getCommunesAGenerer, COMMUNES, PREFIXE_COMMUNE, cheminCommune,
            pageSatellite, PAGES_SATELLITES_DECLAREES } =
      await import(new URL(`file://${path.join(root, 'dist-server/entry-server.js')}`).href);

    // Le préfixe d'URL est écrit à deux endroits : ici via le bundle, et en dur
    // dans scripts/prerender.mjs. On vérifie qu'ils coïncident, sinon le
    // pré-rendu produirait des fichiers à des chemins que l'application ne
    // reconnaît pas — 27 pages en 404 silencieuses.
    if (PREFIXE_COMMUNE !== 'demenagement-') {
      err(`préfixe d'URL des communes désynchronisé : « ${PREFIXE_COMMUNE} » côté application, « demenagement- » côté pré-rendu.`);
    }

    for (const p of validerCommunes()) {
      const msg = `commune « ${p.commune} » : ${p.message}`;
      if (p.gravite === 'erreur') err(msg);
      else warn(msg);
    }

    const aGenerer = getCommunesAGenerer();

    // Vagues du sitemap — voir data/sitemap-waves.json et scripts/sitemap.mjs.
    const vagues = JSON.parse(await readFile(path.join(root, 'data/sitemap-waves.json'), 'utf-8'));
    const enVague = new Set(
      ['wave1', 'wave2', 'wave3', 'wave4', 'wave5'].flatMap((v) => vagues[v] ?? [])
    );
    const horsVague = [];

    // Une commune hors sitemap n'est atteignable que par le maillage interne.
    // /zones-intervention est la page qui porte ce maillage : si elle cesse de
    // lister une commune, la page devient invisible pour Google ET pour le
    // visiteur, ce qui transformerait le report en dépublication silencieuse.
    const zonesHtml = existsSync(path.join(distDir, 'zones-intervention.html'))
      ? await readFile(path.join(distDir, 'zones-intervention.html'), 'utf-8')
      : '';
    if (!zonesHtml) err('zones-intervention.html absent — plus rien ne maille les pages communes.');

    // 12a. Chaque commune publiée doit avoir une page réellement servie en 200,
    // dont le canonical correspond à l'URL servie.
    for (const c of aGenerer) {
      const url = cheminCommune(c.id);
      const r = resolve(url, rules, files);
      if (r.status !== 200) {
        err(`${url} : commune publiée mais l'URL renvoie ${r.status} — page non pré-rendue ?`);
        continue;
      }
      const html = await readFile(path.join(distDir, r.file), 'utf-8');
      const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1];
      if (canonical !== `${BASE}${url}`) {
        err(`${url} : canonical « ${canonical} » ≠ URL servie.`);
      }
      const nbH1 = (html.match(/<h1[\s>]/g) ?? []).length;
      if (nbH1 !== 1) err(`${url} : ${nbH1} balise(s) H1 — il en faut exactement une.`);
      if (!html.includes('"@type":"Service"')) err(`${url} : balisage Service absent.`);
      if (!html.includes('"@type":"BreadcrumbList"')) err(`${url} : balisage BreadcrumbList absent.`);

      // Présence au sitemap : plus une erreur, mais un contrôle de cohérence
      // avec data/sitemap-waves.json.
      //
      // Les pages communes sont déclarées par vagues (voir scripts/sitemap.mjs).
      // Une commune hors vague reste publiée, indexable et liée — elle n'a
      // simplement pas encore sa place dans le sitemap. Exiger sa présence
      // rendait la mise en vagues impossible.
      //
      // Ce qui reste bloquant, et qui est le vrai risque : une DIVERGENCE entre
      // la vague déclarée et le sitemap livré. Une commune listée dans une
      // vague mais absente du sitemap signale un générateur qui a sauté une
      // page ; l'inverse, un sitemap qui déclare une page que personne n'a
      // demandée.
      const auSitemap = sitemapUrls.includes(`${BASE}${url}`);
      if (enVague.has(c.id) && !auSitemap) {
        err(`${url} : déclarée dans data/sitemap-waves.json mais absente du sitemap livré.`);
      }
      if (!enVague.has(c.id) && auSitemap) {
        err(`${url} : présente au sitemap sans figurer dans aucune vague de data/sitemap-waves.json.`);
      }
      if (!auSitemap) horsVague.push(c.nom);

      if (zonesHtml && !zonesHtml.includes(`href="${url}"`)) {
        err(`${url} : absente de /zones-intervention — seule page qui maille les communes hors sitemap.`);
      }
    }

    if (horsVague.length) {
      console.log(
        `\n  ${horsVague.length} commune(s) publiée(s) hors sitemap, en attente d'une vague — ` +
        `indexables et liées depuis /zones-intervention :\n    ${horsVague.join(', ')}`
      );
    }

    // Chemins déjà occupés par une page satellite antérieure. Depuis que les
    // pages communes suivent la même convention que les satellites, le chemin
    // calculé d'une commune coïncide souvent avec sa satellite — ce n'est pas
    // un doublon mais la même URL, et c'est précisément l'intérêt d'avoir
    // unifié la convention.
    const cheminsSatellites = new Set(
      COMMUNES.filter((x) => pageSatellite(x)).map((x) => pageSatellite(x))
    );

    // 12a-bis. La liste des pages satellites déclarées par le dépôt doit
    // correspondre à ce qui est réellement construit.
    //
    // C'est elle qui autorise `pageExistante` à écarter une commune du
    // pré-rendu. Une entrée périmée y ferait donc sauter silencieusement une
    // page — exactement ce que cette liste a été créée pour empêcher.
    for (const chemin of PAGES_SATELLITES_DECLAREES) {
      if (resolve(chemin, rules, files).status !== 200) {
        err(
          `src/data/pages-satellites.json déclare ${chemin}, qui n'est servie par aucun fichier ni aucune règle. ` +
          `Retire l'entrée si la page a été supprimée, ou ajoute sa route.`
        );
      }
    }

    // 12b. Aucune SECONDE URL ne doit être livrée pour une commune qui possède
    // déjà une page satellite : ce serait la cannibalisation que toute
    // l'architecture cherche à éviter.
    for (const c of COMMUNES.filter((x) => pageSatellite(x))) {
      const satellite = pageSatellite(c);
      const url = cheminCommune(c.id);
      if (url === satellite) continue; // même URL, rien à signaler
      if (resolve(url, rules, files).status === 200) {
        err(`${url} est servie alors que ${c.nom} a déjà ${satellite} — deux URL sur la même requête.`);
      }
    }

    // 12c. Aucune commune en brouillon ne doit être déployée — sauf si son
    // chemin est celui d'une satellite préexistante, page légitime et indexée.
    for (const c of COMMUNES.filter((x) => x.statut !== 'published')) {
      const url = cheminCommune(c.id);
      if (cheminsSatellites.has(url)) continue;
      if (resolve(url, rules, files).status === 200) {
        err(`${url} est déployée alors que ${c.nom} est en brouillon.`);
      }
    }
  } catch (e) {
    err(`contrôle des communes impossible : ${e?.message || e}`);
  }

  // --- 10. Une URL inconnue doit bien tomber en 404
  const unknown = resolve('/page-qui-nexiste-pas-' + 'x'.repeat(8), rules, files);
  if (unknown.status !== 404) {
    err(`une URL inconnue renvoie ${unknown.status} (${unknown.to || unknown.file}) au lieu de 404 — soft 404.`);
  }

  // --- 11. L'admin doit rester accessible
  const admin = resolve('/admin/login', rules, files);
  if (admin.status !== 200) {
    err(`/admin/login renvoie ${admin.status} — l'admin ne se chargerait plus. Vérifie la règle /admin/*.`);
  } else if (admin.to && !admin.to.includes('app.html')) {
    warn(`/admin/login est servi par ${admin.to} plutôt que app.html.`);
  }

  // ------------------------------------------------------------------ rapport

  const pageCount = pages.filter((p) => !['app.html', '404.html'].includes(p)).length;
  console.log(`\nVérification du build — ${pageCount} pages, ${rules.length} règles de redirection.`);

  if (warnings.length) {
    console.log(`\n  ${warnings.length} avertissement(s) :`);
    for (const w of warnings) console.log(`    · ${w}`);
  }

  if (errors.length) {
    console.error(`\n  ${errors.length} ERREUR(S) — déploiement interrompu :`);
    for (const e of errors) console.error(`    ✗ ${e}`);
    console.error('');
    process.exit(1);
  }

  console.log(`\n  Aucune erreur bloquante. Build déployable.\n`);
}

main().catch((e) => {
  console.error('verify-build a planté :', e);
  process.exit(1);
});
