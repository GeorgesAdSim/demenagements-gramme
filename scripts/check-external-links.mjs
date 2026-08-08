// scripts/check-external-links.mjs
//
// Contrôle des liens externes présents dans les pages pré-rendues.
//
// Pourquoi ce script existe : les pages communes citent des pages officielles
// de communes wallonnes. Ces sites sont refondus sans redirection, leurs PDF
// changent de chemin, et une page « occupation du domaine public » disparaît
// sans prévenir — c'est déjà arrivé sur blegny.be pendant la collecte. Sans
// surveillance, on sert des 404 sortants dans dix-huit mois.
//
// Usage :
//   node scripts/check-external-links.mjs              # contrôle + rapport
//   node scripts/check-external-links.mjs --hors-build # n'échoue jamais
//
// Politique de sévérité, et elle est délibérée :
//
//   404 / 410 / domaine non résolu  -> ÉCHEC. La ressource n'existe plus.
//   3xx                             -> avertissement. La chaîne de redirection
//                                      mérite d'être corrigée, mais le lien
//                                      fonctionne.
//   5xx / timeout                   -> avertissement. Les sites communaux sont
//                                      instables, et un CI rouge par
//                                      intermittence finit par être ignoré —
//                                      ce qui coûte plus cher que le défaut
//                                      qu'il signale.
//
// Ce script n'est PAS branché sur `npm run build` : il fait des appels réseau,
// et un build de déploiement ne doit pas dépendre de la disponibilité de
// trente sites communaux. Il est fait pour tourner en tâche planifiée
// (hebdomadaire ou mensuelle) et à la demande avant une mise en ligne.
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const RAPPORT = path.join(root, 'reports/external-links.json');

const TIMEOUT_MS = 10_000;
const TENTATIVES = 2;
const CONCURRENCE = 5;

/** Hôtes techniques : ce sont des ressources, pas des liens éditoriaux. */
const HOTES_TECHNIQUES = new Set([
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'images.unsplash.com',
  'schema.org',
  'www.schema.org',
]);

/** Le site lui-même. */
const HOTE_INTERNE = 'www.demenagements-gramme.be';

/** Réseaux sociaux de l'entreprise : légitimes, mais pas des sources. */
const HOTES_MARQUE = new Set(['www.facebook.com', 'facebook.com']);

async function walk(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p, base)));
    else out.push(path.relative(base, p));
  }
  return out;
}

const fileToUrl = (rel) => (rel === 'index.html' ? '/' : '/' + rel.replace(/\.html$/, ''));

/** Collecte les liens externes éditoriaux, page par page. */
async function collecter() {
  const fichiers = (await walk(distDir)).filter((f) => f.endsWith('.html'));
  /** url -> { pages: Set, ancres: Set } */
  const liens = new Map();
  /** page -> nombre de liens éditoriaux */
  const parPage = new Map();

  for (const rel of fichiers) {
    const html = await readFile(path.join(distDir, rel), 'utf-8');
    const page = fileToUrl(rel);
    for (const m of html.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
      const url = m[1];
      const ancre = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      let hote;
      try {
        hote = new URL(url).hostname;
      } catch {
        continue;
      }
      if (hote === HOTE_INTERNE || HOTES_TECHNIQUES.has(hote) || HOTES_MARQUE.has(hote)) continue;

      if (!liens.has(url)) liens.set(url, { pages: new Set(), ancres: new Set() });
      liens.get(url).pages.add(page);
      liens.get(url).ancres.add(ancre);
      parPage.set(page, (parPage.get(page) ?? 0) + 1);
    }
  }
  return { liens, parPage };
}

async function interroger(url) {
  // HEAD d'abord : plus léger, et suffisant dans la majorité des cas. Plusieurs
  // CMS communaux le refusent (405) ou le traitent mal — on retombe alors sur
  // un GET, dont on ne lit pas le corps.
  for (const methode of ['HEAD', 'GET']) {
    for (let essai = 1; essai <= TENTATIVES; essai++) {
      try {
        const rep = await fetch(url, {
          method: methode,
          redirect: 'follow',
          signal: AbortSignal.timeout(TIMEOUT_MS),
          headers: { 'user-agent': 'demenagements-gramme-link-check/1.0' },
        });
        if (methode === 'HEAD' && (rep.status === 405 || rep.status === 501)) break; // -> GET
        return { statut: rep.status, urlFinale: rep.url, redirige: rep.redirected, methode };
      } catch (e) {
        const dernier = methode === 'GET' && essai === TENTATIVES;
        if (dernier) {
          if (e?.name === 'TimeoutError') return { statut: null, erreur: 'timeout', categorie: 'timeout' };
          const code = e?.cause?.code ?? '';
          // Un domaine qui ne résout pas est une ressource morte : blocage.
          if (['ENOTFOUND', 'EAI_AGAIN', 'ERR_INVALID_URL'].includes(code)) {
            return { statut: null, erreur: `domaine non résolu (${code})`, categorie: 'dns' };
          }
          // Chaîne de certificats incomplète, TLS obsolète : le lien fonctionne
          // dans un navigateur, qui complète la chaîne lui-même, mais pas dans
          // Node. C'est un défaut de configuration du site cité, pas un lien
          // mort — on le signale sans faire échouer quoi que ce soit.
          // Observé sur policeliege.be : certificat intermédiaire non servi.
          if (/^(UNABLE_TO_VERIFY|SELF_SIGNED|CERT_|DEPTH_ZERO|ERR_TLS|EPROTO)/.test(code) ||
              /certificate/i.test(e?.cause?.message ?? e?.message ?? '')) {
            return { statut: null, erreur: `chaîne TLS incomplète (${code || 'certificat'})`, categorie: 'tls' };
          }
          return { statut: null, erreur: e?.message || String(e), categorie: 'reseau' };
        }
      }
    }
  }
  return { statut: null, erreur: 'inatteignable' };
}

