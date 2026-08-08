# État du chantier et priorités

Arrêté le 2026-08-08, révisé le même jour après la mise en production de la
mesure des conversions. Document de reprise : il doit suffire à repartir sans
le contexte de la conversation qui l'a produit.

---

# PRIORITÉ 1 — Deux contrôles datés

La mesure des conversions est livrée et publiée, section suivante. Ce qui reste
en tête de liste n'est plus du travail : ce sont deux vérifications qui ne
peuvent pas être faites plus tôt.

## Vers le 10 août — `generate_lead` n'est pas compté deux fois

Dans GA4 → Admin → Événements, confirmer que `generate_lead` n'apparaît
**qu'une seule fois**.

L'événement clé a été déclaré par « Créer un événement → Créer avec du code »,
faute de pouvoir étoiler un événement absent de la liste des événements
récents — celle-ci s'appuie sur des données traitées, avec 24 à 48 h de
latence. C'est le bon chemin, mais c'est le même écran que celui des événements
dérivés : si la déclaration s'était transformée en règle de création, chaque
conversion serait comptée deux fois. Comparer le total du rapport avec ce que
montre DebugView tranche en une minute.

## Vers le 15 août — le J+7 du déploiement du 8

Dans Search Console, sur 5 ou 6 communes de la vague 1 : la **date de dernière
exploration** dans l'inspection d'URL.

- Renseignée → la mise en vagues fonctionne, ouvrir la vague 2 en déplaçant
  10 à 15 slugs de `enAttente` vers `wave2` dans `data/sitemap-waves.json`.
- Toujours vide → le problème est l'autorité du domaine, et ajouter des pages
  n'y changera rien. Basculer l'effort sur la fiche Google Business Profile et
  les signaux externes.

---

# Mesure des conversions — livrée le 8 août

Le site mesurait les vues de page et rien d'autre : GA4 disait combien de gens
venaient, jamais combien demandaient un devis. Il mesure désormais les deux.

C'est cette seconde donnée qui doit trancher l'arbitrage « 3 pages de service
contre 68 pages communes », et la question du regroupement des petites communes
par zone. **Rien de tout cela ne se décide avant plusieurs semaines de
chiffres.**

## Identifiants

| | |
|---|---|
| Conteneur GTM | `GTM-M7C3PW95` — version 3, publiée le 8 août |
| Propriété GA4 | `G-2BZCZJ101P` |
| Couche de données | `dataLayer`, avec `env` valant `dev`, `preview` ou `production` |

## Côté dépôt — PR #37

`src/lib/mesure.ts` est le **seul** point d'envoi vers la couche de données.
Deux verrous avant tout push : l'absence de `window`, pour que le pré-rendu des
95 pages ne tente rien, et un consentement qui vaut `accepted`, lu par
`lireConsentement()` de `src/lib/consentement.ts`. Le cas « pas encore choisi »
vaut refus, comme partout ailleurs dans le site. Conséquence assumée : une
demande envoyée bannière encore ouverte n'est pas comptée.

| Événement | Paramètres | D'où il part |
|---|---|---|
| `generate_lead` | `source_formulaire`, `service_type`, `page_origine` | les 4 points d'insertion `devis_requests`, **après** retour sans erreur |
| `clic_telephone` | `numero_appele`, `page_origine` | écouteur délégué monté dans `App.tsx`, couvre les 27 liens `tel:` et tout lien futur |
| `estimation_photos` | `emplacement` — `hero`, `formulaire` ou `navigation` —, `page_origine` | les 3 liens vers l'estimateur, menu Services compris |

Rien de nominatif n'est envoyé : ni e-mail, ni téléphone du visiteur, ni
adresse.

Trois des quatre formulaires ignoraient complètement le `error` de Supabase et
affichaient un succès inconditionnel. **Ce comportement n'a pas été corrigé** —
c'est un chantier à part — mais `error` est désormais capturé, pour que la
conversion ne se compte que si la base a bien accepté la demande.

## Côté GTM — hors dépôt

