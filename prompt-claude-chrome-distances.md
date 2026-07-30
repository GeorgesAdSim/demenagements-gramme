# Prompt pour Claude dans Chrome — relevé des distances Google Maps

Copie tout le bloc ci-dessous dans Claude dans Chrome, onglet Google Maps ouvert.

---

Tu vas relever, sur Google Maps, des distances routières et des temps de trajet depuis un dépôt unique vers 22 communes de la province de Liège. Ces chiffres seront publiés sur un site professionnel : une valeur fausse est bien plus coûteuse qu'une valeur manquante. Ne devine jamais, ne calcule jamais à vol d'oiseau, ne complète jamais par une moyenne ou par analogie avec une commune voisine. Si un relevé échoue, écris `ECHEC` et passe au suivant.

## Étape 1 — verrouiller le point de départ

Avant tout relevé, ouvre `https://www.google.com/maps/search/?api=1&query=Rue+des+Naiveux+64%2C+4040+Herstal%2C+Belgique`.

Si un bandeau de cookies apparaît, refuse les cookies non essentiels.

Lis la fiche du lieu et dis-moi :

- le nom exact de l'établissement épinglé, s'il y en a un ;
- la commune indiquée dans l'adresse — je m'attends à Herstal, mais Maps a déjà renvoyé « 4040 Oupeye » sur cette adresse ;
- les coordonnées du point, que tu obtiendras en lisant l'URL après avoir cliqué sur le repère (elles y apparaissent sous la forme `@50.xxxx,5.xxxx`).

**Arrête-toi ici et attends ma confirmation.** Si le repère n'est pas sur le bon bâtiment, les 22 relevés seraient tous faussés de la même manière, et c'est le genre d'erreur qui ne se voit plus une fois les chiffres dans un tableau.

## Étape 2 — relever chaque commune

Une fois que j'ai confirmé le départ, traite les communes une par une, dans l'ordre de la liste. Pour chacune, ouvre cette URL en remplaçant `<COMMUNE>` par le nom encodé :

```
https://www.google.com/maps/dir/?api=1&origin=Rue+des+Naiveux+64%2C+4040+Herstal%2C+Belgique&destination=<COMMUNE>%2C+Belgique&travelmode=driving
```

Règles de lecture, à appliquer identiquement pour les 22 :

- Retiens **le premier itinéraire proposé**, celui que Maps met en avant. Ne choisis pas le plus court si Maps en recommande un autre : la cohérence entre les 22 lignes compte plus que l'optimum de chaque ligne.
- La distance est en kilomètres, avec une décimale. **Arrondis à l'entier.**
- Le temps est en minutes, à l'entier. Il dépend du trafic au moment du relevé : c'est accepté, ces valeurs sont annoncées comme indicatives sur le site. Ne change pas l'option « Partir maintenant ».
- Si Maps propose plusieurs communes homonymes, ou si la destination résolue n'est pas en province de Liège, écris `ECHEC` plutôt que de choisir au hasard. Vérifie ce point : plusieurs de ces noms existent ailleurs en Belgique et en France.
- Ne clique sur aucun bouton de partage, d'enregistrement ou d'envoi vers un téléphone.

## Étape 3 — restituer

Rends **uniquement** un bloc de code, une ligne par commune, au format `slug;distance_km;temps_min`, dans l'ordre de la liste, sans en-tête et sans commentaire. Les deux valeurs sont des entiers nus, sans unité.

Exemple du format attendu, avec la seule ligne déjà vérifiée :

```
seraing;22;20
```

Après le bloc de code seulement, signale en une phrase chaque `ECHEC` et chaque destination qui t'a paru ambiguë.

## Les 22 communes à relever

Le slug de gauche est une clé technique : recopie-le exactement, sans le modifier ni le traduire. Le nom de droite est ce que tu tapes dans Maps.

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

Herstal n'est pas dans la liste : c'est le siège du dépôt, donc 0. Seraing non plus, il est déjà relevé.

Commence par l'étape 1 et attends-moi.
