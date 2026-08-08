# Fiches « autorisation de stationnement » — document de relecture

Généré le 2026-08-08, dans le cadre du lot 4. **C'est ce document qui doit être
relu avant toute nouvelle mise en ligne d'une fiche.**

## Pourquoi ce document existe

Une fiche stationnement annonce un délai, parfois une redevance. Un délai faux
fait rater une demande ; une redevance fausse fait prendre une amende au client.
Le coût d'une erreur y est sans commune mesure avec celui d'un paragraphe moins
précis.

Le code applique donc un verrou : **la fiche factuelle n'est rendue que si
`verifiePar === "human"` et que `sourceUrl` et `libelleSource` sont
renseignés.** Sinon la page retombe sur un texte générique — vrai partout — et
ne porte aucun lien externe. Le verrou est vérifié à chaque build.

## État au 2026-08-08

- **50 pages communes** portent une fiche factuelle rendue.
- **20 pages communes** retombent sur le texte générique, faute de source
  officielle exploitable. Elles sont listées plus bas.
- Les 50 fiches rendues étaient **déjà en production** avant ce chantier :
  elles ont été relevées lors d'une passe antérieure, avec leur
  `dateVerification` au 2026-08-02. Elles sont marquées `verifiePar: "human"`
  pour ne pas dépublier du contenu déjà servi — **mais je ne les ai pas
  revérifiées moi-même.** C'est précisément l'objet de la relecture demandée
  ici.
- Toute fiche ajoutée à partir de maintenant doit partir à `verifiePar: null` :
  elle ne sera pas rendue tant qu'un humain ne l'aura pas relue.

## Contrôle automatique des liens

`npm run check:links` interroge chaque lien externe des pages livrées. Au
2026-08-08 : **aucun lien mort** sur 29 liens éditoriaux. Trois avertissements,
tous bénins, détaillés dans `reports/external-links.json` :

- `policeliege.be` sert une chaîne de certificats incomplète. Le lien fonctionne
  dans un navigateur, qui complète la chaîne lui-même, mais pas depuis Node.
  C'est un défaut de configuration du site cité, pas un lien mort. Il n'apparaît
  que sur la page satellite `/demenagement/demenagement-liege`.
- Deux liens des pages légales pointent vers des URL qui redirigent
  (`ec.europa.eu/consumers/odr`, `autoriteprotectiondonnees.be`). Hors périmètre
  de ce chantier, mais à corriger un jour.

## Niveaux de confiance

- **Élevée** : la source est une page ou un formulaire propre à la commune, qui
  décrit sa propre procédure.
- **Moyenne** : la source est une page mutualisée — fiche de zone de police,
  règlement général commun à plusieurs communes. Ce qu'elle publie est exact,
  mais elle ne dit rien de la pratique de la commune en particulier : ni délai,
  ni tarif, ni guichet précis. C'est la catégorie à relire en priorité.

Aucune fiche n'est classée « faible » : une source qui ne permettait pas
d'affirmer quelque chose n'a pas produit de fiche du tout.

## Les 50 fiches rendues

