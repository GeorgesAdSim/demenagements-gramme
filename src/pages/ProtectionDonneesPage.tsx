import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TopBar from '../components/TopBar';
import ServiceNavbar from '../components/ServiceNavbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import SchemaOrg from '../components/SchemaOrg';

const HTML_CONTENT = `<h1>Protection des Données Personnelles</h1>

<p>Chez Déménagements Gramme, la protection de vos données personnelles est une priorité. Cette page vous explique de manière concrète quelles données nous collectons, pourquoi et comment exercer vos droits.</p>

<h2>Quelles données collectons-nous ?</h2>
<p>Nous collectons uniquement les données que vous nous fournissez volontairement via notre formulaire de demande de devis :</p>
<ul>
<li><strong>Votre identité :</strong> prénom et nom, pour vous identifier et personnaliser notre réponse</li>
<li><strong>Vos coordonnées :</strong> email et téléphone, pour vous recontacter avec notre offre</li>
<li><strong>Les détails de votre projet :</strong> adresses de départ et d'arrivée, date souhaitée, volume estimé et description de vos besoins, pour établir un devis précis</li>
</ul>

<h2>Pourquoi collectons-nous ces données ?</h2>
<p>Vos données sont utilisées exclusivement pour :</p>
<ul>
<li><strong>Vous fournir un devis personnalisé</strong> dans les 24 heures suivant votre demande</li>
<li><strong>Vous recontacter</strong> pour affiner les détails de votre projet si nécessaire</li>
<li><strong>Assurer le suivi</strong> de votre dossier jusqu'à la réalisation de la prestation</li>
<li><strong>Respecter nos obligations légales</strong> (comptabilité, fiscalité)</li>
</ul>
<p>Nous ne vendons, ne louons et ne partageons jamais vos données avec des tiers à des fins commerciales ou publicitaires.</p>

<h2>Où sont stockées vos données ?</h2>
<p>Vos données sont stockées de manière sécurisée sur les serveurs de <strong>Supabase</strong>, hébergés au sein de l'Union européenne. Le chiffrement est appliqué tant au repos qu'en transit (HTTPS/TLS).</p>

<h2>Combien de temps conservons-nous vos données ?</h2>
<ul>
<li><strong>Demandes de devis sans suite :</strong> 3 ans, puis suppression automatique</li>
<li><strong>Demandes ayant donné lieu à un contrat :</strong> 7 ans (obligation légale comptable belge)</li>
</ul>

<h2>Comment exercer vos droits ?</h2>
<p>Le RGPD (Règlement Général sur la Protection des Données) vous donne des droits concrets sur vos données. Voici comment les exercer :</p>

<h3>Droit d'accès</h3>
<p>Vous pouvez nous demander de vous fournir une copie de toutes les données que nous détenons vous concernant. Envoyez-nous un email et nous vous répondrons sous 30 jours maximum.</p>

<h3>Droit de rectification</h3>
<p>Vous avez constaté une erreur dans vos données ? Contactez-nous et nous corrigerons immédiatement.</p>

<h3>Droit à l'effacement ("droit à l'oubli")</h3>
<p>Vous souhaitez que nous supprimions toutes vos données ? C'est votre droit. Envoyez-nous un email et nous procéderons à la suppression dans les 30 jours, sauf si une obligation légale nous impose de les conserver.</p>

<h3>Droit d'opposition</h3>
<p>Vous pouvez vous opposer à tout moment au traitement de vos données. Nous cesserons le traitement sauf si nous avons des motifs légitimes impérieux.</p>

<h3>Droit à la portabilité</h3>
<p>Vous pouvez demander à recevoir vos données dans un format structuré, couramment utilisé et lisible par machine (par exemple en format CSV).</p>

<h2>Comment nous contacter ?</h2>
<p>Pour toute question ou demande relative à vos données personnelles :</p>
<ul>
<li><strong>Email :</strong> <a href="mailto:contact@demenagements-gramme.be">contact@demenagements-gramme.be</a></li>
<li><strong>Courrier :</strong> Déménagements Gramme - Protection des données, Rue des Naiveux 64, 4040 Herstal, Belgique</li>
<li><strong>Téléphone :</strong> <a href="tel:+3242645016">+32(0)4 264 50 16</a></li>
</ul>
<p>Nous nous engageons à répondre à toute demande dans un délai maximum de 30 jours.</p>

<h2>Réclamation</h2>
<p>Si vous n'êtes pas satisfait de notre réponse ou si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de l'Autorité de Protection des Données (APD) belge :</p>
<p><strong>Autorité de Protection des Données</strong><br />
Rue de la Presse 35, 1000 Bruxelles<br />
<a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener noreferrer">www.autoriteprotectiondonnees.be</a><br />
Email : contact@apd-gba.be</p>

<p><em>Dernière mise à jour : avril 2026</em></p>`;

export default function ProtectionDonneesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans">
      <SeoHead
        title="Protection des Données — Déménagements Gramme Liège"
        description="Comment Déménagements Gramme protège vos données personnelles : collecte, stockage, droits RGPD et contact DPO."
        canonical="/protection-donnees"
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

            <div
              className="prose-section space-y-4 [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:font-black [&_h1]:uppercase [&_h1]:text-navy [&_h1]:mb-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy [&_h2]:mb-3 [&_h2]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mb-2 [&_h3]:mt-6 [&_p]:text-muted [&_p]:text-[15px] [&_p]:leading-relaxed [&_a]:text-navy [&_a]:hover:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:text-muted [&_ul]:text-[15px] [&_li]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: HTML_CONTENT }}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
