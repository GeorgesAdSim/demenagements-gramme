#!/bin/bash
# ============================================================================
# Pose les deux clés de modèle de l'Edge Function `estimate-volume`.
#
#   bash scripts/migration-supabase/04-poser-secrets.sh <ref-du-projet>
#
# Le script demande les deux clés, les VALIDE chacune auprès de son fournisseur,
# puis les écrit — dans cet ordre. La validation n'est pas une politesse : les
# deux secrets ont déjà été posés avec la même valeur, et rien ne l'a signalé.
# La fonction ne teste que leur présence :
#
#     if (!geminiKey && !anthropicKey) return json({ error: "..." }, 500);
#
# et Gemini est prioritaire dès que sa variable existe, sans repli. Une clé
# Anthropic rangée dans GEMINI_API_KEY donne donc une fonction qui démarre
# normalement et échoue sur chaque photo.
#
# Les valeurs ne passent ni par la ligne de commande — donc ni par
# ~/.zsh_history, ni par `ps` — ni par le dépôt : elles transitent par un
# fichier temporaire en droits 600, effacé à la sortie quoi qu'il arrive.
#
# Où trouver les clés :
#   Gemini    https://aistudio.google.com/apikey        (commence par AIza)
#   Anthropic https://console.anthropic.com/settings/keys (commence par sk-ant-)
#
# Supabase ne permet pas de relire un secret existant : si celles du projet
# d'origine sont introuvables, il faut en générer de nouvelles. Celle de Gemini
# est gratuite.
# ============================================================================
set -uo pipefail

REF="${1:-}"
if [ -z "$REF" ]; then
  echo "Usage : bash scripts/migration-supabase/04-poser-secrets.sh <ref-du-projet>" >&2
  exit 1
fi

FICHIER="$(mktemp -t secrets-supabase)"
chmod 600 "$FICHIER"
# Le piège de mktemp : sans ce trap, une interruption au mauvais moment laisse
# les deux clés en clair dans /tmp.
trap 'rm -f "$FICHIER"' EXIT INT TERM

echo "Projet : $REF"
echo "Les saisies ne s'affichent pas. Entrée pour valider chacune."
echo

printf 'Clé Gemini (AIza…)      : '
IFS= read -rs GEMINI < /dev/tty; echo
printf 'Clé Anthropic (sk-ant-…) : '
IFS= read -rs ANTHROPIC < /dev/tty; echo
echo

[ -z "$GEMINI" ] || [ -z "$ANTHROPIC" ] && { echo "Une des deux clés est vide." >&2; exit 1; }

if [ "$GEMINI" = "$ANTHROPIC" ]; then
  echo "Les deux saisies sont identiques — c'est l'erreur que ce script existe pour" >&2
  echo "attraper. Reprends chaque clé chez son fournisseur." >&2
  exit 1
fi

# --- Validation, avant toute écriture ---------------------------------------
echo "Vérification auprès des fournisseurs…"

code=$(curl -s -o /dev/null -w '%{http_code}' -m 20 \
  "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI")
if [ "$code" != "200" ]; then
  echo "  ÉCHEC  Gemini : HTTP $code" >&2
  echo "         Une clé Anthropic placée ici donnerait ce résultat. Rien n'a été écrit." >&2
  exit 1
fi
echo "  ok     Gemini répond 200"

code=$(curl -s -o /dev/null -w '%{http_code}' -m 20 \
  https://api.anthropic.com/v1/models \
  -H "x-api-key: $ANTHROPIC" -H "anthropic-version: 2023-06-01")
if [ "$code" != "200" ]; then
  echo "  ÉCHEC  Anthropic : HTTP $code" >&2
  echo "         Rien n'a été écrit." >&2
  exit 1
fi
echo "  ok     Anthropic répond 200"
echo

# --- Écriture ---------------------------------------------------------------
printf 'GEMINI_API_KEY=%s\nANTHROPIC_API_KEY=%s\n' "$GEMINI" "$ANTHROPIC" > "$FICHIER"

if ! supabase secrets set --project-ref "$REF" --env-file "$FICHIER" >/dev/null 2>&1; then
  echo "Le CLI a refusé l'écriture. Relancer avec :" >&2
  echo "  supabase secrets set --project-ref $REF --env-file <fichier>" >&2
  exit 1
fi
echo "Secrets posés."
echo

# --- Contrôle ---------------------------------------------------------------
# Supabase n'expose que des empreintes. Deux empreintes égales signifient deux
# valeurs égales : c'est le seul contrôle possible de l'extérieur, et il suffit
# à détecter la panne qu'on cherche à éviter.
echo "Empreintes — les deux premières doivent DIFFÉRER :"
supabase secrets list --project-ref "$REF" 2>/dev/null \
  | grep -E "GEMINI_API_KEY|ANTHROPIC_API_KEY"
echo
echo "Les secrets sont injectés à l'exécution : inutile de redéployer la fonction."
