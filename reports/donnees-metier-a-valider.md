# Données métier à valider — pages de service P1

Document de validation pour Gramme. Établi le 2026-08-08.

**Aucun chiffre de ce document n'est publié.** Les deux pages `/vide-maison` et
`/prix-demenagement` sont verrouillées dans le code : elles ne sont ni
pré-rendues, ni au sitemap, ni dans la navigation, et leur URL tombe en 404 en
production. Le verrou ne se lève qu'en passant `verifiePar: 'human'` **et** en
vidant `donneesManquantes` dans `src/data/pages-service.ts`. Le contrôle de
build refuse l'un sans l'autre.

## Ce qu'une source externe a permis de relever — et ce qu'elle n'a pas

Une source externe du groupe, à la même adresse que le siège, a été consultée à
la demande de Gramme. **Elle ne publie pratiquement aucun prix** : sa page de
tarifs expose des principes de tarification et renvoie au devis. Le raccourci
« ce sont les mêmes prix » ne donne donc rien d'exploitable sur les deux points
qui comptent le plus.

Deux réserves de fond, avant même la question des chiffres :

1. Cette source affiche un **numéro de téléphone différent** de celui de Gramme.
   Deux marques distinctes à la même adresse, c'est fréquemment le signe d'un
   positionnement tarifaire distinct — c'est même l'une des raisons d'avoir deux
   marques. Reprendre une grille de l'une pour l'autre est une hypothèse, pas
   une donnée.
2. Un prix relevé chez un tiers n'a **ni date, ni source vérifiable** du point de
   vue d'un lecteur de la page Gramme. C'est exactement la faiblesse que le
   verrou `verifiePar` des fiches de stationnement a été créé pour empêcher.

### Relevé utile — à confirmer

| Donnée | Valeur relevée | Statut |
|---|---|---|
| Hauteur maximale du lift | 42 mètres | **à confirmer pour le matériel de Gramme** |
| Étages atteignables | jusqu'au 12ᵉ | **à confirmer** |
| Mode d'exploitation | accompagnement obligatoire par un technicien-opérateur agréé — donc **pas** de location en autonomie | **à confirmer** |
| Autorisation de stationnement | prise en charge pour le client | cohérent avec la pratique de Gramme sur les communes, **à confirmer** |
| Zone | province de Liège | cohérent |
| Portée, charge utile | non publiées | **à obtenir** |
| Tarifs lift (demi-journée, journée, avec/sans opérateur) | non publiés | **à obtenir** |
| Prix de déménagement, fourchettes, base de facturation | non publiés | **à obtenir** |
| Plafond et franchise d'assurance | non publiés | **à obtenir** |
| Prix de vide-maison | non publiés | **à obtenir** |
| Nettoyage / remise en état après vide-maison | non publié | **à obtenir** |
| Délai d'intervention vide-maison | non publié | **à obtenir** |

Corroboration au passage : cette source situe l'établissement au **1 Voie du
Belvédère, 4100 Seraing**, ce qui confirme indépendamment le code postal retenu
pour le siège.

## Les 15 points à obtenir de Gramme

### `/vide-maison` — 5 points

- [ ] Gramme rend-il ce service seul, ou avec un partenaire débarras ?
- [ ] Base de prix : forfait, au m³, à la journée ? Ordre de grandeur pour une
      maison moyenne.
- [ ] Devenir des biens : rachat, reprise en déduction du devis, don,
      évacuation seule ?
- [ ] Nettoyage et remise en état : inclus, en option, ou pas du tout ?
- [ ] Délai d'intervention typique entre l'accord et le chantier.

### `/monte-meubles` — 5 points

- [ ] Matériel réellement disponible : hauteur maximale, portée, charge utile,
      appareil par appareil. *(42 m / 12ᵉ étage relevés ailleurs — à confirmer.)*
- [ ] Tarifs : demi-journée, journée, avec opérateur, hors zone.
- [ ] Location en autonomie possible, ou uniquement avec opérateur ?
      *(La source externe indique « opérateur obligatoire » — à confirmer.)*
- [ ] Location sèche à des tiers : artisans, entreprises, particuliers hors
      déménagement ?
- [ ] Autorisation de stationnement : Gramme ou le client ?

### `/prix-demenagement` — 5 points

- [ ] Fourchettes réelles par type de logement, sur la zone d'intervention :
      studio, appartement 2 chambres, maison 3-4 chambres.
- [ ] Ce que couvre exactement chaque formule — économique, standard, clé en
      main.
- [ ] Base de facturation : volume, heures, forfait ?
- [ ] Assurance incluse : plafond et franchise.
- [ ] Suppléments les plus fréquents et leur ordre de grandeur.

## Comment lever le verrou, une fois les données obtenues

1. Remplir `meta`, `answerCapsule`, le `contenu` de chaque section et au moins
   5 questions de FAQ dans `src/data/pages-service.ts`.
2. Renseigner `offre` **seulement** si une fourchette est validée : elle part
   dans un `AggregateOffer`, donc dans les résultats enrichis, où elle devient
   une promesse commerciale.
3. Vider `donneesManquantes` et passer `verifiePar: 'human'`.
4. `npm run build` — le contrôle refuse title, description, capsule, section
   vide ou FAQ de moins de 5 questions.

La page entre alors automatiquement au pré-rendu, au sitemap et dans
l'en-tête — sur l'accueil comme sur les 70 pages communes, soit la profondeur 1
que le plan exige.

## Calendrier : décidé le 2026-08-08

Publication **différée jusqu'à ce que le crawl du déploiement du 8 août
retombe**, soit vers le 15 août.

Raison : ce déploiement a déplacé le `lastmod` des 43 URL du sitemap — l'adresse
du siège figure dans chaque pied de page — et retiré 51 communes du sitemap.
Publier les pages de service avant que Google ait digéré ce changement rendrait
illisible le test du §7 du plan : si elles sont crawlées, on ne saurait pas si
c'est parce qu'une page de service a plus de valeur perçue, ou parce que le
sitemap entier vient de bouger. Or c'est précisément la question que le test
doit trancher.

Ordre retenu : obtenir les 15 données → rédiger → lever le verrou → publier une
fois le crawl du 8 août observé.

## Ce qui reste à faire après la rédaction

- **Liens contextuels** depuis l'accueil, `/demenagement`, `/contact-devis` et
  les pages Liège/Seraing/Herstal. Ils demandent des phrases, donc le contenu :
  ils ne peuvent pas être posés avant. Le lien d'en-tête, lui, est déjà
  automatique.
- **Refonte de `/monte-meubles`** : la page rend 428 mots aujourd'hui, la cible
  est 2 500 à 3 000. C'est une réécriture, pas une extension, et elle porte sur
  une page déjà indexée.
- **`Service` + `BreadcrumbList` sur les 4 autres pages de service**
  (`/demenagement`, `/garde-meubles`, `/monte-meubles`, `/transports`,
  `/demenagement/demenagement-international`) : la plomberie est en place dans
  `ServicePageLayout`, il ne reste qu'à passer les props. Non fait ici pour
  garder le périmètre sur les deux pages neuves.
