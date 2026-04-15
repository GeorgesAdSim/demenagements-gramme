import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { DynamicPage } from './pages/DynamicPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Page d'accueil */}
          <Route path="/" element={<HomePage />} />

          {/* Pages principales */}
          <Route path="/transports" element={<DynamicPage />} />
          <Route path="/demenagements" element={<DynamicPage />} />
          <Route path="/garde-meubles" element={<DynamicPage />} />

          {/* Blog */}
          <Route path="/actualites" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />

          {/* Contact */}
          <Route path="/contact-devis" element={<ContactPage />} />

          {/* Pages cocon déménagement */}
          <Route path="/demenagement-international" element={<DynamicPage />} />
          <Route path="/demenagement-piano" element={<DynamicPage />} />
          <Route path="/demenagement-entreprise" element={<DynamicPage />} />
          <Route path="/demontage-remontage-meubles" element={<DynamicPage />} />
          <Route path="/demenagement-seraing" element={<DynamicPage />} />
          <Route path="/demenagement-herstal" element={<DynamicPage />} />

          {/* Pages cocon international */}
          <Route path="/demenagement-belgique-suisse" element={<DynamicPage />} />
          <Route path="/demenagement-belgique-france" element={<DynamicPage />} />
          <Route path="/demenagement-belgique-espagne" element={<DynamicPage />} />
          <Route path="/demenagement-belgique-italie" element={<DynamicPage />} />

          {/* Pages cocon garde-meubles */}
          <Route path="/prix-garde-meubles-liege" element={<DynamicPage />} />

          {/* Pages légales */}
          <Route path="/politique-confidentialite" element={<DynamicPage />} />
          <Route path="/mentions-legales" element={<DynamicPage />} />
          <Route path="/conditions-generales" element={<DynamicPage />} />
          <Route path="/protection-donnees" element={<DynamicPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
