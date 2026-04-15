import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Printer } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gramme-dark-blue to-gramme-blue text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gramme-yellow">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-gramme-yellow" />
                <div>
                  <p className="font-semibold mb-1">Déménagements Gramme</p>
                  <p>Rue des Naiveux 64</p>
                  <p>4040 Herstal (Liège)</p>
                  <p>Belgique</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-gramme-yellow" />
                <a href="tel:+3242645016" className="hover:text-gramme-yellow transition-colors">
                  +32(0)4 264 50 16
                </a>
              </div>
              <div className="flex items-center">
                <Printer className="w-5 h-5 mr-3 text-gramme-yellow" />
                <span>+32(0)4 264 37 73</span>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 mr-3 mt-0.5 text-gramme-yellow" />
                <a
                  href="mailto:contact-website@demenagements-gramme.be"
                  className="hover:text-gramme-yellow transition-colors break-all"
                >
                  contact-website@demenagements-gramme.be
                </a>
              </div>
              <div className="pt-2">
                <p className="text-xs text-white/70">TVA: BE 0775.264.382</p>
              </div>
            </div>
          </div>

          {/* Nos Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gramme-yellow">Nos services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/demenagements" className="hover:text-gramme-yellow transition-colors hover:translate-x-1 inline-block">
                  Déménagements
                </Link>
              </li>
              <li>
                <Link to="/transports" className="hover:text-gramme-yellow transition-colors hover:translate-x-1 inline-block">
                  Transports
                </Link>
              </li>
              <li>
                <Link to="/garde-meubles" className="hover:text-gramme-yellow transition-colors hover:translate-x-1 inline-block">
                  Garde-meubles
                </Link>
              </li>
              <li>
                <Link to="/demenagement-international" className="hover:text-gramme-yellow transition-colors hover:translate-x-1 inline-block">
                  Déménagement international
                </Link>
              </li>
              <li>
                <Link to="/monte-meubles" className="hover:text-gramme-yellow transition-colors hover:translate-x-1 inline-block">
                  Monte-meubles
                </Link>
              </li>
              <li>
                <Link to="/actualites" className="hover:text-gramme-yellow transition-colors hover:translate-x-1 inline-block">
                  Actualités
                </Link>
              </li>
            </ul>
          </div>

          {/* Pages légales */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gramme-yellow">Informations légales</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/mentions-legales" className="hover:text-gramme-yellow transition-colors hover:translate-x-1 inline-block">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/politique-confidentialite" className="hover:text-gramme-yellow transition-colors hover:translate-x-1 inline-block">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/conditions-generales" className="hover:text-gramme-yellow transition-colors hover:translate-x-1 inline-block">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link to="/protection-donnees" className="hover:text-gramme-yellow transition-colors hover:translate-x-1 inline-block">
                  Protection des données
                </Link>
              </li>
              <li>
                <Link to="/contact-devis" className="hover:text-gramme-yellow transition-colors hover:translate-x-1 inline-block">
                  Contact & Devis
                </Link>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gramme-yellow">Suivez-nous</h3>
            <p className="text-sm mb-4">Restez informé de nos actualités</p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gramme-yellow hover:text-gramme-dark-blue flex items-center justify-center transition-all hover:scale-110 text-sm font-bold"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gramme-yellow hover:text-gramme-dark-blue flex items-center justify-center transition-all hover:scale-110 text-sm font-bold"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gramme-yellow hover:text-gramme-dark-blue flex items-center justify-center transition-all hover:scale-110 text-sm font-bold"
                aria-label="Twitter"
              >
                𝕏
              </a>
            </div>
            <div className="mt-6">
              <Link to="/contact-devis" className="btn-secondary inline-block text-sm">
                Demander un devis
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/80">
            <p>
              © {new Date().getFullYear()} Déménagements Gramme - Tous droits réservés
            </p>
            <p className="text-xs">
              Plus de 60 ans d'expérience à votre service
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
