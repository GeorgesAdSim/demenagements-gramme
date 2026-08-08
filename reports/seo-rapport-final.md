# Chantier SEO des pages communes — rapport final

Branche `seo/commune-pages-dedup`, cinq commits, partant de
`730e9e0` (`fix/reference-organisation-address`, un commit en avance sur `main`).
**Rien n'est déployé.**

---

## 1. Avant / après

Mesures produites par `scripts/seo-dup-report.mjs`, sur les **HTML pré-rendus**
et non sur le source. 70 pages communes, échantillon déterministe de 20 pages
soit 190 paires, blocs communs à partir de 8 mots consécutifs.

| Mesure | baseline | lot 2 | lot 3 | lot 4 |
|---|---|---|---|---|
| Mots par page (médiane) | 1 324 | 1 086 | 1 106 | 1 099 |
| Texte partagé entre 2 pages | 58,6 % | 47,5 % | 36,9 % | **36,4 %** |
| Texte unique entre 2 pages | 41,4 % | 52,5 % | 63,1 % | **63,6 %** |
| Texte partagé avec le reste du site | 69,9 % | 62,1 % | 45,7 % | **45,6 %** |
| Texte unique face au reste du site | 30,1 % | 37,9 % | 54,3 % | **54,4 %** |
| Mots uniques par page | 399 | 412 | 600 | **598** |
| Plus long bloc identique | 421 mots | 145 | 145 | **145** |

**La baseline mesurée diffère un peu de celle du brief** — 1 324 mots contre
~1 250, 58,6 % de partage contre 62 %, 421 mots de bloc commun contre 413.
Les écarts restent sous 10 %, seuil au-delà duquel le brief demandait de
s'arrêter. Ils s'expliquent par la méthode d'extraction : le `<head>` et le
JSON-LD sont retirés avant comptage, sans quoi les réponses de FAQ, recopiées
mot pour mot dans le balisage, seraient comptées deux fois.

Ce qui reste dupliqué, et pourquoi :

| Bloc | Mots | Pages | Statut |
|---|---|---|---|
| Formulaire de devis (libellés des champs, options de volume) | 145 | toutes | lot 2.3 bloqué, voir §7 |
| Carte « estimation rapide » du hero (libellés) | 49 | toutes | conservé — élément de conversion |
| En-tête et pied de page | 34 | toutes | navigation du site |
| Règlement de police partagé (Condroz, Pays de Herve) | 78-102 | 3 à 10 | fait réel : c'est le même document |

---

## 2. Fichiers modifiés, et pourquoi

**Sitemap**

| Fichier | Pourquoi |
|---|---|
| `scripts/sitemap.mjs` (nouveau) | Génère `sitemap.xml` depuis les pages réellement pré-rendues ; `lastmod` piloté par un hachage du contenu ; garde-fous bloquants |
| `data/sitemap-lastmod.json` (nouveau) | Mémoire versionnée `{url → hachage, lastmod}` — c'est elle qui rend le `lastmod` stable |
| `data/sitemap-pages.json` (nouveau) | Les 23 pages non-commune, avec leurs `changefreq`/`priority` d'origine |
| `data/sitemap-waves.json` (nouveau) | Mise en vagues des communes ; vague 1 ouverte, réserve tenue à jour |
| `public/sitemap.xml` (supprimé) | Seconde source de vérité que `prerender.mjs` complétait à l'aveugle |
| `scripts/prerender.mjs` | Appelle le générateur au lieu d'ajouter des URL à un fichier maintenu à la main |
| `scripts/verify-build.mjs` | Le contrôle « commune publiée ⇒ au sitemap » devient un contrôle de cohérence avec les vagues ; nouveau contrôle bloquant : toute commune doit rester liée depuis `/zones-intervention` |

**Contenu des pages communes**

| Fichier | Pourquoi |
|---|---|
| `src/pages/CommuneLandingPage.tsx` | Retrait de `ServicesCards` et `WhyUs`, ligne de liens, phrase d'ancienneté portée par la distance, hero paramétré, FAQ lue depuis les données, verrou de la fiche stationnement, lien contextuel |
| `src/components/ContactForm.tsx` | Prop `variant="locale"` : colonne de gauche non rendue, commune pré-remplie, lien vers le formulaire complet |
| `src/components/HeroSection.tsx` | Props `codesPostaux` et `accroche` ; sans elles, rendu inchangé |
| `src/data/communes.ts` | Champs `faqLocale`, `libelleSource`, `urlFormulaire`, `verifiePar` ; validations correspondantes |
| `src/data/communes.json` | 280 questions/réponses rédigées, 51 fiches stationnement complétées ; ordre des clés normalisé sur celui de `sync-communes.mjs` |
| `scripts/sync-communes.mjs` | Sait reprendre `faqLocale` depuis Supabase, et le conserver depuis le dépôt tant que la colonne n'existe pas |

**Outillage**

