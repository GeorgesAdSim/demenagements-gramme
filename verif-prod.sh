#!/bin/bash
# Contrôle des codes HTTP en production. À lancer sur ton Mac : le conteneur de
# la session n'a pas accès au domaine, donc je ne peux pas mesurer les statuts
# d'ici — or c'est précisément ce qui a caché trois régressions sur ce projet.
#
#   bash verif-prod.sh
#
# Attendu : 200 partout sauf la dernière ligne, qui doit renvoyer 404.

B=https://www.demenagements-gramme.be
ok=0; ko=0

controle() {
  # -o /dev/null : on jette le corps. Pas de -L : on veut voir la redirection,
  # pas la suivre. Un 301 ici signifierait que le canonical pointe vers une URL
  # qui redirige, ce qui rend la page « non indexable » pour les auditeurs.
  read -r code final < <(curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" -m 20 "$1")
  attendu="${2:-200}"
  if [ "$code" = "$attendu" ]; then
    printf '  ok   %s  %s\n' "$code" "${1#$B}"; ok=$((ok+1))
  else
    printf '  ÉCHEC %s (attendu %s) %s %s\n' "$code" "$attendu" "${1#$B}" "$final"; ko=$((ko+1))
  fi
}

echo "Pages de zones et communes"
controle "$B/zones-intervention"
for s in ans awans aywaille bassenge beyne-heusay blegny chaudfontaine \
         comblain-au-pont dalhem esneux flemalle fleron grace-hollogne huy \
         juprelle neupre oupeye saint-nicolas soumagne sprimont trooz vise waremme; do
  controle "$B/demenagement/demenagement-$s"
done

echo
echo "Satellites historiques — ne doivent pas avoir été captées par la route dynamique"
for s in liege seraing herstal entreprise piano international; do
  controle "$B/demenagement/demenagement-$s"
done

echo
echo "Non-régression"
controle "$B/"
controle "$B/demenagement"
controle "$B/sitemap.xml"

echo
echo "Une commune en brouillon doit renvoyer un vrai 404"
controle "$B/demenagement/demenagement-verviers" 404
controle "$B/demenagement/nimporte-quoi" 404

echo
echo "$ok conforme(s), $ko écart(s)."
echo
echo "URL de zone dans le sitemap déployé :"
curl -s -m 20 "$B/sitemap.xml" | grep -c 'demenagement/demenagement-'
