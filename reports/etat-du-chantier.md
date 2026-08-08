# État du chantier et priorités

Arrêté le 2026-08-08. Document de reprise : il doit suffire à repartir sans le
contexte de la conversation qui l'a produit.

---

# PRIORITÉ 1 — Événements de conversion GA4

**À faire en premier.** Tout le reste attend, y compris les décisions listées
plus bas.

## Pourquoi maintenant

Le consentement et Tag Manager sont en production depuis le 8 août, et la
balise GA4 fonctionne : un test sur le site en ligne a produit les cookies
`_ga` et `_ga_2BZCZJ101P` et une requête vers `region1.google-analytics.com`
avec `tid=G-2BZCZJ101P`. Le site mesure donc déjà les vues de page, **mais
aucune conversion**. Sans elles, GA4 dit combien de gens sont venus, jamais
combien ont demandé un devis — et c'est cette seconde donnée qui doit trancher
l'arbitrage « 3 pages de service contre 68 pages communes ».

## Identifiants

| | |
|---|---|
| Conteneur GTM | `GTM-M7C3PW95` |
| Propriété GA4 | `G-2BZCZJ101P` |
| Couche de données | `dataLayer`, avec une variable `env` valant `dev`, `preview` ou `production` |

## Trois événements à poser

### 1. `generate_lead` — soumission du formulaire de devis

C'est la conversion principale. Le piège : **le formulaire s'insère depuis
quatre endroits distincts**, et ils ne partagent aucun code.

| Fichier | Contexte |
|---|---|
| `src/components/ContactForm.tsx` | accueil, pages communes, zones, satellite Liège, pages de service |
| `src/pages/ContactDevisPage.tsx` | `/contact-devis` |
| `src/pages/ContactPage.tsx` | `/contact` |
| `src/pages/EstimationVolumePage.tsx` | `/estimation-volume` |

Tous appellent `supabase.from('devis_requests').insert({...})`.

**Ne pas recopier l'appel quatre fois.** Écrire un helper unique — par exemple
`src/lib/mesure.ts` — et l'appeler depuis chacun, **après** le retour sans
erreur de l'insertion. Une conversion comptée avant confirmation gonfle le
chiffre de tous les envois qui échouent.

Paramètres utiles à pousser : la page d'origine, et le type de service
(`service_type`, déjà présent dans le payload). Ne rien envoyer qui identifie
la personne — ni e-mail, ni téléphone, ni adresse : GA4 l'interdit et c'est
une donnée personnelle.

### 2. `clic_telephone`

Le numéro apparaît dans **19 fichiers**. Ne pas les modifier un par un :
poser **un écouteur délégué** au montage de l'application, qui intercepte les
clics sur `a[href^="tel:"]`. Un seul point de code, et tout lien ajouté plus
tard est couvert d'office.

### 3. `estimation_photos`

Clic vers `/estimation-volume`, depuis `src/components/HeroSection.tsx` et
`src/components/ContactForm.tsx`. C'est le différenciateur du site — aucun
concurrent suivi n'a l'équivalent — donc il mérite sa propre mesure, distincte
du devis.

## Contrainte de consentement

Le helper ne doit **rien** envoyer si le consentement est refusé. En pratique
Consent Mode s'en charge côté Google, mais pousser dans le `dataLayer` reste
inutile et brouille le débogage. Lire `lireConsentement()` de
`src/lib/consentement.ts`, qui est la seule source de cette décision.

## Côté GTM, hors dépôt

1. Un déclencheur par événement personnalisé, une balise GA4 « Événement » pour
   chacun.
2. Marquer `generate_lead` comme **conversion** dans GA4.
3. **Publier** le conteneur.

## ⚠️ À faire avant tout le reste, dans GTM

**L'exception sur `env` ≠ `production` n'est pas configurée.** Le conteneur se
charge aussi sur les déploiements de prévisualisation, où la balise GA4 est
active : à la prochaine pull request, le trafic de test entrera dans
`G-2BZCZJ101P` et polluera les données que ce chantier sert à produire.

Déclarer `env` en variable de couche de données, puis l'ajouter en exception du
déclencheur. La variable est déjà poussée par le site : rien à redéployer.

Deux réglages GA4 au passage : conservation des données à **14 mois** (le défaut
est de 2, et la politique de confidentialité annonce 14) et **association à
Search Console**.

---

# Ce qui est livré et en production

Trois fusions le 8 août : PR #33, #34, #35.

## Pages communes — dé-duplication

| Mesure | Avant | Après |
|---|---|---|
| Mots par page | 1 324 | 1 111 |
| Texte unique entre deux pages | 41,4 % | **62,8 %** |
| Texte unique face au reste du site | 30,1 % | **53,8 %** |
| Plus long bloc identique | 421 mots | **145** |

- `ServicesCards` et `WhyUs` retirés des pages communes ; `ContactForm` a une
  variante `locale`. Sans prop, toutes les autres pages sont inchangées à
  l'octet.
- **280 questions de FAQ rédigées commune par commune, toutes distinctes.** Le
  balisage `FAQPage` vient de la même source, donc identique mot pour mot.
- Fiches d'autorisation de stationnement : verrou `verifiePar` — une fiche non
  relue n'est pas rendue. 50 fiches rendues, 20 communes sans fiche.

## Sitemap

- `lastmod` piloté par un **hachage du contenu rendu**, mémorisé dans
  `data/sitemap-lastmod.json`, versionné. Deux builds sans modification
  produisent un sitemap identique.
- **Mise en vagues** : 19 communes déclarées, 51 en attente. Les 51 restent
  routées, indexables et liées — un contrôle de build le vérifie page par page.
