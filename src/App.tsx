import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader as Loader2 } from 'lucide-react';
import { AuthProvider } from './lib/AuthContext';
import PublicSite from './pages/PublicSite';
import CookieConsent from './components/CookieConsent';
import { useLocation } from 'react-router-dom';
import WebMcpTools from './components/WebMcpTools';
import { installerMesureTelephone } from './lib/mesure';

const DemenagementsPage = lazy(() => import('./pages/DemenagementsPage'));
const GardeMeublesPage = lazy(() => import('./pages/GardeMeublesPage'));
const MonteMeublesPage = lazy(() => import('./pages/MonteMeublesPage'));
const EstimationVolumePage = lazy(() => import('./pages/EstimationVolumePage'));
const ActualitesPage = lazy(() => import('./pages/ActualitesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ContactDevisPage = lazy(() => import('./pages/ContactDevisPage'));
const MentionsLegalesPage = lazy(() => import('./pages/MentionsLegalesPage'));
const ConfidentialitePage = lazy(() => import('./pages/ConfidentialitePage'));
const CgvPage = lazy(() => import('./pages/CgvPage'));
const ProtectionDonneesPage = lazy(() => import('./pages/ProtectionDonneesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const LoginPage = lazy(() => import('./admin/pages/LoginPage'));
const DashboardPage = lazy(() => import('./admin/pages/DashboardPage'));
const PagesListPage = lazy(() => import('./admin/pages/PagesListPage'));
const PageEditorPage = lazy(() => import('./admin/pages/PageEditorPage'));
const SitePageEditorPage = lazy(() => import('./admin/pages/SitePageEditorPage'));
const DevisListPage = lazy(() => import('./admin/pages/DevisListPage'));
const EstimationsListPage = lazy(() => import('./admin/pages/EstimationsListPage'));
const MediaPage = lazy(() => import('./admin/pages/MediaPage'));
const SettingsPage = lazy(() => import('./admin/pages/SettingsPage'));
const CommunesListPage = lazy(() => import('./admin/pages/CommunesListPage'));
const CommuneEditorPage = lazy(() => import('./admin/pages/CommuneEditorPage'));

const DemenageurLiege = lazy(() => import('./pages/satellites/DemenageurLiege'));
const DemenagementLiege = lazy(() => import('./pages/satellites/DemenagementLiege'));
const DemenagementEntreprise = lazy(() => import('./pages/satellites/DemenagementEntreprise'));
const DemenagementPiano = lazy(() => import('./pages/satellites/DemenagementPiano'));
const DemenagementInternationalSatellite = lazy(() => import('./pages/satellites/DemenagementInternationalSatellite'));
const DemontageRemontageMeubles = lazy(() => import('./pages/satellites/DemontageRemontageMeubles'));

const GardeMeublesLiege = lazy(() => import('./pages/satellites/GardeMeublesLiege'));
const PrixGardeMeublesLiege = lazy(() => import('./pages/satellites/PrixGardeMeublesLiege'));

const ZonesInterventionPage = lazy(() => import('./pages/ZonesInterventionPage'));
const CommuneLandingPage = lazy(() => import('./pages/CommuneLandingPage'));

const ConseilsDemenagementLiege = lazy(() => import('./pages/blog/ConseilsDemenagementLiege'));
const PreparerEnfantsDemenagement = lazy(() => import('./pages/blog/PreparerEnfantsDemenagement'));
const ErreursEviterDemenagement = lazy(() => import('./pages/blog/ErreursEviterDemenagement'));

function AppFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F2EE]">
      <Loader2 className="w-8 h-8 animate-spin text-[#132073]" />
    </div>
  );
}

/**
 * N'affiche ses enfants que sur le site public.
 *
 * Le bandeau de consentement et les outils WebMCP étaient montés sur toute
 * l'application, back-office compris. Dans l'admin, le bandeau masquait le bas
 * de la navigation et demandait un consentement à un utilisateur déjà
 * authentifié — et WebMCP y exposait des outils à un agent alors que ces pages
 * ne sont pas destinées à être parcourues automatiquement.
 */
function HorsAdmin({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;
  return <>{children}</>;
}

export default function App() {
  // Écouteur délégué des liens `tel:`, posé une fois pour tout le site.
  // `useEffect` ne s'exécute pas au pré-rendu, où `document` n'existe pas.
  useEffect(installerMesureTelephone, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<AppFallback />}>
          <Routes>
            <Route path="/" element={<PublicSite />} />

            {/* Service pillar pages (new canonical routes) */}
            <Route path="/demenagement" element={<DemenagementsPage />} />
            <Route path="/garde-meubles" element={<GardeMeublesPage />} />
            <Route path="/blog" element={<ActualitesPage />} />

            {/* Legacy route redirects */}
            <Route path="/demenagements" element={<Navigate to="/demenagement" replace />} />
            <Route path="/transports" element={<Navigate to="/demenagement" replace />} />
            <Route path="/transport" element={<Navigate to="/demenagement" replace />} />
            <Route path="/actualites" element={<Navigate to="/blog" replace />} />
            <Route path="/demenagement-international" element={<Navigate to="/demenagement/demenagement-international" replace />} />
            <Route path="/monte-meubles" element={<MonteMeublesPage />} />
            <Route path="/estimation-volume" element={<EstimationVolumePage />} />

            {/* Demenagement satellite pages */}
            <Route path="/demenagement/demenageur-liege" element={<DemenageurLiege />} />
            <Route path="/demenagement/demenagement-liege" element={<DemenagementLiege />} />
            <Route path="/demenagement/demenagement-entreprise" element={<DemenagementEntreprise />} />
            <Route path="/demenagement/demenagement-piano" element={<DemenagementPiano />} />
            <Route path="/demenagement/demenagement-international" element={<DemenagementInternationalSatellite />} />
            <Route path="/demenagement/demontage-remontage-meubles" element={<DemontageRemontageMeubles />} />

            {/* Transport satellite → redirigé vers international */}
            <Route path="/transport/*" element={<Navigate to="/demenagement/demenagement-international" replace />} />

            {/* Garde-meubles satellite pages */}
            <Route path="/garde-meubles/garde-meubles-liege" element={<GardeMeublesLiege />} />
            <Route path="/garde-meubles/prix-garde-meubles-liege" element={<PrixGardeMeublesLiege />} />

            {/* Blog articles */}
            <Route path="/blog/6-conseils-reussir-demenagement-liege" element={<ConseilsDemenagementLiege />} />
            <Route path="/blog/preparer-enfants-demenagement-liege" element={<PreparerEnfantsDemenagement />} />
            <Route path="/blog/6-erreurs-eviter-demenagement-liege" element={<ErreursEviterDemenagement />} />

            {/* Index des zones : page navigationnelle, laissée à la racine. */}
            <Route path="/zones-intervention" element={<ZonesInterventionPage />} />

            {/* Pages communes : /demenagement/demenagement-<slug>.
                React Router 6 n'accepte pas de segment partiellement dynamique
                (`demenagement-:slug` ne matche jamais), d'où un :slug complet
                dont le préfixe est découpé dans le composant. Les satellites
                ci-dessus restent prioritaires : un segment statique l'emporte
                toujours sur un segment dynamique dans le classement v6. */}
            <Route path="/demenagement/:slug" element={<CommuneLandingPage />} />

            {/* Contact pages */}
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/contact-devis" element={<ContactDevisPage />} />

            {/* Legal pages */}
            <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
            <Route path="/politique-confidentialite" element={<ConfidentialitePage />} />
            <Route path="/conditions-generales" element={<CgvPage />} />
            <Route path="/protection-donnees" element={<ProtectionDonneesPage />} />

            {/* Legacy legal routes */}
            <Route path="/confidentialite" element={<ConfidentialitePage />} />
            <Route path="/cgv" element={<CgvPage />} />

            {/* Admin */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="pages" element={<PagesListPage />} />
              <Route path="pages/:id/edit" element={<PageEditorPage />} />
              <Route path="site-pages/:id/edit" element={<SitePageEditorPage />} />
              <Route path="communes" element={<CommunesListPage />} />
              <Route path="communes/:id/edit" element={<CommuneEditorPage />} />
              <Route path="devis" element={<DevisListPage />} />
              <Route path="estimations" element={<EstimationsListPage />} />
              <Route path="media" element={<MediaPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all — sert la page 404 côté client. Côté serveur, Netlify
                renvoie dist/404.html avec un vrai statut HTTP 404. */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <HorsAdmin>
            <CookieConsent />
            <WebMcpTools />
          </HorsAdmin>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