| Fichier | Pourquoi |
|---|---|
| `scripts/seo-dup-report.mjs` (nouveau) | Mesure la duplication sur les HTML livrés ; `npm run seo:dup` |
| `scripts/check-external-links.mjs` (nouveau) | Contrôle les liens sortants ; `npm run check:links` |
| `package.json` | Deux scripts npm ajoutés, aucun retiré, `build` inchangé |

---

## 3. Composants passés en variante conditionnelle — et la preuve

| Composant | Variante | Comportement par défaut |
|---|---|---|
| `ContactForm` | `variant="locale"` | Sans la prop : rendu identique |
| `HeroSection` | `codesPostaux`, `accroche` | Sans les props : rendu identique |
| `ServicesCards` | non modifié — simplement plus rendu sur les pages communes | — |
| `WhyUs` | non modifié — idem | — |

**Preuve.** Le dépôt a été rebâti à l'état d'origine (`730e9e0`) dans un
worktree séparé, puis comparé fichier à fichier au build final, en normalisant
les hachages d'assets de Vite :

- **70 fichiers HTML diffèrent : les 70 pages communes, et rien d'autre.**
- Accueil, `/contact-devis`, `/contact`, `/zones-intervention`, les 8 pages
  satellites, les 3 articles de blog et les 4 pages légales sont **identiques à
  l'octet**.
- Sur les **95 pages**, zéro divergence sur `<title>`, `meta description`,
  `canonical`, `og:title`, `og:description`, `twitter:card`, `robots`,
  `google-site-verification`, nombre de blocs JSON-LD et nombre de `<h1>`.

---

## 4. Documents de relecture

- **`reports/faq-a-completer.md`** — 70 pages sur 70 couvertes, 280 questions et
  280 réponses toutes distinctes. Aucune commune n'est restée sur la FAQ
  générique. Le document liste les 20 communes dont la réponse « autorisation »
  repose sur un aveu d'absence de procédure publiée, les affirmations
  opérationnelles à faire confirmer par l'exploitation (Francorchamps, tarifs de
  Beyne-Heusay, Huy, Seraing, Flémalle) et les questions « frontalières ».
- **`reports/stationnement-a-verifier.md`** — **c'est le document à relire avant
  toute nouvelle mise en ligne de fiche.** 50 fiches rendues avec leur autorité,
  les chiffres publiés et un niveau de confiance ; 24 sont classées « moyenne »
  parce que leur source est une page mutualisée de zone de police. 20 communes
  sans fiche. Ordre de traitement recommandé, en commençant par un appel à la
  zone de police Hesbaye qui débloquerait sept communes d'un coup.
- **`reports/seo-inventaire.md`** — inventaire du code produit avant toute
  modification (étape 0).

---

## 5. Liens externes

`npm run check:links`, sur les pages livrées : **29 liens éditoriaux, aucun
mort.** Détail dans `reports/external-links.json`.

- Maximum **1 lien externe par page commune** (plafond autorisé : 3).
- `target="_blank"` et `rel="noopener"` sur 100 % d'entre eux. Aucun `nofollow`.
- 25 ancres distinctes. Les réutilisations correspondent à des documents
  réellement partagés : le règlement du Condroz (10 communes), la fiche de la
  zone Pays de Herve (8), la page Eaglebe de Meuse-Hesbaye (6).

Trois avertissements, tous bénins :

- `policeliege.be` sert une chaîne de certificats incomplète — le lien
  fonctionne en navigateur, pas depuis Node. Défaut du site cité. Il n'apparaît
  que sur la satellite `/demenagement/demenagement-liege`.
- Deux liens des pages légales pointent vers des URL qui redirigent
  (`ec.europa.eu/consumers/odr`, `autoriteprotectiondonnees.be`). Hors périmètre.

Une redirection a été **corrigée** : l'URL d'Oupeye portait un `-1` parasite.

**20 communes sans lien**, faute de source fiable : Awans, Aywaille, Blegny,
Crisnée, Dalhem, Dison, Donceel, Faimes, Fexhe-le-Haut-Clocher, Geer, Jalhay,
Juprelle, Neupré, Oreye, Remicourt, Stoumont, Theux, Trois-Ponts, Trooz, Waimes.

---

## 6. Décisions prises seul, et ce qu'il faut vérifier

**`verify-build.mjs` a été assoupli.** Le contrôle « toute commune publiée doit
être au sitemap » rendait la mise en vagues impossible. Il est remplacé par un
contrôle de divergence dans les deux sens, plus un contrôle **nouveau et
bloquant** : toute commune générée doit rester liée depuis `/zones-intervention`.
Sans ce dernier, reporter une commune reviendrait à la rendre invisible.
→ À valider : c'est le seul garde-fou desserré du chantier.

**`public/sitemap.xml` a été supprimé.** Le sitemap est désormais généré.
→ À valider : plus personne ne peut ajouter une URL à la main.

**Liège n'est dans aucune vague.** Elle est servie par sa satellite, déjà
indexée et listée en permanence dans `sitemap-pages.json`. La vague 1 compte
donc 19 slugs de communes générées, pour 20 URL de niveau commune au sitemap.