| Commune | Autorité citée | Chiffres publiés | Confiance |
|---|---|---|---|
| Amay | Zone de police Meuse-Hesbaye, pour les six communes de la zone | aucun chiffre publié | Élevée — source communale primaire |
| Ans | Zone de Police Ans / Saint-Nicolas | délai, coût, signalisation | Moyenne — page partagée par la zone, non spécifique à la commune |
| Anthisnes | Administration communale d'Anthisnes | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Aubel | Administration communale d'Aubel | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Baelen | Administration communale de Baelen | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Bassenge | Commune de Bassenge | délai | Élevée — source communale primaire |
| Beyne-Heusay | Zone de Police Beyne-Fléron-Soumagne | délai, coût | Élevée — source communale primaire, plusieurs champs publiés |
| Braives | Zone de police Hesbaye-Ouest, conjointement avec l’administration communale | délai | Moyenne — page partagée par la zone, non spécifique à la commune |
| Burdinne | Zone de police Hesbaye-Ouest, conjointement avec l’administration communale | délai | Moyenne — page partagée par la zone, non spécifique à la commune |
| Chaudfontaine | Zone de Police de Chaudfontaine, postes de Beaufays et de Vaux-sous-Chèvremont | signalisation | Élevée — source communale primaire |
| Clavier | Administration communale de Clavier | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Comblain-au-Pont | Administration communale de Comblain-au-Pont | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Engis | Zone de police Meuse-Hesbaye, pour les six communes de la zone | aucun chiffre publié | Élevée — source communale primaire |
| Esneux | Commune d'Esneux, service de Police administrative | délai | Élevée — source communale primaire |
| Ferrières | Administration communale de Ferrières | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Flémalle | Commune de Flémalle, service de Police administrative | délai, coût, signalisation | Élevée — source communale primaire, plusieurs champs publiés |
| Fléron | Zone de Police Beyne-Fléron-Soumagne | délai | Élevée — source communale primaire |
| Grâce-Hollogne | Commune de Grâce-Hollogne, service technique communal | délai | Élevée — source communale primaire |
| Hamoir | Administration communale d'Hamoir | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Hannut | Zone de police Hesbaye-Ouest, conjointement avec l’administration communale | délai | Moyenne — page partagée par la zone, non spécifique à la commune |
| Héron | Zone de police Hesbaye-Ouest, conjointement avec l’administration communale | délai | Moyenne — page partagée par la zone, non spécifique à la commune |
| Herstal | Police de Herstal, service Mobilité | aucun chiffre publié | Élevée — source communale primaire |
| Herve | Administration communale de Herve | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Huy | Zone de Police de Huy, service Circulation | coût, signalisation | Élevée — source communale primaire, plusieurs champs publiés |
| Limbourg | Administration communale de Limbourg | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Malmedy | Ville de Malmedy, service Mobilité | délai | Élevée — source communale primaire |
| Marchin | Administration communale de Marchin | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Modave | Administration communale de Modave | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Nandrin | Administration communale de Nandrin | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Olne | Administration communale d'Olne | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Ouffet | Administration communale d'Ouffet | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Oupeye | Commune d'Oupeye, service de Police administrative, de Mobilité et de Planification d'urgence | délai | Élevée — source communale primaire |
| Pepinster | Commune de Pepinster, service Travaux et Développement | signalisation | Élevée — source communale primaire |
| Plombières | Administration communale de Plombières | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Saint-Georges-sur-Meuse | Zone de police Meuse-Hesbaye, pour les six communes de la zone | aucun chiffre publié | Élevée — source communale primaire |
| Saint-Nicolas | Zone de Police Ans / Saint-Nicolas | délai, coût, signalisation | Moyenne — page partagée par la zone, non spécifique à la commune |
| Seraing | Ville de Seraing | délai, coût, signalisation | Élevée — source communale primaire, plusieurs champs publiés |
| Soumagne | Zone de Police Beyne-Fléron-Soumagne | délai | Élevée — source communale primaire |
| Spa | Ville de Spa | délai | Élevée — source communale primaire |
| Sprimont | Commune de Sprimont, service Travaux | aucun chiffre publié | Élevée — source communale primaire |
| Stavelot | Ville de Stavelot | aucun chiffre publié | Élevée — source communale primaire |
| Thimister-Clermont | Administration communale de Thimister-Clermont | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Tinlot | Administration communale de Tinlot | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |
| Verlaine | Zone de police Meuse-Hesbaye, pour les six communes de la zone | aucun chiffre publié | Élevée — source communale primaire |
| Verviers | Ville de Verviers, service de Police administrative | délai, signalisation | Élevée — source communale primaire, plusieurs champs publiés |
| Villers-le-Bouillet | Zone de police Meuse-Hesbaye, pour les six communes de la zone | aucun chiffre publié | Élevée — source communale primaire |
| Visé | Ville de Visé | aucun chiffre publié | Élevée — source communale primaire |
| Wanze | Zone de police Meuse-Hesbaye, pour les six communes de la zone | aucun chiffre publié | Élevée — source communale primaire |
| Waremme | Ville de Waremme, service de la Police administrative | aucun chiffre publié | Élevée — source communale primaire |
| Welkenraedt | Administration communale de Welkenraedt | aucun chiffre publié | Moyenne — page partagée par la zone, non spécifique à la commune |

