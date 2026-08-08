// scripts/seo-dup-report.mjs
//
// Mesure la duplication de texte entre les pages communes, à partir des
// fichiers HTML RÉELLEMENT LIVRÉS (dist/), et non du source.
//
// Pourquoi le HTML livré et pas les composants : ce que Google voit, c'est le
// texte rendu. Un composant partagé qui n'apparaît que sur trois pages ne pèse
// rien ; un gabarit de deux lignes recopié sur soixante-dix pages pèse
// beaucoup. Seul le rendu permet de faire la différence.
//
// Usage :
//   node scripts/seo-dup-report.mjs                    # affiche le rapport
//   node scripts/seo-dup-report.mjs reports/x.json     # + écrit le JSON
//
// Méthode, et ses limites :
//
//  · « Bloc commun » = suite d'au moins 8 mots consécutifs identiques entre
//    deux pages. Le seuil de 8 est celui des détecteurs de contenu dupliqué
//    classiques : en dessous, on capture des tournures de langue ordinaires
//    (« il faut compter environ trente minutes de route ») plutôt que du
//    gabarit recopié.
//
//  · Les métriques par paire sont calculées sur un ÉCHANTILLON déterministe de
//    pages (20 par défaut), pris à intervalle régulier dans la liste triée.
//    Le calcul est quadratique : 70 pages font 2 415 paires, chacune exigeant
//    une recherche de plus longue sous-chaîne. L'échantillon rend la mesure
//    reproductible d'un lot à l'autre — c'est la comparaison entre lots qui
//    compte, pas la valeur absolue au dixième de point.
//
//  · Le compte de mots, lui, est calculé sur TOUTES les pages communes.
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const communesDir = path.join(distDir, 'demenagement');

/** Longueur minimale, en mots, d'un bloc considéré comme dupliqué. */
const N = 8;
/** Nombre de pages retenues pour les mesures par paire. */
const TAILLE_ECHANTILLON = 20;
/** Nombre de blocs communs les plus longs détaillés dans le rapport. */
const TOP_BLOCS = 25;

// ─────────────────────────────────────────────────────────── extraction texte

const ENTITES = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&#39;': "'", '&apos;': "'", '&eacute;': 'é', '&egrave;': 'è', '&agrave;': 'à',
  '&ccedil;': 'ç', '&ecirc;': 'ê', '&hellip;': '…', '&laquo;': '«', '&raquo;': '»',
};

/**
 * Texte visible d'une page pré-rendue.
 *
 * On retire d'abord le <head> entier : il contient le JSON-LD, dont les
 * réponses de FAQ sont une recopie mot pour mot du corps de page. Les compter
 * doublerait artificiellement la duplication mesurée.
 */
