import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gramme-dark-blue text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-gramme-yellow">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                <span>Rue des Naiveux 64<br />4040 Herstal (Liège)<br />Belgique</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3" />
                <a href="tel:+3242645016" className="hover:text-gramme-yellow transition-colors">
                  +32(0)4 264 50 16
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3" />
                <a href="mailto:contact-website@demenagements-gramme.be" className="hover:text-gramme-yellow transition-colors">
                  contact-website@demenagements-gramme.be
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-gramme-yellow">Nos services</h3>
            <ul className="space-y-2">
              <li><Link to="/demenagements" className="hover:text-gramme-yellow transition-colors">Déménagements</Link></li>
              <li><Link to="/transports" className="hover:text-gramme-yellow transition-colors">Transports</Link></li>
              <li><Link to="/garde-meubles" className="hover:text-gramme-yellow transition-colors">Garde-meubles</Link></li>
              <li><Link to="/demenagement-international" className="hover:text-gramme-yellow transition-colors">International</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-gramme-yellow">Informations légales</h3>
            <ul className="space-y-2">
              <li><Link to="/mentions-legales" className="hover:text-gramme-yellow transition-colors">Mentions légales</Link></li>
              <li><Link to="/politique-confidentialite" className="hover:text-gramme-yellow transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="/conditions-generales" className="hover:text-gramme-yellow transition-colors">Conditions générales</Link></li>
              <li><Link to="/protection-donnees" className="hover:text-gramme-yellow transition-colors">Protection des données</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} DGramme - TVA 0775.264.382 - Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
