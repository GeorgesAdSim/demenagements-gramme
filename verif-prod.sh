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

# ---------------------------------------------------------------------------
# Domaine nu (apex). Contrôlé EN PREMIER parce que c'est la panne la plus
# coûteuse et la plus silencieuse : elle n'apparaît sur aucune page du site.
#
# Le 17/07/2026, Let's Encrypt a émis le certificat pour www uniquement, après
# 5 échecs de validation sur le domaine nu. Personne n'a relancé, et pendant
# trois semaines quiconque tapait « demenagements-gramme.be » dans un
# navigateur recevait un avertissement de sécurité plein écran.
#
# La cause n'était pas Netlify mais un AAAA résiduel dans la zone OVH,
# 2001:41d0:301::27, hérité de l'ancien hébergement. Let's Encrypt PRIVILÉGIE
# l'IPv6 : il interrogeait donc l'ancien serveur, qui répondait au défi avec la
# signature d'un autre compte ACME. En IPv4 tout paraissait normal — et la
# plupart des machines de bureau n'ayant pas d'IPv6, le test manuel « ça marche
# chez moi » confirmait à tort.
#
# D'où les trois contrôles ci-dessous : le résultat (HTTPS), la cause probable
# (AAAA), et la couverture réelle du certificat.
# ---------------------------------------------------------------------------
echo "Domaine nu"
apex=demenagements-gramme.be

if curl -sI -o /dev/null -m 20 "https://$apex/" 2>/dev/null; then
  printf '  ok   apex en HTTPS\n'; ok=$((ok+1))
else
  printf '  ÉCHEC apex en HTTPS — certificat invalide ou hôte injoignable\n'; ko=$((ko+1))
fi

# Sans dig, `aaaa` serait vide et le contrôle annoncerait « aucun AAAA » — un
# faux positif silencieux, sur précisément le test censé prévenir une panne
# silencieuse. Outil absent = écart, jamais conformité.
if ! command -v dig >/dev/null 2>&1; then
  printf '  ÉCHEC dig introuvable — contrôle AAAA impossible, statut inconnu\n'
  printf '        Installe-le (brew install bind) ou vérifie la zone OVH à la main.\n'
  ko=$((ko+1))
else
  aaaa=$(dig +short "$apex" AAAA 2>/dev/null)
  if [ -z "$aaaa" ]; then
    printf '  ok   aucun AAAA sur le domaine nu\n'; ok=$((ok+1))
  else
    printf '  ÉCHEC AAAA présent sur le domaine nu : %s\n' "$(echo "$aaaa" | tr '\n' ' ')"
    printf '        Netlify ne publie pas d'\''AAAA pour un apex. Supprime-le dans la zone OVH.\n'
    ko=$((ko+1))
  fi
fi

sans=$(echo | openssl s_client -servername "$apex" -connect "$apex:443" 2>/dev/null \
       | openssl x509 -noout -ext subjectAltName 2>/dev/null | tr -d ' ' | tr ',' '\n' | grep -c "DNS:$apex")
if [ "${sans:-0}" -ge 1 ]; then
  printf '  ok   le certificat couvre le domaine nu\n'; ok=$((ok+1))
else
  printf '  ÉCHEC le certificat ne couvre pas %s — relance l'\''émission côté Netlify\n' "$apex"; ko=$((ko+1))
fi

echo
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
echo "Une URL inconnue doit renvoyer un vrai 404"
# Verviers servait d'exemple de brouillon ; elle est publiée depuis le lot
# Verviers et répond 200. Garder l'ancienne attente faisait échouer le script
# sur une page parfaitement saine — le genre de faux négatif qui finit par
# faire ignorer le script entier.
#
# ATTENTION : plus aucune commune en brouillon n'est couverte ici. Le seul
# contrôle qui reste est celui de l'URL inconnue, qui, elle, ne changera jamais
# de statut. Pour retrouver la garantie d'origine — qu'un brouillon ne fuite
# pas en production — il faut ajouter une commune réellement en `draft`, et la
# remplacer à chaque fois qu'elle est publiée. C'est cette maintenance-là qui
# avait fait dériver la ligne Verviers.
controle "$B/demenagement/demenagement-verviers" 200
controle "$B/demenagement/nimporte-quoi" 404

echo
echo "$ok conforme(s), $ko écart(s)."
echo
echo "URL de zone dans le sitemap déployé :"
curl -s -m 20 "$B/sitemap.xml" | grep -c 'demenagement/demenagement-'
