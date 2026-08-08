# Inventaire du code — chantier SEO pages communes

Relevé le 2026-08-08, sur la branche `seo/commune-pages-dedup` (partant de
`fix/reference-organisation-address`, un commit en avance sur `main`).

## Gabarit d'une page commune

| Élément | Fichier |
|---|---|
| Composant de page | `src/pages/CommuneLandingPage.tsx` |
| Route | `/demenagement/:slug`, préfixe `demenagement-` découpé par `slugDepuisSegment` (`src/data/communes.ts`) |
| Balises SEO | `src/components/SeoHead.tsx` |
| JSON-LD | `src/components/SchemaOrg.tsx` |

Ordre de rendu actuel : `TopBar` → `ServiceNavbar` → `HeroSection` → section
locale (fil d'Ariane, H2 « Déménageur à X depuis 1948 », intro locale,
paragraphe entreprise, 3 tuiles de repères, `sectionsLocales`, autorisation de
stationnement, `informationsLocales`, villages, FAQ, maillage voisines, CTA) →
`ServicesCards` → `WhyUs` → `ContactForm` → `MobileCTA` → `Footer`.

## Source de données des communes

`src/data/communes.json` (84 communes) — source unique, lue à l'identique par
Vite (`src/data/communes.ts`) et par les scripts Node du build. Régénérée depuis
Supabase par `scripts/sync-communes.mjs` au début du build ; en local, les
identifiants sont factices et le script conserve le JSON du dépôt.

Champs disponibles par commune (`CommuneSEO`, `src/data/communes.ts`) :
`id`, `nom`, `arrondissement?`, `codesPostaux[]`, `distanceDepotKm|null`,
`tempsTrajetEstimeMin|null`, `villages[]`, `communesVoisines[]`,
`introductionLocale?`, `informationsLocales?[]`,
`sectionsLocales?[{titre, contenu}]`, `autorisationStationnement?`,
`todoDonneesLocales?`, `dateVerification?`, `pageExistante?`,
`statut: 'draft'|'published'`.

Couverture mesurée : 71 communes `published`, dont **70 pages générées**
(Liège est servie par une satellite). 74 ont une `introductionLocale`, 70 des
`sectionsLocales`, 70 des `informationsLocales`, **51 un
`autorisationStationnement` déjà relevé sur source officielle**.

## Composants partagés et pages qui les utilisent

| Composant | Utilisé par |
|---|---|
| `ServicesCards` | `PublicSite` (accueil), `CommuneLandingPage` |
| `WhyUs` (bloc « 78 ans ») | `PublicSite` (accueil), `CommuneLandingPage` |
| `ContactForm` | `PublicSite`, `ZonesInterventionPage`, `HomePage`, `satellites/DemenagementLiege`, `CommuneLandingPage` |
| `HeroSection` | `PublicSite` (sans `cityName`), `CommuneLandingPage` (`cityName`) |

## Formulaire de devis

`src/components/ContactForm.tsx` → `supabase.from('devis_requests').insert({...})`
avec `service_type, firstname, lastname, email, phone, departure_city,
arrival_city, move_date, volume, message`. Notification e-mail best-effort vers
`/api/send-devis-email` (`netlify/functions/send-devis-email.mts`).

**Le schéma de `devis_requests` n'existe dans aucune migration du dépôt** —
`supabase/migrations/` ne contient que la table `communes`. Le `.env` local ne
porte que des valeurs factices : les contraintes `NOT NULL` et les politiques
RLS ne sont donc **pas vérifiables depuis ce dépôt**. Conséquence pour le
lot 2.3, voir le rapport final.

Les mêmes colonnes sont insérées par `src/pages/ContactDevisPage.tsx` et
`src/pages/ContactPage.tsx`, tous deux hors périmètre.

## Sitemap

Pas de générateur : `public/sitemap.xml` est maintenu **à la main** (24 URL,
`lastmod` réfléchis). `scripts/prerender.mjs` → `completerSitemap()` y ajoute
après coup les URL de communes absentes, avec
`lastmod = new Date()` — **c'est l'origine du `lastmod` mouvant**. Comme
`dist/sitemap.xml` est recopié depuis `public/` à chaque `vite build`, les 69
URL de communes sont réinsérées à chaque build avec la date du jour.

## FAQ affichée et `FAQPage`

Les deux viennent de la **même** fonction `construireFaq(commune)` dans
`src/pages/CommuneLandingPage.tsx` : le tableau est passé à `SchemaOrg`
(`customFaq`) et rendu dans la section « Questions fréquentes ». La
synchronisation est donc structurelle. Les 4 questions sont des gabarits à
variables (distance/durée, villages, stationnement, devis).

`src/data/faq.ts` sert l'accueil, pas les pages communes.

## Pré-rendu

`scripts/prerender.mjs` — liste de routes en dur + communes lues depuis
`communes.json`. Produit **93 pages + 404 + app.html**. Écrit des fichiers plats
(`x.html`, pas `x/index.html`).

## Contrôles bloquants avant déploiement

`npm run build` = `sync:communes` → `build:client` → `build:ssr` → `prerender` →
`verify` (`scripts/verify-build.mjs`, 12 familles de contrôles, `exit 1` en cas
d'erreur). Points qui contraignent ce chantier :

- **12a** : toute commune publiée doit être **présente dans le sitemap**, sinon
  erreur bloquante. La segmentation en vagues du lot 1 entre en conflit direct
  avec ce contrôle — il doit être assoupli, pas contourné.
- **9** : aucune page orpheline (chaque page doit recevoir un lien interne).
- **2** : canonical auto-référent exact, `title`/`description` présents, JSON-LD
  valide, `LocalBusiness` avec `name` + `address`, un seul `<h1>`.
- **7** : aucune URL du sitemap en 404 ni en redirection.

`npm run lint` et `npm run typecheck` existent mais ne sont pas dans `build`.
