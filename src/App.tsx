import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader as Loader2 } from 'lucide-react';
import { AuthProvider } from './lib/AuthContext';
import PublicSite from './pages/PublicSite';
import CookieConsent from './components/CookieConsent';

const DemenagementsPage = lazy(() => import('./pages/DemenagementsPage'));
const GardeMeublesPage = lazy(() => import('./pages/GardeMeublesPage'));
const MonteMeublesPage = lazy(() => import('./pages/MonteMeublesPage'));
const ActualitesPage = lazy(() => import('./pages/ActualitesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ContactDevisPage = lazy(() => import('./pages/ContactDevisPage'));
const MentionsLegalesPage = lazy(() => import('./pages/MentionsLegalesPage'));
const ConfidentialitePage = lazy(() => import('./pages/ConfidentialitePage'));
const CgvPage = lazy(() => import('./pages/CgvPage'));
const ProtectionDonneesPage = lazy(() => import('./pages/ProtectionDonneesPage'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const LoginPage = lazy(() => import('./admin/pages/LoginPage'));
const DashboardPage = lazy(() => import('./admin/pages/DashboardPage'));
const PagesListPage = lazy(() => import('./admin/pages/PagesListPage'));
const PageEditorPage = lazy(() => import('./admin/pages/PageEditorPage'));
const SitePageEditorPage = lazy(() => import('./admin/pages/SitePageEditorPage'));
const DevisListPage = lazy(() => import('./admin/pages/DevisListPage'));
const MediaPage = lazy(() => import('./admin/pages/MediaPage'));
const SettingsPage = lazy(() => import('./admin/pages/SettingsPage'));

const DemenageurLiege = lazy(() => import('./pages/satellites/DemenageurLiege'));
const DemenagementLiege = lazy(() => import('./pages/satellites/DemenagementLiege'));
const DemenagementSeraing = lazy(() => import('./pages/satellites/DemenagementSeraing'));
const DemenagementHerstal = lazy(() => import('./pages/satellites/DemenagementHerstal'));
const DemenagementEntreprise = lazy(() => import('./pages/satellites/DemenagementEntreprise'));
const DemenagementPiano = lazy(() => import('./pages/satellites/DemenagementPiano'));
const DemenagementInternationalSatellite = lazy(() => import('./pages/satellites/DemenagementInternationalSatellite'));
const DemontageRemontageMeubles = lazy(() => import('./pages/satellites/DemontageRemontageMeubles'));

const GardeMeublesLiege = lazy(() => import('./pages/satellites/GardeMeublesLiege'));
const PrixGardeMeublesLiege = lazy(() => import('./pages/satellites/PrixGardeMeublesLiege'));

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

export default function App() {
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

            {/* Demenagement satellite pages */}
            <Route path="/demenagement/demenageur-liege" element={<DemenageurLiege />} />
            <Route path="/demenagement/demenagement-liege" element={<DemenagementLiege />} />
            <Route path="/demenagement/demenagement-seraing" element={<DemenagementSeraing />} />
            <Route path="/demenagement/demenagement-herstal" element={<DemenagementHerstal />} />
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
              <Route path="devis" element={<DevisListPage />} />
              <Route path="media" element={<MediaPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
          <CookieConsent />
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