- Le fichier `data/sitemap-lastmod.json` doit être **committé après chaque
  déploiement qui change du contenu**, sinon les dates rebougent à chaque build.

## Siège social

Déménagé de Rue des Naiveux 64 à Herstal vers **Voie du Belvédère 1, 4100
Seraing**. `src/data/entreprise.ts` est la source unique — adresse, position,
téléphone, TVA, nœuds schema.org. 22 emplacements en dur supprimés, plus les
pages légales, `llms.txt`, la carte et le garde-meubles.

**Le dépôt n'a pas bougé** : rue de la Digue à Oupeye, et toutes les distances
de `communes.json` sont mesurées depuis lui. Voir l'avertissement en tête de
`src/data/communes.ts` — cette confusion a déjà faussé 37 relevés, et un audit
externe l'a refaite en août.

## Audit technique

Espaces des H1 · `sizes` du hero corrigé de 70vw à 100vw · CTA d'en-tête unifié
vers `/contact-devis` · deux titles ramenés sous 60 caractères · `sameAs`,
`logo`, dimanche fermé dans le JSON-LD · bouton du menu mobile porté à 48×48 ·
mécanisme `liensAssocies` pré-rendu · 22 communes de l'accueil converties en
liens · 4 ancres « En savoir plus » remplacées. L'accueil passe de 8 à 37 URL
sortantes.

## Mesure

Tag Manager derrière Consent Mode v2 en `denied`, bandeau de consentement
réécrit — le précédent n'était relié à rien —, lien « Gérer mes cookies » et
section 8 de la politique de confidentialité mise à jour.

---

# En suspens

## Décisions attendues

| | Sujet | Pourquoi c'est bloqué |
|---|---|---|
| P1.7 | `/contact` vs `/contact-devis` | Même H1, deux pages sur la même intention. Fusion avec 301, ou différenciation ? Le CTA d'en-tête pointe déjà vers `/contact-devis`, sans rien rediriger |
| P1.8 | `/garde-meubles` vs `/garde-meubles/garde-meubles-liege` | Title strictement identique |
| — | **Horaires contradictoires** | Le pied de page dit mardi-vendredi 17h, `llms.txt` dit lundi-vendredi 18h et samedi 8h-12h. Le samedi reste hors du JSON-LD tant que la version vraie n'est pas connue |
| — | **Certificat de l'apex** | `https://demenagements-gramme.be` échoue en TLS — le certificat servi est le `*.netlify.app` par défaut. L'alias est déclaré, le DNS pointe bien, le certificat n'a jamais été réémis. Reporté à la demande de Georges |

## Branches non fusionnées

- **`seo/pages-service-p1`** — socle de `/vide-maison` et `/prix-demenagement`,
  verrouillé. Les pages ne sont ni pré-rendues, ni au sitemap, ni dans la
  navigation tant que `verifiePar` n'est pas `'human'` et que
  `donneesManquantes` n'est pas vide. **Il manque 15 données métier**, listées
  dans `reports/donnees-metier-a-valider.md`. Publication différée jusqu'à ce
  que le crawl du 8 août retombe.

## À faire en back-office, pas dans le dépôt

1. Table `config` de Supabase : porte encore l'ancienne adresse. Non lue par le
   site public, donc sans urgence.
2. `informationsLocales` de Herstal : annonce « Commune du siège social ».
3. URL d'Oupeye dans `autorisationStationnement` : contient un `-1` parasite qui
   provoque une redirection. `sourceUrl` appartient au CMS, une correction dans
   le dépôt serait écrasée à la synchro suivante.

## À observer vers le 15 août

Le J+7 du déploiement du 8 août. Dans Search Console, sur 5 ou 6 communes de la
vague 1 : la **date de dernière exploration** dans l'inspection d'URL.

- Renseignée → la mise en vagues fonctionne, ouvrir la vague 2 en déplaçant
  10 à 15 slugs de `enAttente` vers `wave2` dans `data/sitemap-waves.json`.
- Toujours vide → le problème est l'autorité du domaine, et ajouter des pages
  n'y changera rien. Basculer l'effort sur la fiche Google Business Profile et
  les signaux externes.

## Points éditoriaux relevés, non tranchés

1. « Satisfaction client supérieure à 95 % » cohabite sur l'accueil avec
   « 4,0/5 sur Google (24 avis) ».
2. Sur l'accueil, l'autorisation de stationnement à Liège est attribuée tantôt à
   la Ville, tantôt à la zone de police, dans la même page.
3. Quatre visuels sont chargés depuis `images.unsplash.com` — dépendance tierce
   et photo générique là où une photo réelle servirait la crédibilité locale.
4. Lisibilité : phrases longues sur les pages communes.
5. Hiérarchie plate sur les pages communes : beaucoup de H2, aucun H3.
6. Les pages communes restent proches les unes des autres. Une trentaine de
   petites communes posent la question d'un regroupement par zone — **à décider
   après quelques semaines de données GA4 et Search Console, pas avant**. Ne
   supprimer ni passer en `noindex` aucune page sans instruction explicite.

---

# Outils du dépôt

| Commande | Ce qu'elle fait |
|---|---|
| `npm run build` | Synchro Supabase, build, pré-rendu, contrôles bloquants |
| `npm run verify` | Contrôles seuls, sur `dist/` |
| `npm run seo:dup` | Duplication entre pages communes, sur les HTML livrés |
| `npm run check:links` | Liens externes ; échoue sur 404/410, avertit sur le reste |

`npm run lint` et `npm run typecheck` échouaient déjà avant ce chantier et
échouent toujours à l'identique — configuration ESLint incompatible avec la
version installée, et 22 erreurs de typage préexistantes. Aucune ne fait partie
de `npm run build`.
