import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader as Loader2 } from 'lucide-react';
import TopBar from '../components/TopBar';
import ServiceNavbar from '../components/ServiceNavbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import SchemaOrg from '../components/SchemaOrg';
import { useSitePageContent } from '../lib/useSitePageContent';

interface LegalContent {
  html: string;
}

const DEFAULT_HTML = `<h1>Mentions Légales</h1>
<h2>1. Éditeur du site</h2>
<p><strong>Raison sociale :</strong> Déménagements Gramme</p>
<p><strong>Forme juridique :</strong> Société à responsabilité limitée (SRL)</p>
<p><strong>Siège social :</strong> Rue des Naiveux 64, 4040 Herstal (Liège), Belgique</p>
<p><strong>Numéro de TVA :</strong> BE 0775.264.382</p>
<p><strong>Téléphone :</strong> <a href="tel:+3242645016">+32(0)4 264 50 16</a></p>
<p><strong>Fax :</strong> +32(0)4 264 37 73</p>
<p><strong>Email :</strong> <a href="mailto:contact@demenagements-gramme.be">contact@demenagements-gramme.be</a></p>
<p><strong>Responsable de la publication :</strong> Déménagements Gramme SRL</p>
<h2>2. Hébergeur</h2>
<p><strong>Nom :</strong> Netlify, Inc.</p>
<p><strong>Adresse :</strong> 2325 3rd Street, Suite 215, San Francisco, California 94107, États-Unis</p>
<p><strong>Site web :</strong> <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">www.netlify.com</a></p>
<p>Les données applicatives (formulaires, demandes de devis) sont hébergées via Supabase au sein de l'Union européenne.</p>
<h2>3. Activité</h2>
<p>Déménagements Gramme est une entreprise familiale fondée en 1948, spécialisée dans les services de déménagement pour particuliers et entreprises, le transport de marchandises, le garde-meubles et la location de monte-meubles. Nous opérons principalement depuis Herstal (Liège) en Belgique, avec des services couvrant l'ensemble du territoire belge et l'Europe.</p>
<h2>4. Propriété intellectuelle</h2>
<p>L'ensemble du contenu de ce site (textes, images, logos, graphismes, maquettes, etc.) est la propriété exclusive de Déménagements Gramme ou de ses partenaires et est protégé par le droit belge et international relatif à la propriété intellectuelle.</p>
<p>Toute reproduction, représentation, modification, publication, adaptation ou distribution, totale ou partielle, du contenu de ce site, par quelque moyen que ce soit, sans l'autorisation écrite préalable de Déménagements Gramme est strictement interdite et constitue une contrefaçon sanctionnée par le Code de droit économique belge.</p>
<h2>5. Responsabilité</h2>
<p>Déménagements Gramme s'efforce de fournir des informations exactes et à jour sur ce site. Toutefois, la société ne peut garantir l'exhaustivité, l'exactitude ni l'actualité des informations diffusées. L'utilisation des informations présentes sur ce site se fait sous la seule responsabilité de l'utilisateur.</p>
<p>Déménagements Gramme décline toute responsabilité pour les dommages directs ou indirects résultant de l'accès au site, de l'utilisation des informations qu'il contient, ou de l'impossibilité d'y accéder.</p>
<h2>6. Liens hypertextes</h2>
<p>Le site peut contenir des liens vers des sites tiers. Déménagements Gramme ne contrôle pas le contenu de ces sites et décline toute responsabilité quant à leur contenu ou aux éventuels dommages liés à leur consultation.</p>
<h2>7. Données personnelles</h2>
<p>Les informations collectées via les formulaires de ce site (demandes de devis, contact) sont traitées conformément au Règlement Général sur la Protection des Données (RGPD). Pour plus de détails, consultez notre <a href="/politique-confidentialite">Politique de Confidentialité</a> et notre page <a href="/protection-donnees">Protection des Données</a>.</p>
<h2>8. Cookies</h2>
<p>Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. Pour plus d'informations, consultez notre <a href="/politique-confidentialite">Politique de Confidentialité</a>.</p>
<h2>9. Droit applicable et juridiction compétente</h2>
<p>Le présent site et ses mentions légales sont soumis au droit belge. En cas de litige relatif à l'interprétation ou l'exécution des présentes, et à défaut de résolution amiable, les tribunaux de l'arrondissement judiciaire de Liège seront seuls compétents.</p>
<h2>10. Contact</h2>
<p>Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter :</p>
<ul>
<li>Par courrier : Déménagements Gramme, Rue des Naiveux 64, 4040 Herstal, Belgique</li>
<li>Par téléphone : <a href="tel:+3242645016">+32(0)4 264 50 16</a></li>
<li>Par email : <a href="mailto:contact@demenagements-gramme.be">contact@demenagements-gramme.be</a></li>
</ul>
<p><em>Dernière mise à jour : avril 2026</em></p>`;

export default function MentionsLegalesPage() {
  const { content, meta, loading } = useSitePageContent<LegalContent>('mentions-legales');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const html = content?.html || DEFAULT_HTML;

  return (
    <div className="font-sans">
      <SeoHead
        title={meta?.metaTitle || 'Mentions Légales — Déménagements Gramme Liège'}
        description={meta?.metaDescription || "Mentions légales de Déménagements Gramme : raison sociale, TVA, hébergeur, propriété intellectuelle et droit applicable."}
        canonical={meta?.canonicalUrl || '/mentions-legales'}
      />
      <SchemaOrg />
      <TopBar />
      <ServiceNavbar />

      <main id="main-content">
        <section className="bg-offwhite py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 md:px-8">
            <Link to="/" className="inline-flex items-center gap-2 text-navy/60 hover:text-navy transition-colors text-sm mb-8">
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Link>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#132073]" />
              </div>
            ) : (
              <div
                className="prose-section space-y-4 [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:font-black [&_h1]:uppercase [&_h1]:text-navy [&_h1]:mb-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy [&_h2]:mb-3 [&_h2]:mt-8 [&_p]:text-muted [&_p]:text-[15px] [&_p]:leading-relaxed [&_a]:text-navy [&_a]:hover:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:text-muted [&_ul]:text-[15px] [&_li]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