6 variables de couche de données (`DL - env`, `DL - source_formulaire`,
`DL - service_type`, `DL - page_origine`, `DL - emplacement`,
`DL - numero_appele`), 3 déclencheurs « Événement personnalisé » aux noms
exacts, 3 balises « Événement GA4 » rattachées à la balise Google existante.

Aucun déclencheur « Envoi de formulaire » ni « Liens uniquement » : les
formulaires sont en React et écrivent en AJAX, l'écouteur natif ne verrait rien
ou se déclencherait sur des envois qui échouent. Toute la détection est faite
côté site, GTM ne fait qu'écouter le `dataLayer`.

**Tous les déclencheurs portent la condition `DL - env` = `production`.** La
balise Google est passée de `Initialization - All Pages` à un déclencheur
`Initialisation — production` du **même type** : une exception ne bloque une
balise que si elle est du même type que le déclencheur qui l'allume, et un
déclencheur d'événement personnalisé n'aurait jamais bloqué une balise
d'initialisation.

Vérifié dans les deux sens. En production, les trois balises se déclenchent et
les événements arrivent en DebugView avec leurs paramètres. Sur
`deploy-preview-37--demenagements-gramme.netlify.app`, le `dataLayer` se
remplit normalement — le site fait son travail — et **aucune requête ne sort**
vers `google-analytics.com`.

Le filtrage échoue du bon côté : si `env` venait à manquer, plus rien ne serait
mesuré. On perd de la donnée plutôt que d'en polluer. Si la mesure s'arrête un
jour sans raison apparente, c'est la première chose à regarder.

Effet de bord à connaître : le mode Aperçu ne montre plus rien depuis
`localhost` ni depuis une prévisualisation. C'est voulu, mais ça surprend.

## Côté GA4

`generate_lead` marqué événement clé, **sans valeur monétaire par défaut** —
GA4 proposait 1 $, ce qui aurait injecté un chiffre d'affaires fictif dans les
rapports. Les quatre paramètres enregistrés en dimensions personnalisées de
**portée événement** : sans cet enregistrement ils arrivent bien, mais restent
invisibles dans les rapports. Conservation des données d'événement portée de 2
à **14 mois**, ce qu'annonce la politique de confidentialité. Search Console
associée au flux Web.

Ni les événements clés ni les dimensions ne sont rétroactifs : ils ne valent
que pour les données collectées à partir du 8 août.

## Deux réserves connues

**`page_title` décalé sur les navigations internes.** Le site est une
application React, et `react-helmet-async` écrit le titre dans un effet, donc
après le `pushState` qui déclenche le `page_view`. Le chemin envoyé est
correct — vérifié, un second `page_view` part bien à chaque changement de
route —, mais le titre est celui de la page précédente. Contournement
immédiat : dans « Pages et écrans », remplacer la dimension par défaut « Titre
de la page et classe d'écran » par « Chemin de la page ». Le corriger vraiment
supposerait de désactiver la mesure améliorée sur les changements d'historique
et d'émettre le `page_view` soi-même après Helmet : on échangerait un titre
décalé contre une mesure de pages vues dont on deviendrait responsable. Laissé
tel quel.

**Alerte « taux de consentement de 0 % ».** À ne pas lire comme un refus
massif : sur la période concernée la propriété affiche 0 session, et les
signaux sont décrits comme *inactifs*, pas *refusés*. La collecte n'existait
pas avant le 8 août. À relire quand il y aura du volume ; si elle persiste, la
piste sera le taux de refus réel du bandeau, pas la configuration.

Le site est en opt-in strict et **mondial** : les conversions mesurées ne
seront jamais qu'une fraction des conversions réelles. À garder en tête au
moment de comparer les pages entre elles — le rapport entre les deux doit
rester constant pour que la comparaison tienne.

---

# Ce qui est livré et en production

Cinq fusions le 8 août : PR #33, #34, #35, #36 et #37.

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

Puis les trois événements de conversion et le filtrage `env` : voir la section
« Mesure des conversions » en tête de document.

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
4. Compte Tag Manager : un seul administrateur. Le panneau « Qualité du
   conteneur » recommande d'en ajouter un second — relève des permissions du
   compte Google.

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
