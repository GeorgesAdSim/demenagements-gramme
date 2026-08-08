// scripts/sync-communes.mjs
//
// Régénère src/data/communes.json depuis la table Supabase `communes`, au tout
// début du build.
//
// Pourquoi passer par le JSON plutôt que lire Supabase depuis prerender.mjs :
// le JSON reste la source unique du pré-rendu, du contrôle de build et du
// client. Un seul point d'entrée réseau, en début de chaîne, là où un échec est
// visible et rattrapable — au lieu d'une dépendance réseau répartie dans trois
// scripts.
//
// Trois issues, et la distinction entre elles est délibérée :
//
//  · Supabase non configuré (build local, conteneur de développement) : le JSON
//    du dépôt est conservé, le build continue. C'est le cas normal hors Netlify.
//
//  · Supabase injoignable (panne, réseau) : JSON conservé, build continue. La
//    panne est transitoire, et bloquer tout déploiement parce que le CMS tousse
//    serait disproportionné.
//
//  · Supabase répond mais renvoie trop peu de lignes : le build ÉCHOUE. Ce cas
//    signale une erreur permanente, typiquement une politique RLS mal reprise.
//    Un échec de déploiement est bruyant et sans conséquence — le déploiement
//    précédent reste en ligne. Un build « réussi » qui ignore silencieusement
//    les modifications que Gramme vient d'enregistrer est bien pire : il ne se
//    voit pas, et il détruit la confiance dans le back-office.
//
// Usage : node scripts/sync-communes.mjs
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cible = path.join(root, 'src/data/communes.json');

// Les mêmes variables que le client. Sur Netlify, elles viennent des variables
// d'environnement du site ; en local, de .env — où elles sont des valeurs
// factices, ce qui fait tomber le script dans son repli.
const url = process.env.VITE_SUPABASE_URL;
const cle = process.env.VITE_SUPABASE_ANON_KEY;

// Un fetch qui réussit mais renvoie trop peu de lignes est plus dangereux qu'un
// fetch qui échoue : une politique RLS mal reprise renverrait 0 ligne, et le
// build effacerait les 84 communes sans rien signaler. On refuse d'écrire en
// dessous de ce seuil, exprimé en proportion de ce que contient déjà le dépôt.
const SEUIL_PERTE = 0.8;

/**
 * Colonnes SQL en snake_case → champs de l'interface CommuneSEO.
 *
 * `depot` est la ligne correspondante déjà présente dans le JSON du dépôt. Elle
 * sert de repli pour les champs dont la table n'a PAS encore la colonne.
 *
 * Sans ce repli, une table en retard sur le schéma efface silencieusement du
 * contenu à chaque déploiement : c'est exactement ce qui est arrivé à
 * `sectionsLocales`, `autorisationStationnement` et `todoDonneesLocales`, que
 * ce mappeur ne connaissait pas. Le build passait, et 70 communes perdaient
 * leur rédaction sans qu'aucune alerte ne se déclenche.
 *
 * La distinction est entre « la colonne existe et vaut NULL » — la base a
 * autorité, on efface — et « la colonne n'existe pas » — la base n'a rien à
 * dire, on garde le dépôt.
 */
function versCommuneSEO(r, depot = {}) {
  const c = {
    id: r.id,
    nom: r.nom,
    codesPostaux: r.codes_postaux ?? [],
    distanceDepotKm: r.distance_depot_km,
    tempsTrajetEstimeMin: r.temps_trajet_estime_min,
    villages: r.villages ?? [],
    communesVoisines: r.communes_voisines ?? [],
    statut: r.statut,
  };
  // Champs optionnels : on ne les écrit que s'ils portent une valeur, pour que
  // le JSON reste lisible en revue de diff et ne se remplisse pas de null.
  if (r.arrondissement) c.arrondissement = r.arrondissement;
  if (r.introduction_locale) c.introductionLocale = r.introduction_locale;
  if (r.informations_locales?.length) c.informationsLocales = r.informations_locales;
  if (r.date_verification) c.dateVerification = r.date_verification;
  if (r.page_existante) c.pageExistante = r.page_existante;

  // Champs éditoriaux ajoutés après la création de la table. Repli sur le dépôt
  // tant que la migration correspondante n'est pas appliquée.
  reprendre(c, 'sectionsLocales', r, 'sections_locales', depot, (v) => v.length > 0);
  reprendre(c, 'autorisationStationnement', r, 'autorisation_stationnement', depot);
  reprendre(c, 'todoDonneesLocales', r, 'todo_donnees_locales', depot);
  reprendre(c, 'faqLocale', r, 'faq_locale', depot, (v) => v.length > 0);

  return c;
}

