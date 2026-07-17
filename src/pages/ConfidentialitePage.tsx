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

const DEFAULT_HTML = `<h1>Politique de Confidentialité</h1>

<p>La présente politique de confidentialité décrit comment Déménagements Gramme SRL (ci-après "nous", "notre" ou "l'entreprise") collecte, utilise et protège vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679) et à la loi belge du 30 juillet 2018 relative à la protection des personnes physiques à l'égard des traitements de données à caractère personnel.</p>

<h2>1. Responsable du traitement</h2>
<p><strong>Déménagements Gramme SRL</strong></p>
<p>Rue des Naiveux 64, 4040 Herstal (Liège), Belgique</p>
<p>TVA : BE 0775.264.382</p>
<p>Email : <a href="mailto:contact@demenagements-gramme.be">contact@demenagements-gramme.be</a></p>
<p>Téléphone : <a href="tel:+3242645016">+32(0)4 264 50 16</a></p>

<h2>2. Données collectées</h2>
<p>Nous collectons les données personnelles suivantes via notre formulaire de demande de devis :</p>
<ul>
<li><strong>Données d'identification :</strong> prénom, nom</li>
<li><strong>Coordonnées :</strong> adresse email, numéro de téléphone</li>
<li><strong>Données relatives au projet :</strong> type de service souhaité, ville de départ et d'arrivée, date souhaitée, volume estimé, message descriptif</li>
</ul>
<p>Nous ne collectons aucune donnée sensible au sens de l'article 9 du RGPD (origine ethnique, opinions politiques, données de santé, etc.).</p>

<h2>3. Finalités du traitement</h2>
<p>Vos données personnelles sont traitées pour les finalités suivantes :</p>
<ul>
<li>Traitement de votre demande de devis et élaboration d'une offre personnalisée</li>
<li>Communication relative à votre projet de déménagement</li>
<li>Suivi commercial dans le cadre de votre demande</li>
<li>Respect de nos obligations légales et comptables</li>
</ul>

<h2>4. Base juridique</h2>
<p>Le traitement de vos données repose sur :</p>
<ul>
<li><strong>Votre consentement</strong> (article 6.1.a du RGPD) : en soumettant le formulaire de devis, vous consentez au traitement de vos données</li>
<li><strong>L'exécution de mesures précontractuelles</strong> (article 6.1.b du RGPD) : le traitement est nécessaire à l'élaboration d'un devis à votre demande</li>
<li><strong>Nos obligations légales</strong> (article 6.1.c du RGPD) : conservation des données à des fins comptables et fiscales</li>
</ul>

<h2>5. Sous-traitant et hébergement des données</h2>
<p>Les données collectées via le formulaire sont stockées sur les serveurs de <strong>Supabase</strong> (sous-traitant au sens du RGPD), hébergés au sein de l'Union européenne. Supabase assure un niveau de sécurité conforme aux exigences du RGPD.</p>
<p>Le site web est hébergé par <strong>Netlify, Inc.</strong> (2325 3rd Street, Suite 215, San Francisco, California 94107, États-Unis). Netlify assure la conformité via les clauses contractuelles types de la Commission européenne pour les transferts de données hors UE.</p>

<h2>6. Durée de conservation</h2>
<ul>
<li><strong>Données de demande de devis :</strong> conservées pendant 3 ans à compter de la date de soumission, sauf si un contrat est conclu (dans ce cas, la durée légale de conservation comptable s'applique : 7 ans)</li>
<li><strong>Données de cookies techniques :</strong> durée de la session de navigation</li>
</ul>

<h2>7. Vos droits</h2>
<p>Conformément au RGPD, vous disposez des droits suivants :</p>
<ul>
<li><strong>Droit d'accès :</strong> obtenir la confirmation que vos données sont traitées et en recevoir une copie</li>
<li><strong>Droit de rectification :</strong> faire corriger des données inexactes ou incomplètes</li>
<li><strong>Droit à l'effacement :</strong> demander la suppression de vos données dans les conditions prévues par le RGPD</li>
<li><strong>Droit à la limitation du traitement :</strong> restreindre le traitement de vos données dans certains cas</li>
<li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré et couramment utilisé</li>
<li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données pour des motifs légitimes</li>
<li><strong>Droit de retirer votre consentement :</strong> à tout moment, sans que cela n'affecte la licéité du traitement effectué avant le retrait</li>
</ul>
<p>Pour exercer vos droits, contactez-nous par email à <a href="mailto:contact@demenagements-gramme.be">contact@demenagements-gramme.be</a> ou par courrier à l'adresse mentionnée ci-dessus. Nous répondrons dans un délai d'un mois.</p>

<h2>8. Cookies</h2>
<p>Ce site utilise uniquement des <strong>cookies techniques</strong> nécessaires au bon fonctionnement du site :</p>
<ul>
<li>Cookie de consentement (mémorisation de votre choix concernant les cookies)</li>
<li>Cookies de session (fonctionnement du formulaire)</li>
</ul>
<p>Aucun cookie publicitaire, analytique ou de pistage n'est utilisé. Aucune donnée n'est transmise à des tiers à des fins de marketing ou de publicité.</p>

<h2>9. Sécurité</h2>
<p>Nous mettons en oeuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte, altération ou divulgation : chiffrement HTTPS, contrôle d'accès, sauvegardes régulières.</p>

<h2>10. Réclamation</h2>
<p>Si vous estimez que le traitement de vos données personnelles ne respecte pas la réglementation en vigueur, vous avez le droit d'introduire une réclamation auprès de l'<strong>Autorité de Protection des Données (APD)</strong> belge :</p>
<p>Autorité de Protection des Données<br />
Rue de la Presse 35, 1000 Bruxelles<br />
<a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener noreferrer">www.autoriteprotectiondonnees.be</a><br />
Email : contact@apd-gba.be</p>

<h2>11. Modifications</h2>
<p>Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. La version en vigueur est celle publiée sur cette page. Nous vous encourageons à la consulter régulièrement.</p>

<p><em>Dernière mise à jour : avril 2026</em></p>`;

export default function ConfidentialitePage() {
  const { content, meta, loading } = useSitePageContent<LegalContent>('confidentialite');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const html = content?.html || DEFAULT_HTML;

  return (
    <div className="font-sans">
      <SeoHead
        title={meta?.metaTitle || 'Politique de Confidentialité — Déménagements Gramme Liège'}
        description={meta?.metaDescription || 'Politique de confidentialité RGPD de Déménagements Gramme : collecte de données, droits, cookies et sous-traitants.'}
        canonical={meta?.canonicalUrl || '/politique-confidentialite'}
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
