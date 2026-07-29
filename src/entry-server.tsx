// Entrée SSR utilisée UNIQUEMENT par scripts/prerender.mjs (build-time).
// Imports statiques volontairement (pas de lazy()) pour un rendu synchrone
// complet côté serveur avec renderToString.
//
// ⚠️ Cette liste de routes doit rester synchronisée avec la partie "publique"
// de src/App.tsx. Les routes /admin/* sont volontairement exclues : elles ne
// sont pas indexables (Disallow: /admin/ dans robots.txt) et n'ont donc pas
// besoin d'être pré-rendues.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';

import PublicSite from './pages/PublicSite';
import DemenagementsPage from './pages/DemenagementsPage';
import GardeMeublesPage from './pages/GardeMeublesPage';
import MonteMeublesPage from './pages/MonteMeublesPage';
import ActualitesPage from './pages/ActualitesPage';
import ContactPage from './pages/ContactPage';
import ContactDevisPage from './pages/ContactDevisPage';
import MentionsLegalesPage from './pages/MentionsLegalesPage';
import ConfidentialitePage from './pages/ConfidentialitePage';
import CgvPage from './pages/CgvPage';
import ProtectionDonneesPage from './pages/ProtectionDonneesPage';
import NotFoundPage from './pages/NotFoundPage';

import DemenageurLiege from './pages/satellites/DemenageurLiege';
import DemenagementLiege from './pages/satellites/DemenagementLiege';
import DemenagementSeraing from './pages/satellites/DemenagementSeraing';
import DemenagementHerstal from './pages/satellites/DemenagementHerstal';
import DemenagementEntreprise from './pages/satellites/DemenagementEntreprise';
import DemenagementPiano from './pages/satellites/DemenagementPiano';
import DemenagementInternationalSatellite from './pages/satellites/DemenagementInternationalSatellite';
import DemontageRemontageMeubles from './pages/satellites/DemontageRemontageMeubles';
import GardeMeublesLiege from './pages/satellites/GardeMeublesLiege';
import PrixGardeMeublesLiege from './pages/satellites/PrixGardeMeublesLiege';

import ConseilsDemenagementLiege from './pages/blog/ConseilsDemenagementLiege';
import PreparerEnfantsDemenagement from './pages/blog/PreparerEnfantsDemenagement';
import ErreursEviterDemenagement from './pages/blog/ErreursEviterDemenagement';

function ServerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />

      <Route path="/demenagement" element={<DemenagementsPage />} />
      <Route path="/garde-meubles" element={<GardeMeublesPage />} />
      <Route path="/blog" element={<ActualitesPage />} />
      <Route path="/monte-meubles" element={<MonteMeublesPage />} />

      <Route path="/demenagement/demenageur-liege" element={<DemenageurLiege />} />
      <Route path="/demenagement/demenagement-liege" element={<DemenagementLiege />} />
      <Route path="/demenagement/demenagement-seraing" element={<DemenagementSeraing />} />
      <Route path="/demenagement/demenagement-herstal" element={<DemenagementHerstal />} />
      <Route path="/demenagement/demenagement-entreprise" element={<DemenagementEntreprise />} />
      <Route path="/demenagement/demenagement-piano" element={<DemenagementPiano />} />
      <Route path="/demenagement/demenagement-international" element={<DemenagementInternationalSatellite />} />
      <Route path="/demenagement/demontage-remontage-meubles" element={<DemontageRemontageMeubles />} />

      <Route path="/garde-meubles/garde-meubles-liege" element={<GardeMeublesLiege />} />
      <Route path="/garde-meubles/prix-garde-meubles-liege" element={<PrixGardeMeublesLiege />} />

      <Route path="/blog/6-conseils-reussir-demenagement-liege" element={<ConseilsDemenagementLiege />} />
      <Route path="/blog/preparer-enfants-demenagement-liege" element={<PreparerEnfantsDemenagement />} />
      <Route path="/blog/6-erreurs-eviter-demenagement-liege" element={<ErreursEviterDemenagement />} />

      <Route path="/contact" element={<ContactPage />} />
      <Route path="/contact-devis" element={<ContactDevisPage />} />

      <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
      <Route path="/politique-confidentialite" element={<ConfidentialitePage />} />
      <Route path="/conditions-generales" element={<CgvPage />} />
      <Route path="/protection-donnees" element={<ProtectionDonneesPage />} />

      {/* Catch-all : permet de pré-rendre la page 404 vers dist/404.html. */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export function render(url: string): { html: string; helmet: HelmetServerState } {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <ServerRoutes />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>
  );

  return { html, helmet: helmetContext.helmet! };
}
