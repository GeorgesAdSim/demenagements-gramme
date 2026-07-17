import { Link } from 'react-router-dom';

const FACEBOOK_URL = 'https://www.facebook.com/GrammeDemenagements';

export default function Footer() {
  return (
    <footer className="bg-footer-bg text-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="mb-4 inline-block">
            <div className="bg-white rounded-xl px-3 py-1.5">
              <picture>
                <source srcSet="/logo-gramme.webp" type="image/webp" />
                <img
                  src="/logo-gramme.jpeg"
                  alt="Déménagements Gramme"
                  className="h-10 w-auto"
                  loading="lazy"
                  width="2400"
                  height="1792"
                />
              </picture>
            </div>
          </div>
          <p className="text-white/60 text-sm mb-4">
            Votre déménageur de confiance à Liège depuis 1948.
          </p>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-9 h-9 rounded-full bg-yellow items-center justify-center hover:bg-white transition-colors"
            aria-label="Facebook"
          >
            <svg className="w-4 h-4 text-navy" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </div>

        <div>
          <h4 className="text-yellow text-[11px] uppercase tracking-[0.2em] font-bold mb-4">
            NOS SERVICES
          </h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>
              <Link to="/demenagement" className="hover:text-white transition-colors">
                Déménagement
              </Link>
            </li>
            <li>
              <Link to="/transport" className="hover:text-white transition-colors">
                Transport
              </Link>
            </li>
            <li>
              <Link to="/garde-meubles" className="hover:text-white transition-colors">
                Garde-Meubles
              </Link>
            </li>
            <li>
              <Link to="/demenagement/demenagement-international" className="hover:text-white transition-colors">
                Déménagement International
              </Link>
            </li>
            <li>
              <Link to="/demenagement/demenagement-entreprise" className="hover:text-white transition-colors">
                Déménagement Entreprise
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-yellow text-[11px] uppercase tracking-[0.2em] font-bold mb-4">
            INFORMATIONS
          </h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>
              <Link to="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/contact-devis" className="hover:text-white transition-colors">
                Contact &amp; Devis
              </Link>
            </li>
            <li>
              <Link to="/demenagement/demenagement-liege" className="hover:text-white transition-colors">
                Déménagement à Liège
              </Link>
            </li>
            <li>
              <Link to="/demenagement/demenagement-seraing" className="hover:text-white transition-colors">
                Déménagement Seraing
              </Link>
            </li>
            <li>
              <Link to="/demenagement/demenagement-herstal" className="hover:text-white transition-colors">
                Déménagement Herstal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-yellow text-[11px] uppercase tracking-[0.2em] font-bold mb-4">
            CONTACT
          </h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>Rue des Naiveux 64, 4040 Herstal</li>
            <li>
              Tél : <a href="tel:+3242645016" className="hover:text-white transition-colors">04 264 50 16</a>
            </li>
            <li>
              <a href="mailto:contact@demenagements-gramme.be" className="hover:text-white transition-colors break-all">
                contact@demenagements-gramme.be
              </a>
            </li>
            <li className="pt-1">Lun-Ven : 8h–18h | Sam : 8h–12h</li>
            <li>Dim : Fermé</li>
            <li className="text-white/40 text-xs">TVA BE 0775.264.382</li>
          </ul>
          <Link
            to="/contact-devis"
            className="mt-4 w-full bg-yellow text-navy font-bold uppercase py-2.5 rounded text-sm hover:bg-white transition-colors block text-center"
          >
            Devis Gratuit
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-white/40 text-[13px]">
          &copy; 2026 Déménagements Gramme. Tous droits réservés.
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-white/40 text-[13px]">
          <Link to="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link>
          <span>|</span>
          <Link to="/politique-confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
          <span>|</span>
          <Link to="/conditions-generales" className="hover:text-white transition-colors">CGV</Link>
          <span>|</span>
          <Link to="/protection-donnees" className="hover:text-white transition-colors">Protection des données</Link>
        </div>
      </div>
    </footer>
  );
}
