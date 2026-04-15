import { SEO } from '../components/SEO';
import { MapPin, Phone, Mail } from 'lucide-react';

export function ContactPage() {
  return (
    <>
      <SEO
        title="Contact et devis déménagement, transport, garde-meubles - Gramme"
        description="Demandez votre devis gratuit pour un déménagement, un transport ou un garde-meubles à Liège."
      />

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-gramme-dark-blue mb-4">
          Devis gratuit pour un déménagement, un transport ou un garde-meubles
        </h1>

        <div className="grid md:grid-cols-2 gap-12 mt-12">
          <div>
            <h2 className="text-2xl font-bold text-gramme-dark-blue mb-6">Nos coordonnées</h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-gramme-blue mr-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">DGramme</p>
                  <p>Rue des Naiveux 64</p>
                  <p>4040 Herstal (Liège)</p>
                  <p>Belgique</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="w-6 h-6 text-gramme-blue mr-4" />
                <a href="tel:+3242645016" className="hover:text-gramme-blue transition-colors">
                  +32(0)4 264 50 16
                </a>
              </div>

              <div className="flex items-center">
                <Phone className="w-6 h-6 text-gramme-blue mr-4" />
                <span>Fax: +32(0)4 240 43 06</span>
              </div>

              <div className="flex items-center">
                <Mail className="w-6 h-6 text-gramme-blue mr-4" />
                <a
                  href="mailto:contact-website@demenagements-gramme.be"
                  className="hover:text-gramme-blue transition-colors break-all"
                >
                  contact-website@demenagements-gramme.be
                </a>
              </div>

              <p className="text-sm text-gray-600 mt-4">TVA 0775.264.382</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gramme-dark-blue mb-6">Demande de devis</h2>
            <p className="text-gray-600 mb-6">
              Pour obtenir un devis personnalisé, contactez-nous par téléphone ou par email.
              Nous vous répondrons dans les plus brefs délais.
            </p>

            <div className="bg-gramme-gray p-6 rounded-lg">
              <p className="font-semibold mb-4">Informations à nous fournir :</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Nom et prénom</li>
                <li>Email</li>
                <li>Téléphone</li>
                <li>Type de service (Déménagement / Transport / Garde-Meubles)</li>
                <li>Détails de votre projet</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
