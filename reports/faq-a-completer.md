# FAQ des pages communes — état et points à relire

Généré à la main le 2026-08-08, dans le cadre du lot 3 (dé-templatisation de la
FAQ). Ce document est destiné à une relecture humaine.

## État de couverture

**70 pages communes sur 70 ont une FAQ rédigée** (`faqLocale` dans
`src/data/communes.json`), soit 280 questions et 280 réponses, **toutes
distinctes** — aucune paire question/réponse n'est répétée d'une commune à
l'autre. Aucune commune n'est donc restée sur la FAQ générique.

Chaque commune porte 4 questions, dont au moins 2 qui n'auraient aucun sens sur
une autre commune (procédure administrative locale, relief, bâti, contrainte
saisonnière ou frontalière propre).

Le bloc `FAQPage` du JSON-LD est régénéré depuis la même source : la
synchronisation a été vérifiée mot pour mot sur les 76 pages de
`/demenagement/` — 76 sur 76 conformes.

## Ce qui reste à faire relire

Rien n'a été inventé : chaque réponse reformule un fait déjà relevé et publié
dans la fiche de la commune (`introductionLocale`, `informationsLocales`,
`sectionsLocales`, `autorisationStationnement`). Trois points méritent
néanmoins une relecture par quelqu'un qui connaît le terrain.

### 1. Les 20 communes sans source administrative officielle

Pour ces communes, la question portant sur l'autorisation de stationnement
**dit explicitement que la procédure n'est pas publiée** et que Gramme prend
contact directement. C'est vrai et vérifiable, mais c'est aussi un aveu public :
si l'un de ces services a depuis publié sa procédure, la réponse doit être
réécrite.

| Commune | Ce que dit la FAQ | Ce qui reste à confirmer |
|---|---|---|
| Awans | Formulaire scanné, délai et redevance inexploitables ; contact au secrétariat du Bourgmestre | Délai réglementaire réel |
| Aywaille | Ordonnances publiées au cas par cas, pas de procédure générale | Existence d'un guichet unique |
| Blegny | Page « occupation du domaine public » en 404 au 2026-08 | Page rétablie depuis ? |
| Crisnée | Ni la commune ni la zone de police Hesbaye ne publient de procédure | Autorité compétente |
| Dalhem | Aucune procédure sur dalhem.be | Service Travaux : délai |
| Dison | Seul le règlement coordonné de la zone Vesdre est publié | Service des Travaux : procédure |
| Donceel | Zone de police Hesbaye — rien de publié | Autorité compétente |
| Faimes | Zone de police Hesbaye — rien de publié | Autorité compétente |
| Fexhe-le-Haut-Clocher | Zone de police Hesbaye — rien de publié | Autorité compétente |
| Geer | Zone de police Hesbaye — rien de publié | Autorité compétente |
| Jalhay | Seule l'ordonnance générale est publiée | Procédure de demande |
| Juprelle | Aucune procédure sur juprelle.be | Contact téléphonique à confirmer |
| Neupré | Aucune procédure sur neupre.be | Délai et redevance |
| Oreye | Zone de police Hesbaye — rien de publié | Autorité compétente |
| Remicourt | Zone de police Hesbaye — rien de publié | Autorité compétente |
| Stoumont | Aucune procédure sur stoumont.be | Délai et redevance |
| Theux | Aucune procédure sur theux.be | Délai et redevance |
| Trois-Ponts | Seule l'ordonnance générale est publiée | Procédure de demande |
| Trooz | Aucune procédure sur trooz.be | Services techniques : délai |
| Waimes | Aucune procédure sur waimes.be | Délai et redevance |

Dès qu'une de ces procédures est relevée, deux choses sont à faire ensemble :
renseigner `autorisationStationnement` pour la commune, et réécrire la question
correspondante de sa `faqLocale`.

### 2. Les affirmations opérationnelles

Certaines réponses décrivent la façon dont Gramme travaille : envoi d'un
véhicule plus court, rotations multiples, repérage du point de retournement,
équipe renforcée, groupage d'interventions par secteur. Ces affirmations sont
reprises des sections rédigées déjà publiées sur les mêmes pages — elles ne
sont donc pas nouvelles — mais elles engagent l'entreprise et méritent d'être
confirmées par l'exploitation.

Cas particuliers à valider explicitement :

- **Stavelot** : « une date qui tombe sur un week-end de grande épreuve à
  Francorchamps se déplace ». C'est une règle commerciale, pas un fait
  géographique.
- **Beyne-Heusay** : le tarif de 75 € pour la location des panneaux est repris
  de la source communale ; à revérifier avant chaque saison.
- **Huy** : 62 € de pose et 25 € de caution par panneau, même remarque.
- **Seraing** et **Flémalle** : redevances au mètre carré et par jour, dont
  celle de Flémalle avec une date d'entrée en vigueur au 1er juin 2026.

### 3. Les questions « frontalières »

Aubel, Oreye, Plombières, Welkenraedt, Bassenge et Visé portent une question sur
les départs vers les Pays-Bas ou l'Allemagne. Elle suppose que Gramme réalise
effectivement ces déménagements depuis ces secteurs. C'est cohérent avec la page
`/demenagement/demenagement-international`, mais l'exploitation doit confirmer
que le volume annoncé (« régulièrement », « courant ») correspond à la réalité.

## Ce qui n'a pas été fait

Aucune commune ne porte 5 questions : toutes en ont 4. La borne haute autorisée
par la validation est 5 ; passer à 5 sur les communes les plus documentées
(Seraing, Verviers, Huy, Herstal) est une amélioration possible, sans urgence.
