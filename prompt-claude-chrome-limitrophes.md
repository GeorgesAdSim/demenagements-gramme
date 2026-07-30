# Prompt pour Claude dans Chrome — communes limitrophes, codes postaux, anciennes communes

Second relevé. Il complète les trois champs qui bloquent encore la publication.
Copie tout le bloc ci-dessous dans Claude dans Chrome.

---

Tu vas relever trois informations factuelles sur 22 communes belges de la province de Liège, depuis leur article Wikipédia en français. Ces données seront publiées sur un site professionnel et servent à construire des liens entre pages : une commune citée à tort comme limitrophe crée un lien géographiquement faux, ce qui est pire qu'un lien manquant. Ne déduis rien d'une carte, ne complète rien de mémoire. Si une information n'est pas explicitement écrite dans l'article, laisse le champ vide.

## Pour chaque commune

Ouvre `https://fr.wikipedia.org/wiki/<NOM>` en remplaçant `<NOM>` par le nom de la commune. Si l'article est une page d'homonymie, ajoute `_(Belgique)` ou suis le lien vers la commune de la province de Liège. Si un bandeau de cookies apparaît, refuse les cookies non essentiels.

Relève exactement trois choses.

**1. Les communes limitrophes.** L'article contient un encadré ou une section « Communes limitrophes de X » — souvent une petite grille de huit cases orientées autour de la commune. Relève **uniquement** les communes qui y figurent, et **uniquement celles situées en province de Liège**. Écarte celles des provinces de Namur, du Limbourg, du Brabant wallon, ainsi que les communes néerlandaises ou allemandes : elles ne font pas partie de la zone couverte et n'auront jamais de page.

S'il y en a plus de cinq, garde les cinq premières dans l'ordre où elles apparaissent. S'il y en a moins de trois après filtrage, écris-les quand même et signale-le-moi à la fin.

**2. Les codes postaux.** Cherche dans l'infobox de droite, ligne « Code postal ». Il y en a souvent plusieurs, un par ancienne commune. Relève-les tous.

**3. Les anciennes communes ou sections.** Cherche la section « Sections » ou « Anciennes communes », ou la ligne « Sections » de l'infobox. Ce sont les villages fusionnés lors de la réforme de 1977. Relève leurs noms. Si l'article n'en mentionne aucune, laisse vide — certaines communes n'ont jamais fusionné.

## Restitution

Un seul bloc de code, une ligne par commune, dans l'ordre de la liste, au format :

```
slug | limitrophes séparées par des virgules | codes postaux séparés par des virgules | sections séparées par des virgules
```

Écris les noms des communes limitrophes **tels qu'ils apparaissent** dans l'article, en français, sans les convertir en slug — je m'en occupe. Laisse le champ vide entre deux barres verticales s'il n'y a rien, sans écrire « aucun » ni « N/A ».

Exemple du format attendu :

```
seraing | Liège, Flémalle, Neupré, Esneux | 4100, 4101, 4102 | Jemeppe-sur-Meuse, Ougrée, Boncelles
```

Après le bloc uniquement, signale en quelques lignes : les communes pour lesquelles tu as trouvé moins de trois limitrophes en province de Liège, les articles où l'encadré des limitrophes était absent, et toute hésitation sur l'identification de l'article.

## Les 22 communes

```
ans ; Ans
awans ; Awans
aywaille ; Aywaille
bassenge ; Bassenge
beyne-heusay ; Beyne-Heusay
blegny ; Blegny
chaudfontaine ; Chaudfontaine
comblain-au-pont ; Comblain-au-Pont
dalhem ; Dalhem
esneux ; Esneux
flemalle ; Flémalle
fleron ; Fléron
grace-hollogne ; Grâce-Hollogne
herstal ; Herstal
juprelle ; Juprelle
liege ; Liège
neupre ; Neupré
oupeye ; Oupeye
saint-nicolas ; Saint-Nicolas
soumagne ; Soumagne
sprimont ; Sprimont
trooz ; Trooz
vise ; Visé
```

Commence par Ans et enchaîne. Ne t'arrête pas pour me montrer chaque commune, je veux le tableau complet à la fin.