## Les 20 communes sans fiche

Pour celles-ci, aucune procédure exploitable n'a été trouvée. Le texte
générique est servi, sans lien externe, et la question correspondante de la FAQ
le dit explicitement. **Rien n'a été extrapolé depuis une commune voisine** —
c'est la règle qui a produit ces vingt cases vides, et il ne faut pas la lever
pour homogénéiser la mise en page.

Awans · Aywaille · Blegny · Crisnée · Dalhem · Dison · Donceel · Faimes ·
Fexhe-le-Haut-Clocher · Geer · Jalhay · Juprelle · Neupré · Oreye · Remicourt ·
Stoumont · Theux · Trois-Ponts · Trooz · Waimes

Le détail de ce qui manque, commune par commune, est dans le champ
`todoDonneesLocales` de `src/data/communes.json` et repris dans
`reports/faq-a-completer.md`.

Huit d'entre elles relèvent de la **zone de police Hesbaye** (Berloz, Crisnée,
Donceel, Faimes, Fexhe-le-Haut-Clocher, Geer, Oreye, Remicourt, Waremme), qui
ne publiait aucune procédure d'occupation de la voirie. Un seul appel à cette
zone débloquerait potentiellement sept fiches d'un coup : c'est le meilleur
rapport effort/résultat de la liste.

## Ce qui reste à faire, dans l'ordre

1. Appeler la zone de police Hesbaye — sept communes débloquées d'un coup.
2. Relire les 24 fiches classées « confiance moyenne » : la page de zone ne dit
   rien de la pratique communale, et un appel confirme ou infirme en cinq
   minutes.
3. Vérifier par sondage cinq fiches « confiance élevée » portant un montant :
   Seraing (1 €/m²/jour), Flémalle (10 € + 1 €/m²/jour depuis le 1er juin 2026),
   Beyne-Heusay (75 € par intervention), Huy (62 € de pose, 25 € de caution par
   panneau), Ans (panneaux à charge du demandeur). Ce sont les montants qui
   arrivent le plus vite dans une réclamation client.
4. Pour chaque fiche corrigée : mettre à jour `autorisationStationnement`, sa
   `dateVerification`, **et** la question correspondante de `faqLocale` — les
   deux textes affirment les mêmes faits et doivent bouger ensemble.

## Une limite à connaître

Le verrou `verifiePar` protège la **fiche**, pas la **FAQ**. Une réponse de
`faqLocale` qui reprend un délai ou un tarif reste affichée même si la fiche
correspondante passait à `null`. Sur les 50 communes concernées, les deux textes
viennent de la même source et de la même date, donc la relecture couvre les
deux — mais si une fiche est un jour repassée à `null`, il faut relire sa FAQ
dans le même mouvement. Le code ne le détecte pas.

## Liens externes : ce qui n'a pas été ajouté

Le lot prévoyait 2 à 3 liens externes par page. Il n'y en a **qu'un seul** : la
source de l'autorisation de stationnement. Le formulaire sur URL distincte, la
déclaration de changement d'adresse et l'accès au recyparc n'ont pas été
ajoutés, faute d'avoir relevé leurs URL. Deviner une URL communale produit un
404 sortant, ce qui coûte plus cher que le lien manquant. Ces deux liens
supplémentaires sont un chantier de collecte à part entière, à faire commune par
commune.
