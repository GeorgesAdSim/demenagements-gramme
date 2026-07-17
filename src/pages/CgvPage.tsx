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

const DEFAULT_HTML = `<h1>Conditions Générales de Vente et de Service</h1>

<p>Les présentes conditions générales régissent les relations entre <strong>Déménagements Gramme SRL</strong> (Rue des Naiveux 64, 4040 Herstal, TVA BE 0775.264.382) et ses clients pour toute prestation de déménagement, transport, garde-meubles et services connexes.</p>

<h2>1. Devis et commande</h2>
<p>Toute prestation fait l'objet d'un devis écrit préalable, gratuit et sans engagement. Le devis est établi sur base des informations communiquées par le client (volume, adresses, étages, accès, date, objets spéciaux). Le devis est valable 30 jours à compter de sa date d'émission.</p>
<p>La commande est considérée comme ferme et définitive dès réception par Déménagements Gramme du devis signé par le client, accompagné de l'acompte éventuel.</p>
<p>En cas de différence significative entre le volume déclaré et le volume réel constaté le jour du déménagement, Déménagements Gramme se réserve le droit d'adapter le prix en conséquence, après en avoir informé le client.</p>

<h2>2. Prix et paiement</h2>
<p>Les prix sont exprimés en euros (EUR) et s'entendent hors TVA, sauf mention contraire. La TVA applicable est celle en vigueur au moment de la facturation (taux actuel : 21%).</p>
<p>Un acompte de 30% du montant total peut être demandé à la confirmation de la commande. Le solde est payable le jour de la prestation, sauf accord contraire écrit.</p>
<p>En cas de non-paiement à l'échéance, des intérêts de retard de 10% par an seront appliqués de plein droit et sans mise en demeure préalable, conformément à la loi belge du 2 août 2002 concernant la lutte contre le retard de paiement dans les transactions commerciales. Une indemnité forfaitaire de 10% du montant impayé (avec un minimum de 40 EUR) sera également due.</p>

<h2>3. Annulation et report</h2>
<p>Toute annulation doit être notifiée par écrit (email ou courrier recommandé) :</p>
<ul>
<li><strong>Plus de 15 jours avant la date prévue :</strong> annulation gratuite, l'acompte éventuel est remboursé intégralement</li>
<li><strong>Entre 7 et 15 jours :</strong> 30% du montant du devis sera retenu à titre de dédommagement</li>
<li><strong>Moins de 7 jours :</strong> 50% du montant du devis sera dû à titre de dédommagement</li>
<li><strong>Le jour même ou sans préavis :</strong> 100% du montant du devis sera dû</li>
</ul>
<p>Un report de date est possible sans frais si notifié au minimum 7 jours à l'avance, sous réserve de disponibilité.</p>

<h2>4. Obligations du client</h2>
<p>Le client s'engage à :</p>
<ul>
<li>Fournir des informations exactes et complètes lors de la demande de devis</li>
<li>Assurer l'accessibilité des lieux (stationnement, ascenseur, clés, autorisations communales si nécessaire)</li>
<li>Signaler tout objet de valeur exceptionnelle, dangereux ou nécessitant un traitement spécial</li>
<li>Être présent ou représenté par une personne mandatée le jour du déménagement</li>
<li>Vider et dégivrer le réfrigérateur et le congélateur, vider les armoires et tiroirs</li>
</ul>

<h2>5. Responsabilité et assurance</h2>
<p>Déménagements Gramme est couvert par une <strong>assurance responsabilité civile professionnelle</strong> couvrant les dommages causés aux biens du client lors du déménagement.</p>
<p><strong>Assurance de base incluse :</strong> couvre les dommages directs causés par notre équipe lors des opérations de manutention, chargement, transport et déchargement.</p>
<p><strong>Option tous risques :</strong> une assurance complémentaire "tous risques" peut être souscrite sur demande pour une couverture étendue.</p>
<p>Sont exclus de la garantie :</p>
<ul>
<li>Les dommages préexistants ou résultant d'un emballage réalisé par le client</li>
<li>Les objets de valeur non déclarés (bijoux, oeuvres d'art, documents importants)</li>
<li>Les dommages causés par un défaut de l'objet (fragilité intrinsèque, vétusté)</li>
<li>Les dommages aux végétaux et animaux</li>
</ul>
<p>Toute réclamation doit être formulée par écrit dans un délai de <strong>8 jours ouvrables</strong> suivant la livraison, sous peine de forclusion. Les réserves doivent être détaillées et, si possible, accompagnées de photographies.</p>

<h2>6. Force majeure</h2>
<p>Déménagements Gramme ne peut être tenu responsable en cas de force majeure, c'est-à-dire tout événement imprévisible, irrésistible et extérieur rendant impossible l'exécution de la prestation : conditions météorologiques extrêmes, grèves générales, pandémies, mesures gouvernementales, accidents de la circulation majeurs, incendies, inondations, etc.</p>
<p>En cas de force majeure, la prestation sera reportée à une date ultérieure convenue entre les parties, sans pénalité.</p>

<h2>7. Garde-meubles</h2>
<p>Pour les prestations de garde-meubles, les conditions spécifiques suivantes s'appliquent :</p>
<ul>
<li>La facturation est basée sur le volume réel constaté lors de l'entrée des biens dans nos halls de stockage</li>
<li>Le paiement est dû mensuellement à terme échu</li>
<li>Une assurance obligatoire (vol, incendie, dégradation) est incluse dans le tarif</li>
<li>Tout retard de paiement de plus de 2 mois confère à Déménagements Gramme le droit de disposer des biens entreposés conformément à la législation belge en vigueur, après mise en demeure par courrier recommandé</li>
<li>Le client peut accéder à ses biens sur simple demande pendant les heures d'ouverture</li>
</ul>

<h2>8. Sous-traitance</h2>
<p>Déménagements Gramme se réserve le droit de faire appel à des sous-traitants qualifiés pour l'exécution partielle ou totale de la prestation, sans que cela ne modifie les obligations et garanties envers le client.</p>

<h2>9. Protection des données</h2>
<p>Les données personnelles collectées sont traitées conformément au RGPD et à notre <a href="/politique-confidentialite">Politique de Confidentialité</a>.</p>

<h2>10. Droit applicable et litiges</h2>
<p>Les présentes conditions générales sont soumises au droit belge. En cas de litige relatif à leur interprétation ou exécution, les parties s'engagent à rechercher une solution amiable.</p>
<p>À défaut d'accord amiable dans un délai de 30 jours, les <strong>tribunaux de l'arrondissement judiciaire de Liège</strong> seront seuls compétents.</p>
<p>Le client consommateur peut également recourir à la plateforme européenne de résolution des litiges en ligne : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.</p>

<h2>11. Dispositions finales</h2>
<p>Si une clause des présentes conditions générales est déclarée nulle ou inapplicable, les autres clauses restent pleinement en vigueur. La clause nulle sera remplacée par une disposition valide se rapprochant le plus possible de l'intention initiale.</p>
<p>Le fait pour Déménagements Gramme de ne pas exercer un droit prévu aux présentes ne constitue pas une renonciation à ce droit.</p>

<p><em>Dernière mise à jour : avril 2026</em></p>`;

export default function CgvPage() {
  const { content, meta, loading } = useSitePageContent<LegalContent>('cgv');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const html = content?.html || DEFAULT_HTML;

  return (
    <div className="font-sans">
      <SeoHead
        title={meta?.metaTitle || 'Conditions Générales — Déménagements Gramme Liège'}
        description={meta?.metaDescription || 'Conditions générales de vente et de service de Déménagements Gramme : devis, annulation, assurance et responsabilité.'}
        canonical={meta?.canonicalUrl || '/conditions-generales'}
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
