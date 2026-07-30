# Préparer un site pour les agents IA — WebMCP et llms.txt

Note de mise en œuvre rédigée sur le cas Déménagements Gramme, réutilisable
sur d'autres sites. Deux sujets souvent confondus, alors qu'ils n'ont ni la
même maturité ni le même retour.

## Ce que Lighthouse mesure vraiment

La catégorie « Navigation agentique » de Lighthouse ne produit pas un score
sur 100 mais un ratio de réussite. Elle contient deux familles d'audits :

Les audits **notés** — l'arborescence d'accessibilité et la stabilité de mise
en page (CLS). Ce sont eux qui donnent le « 2/2 ». Un site bien construit les
passe sans rien faire de spécifique aux IA : des libellés corrects, une
arborescence saine, pas de sauts de mise en page.

Les audits **non notés**, présentés comme « non applicables » — les trois
audits WebMCP et llms.txt. Ils n'enlèvent aucun point. C'est une distinction
qui compte pour arbitrer : ne pas les traiter ne dégrade rien.

## llms.txt — à faire, sans hésiter

Convention simple et stable, décrite sur [llmstxt.org](https://llmstxt.org).
Un fichier Markdown à la racine du domaine qui donne à un assistant une carte
du site en une seule requête, plutôt que de le laisser deviner.

Structure imposée par la spec :

- un **H1** en première ligne — c'est la *seule* section obligatoire ;
- une **citation** (`>`) résumant l'activité, avec les informations clés ;
- des paragraphes libres, sans titre ;
- des sections **H2** contenant des listes de liens `[nom](url) : notes` ;
- une section `## Optional` dont le contenu peut être ignoré quand un contexte
  plus court est nécessaire — l'endroit naturel pour les pages légales.

Deux principes qui font la différence entre un fichier utile et un fichier
décoratif. D'abord, n'y mettre que des faits vérifiables tirés du site :
coordonnées, horaires, zones desservies, grille tarifaire, capacités. Un
assistant qui cite une information fausse vous dessert plus qu'il ne vous
sert. Ensuite, regrouper les liens **par intention** et non par arborescence
technique : services, zones, prestations spécialisées, contact.

Le piège à surveiller : un lien mort dans ce fichier égare l'assistant sans
que personne ne le remarque, puisque le fichier n'est jamais lu par un humain.
D'où le contrôle automatique ajouté au build (`scripts/verify-build.mjs`) qui
vérifie la présence du H1 et résout chaque lien.

## WebMCP — comprendre avant d'implémenter

État réel au moment de l'écriture, juillet 2026 :

- **Ce n'est pas une norme.** C'est un *Draft Community Group Report* du W3C
  Web Machine Learning Community Group, explicitement hors voie de
  standardisation.
- **Support partiel.** Chrome via un essai d'origine (149-156), Edge derrière
  un drapeau, Firefox et Safari sans engagement.
- **L'API bouge.** `navigator.modelContext` est devenu `document.modelContext`
  le 21 juillet 2026. Chrome 150 déprécie l'ancien emplacement. D'où la double
  lecture avec repli dans le code.
- **La partie déclarative est incomplète.** L'annotation des formulaires est
  encore marquée TODO dans la spec, alors que Lighthouse l'audite déjà.
- **Aucun agent grand public ne consomme ces outils.** Claude, ChatGPT,
  Perplexity et Gemini lisent tous les pages de façon classique.

Conclusion honnête à tenir devant un client : implémenter WebMCP aujourd'hui
relève de l'anticipation et de la démonstration, pas du retour mesurable. Ce
qui rend réellement un site exploitable par les IA aujourd'hui, c'est du HTML
complet livré sans exécution de JavaScript, des données structurées valides et
une arborescence d'accessibilité propre.

## Les deux volets de l'implémentation

### Déclaratif — annoter les formulaires

Trois attributs, sur le `<form>` et ses champs :

```html
<form toolname="demander_devis_demenagement"
      tooldescription="Prépare une demande de devis gratuit. Le formulaire est rempli mais reste soumis par la personne.">
  <input id="email" toolparamdescription="Adresse email pour recevoir le devis" />
</form>
```

Lighthouse exige `toolname` **et** `tooldescription` pour valider un
formulaire. `toolparamdescription` sur les champs est facultatif pour l'audit,
mais c'est lui qui permet à un agent de remplir correctement.

Deux règles à ne pas enfreindre. Ne jamais annoter les formulaires
d'administration ou d'authentification : cela reviendrait à documenter une
surface d'attaque pour un agent. Et formuler la description de sorte qu'elle
dise ce que l'outil fait *et ne fait pas* — ici, que remplir n'est pas
soumettre.

### Impératif — exposer des outils

Voir `src/lib/webmcp.ts` pour l'implémentation complète. Les points de méthode :

**Lecture seule.** Aucun outil ne soumet de formulaire ni ne crée de demande.
Un agent pourrait sinon générer des leads à l'insu du visiteur, avec un client
qui reçoit des devis fantômes. La soumission reste un geste humain.

**Sans effet quand l'API est absente.** Le code vérifie l'existence de
`registerTool` et se retire silencieusement — c'est le cas de la quasi-totalité
des visiteurs. Vérifié : aucune erreur console sur un navigateur sans WebMCP.

**Nettoyage par AbortController.** `registerTool(tool, { signal })` puis
`controller.abort()` au démontage, pour éviter les enregistrements fantômes en
navigation côté client.

**Données puisées dans le contenu réel.** Les tarifs exposés par
`get_storage_pricing` sont ceux affichés sur la page publique. Deux sources de
vérité divergentes, c'est un client qui se fait opposer un prix erroné.

Outils exposés ici : `get_company_info`, `get_services`,
`get_storage_pricing`, `get_service_area`.

## Comment vérifier sans attendre un agent

Aucun agent n'appelant encore ces outils, il faut simuler l'API. Injecté avant
le chargement de la page, dans un navigateur piloté :

```js
window.__tools = [];
document.modelContext = { registerTool: (t) => { window.__tools.push(t); } };
```

Puis contrôler que les outils s'enregistrent, que `execute({})` renvoie une
charge conforme (`{ content: [{ type: 'text', text }] }`), et surtout que la
page ne produit **aucune** erreur quand cette API est absente.

## À surveiller

La spec évoluant vite, ce code est à revoir quand l'API se stabilisera. Les
deux signaux qui justifieront d'y revenir : la publication de l'explainer
déclaratif dans la spec principale, et le premier agent grand public qui
consomme réellement `modelContext` — Google annonce Gemini dans Chrome comme
premier client.
