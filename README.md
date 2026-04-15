# Déménagements Gramme

Site web pour l'entreprise de déménagement Gramme à Liège.

## Stack technique

- **Frontend**: React + TypeScript + Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **Icons**: Lucide React

## Installation

\`\`\`bash
npm install
\`\`\`

## Configuration

Créez un fichier \`.env\` à la racine du projet avec vos clés Supabase :

\`\`\`env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## Développement

\`\`\`bash
npm run dev
\`\`\`

Le site sera accessible sur \`http://localhost:5173\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Structure du projet

\`\`\`
src/
├── components/       # Composants réutilisables
│   ├── Layout.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── SEO.tsx
│   ├── FAQ.tsx
│   ├── ServiceCard.tsx
│   └── BlogCard.tsx
├── pages/           # Pages de l'application
│   ├── HomePage.tsx
│   ├── DynamicPage.tsx
│   ├── BlogListPage.tsx
│   ├── BlogPostPage.tsx
│   ├── ContactPage.tsx
│   └── NotFoundPage.tsx
├── hooks/           # Custom React hooks
│   ├── usePageBySlug.ts
│   ├── useBlogPosts.ts
│   ├── useFAQ.ts
│   ├── useNavigation.ts
│   └── useConfig.ts
├── lib/             # Configuration et utilitaires
│   └── supabase.ts
├── App.tsx          # Routing principal
├── main.tsx         # Point d'entrée
└── index.css        # Styles Tailwind
\`\`\`

## Base de données Supabase

Le projet utilise les tables suivantes :

- \`pages\` - Pages du site avec cocons SEO
- \`blog_posts\` - Articles de blog
- \`faq\` - Questions fréquentes
- \`services\` - Services proposés
- \`navigation\` - Menu de navigation
- \`config\` - Configuration du site
- \`media\` - Fichiers médias
- \`testimonials\` - Témoignages clients

## Cocons SEO

Le site est organisé en 4 cocons sémantiques :

1. **Principal** - Pages principales (accueil, transports, déménagements, garde-meubles)
2. **Déménagement** - Services de déménagement spécialisés
3. **International** - Déménagements vers l'étranger
4. **Garde-meubles** - Solutions de stockage

## Palette de couleurs

- Bleu principal : \`#0c2094\`
- Jaune accent : \`#fff200\`
- Bleu foncé texte : \`#0d1c78\`
- Blanc : \`#ffffff\`
- Gris clair fond : \`#f5f5f5\`

## License

© DGramme - Tous droits réservés
