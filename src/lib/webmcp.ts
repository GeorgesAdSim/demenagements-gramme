// src/lib/webmcp.ts
//
// Exposition d'outils WebMCP aux agents IA qui visitent le site.
//
// ⚠️ Statut de la technologie, à connaître avant de toucher à ce fichier :
// WebMCP n'est PAS une norme. C'est un « Draft Community Group Report » du
// W3C Web Machine Learning Community Group, explicitement hors voie de
// standardisation. Chrome l'expose via un essai d'origine (149-156), Edge
// derrière un drapeau, Firefox et Safari ne se sont pas engagés. L'API a
// changé d'emplacement le 21 juillet 2026 : `navigator.modelContext` est
// devenu `document.modelContext`, d'où la double lecture ci-dessous.
//
// Conséquence pratique : aucun agent grand public ne consomme encore ces
// outils. Ce code est donc une anticipation, pas une fonctionnalité utile
// aujourd'hui. Il est écrit pour être SANS EFFET quand l'API est absente,
// ce qui est le cas de la quasi-totalité des visiteurs.
//
// Choix de conception : tous les outils sont en LECTURE SEULE. Aucun n'envoie
// de formulaire ni ne crée de demande de devis. Un agent pourrait sinon
// générer des leads à l'insu du visiteur. La demande de devis reste soumise
// par l'humain via le formulaire, que l'agent peut remplir grâce aux
// attributs déclaratifs (toolname / tooldescription).

interface McpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, never>) => Promise<{ content: Array<{ type: string; text: string }> }>;
}

interface ModelContext {
  registerTool: (tool: McpTool, options?: { signal?: AbortSignal }) => Promise<void> | void;
}

/** Réponse au format attendu par WebMCP. */
const text = (value: unknown) => ({
  content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }],
});

/** Aucun paramètre : schéma d'entrée vide mais valide. */
const NO_PARAMS = { type: 'object', properties: {}, required: [] as string[] };

// Données reprises du contenu réel du site (voir GardeMeublesPage et Footer).
const STORAGE_PRICES = [
  { volume: '1 m³', prixMensuelEuros: 30 },
  { volume: '2 m³', prixMensuelEuros: 40 },
  { volume: '8 m³', prixMensuelEuros: 76 },
  { volume: '12 m³', prixMensuelEuros: 95 },
  { volume: '15 m³', prixMensuelEuros: 105 },
  { volume: '20 m³', prixMensuelEuros: 130 },
  { volume: '24 m³', prixMensuelEuros: 150 },
  { volume: 'au-delà de 30 m³', prixMensuelEuros: 6, note: 'par m³ et par mois' },
];

const TOOLS: McpTool[] = [
  {
    name: 'get_company_info',
    description:
      "Coordonnées, horaires et informations générales de Déménagements Gramme, entreprise de déménagement et garde-meubles à Herstal, près de Liège en Belgique.",
    inputSchema: NO_PARAMS,
    execute: async () =>
      text({
        raisonSociale: 'Déménagements Gramme SCRL',
        fondeeEn: 1948,
        adresse: 'Rue des Naiveux 64, 4040 Herstal, Belgique',
        telephone: '+32 4 264 50 16',
        email: 'contact@demenagements-gramme.be',
        tva: 'BE 0775.264.382',
        horaires: {
          lundiAuVendredi: '08:00-18:00',
          samedi: '08:00-12:00',
          dimanche: 'fermé',
        },
        devis: 'Gratuit et sans engagement, réponse sous 24 heures ouvrables.',
        siteWeb: 'https://www.demenagements-gramme.be',
      }),
  },
  {
    name: 'get_services',
    description:
      'Liste les prestations proposées par Déménagements Gramme, avec la page correspondante sur le site.',
    inputSchema: NO_PARAMS,
    execute: async () =>
      text([
        { service: 'Déménagement de particuliers et d\'entreprises', page: '/demenagement' },
        { service: 'Garde-meubles en box sécurisés', page: '/garde-meubles' },
        { service: 'Monte-meubles pour étages élevés et accès difficiles', page: '/monte-meubles' },
        { service: 'Déménagement international', page: '/demenagement/demenagement-international' },
        { service: 'Déménagement de piano', page: '/demenagement/demenagement-piano' },
        { service: 'Démontage et remontage de meubles', page: '/demenagement/demontage-remontage-meubles' },
        { service: 'Déménagement d\'entreprise', page: '/demenagement/demenagement-entreprise' },
        { service: 'Emballage professionnel, transport de coffres-forts', page: '/demenagement' },
      ]),
  },
  {
    name: 'get_storage_pricing',
    description:
      'Grille tarifaire du garde-meubles de Déménagements Gramme, par volume et par mois, avec les conditions.',
    inputSchema: NO_PARAMS,
    execute: async () =>
      text({
        devise: 'EUR',
        tarifs: STORAGE_PRICES,
        dureeMinimum: '1 mois',
        inclus: [
          'Assurance vol, incendie et dégradation (forfait obligatoire inclus par m³)',
          'Assistance du magasinier pour les entrées et sorties, du lundi au vendredi',
        ],
        conditions: [
          'Le volume facturé est le volume réel constaté à l\'entrée en stockage, l\'estimation du devis étant indicative.',
          'Réservation sans engagement, prix garantis 15 jours.',
          'Possibilité d\'amener les meubles par ses propres moyens.',
        ],
        pageDetaillee: '/garde-meubles/prix-garde-meubles-liege',
      }),
  },
  {
    name: 'get_service_area',
    description:
      'Zones géographiques desservies par Déménagements Gramme et capacité de la flotte.',
    inputSchema: NO_PARAMS,
    execute: async () =>
      text({
        national: 'Toute la Belgique, avec une implantation à Herstal en périphérie de Liège.',
        villesLiegeoises:
          'Tous les quartiers de Liège, ainsi que Seraing, Herstal et les communes environnantes. Les autorisations de stationnement auprès de la commune sont prises en charge.',
        international: ['France', 'Suisse', 'Espagne', 'Italie', 'reste de l\'Europe'],
        flotte: 'Véhicules de 4 à 100 m³, équipés d\'élévateurs intégrés.',
        internationalNote:
          'Formalités douanières et administratives prises en charge. Groupage possible pour les petits volumes.',
      }),
  },
];

/**
 * Enregistre les outils si — et seulement si — le navigateur expose l'API.
 * Retourne une fonction de nettoyage à appeler au démontage.
 */
export function registerWebMcpTools(): () => void {
  if (typeof document === 'undefined') return () => {};

  // L'emplacement a changé en juillet 2026 ; on lit les deux.
  const ctx: ModelContext | undefined =
    (document as unknown as { modelContext?: ModelContext }).modelContext ??
    (navigator as unknown as { modelContext?: ModelContext }).modelContext;

  if (!ctx?.registerTool) return () => {};

  const controller = new AbortController();
  for (const tool of TOOLS) {
    try {
      ctx.registerTool(tool, { signal: controller.signal });
    } catch {
      // Une version antérieure de l'API peut rejeter la signature : on
      // n'insiste pas, le site doit fonctionner normalement sans WebMCP.
    }
  }

  return () => controller.abort();
}
