import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info, ShieldCheck } from 'lucide-react';

// Grille reprise à l'identique de la page /garde-meubles, seule source de
// vérité. Deux grilles divergentes, c'est un client qui se fait opposer un prix
// erroné.
const BOXES = [
  { volume: '1 m³', prix: '30' },
  { volume: '2 m³', prix: '40' },
  { volume: '8 m³', prix: '76' },
  { volume: '12 m³', prix: '95' },
  { volume: '15 m³', prix: '105' },
  { volume: '20 m³', prix: '130' },
  { volume: '24 m³', prix: '150' },
  { volume: '+30 m³', prix: '6', unite: '/m³' },
];

// Repères de volume, utiles pour que le visiteur se situe avant de demander un
// devis. Correspondent aux paliers proposés dans le formulaire d'estimation.
const REPERES = [
  { logement: 'Studio ou 1 pièce', volume: '10 à 20 m³' },
  { logement: 'Appartement 2 pièces', volume: '20 à 35 m³' },
  { logement: 'Appartement 3 pièces', volume: '35 à 55 m³' },
  { logement: 'Maison 4 pièces', volume: '55 à 75 m³' },
  { logement: 'Grande maison', volume: '75 à 100 m³' },
];

export default function PricingSection() {
  return (
    <section id="tarifs" className="bg-offwhite py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="inline-block bg-navy text-yellow text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-1.5 mb-4">
            TARIFS
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase text-navy leading-tight mb-5">
            Combien coûte un déménagement à Liège&nbsp;?
          </h2>

          {/* Passage extractible — répond à « combien ça coûte », l'une des trois
              questions que les moteurs de réponse citent le plus volontiers. */}
          <p className="text-muted text-[17px] leading-relaxed mb-4">
            Le prix d'un déménagement dépend de quatre facteurs. Le volume à
            transporter, la distance, l'accessibilité des deux adresses, et les
            prestations choisies comme l'emballage ou le démontage. Un
            troisième étage sans ascenseur en Outremeuse ne coûte pas le même prix
            qu'un rez-de-chaussée avec parking à Rocourt, à volume identique.
          </p>
          <p className="text-muted text-[17px] leading-relaxed">
            C'est pourquoi nous ne publions pas de tarif unique au mètre cube&nbsp;:
            ce serait vous annoncer un chiffre qui ne tiendrait pas. Nous
            procédons par visite technique gratuite, puis devis détaillé et
            gratuit sous 24 heures ouvrables — sans engagement de votre part.
          </p>
        </motion.div>

        {/* Repères de volume */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-8"
        >
          <h3 className="text-navy font-bold text-lg mb-4">
            Estimer votre volume avant le devis
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 pr-4 text-navy text-sm font-bold uppercase tracking-wider">Logement</th>
                  <th className="py-3 text-navy text-sm font-bold uppercase tracking-wider">Volume estimé</th>
                </tr>
              </thead>
              <tbody>
                {REPERES.map((r, i) => (
                  <tr key={r.logement} className={i % 2 ? 'bg-offwhite/60' : ''}>
                    <td className="py-3 pr-4 text-navy text-[15px] font-medium">{r.logement}</td>
                    <td className="py-3 text-muted text-[15px]">{r.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted text-sm leading-relaxed mt-4">
            Ces repères sont indicatifs. Le volume réel dépend du mobilier
            effectif&nbsp;: une bibliothèque garnie ou un atelier de bricolage
            font vite grimper le total.
          </p>
        </motion.div>

        {/* Grille garde-meubles — tarifs réellement publics */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="p-6 md:p-8 pb-4">
            <h3 className="text-navy font-bold text-lg mb-2">
              Garde-meubles à Liège&nbsp;: nos tarifs mensuels
            </h3>
            <p className="text-muted text-[15px] leading-relaxed">
              Pour le stockage, en revanche, les prix sont fixes et publics. Box
              individuels fermés dans notre garde-meubles de Seraing, à partir d'un mois
              de location.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-navy">
                  <th className="text-left text-yellow font-bold text-sm uppercase tracking-wider py-3.5 px-6">Volume</th>
                  <th className="text-right text-yellow font-bold text-sm uppercase tracking-wider py-3.5 px-6">Par mois</th>
                </tr>
              </thead>
              <tbody>
                {BOXES.map((b, i) => (
                  <tr key={b.volume} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-offwhite/60'}`}>
                    <td className="py-3.5 px-6 font-bold text-navy text-[15px]">{b.volume}</td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="text-navy font-black text-lg">{b.prix}&nbsp;€</span>
                      {b.unite && <span className="text-muted text-sm">{b.unite}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 md:p-8 pt-5 space-y-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-navy mt-0.5 shrink-0" />
              <p className="text-muted text-[15px] leading-relaxed">
                Assurance vol, incendie et dégradation incluse dans le tarif, ainsi
                que l'assistance de notre magasinier pour les entrées et sorties,
                du lundi au vendredi.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-navy mt-0.5 shrink-0" />
              <p className="text-muted text-[15px] leading-relaxed">
                La facturation se fait sur le volume réellement constaté à
                l'entrée en stockage, l'estimation du devis restant indicative.
                Vous êtes libre d'assister à la mise en garde-meubles. Réservation
                sans engagement, prix garantis 15 jours.
              </p>
            </div>
            <Link
              to="/garde-meubles/prix-garde-meubles-liege"
              className="inline-flex text-navy font-bold underline hover:text-navy/70 transition-colors text-[15px]"
            >
              Voir le détail des prix du garde-meubles à Liège
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