/** Exécute `taches` avec au plus `n` en vol. */
async function enParallele(taches, n) {
  const resultats = [];
  let i = 0;
  const ouvriers = Array.from({ length: Math.min(n, taches.length) }, async () => {
    while (i < taches.length) {
      const k = i++;
      resultats[k] = await taches[k]();
    }
  });
  await Promise.all(ouvriers);
  return resultats;
}

async function main() {
  const horsBuild = process.argv.includes('--hors-build');
  if (!existsSync(distDir)) {
    console.error('dist/ introuvable — lance `npm run build` avant le contrôle des liens.');
    process.exit(1);
  }

  const { liens, parPage } = await collecter();
  const urls = [...liens.keys()].sort();
  console.log(`\nContrôle de ${urls.length} lien(s) externe(s) éditorial(aux), ${CONCURRENCE} en parallèle…\n`);

  const reponses = await enParallele(
    urls.map((url) => () => interroger(url).then((r) => ({ url, ...r }))),
    CONCURRENCE
  );

  const erreurs = [];
  const avertissements = [];
  const entrees = [];

  for (const r of reponses) {
    const { pages, ancres } = liens.get(r.url);
    const entree = {
      url: r.url,
      statut: r.statut,
      urlFinale: r.urlFinale && r.urlFinale !== r.url ? r.urlFinale : undefined,
      erreur: r.erreur,
      categorie: r.categorie,
      pages: [...pages].sort(),
      ancres: [...ancres],
    };
    entrees.push(entree);

    if (r.statut === 404 || r.statut === 410) {
      erreurs.push(`${r.statut} — ${r.url} (${pages.size} page(s))`);
    } else if (r.categorie === 'dns') {
      erreurs.push(`${r.erreur} — ${r.url} (${pages.size} page(s))`);
    } else if (r.statut === null) {
      avertissements.push(`${r.erreur} — ${r.url}`);
    } else if (r.statut >= 500) {
      avertissements.push(`${r.statut} — ${r.url}`);
    } else if (r.redirige) {
      avertissements.push(`redirection vers ${r.urlFinale} — ${r.url}`);
    }
  }

  // Plafond de trois liens externes par page commune. Au-delà, la page cesse
  // de citer ses sources et commence à distribuer de l'autorité.
  const trop = [...parPage.entries()].filter(([p, n]) => p.startsWith('/demenagement/') && n > 3);
  for (const [p, n] of trop) erreurs.push(`${p} porte ${n} liens externes (maximum 3).`);

  // Une ancre identique sur beaucoup de pages signale un patron : c'est ce que
  // le chantier cherchait à supprimer. Les ressources RÉELLEMENT partagées —
  // un règlement de zone de police commun à dix communes — sont légitimes,
  // d'où le seuil élevé et le simple avertissement.
  const parAncre = new Map();
  for (const [url, { pages, ancres }] of liens) {
    for (const a of ancres) parAncre.set(a, (parAncre.get(a) ?? 0) + pages.size);
    void url;
  }
  for (const [ancre, n] of parAncre) {
    if (n > 12) avertissements.push(`ancre « ${ancre.slice(0, 60)}… » réutilisée sur ${n} pages — vérifier qu'il s'agit bien de la même ressource.`);
  }

  await mkdir(path.dirname(RAPPORT), { recursive: true });
  await writeFile(
    RAPPORT,
    `${JSON.stringify(
      {
        genereLe: new Date().toISOString().slice(0, 10),
        liens: entrees.length,
        enErreur: erreurs.length,
        avertissements: avertissements.length,
        detail: entrees,
      },
      null,
      2
    )}\n`,
    'utf-8'
  );

  for (const e of entrees) {
    const etat = e.statut ?? e.erreur;
    console.log(`  ${String(etat).padStart(9)} · ${e.pages.length.toString().padStart(2)} page(s) · ${e.url}`);
  }

  if (avertissements.length) {
    console.log(`\n  ${avertissements.length} avertissement(s) :`);
    for (const a of avertissements) console.log(`    · ${a}`);
  }

  console.log(`\n  Rapport écrit dans ${path.relative(root, RAPPORT)}`);

  if (erreurs.length) {
    console.error(`\n  ${erreurs.length} ERREUR(S) :`);
    for (const e of erreurs) console.error(`    ✗ ${e}`);
    console.error('');
    if (!horsBuild) process.exit(1);
    return;
  }
  console.log('\n  Aucun lien mort.\n');
}

main().catch((e) => {
  console.error('check-external-links a planté :', e);
  process.exit(1);
});