export function texteVisible(html) {
  return html
    .replace(/<head[\s\S]*?<\/head>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    // React échappe les apostrophes en &#x27; : sans le cas hexadécimal, tout
    // « l'autorisation » du corpus se lisait « l x27 autorisation ».
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;/gi, (e) => ENTITES[e.toLowerCase()] ?? ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Découpage en mots. L'apostrophe sépare : « l'ensemble » donne « l » et
 * « ensemble ». Ce choix est sans effet sur les comparaisons, qui portent sur
 * les deux pages traitées à l'identique, et évite d'avoir à gérer les trois
 * apostrophes typographiques du corpus.
 */
export function enMots(texte) {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

// ─────────────────────────────────────────────────────── comparaison de pages

/** Ensemble des n-grammes de `mots`, sous forme de chaînes jointes. */
function ngrammes(mots, n = N) {
  const set = new Set();
  for (let i = 0; i + n <= mots.length; i++) set.add(mots.slice(i, i + n).join(' '));
  return set;
}

/**
 * Positions de `mots` couvertes par un n-gramme présent dans `autres`.
 *
 * Un mot est « partagé » dès qu'il appartient à au moins un bloc de N mots que
 * l'autre page contient aussi. Les positions sont marquées, pas comptées : un
 * mot dans deux blocs qui se chevauchent ne compte qu'une fois.
 */
function positionsPartagees(mots, autresNgrammes) {
  const marque = new Uint8Array(mots.length);
  for (let i = 0; i + N <= mots.length; i++) {
    if (autresNgrammes.has(mots.slice(i, i + N).join(' '))) {
      for (let j = i; j < i + N; j++) marque[j] = 1;
    }
  }
  let n = 0;
  for (const m of marque) n += m;
  return { marque, nombre: n };
}

/**
 * Plus longue suite de mots consécutifs commune à deux pages.
 *
 * Programmation dynamique sur deux lignes seulement : la matrice complète
 * (1 300 × 1 300 par paire) ne tient pas en mémoire sur les 190 paires de
 * l'échantillon, mais chaque ligne suffit puisqu'on ne remonte jamais.
 */
function plusLongBlocCommun(a, b) {
  if (!a.length || !b.length) return { longueur: 0, finA: 0 };
  let precedente = new Int32Array(b.length + 1);
  let courante = new Int32Array(b.length + 1);
  let meilleure = 0;
  let finA = 0;
  for (let i = 1; i <= a.length; i++) {
    const motA = a[i - 1];
    for (let j = 1; j <= b.length; j++) {
      if (motA === b[j - 1]) {
        const v = precedente[j - 1] + 1;
        courante[j] = v;
        if (v > meilleure) {
          meilleure = v;
          finA = i;
        }
      } else {
        courante[j] = 0;
      }
    }
    const tmp = precedente;
    precedente = courante;
    courante = tmp;
    courante.fill(0);
  }
  return { longueur: meilleure, finA };
}

/**
 * Suites maximales de positions marquées — les blocs réellement recopiés.
 *
 * Reconstruit depuis le marquage plutôt que par une seconde passe de
 * programmation dynamique : deux blocs distincts de la page A qui se suivent et
 * dont les correspondants sont éloignés dans B ressortent ici fusionnés. La
 * mesure de longueur exacte, elle, vient de `plusLongBlocCommun`. Ce que cette
 * fonction sert à produire est la LISTE des passages dupliqués, pour pouvoir
 * dire d'où vient la duplication — c'est un outil de diagnostic.
 */
function blocsMarques(mots, marque) {
  const out = [];
  let debut = -1;
  for (let i = 0; i <= marque.length; i++) {
    if (i < marque.length && marque[i]) {
      if (debut === -1) debut = i;
    } else if (debut !== -1) {
      if (i - debut >= N) out.push({ mots: i - debut, texte: mots.slice(debut, i).join(' ') });
      debut = -1;
    }
  }
  return out;
}

function mediane(valeurs) {
  if (!valeurs.length) return 0;
  const v = [...valeurs].sort((x, y) => x - y);
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}

const arrondi = (x, d = 1) => Number(x.toFixed(d));

// ─────────────────────────────────────────────────────────────────── rapport

async function pagesCommunes() {
  if (!existsSync(communesDir)) {
    throw new Error(`${communesDir} introuvable — lance \`npm run build\` avant la mesure.`);
  }
  // Les pages satellites vivent dans le même dossier mais ne sont pas des
  // pages communes générées : elles ont leur rédaction propre et fausseraient
  // la mesure. On ne retient que celles dont le slug correspond à une commune
  // réellement générée par le gabarit.
  const { getCommunesAGenerer } = await import(
    new URL(`file://${path.join(root, 'dist-server/entry-server.js')}`).href
  );
  const slugs = new Set(getCommunesAGenerer().map((c) => c.id));

  const fichiers = (await readdir(communesDir))
    .filter((f) => f.endsWith('.html'))
    .filter((f) => slugs.has(f.replace(/^demenagement-/, '').replace(/\.html$/, '')))
    .sort();

  const pages = [];
  for (const f of fichiers) {
    const html = await readFile(path.join(communesDir, f), 'utf-8');
    const mots = enMots(texteVisible(html));
    pages.push({ slug: f.replace(/\.html$/, ''), url: `/demenagement/${f.replace(/\.html$/, '')}`, mots });
  }
  return pages;
}

/** Échantillon déterministe : pages prises à intervalle régulier. */
function echantillonner(pages, taille) {
  if (pages.length <= taille) return pages;
  const pas = pages.length / taille;
  return Array.from({ length: taille }, (_, i) => pages[Math.floor(i * pas)]);
}

export async function mesurer() {
  const pages = await pagesCommunes();
  const echantillon = echantillonner(pages, TAILLE_ECHANTILLON);
  const ngrammesPar = new Map(echantillon.map((p) => [p.slug, ngrammes(p.mots)]));

  const partsPartagees = [];
  /** texte du bloc -> { mots, paires } */
  const blocs = new Map();
  let recordLongueur = 0;
  let recordBloc = null;
  // Couverture d'une page par l'UNION des autres pages de l'échantillon : c'est
  // la mesure qui répond à « quelle part de cette page existe ailleurs sur le
  // site », alors que la mesure par paire répond à « quelle part de cette page
  // se retrouve sur telle autre ». Les deux sont utiles, la première est plus
  // sévère et plus proche de ce que voit un moteur.
  const couvertureUnion = new Map(echantillon.map((p) => [p.slug, new Uint8Array(p.mots.length)]));

  for (let i = 0; i < echantillon.length; i++) {
    for (let j = i + 1; j < echantillon.length; j++) {
      const a = echantillon[i];
      const b = echantillon[j];
      const versB = positionsPartagees(a.mots, ngrammesPar.get(b.slug));
      const versA = positionsPartagees(b.mots, ngrammesPar.get(a.slug));

      const ua = couvertureUnion.get(a.slug);
      for (let k = 0; k < ua.length; k++) if (versB.marque[k]) ua[k] = 1;
      const ub = couvertureUnion.get(b.slug);
      for (let k = 0; k < ub.length; k++) if (versA.marque[k]) ub[k] = 1;

      partsPartagees.push(
        (versB.nombre / a.mots.length + versA.nombre / b.mots.length) / 2
      );

      for (const bloc of blocsMarques(a.mots, versB.marque)) {
        const vu = blocs.get(bloc.texte);
        if (vu) vu.paires++;
        else blocs.set(bloc.texte, { mots: bloc.mots, paires: 1 });
      }

      const { longueur, finA } = plusLongBlocCommun(a.mots, b.mots);
      if (longueur > recordLongueur) {
        recordLongueur = longueur;
        recordBloc = {
          mots: longueur,
          pages: [a.slug, b.slug],
          texte: a.mots.slice(finA - longueur, finA).join(' '),
        };
      }
    }
  }

  const partsUnion = echantillon.map((p) => {
    const c = couvertureUnion.get(p.slug);
    let n = 0;
    for (const v of c) n += v;
    return n / p.mots.length;
  });

  const blocsUniques = [...blocs.entries()]
    .map(([texte, { mots, paires }]) => ({ mots, paires, texte }))
    .sort((x, y) => y.mots - x.mots || y.paires - x.paires)
    .slice(0, TOP_BLOCS);

  const motsParPage = pages.map((p) => p.mots.length);
  const partPartageeMediane = mediane(partsPartagees);
  const partUnionMediane = mediane(partsUnion);

  return {
    genereLe: new Date().toISOString().slice(0, 10),
    parametres: { seuilMotsBlocCommun: N, tailleEchantillon: echantillon.length, pagesCommunes: pages.length },
    motsParPage: {
      median: mediane(motsParPage),
      min: Math.min(...motsParPage),
      max: Math.max(...motsParPage),
      moyenne: arrondi(motsParPage.reduce((s, x) => s + x, 0) / motsParPage.length),
    },
    // Mesure par paire — comparable à un test de duplicate content classique.
    parPaire: {
      paires: partsPartagees.length,
      partPartageeMediane: arrondi(partPartageeMediane * 100),
      partUniqueMediane: arrondi((1 - partPartageeMediane) * 100),
    },
    // Mesure contre l'union de l'échantillon — « ce texte existe-t-il ailleurs
    // sur le site ». Plus sévère, c'est l'objectif chiffré à suivre.
    contreUnion: {
      partPartageeMediane: arrondi(partUnionMediane * 100),
      partUniqueMediane: arrondi((1 - partUnionMediane) * 100),
      motsUniquesMedians: Math.round(mediane(motsParPage) * (1 - partUnionMediane)),
    },
    plusLongBlocCommun: recordBloc,
    blocsCommunsLesPlusLongs: blocsUniques,
    detailParPage: pages.map((p) => ({ url: p.url, mots: p.mots.length })),
  };
}

async function main() {
  const rapport = await mesurer();
  const cible = process.argv[2];

  console.log(`\nDuplication des pages communes — ${rapport.parametres.pagesCommunes} pages, ` +
    `échantillon de ${rapport.parametres.tailleEchantillon} (${rapport.parPaire.paires} paires)\n`);
  console.log(`  Mots par page          : ${rapport.motsParPage.median} (médiane), ` +
    `${rapport.motsParPage.min}–${rapport.motsParPage.max}`);
  console.log(`  Par paire   — partagé  : ${rapport.parPaire.partPartageeMediane} %  ` +
    `| unique : ${rapport.parPaire.partUniqueMediane} %`);
  console.log(`  Vs le reste — partagé  : ${rapport.contreUnion.partPartageeMediane} %  ` +
    `| unique : ${rapport.contreUnion.partUniqueMediane} % (${rapport.contreUnion.motsUniquesMedians} mots)`);
  console.log(`  Plus long bloc commun  : ${rapport.plusLongBlocCommun?.mots ?? 0} mots`);
  if (rapport.plusLongBlocCommun) {
    console.log(`    « ${rapport.plusLongBlocCommun.texte.slice(0, 160)}… »`);
  }
  console.log('\n  Passages dupliqués les plus longs (mots · nb de paires concernées) :');
  for (const b of rapport.blocsCommunsLesPlusLongs.slice(0, 10)) {
    console.log(`    ${String(b.mots).padStart(4)} · ${String(b.paires).padStart(3)} · ${b.texte.slice(0, 100)}…`);
  }

  if (cible) {
    const chemin = path.isAbsolute(cible) ? cible : path.join(root, cible);
    await mkdir(path.dirname(chemin), { recursive: true });
    await writeFile(chemin, `${JSON.stringify(rapport, null, 2)}\n`, 'utf-8');
    console.log(`\n  Rapport écrit dans ${path.relative(root, chemin)}\n`);
  } else {
    console.log('');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