**Les 51 fiches stationnement existantes sont marquées `verifiePar: "human"`.**
Décision prise avec votre accord explicite : elles étaient déjà servies en
production. **Je ne les ai pas revérifiées moi-même.** C'est l'objet de
`stationnement-a-verifier.md`.

**Les codes postaux entrent dans le `<h1>`** — « Votre déménagement à Waimes
(4950) & partout en Belgique ». `<title>` et `meta description` n'ont pas bougé.
→ À valider : c'est le seul changement visible sur un élément de premier plan.

**Le verrou `verifiePar` protège la fiche, pas la FAQ.** Une réponse de
`faqLocale` qui reprend un délai reste affichée même si la fiche repassait à
`null`. Sur les 50 communes concernées les deux textes ont la même source et la
même date, donc une relecture couvre les deux — mais le code ne détecte pas la
divergence.

---

## 7. Ce que je n'ai pas fait

**Le mini-formulaire à trois champs (lot 2.3).** Le schéma de `devis_requests`
n'existe dans aucune migration du dépôt, et le `.env` local ne contient que des
valeurs factices : les contraintes `NOT NULL`, les valeurs par défaut et les
politiques RLS ne sont pas vérifiables d'ici. Retirer une colonne de l'UI sans
connaître sa nullabilité casserait l'envoi en production sur 70 pages.

Livré à la place, avec votre accord : la variante compacte — toute la colonne de
gauche retirée (réassurances, coordonnées, horaires, photo, Facebook, TVA),
titre et une ligne, commune pré-remplie, lien vers le formulaire complet. Champs
et payload d'insertion **strictement inchangés**.

Pour débloquer :

```sql
select column_name, is_nullable, column_default
from information_schema.columns
where table_name = 'devis_requests'
order by ordinal_position;
```

Avec ce résultat, la réduction à trois champs est un petit commit.

**Les 2ᵉ et 3ᵉ liens externes par page.** Le lot en prévoyait 2 à 3 ; il n'y en a
qu'un. Formulaire sur URL distincte, déclaration de changement d'adresse, accès
au recyparc : leurs URL n'ont pas été relevées, et deviner une URL communale
produit un 404 sortant. C'est un chantier de collecte à part entière.

**La cible de 950 mots par page** n'est pas atteinte : 1 099. L'objectif qui
compte, lui, l'est largement — 63,6 % de texte unique contre 50 % visés. Les
deux leviers restants sont le mini-formulaire ci-dessus et la carte du hero
(≈ 50 mots identiques), conservée parce que c'est un élément de conversion.

**La collecte des 20 fiches stationnement manquantes.** Aucune donnée n'a été
extrapolée d'une commune voisine. Voir `stationnement-a-verifier.md`.

**`npm run lint` et `npm run typecheck` échouaient déjà avant ce chantier** et
échouent toujours à l'identique : la configuration ESLint est incompatible avec
ESLint 9 installé, et `tsc` remonte 22 erreurs, exactement les mêmes qu'avant
(comptées sur les deux états). Aucune ne touche un fichier modifié ici, et ni
l'un ni l'autre ne fait partie de `npm run build`. Hors périmètre, mais à
traiter.

**Aucun déploiement.** La branche est prête, cinq commits, un par lot.

---

## 8. Contrôles passés

- Build complet : **93 pages + 404 + app.html**, identique à l'origine. Aucune
  erreur bloquante.
- **Deux builds consécutifs produisent un `sitemap.xml` identique** — test
  d'acceptation du lot 1, vérifié après chaque lot.
- Sitemap : 42 URL — 23 pages non-commune + 19 communes de la vague 1. Aucune en
  404, aucune non pré-rendue. Les 51 communes hors vague restent servies en 200,
  indexables, et liées depuis `/zones-intervention`.
- `FAQPage` synchronisé mot pour mot avec la FAQ affichée : **76 pages sur 76**.
- Un seul `<h1>` par page, portant le nom de la commune. Aucun saut de niveau de
  titre. Le lien « Aller au contenu principal » fonctionne.
- `noindex` : **404.html uniquement**.
- Consentement RGPD et lien vers la politique de confidentialité présents sur
  les 70 pages communes.
- Rendu mobile (375 × 812) contrôlé sur Waimes et Seraing : hero, ligne de
  prestations, fiche stationnement, formulaire compact avec commune pré-remplie.
  Aucune nouvelle erreur console.
- Aucun `undefined`, `NaN` ni `[object Object]` dans le HTML livré.

---

## 9. Hors code — à faire après déploiement

1. Resoumettre le sitemap dans Search Console.
2. Demander l'indexation manuelle de 5 à 8 communes de la vague 1.
3. Fiche Google Business Profile avec zone de service couvrant la vague 1.
4. Citations locales et premiers backlinks.
5. Deux à trois semaines plus tard : si la majorité de la vague 1 est passée en
   « Indexée », déplacer 10 à 15 slugs de `enAttente` vers `wave2` dans
   `data/sitemap-waves.json`. Le build vérifie le reste.

Sans ces signaux, l'allègement ne suffira pas à déclencher le crawl : les 72 URL
n'ont à ce jour **jamais** été explorées.