/**
 * Écrit `champ` depuis la colonne si elle existe dans la réponse, sinon depuis
 * le dépôt. `garder` filtre les valeurs vides pour ne pas polluer le JSON.
 */
function reprendre(cible, champ, ligne, colonne, depot, garder = Boolean) {
  const valeur = colonne in ligne ? ligne[colonne] : depot[champ];
  if (valeur != null && garder(valeur)) cible[champ] = valeur;
}

/** Ordre des clés figé, pour que deux synchronisations identiques donnent un diff vide. */
const ORDRE = [
  'id', 'nom', 'arrondissement', 'codesPostaux', 'distanceDepotKm',
  'tempsTrajetEstimeMin', 'villages', 'communesVoisines', 'introductionLocale',
  'informationsLocales', 'sectionsLocales', 'autorisationStationnement',
  'faqLocale', 'todoDonneesLocales', 'dateVerification', 'pageExistante', 'statut',
];

function ordonner(c) {
  const out = {};
  for (const k of ORDRE) if (k in c) out[k] = c[k];
  return out;
}

async function main() {
  const actuel = JSON.parse(await readFile(cible, 'utf-8'));
  const nbActuel = actuel.communes.length;

  if (!url || !cle || url.includes('placeholder')) {
    console.log(`  sync communes : Supabase non configuré — ${nbActuel} communes conservées depuis le dépôt.`);
    return;
  }

  let lignes;
  try {
    const rep = await fetch(`${url}/rest/v1/communes?select=*&order=nom.asc`, {
      headers: { apikey: cle, Authorization: `Bearer ${cle}` },
      signal: AbortSignal.timeout(20000),
    });
    if (!rep.ok) throw new Error(`HTTP ${rep.status} ${await rep.text()}`);
    lignes = await rep.json();
  } catch (e) {
    console.warn(`  ⚠ sync communes : Supabase injoignable (${e.message}) — ${nbActuel} communes conservées depuis le dépôt.`);
    return;
  }

  if (!Array.isArray(lignes) || lignes.length < nbActuel * SEUIL_PERTE) {
    console.warn(
      `  ⚠ sync communes : ${Array.isArray(lignes) ? lignes.length : 'aucune'} ligne(s) reçue(s) contre ${nbActuel} dans le dépôt — ` +
      `écriture refusée, le JSON existant est conservé. Vérifie la politique RLS de lecture.`
    );
    process.exitCode = 1;
    return;
  }

  // Index du dépôt, pour que chaque ligne retrouve son repli.
  const parId = new Map(actuel.communes.map((c) => [c.id, c]));

  const communes = lignes
    .map((r) => versCommuneSEO(r, parId.get(r.id) ?? {}))
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
    .map(ordonner);

  // Garde-fou explicite : si la table n'a pas encore les colonnes éditoriales,
  // le repli a joué et il faut que ça se voie dans le log de build.
  const manquantes = ['sections_locales', 'autorisation_stationnement', 'todo_donnees_locales']
    .filter((col) => !(col in (lignes[0] ?? {})));
  if (manquantes.length > 0) {
    console.warn(
      `  ⚠ sync communes : colonne(s) absente(s) de la table — ${manquantes.join(', ')}. ` +
      `Les valeurs du dépôt sont conservées pour ces champs. ` +
      `Applique supabase/migrations/20260802120000_communes_champs_editoriaux.sql pour aligner la base.`
    );
  }

  const avant = JSON.stringify(actuel.communes);
  const apres = JSON.stringify(communes);

  await writeFile(cible, JSON.stringify({ communes }, null, 2) + '\n', 'utf-8');

  const publiees = communes.filter((c) => c.statut === 'published').length;
  console.log(
    `  sync communes : ${communes.length} communes depuis Supabase, dont ${publiees} publiée(s)` +
    (avant === apres ? ' — identique au dépôt.' : ' — le dépôt a été mis à jour.')
  );
}

main().catch((e) => {
  // Même un plantage inattendu ne doit pas interrompre un déploiement.
  console.warn(`  ⚠ sync communes : ${e?.message || e} — JSON du dépôt conservé.`);
});
