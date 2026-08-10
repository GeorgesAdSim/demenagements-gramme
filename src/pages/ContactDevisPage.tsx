import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Loader as Loader2,
  CircleCheck as CheckCircle2,
  Truck,
  Warehouse,
  Globe,
  ArrowUpFromLine,
} from 'lucide-react';
import TopBar from '../components/TopBar';
import ServiceNavbar from '../components/ServiceNavbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import SchemaOrg from '../components/SchemaOrg';

/**
 * Ce que le visiteur veut savoir avant d'envoyer le formulaire.
 *
 * Page de conversion : elle ne doit pas être noyée sous du texte. Ces quatre
 * étapes tiennent en une bande au-dessus du formulaire, sans le déplacer ni le
 * modifier.
 */
const APRES_ENVOI = [
  {
    titre: 'Nous vous rappelons',
    texte:
      "Un responsable vous recontacte sous 24 heures ouvrables pour préciser votre projet et convenir d'un rendez-vous. Aucun devis n'est établi par téléphone : nous préférons voir.",
  },
  {
    titre: 'Visite technique gratuite',
    texte:
      "Elle dure trente à quarante-cinq minutes. Nous mesurons le volume pièce par pièce, relevons l'étage, la cage d'escalier, l'ascenseur et le stationnement, aux deux adresses quand c'est possible.",
  },
  {
    titre: 'Devis détaillé',
    texte:
      "Vous le recevez sous 24 heures ouvrables après la visite. Il détaille le volume retenu, les prestations, le matériel et le prix. Rien ne s'ajoute le jour J s'il n'y figure pas.",
  },
  {
    titre: 'Vous décidez',
    texte:
      "La visite et le devis sont gratuits et sans engagement. Tant que vous n'avez pas confirmé, aucune date n'est bloquée et rien ne vous est facturé.",
  },
];

/** FAQ affichée et balisée : les deux lisent cette même liste. */
const FAQ_DEVIS = [
  {
    q: 'Le devis est-il vraiment gratuit et sans engagement ?',
    a: "Oui. La visite technique et le devis sont gratuits et ne vous engagent à rien. Vous pouvez les demander pour comparer, même si votre décision n'est pas prise. Rien ne vous est facturé tant que vous n'avez pas confirmé la date.",
  },
  {
    q: 'Sous quel délai obtiendrai-je une réponse ?',
    a: "Nous recontactons chaque demande sous 24 heures ouvrables. Le devis lui-même arrive sous 24 heures ouvrables après la visite technique. Une demande déposée un vendredi soir reçoit donc sa réponse en début de semaine suivante.",
  },
  {
    q: "Que demandez-vous lors de la visite technique ?",
    a: "Rien de particulier à préparer. Nous parcourons les pièces pour mesurer le volume réel, et nous relevons ce qui conditionne l'intervention : étage, largeur de la cage d'escalier, présence d'un ascenseur, possibilités de stationnement. Signalez-nous simplement les objets lourds ou fragiles — piano, coffre-fort, œuvres — et les meubles que vous ne souhaitez pas emporter.",
  },
  {
    q: 'Qu\'est-ce qui fait varier le prix ?',
    a: "Quatre facteurs : le volume, la distance entre les deux adresses, l'accessibilité de chacune et les prestations choisies. L'accessibilité pèse autant que le volume — un troisième étage sans ascenseur ne coûte pas comme un rez-de-chaussée avec parking, à volume identique. La saison joue aussi : mai à septembre est la période la plus demandée.",
  },
  {
    q: 'Puis-je annuler ou déplacer la date après avoir signé ?',
    a: "Contactez-nous dès que vous le savez. Plus le préavis est long, plus le report est simple à organiser, surtout en pleine saison. Les conditions applicables figurent sur le devis que vous avez reçu : nous n'appliquons rien qui n'y soit écrit.",
  },
];
import { anneesExperience } from '../lib/anciennete';
import { SERVICES, VOLUMES, useFormulaireDevis, type ChampsDevis } from '../lib/devis';
import { ENTREPRISE, CARTE_EMBED_URL } from '../data/entreprise';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

// Les valeurs et libellés viennent du socle ; cette page y ajoute une icône par
// service. Auparavant elle redéfinissait la liste entière, et c'est ainsi que
// « International » et « Monte-Meubles » ont existé ici sans exister ailleurs —
// jusqu'à ce qu'une contrainte écrite d'après un autre formulaire les rejette.
const ICONES: Record<string, typeof Truck> = {
  'demenagement': Truck,
  'garde-meuble': Warehouse,
  'international': Globe,
  'monte-meubles': ArrowUpFromLine,
};

export default function ContactDevisPage() {
  const { form, set, errors, submitted, loading, success, erreurEnvoi, envoyer } =
    useFormulaireDevis({ source: 'contact-devis', dateObligatoire: true });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const inputBase =
    'w-full border rounded-xl px-4 py-3.5 text-base outline-none transition-all duration-200 bg-white focus:ring-2 placeholder:text-muted/60';

  const inputClass = (key: keyof ChampsDevis) =>
    `${inputBase} ${errors[key] ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-navy/20 focus:border-navy'}`;

  return (
    <div className="font-sans">
      <SeoHead
        title="Contact & Devis Gratuit — Déménagements Gramme Liège"
        description="Contactez Déménagements Gramme pour un devis gratuit et sans engagement. Formulaire en ligne, téléphone et adresse à Seraing (Liège)."
        canonical="/contact-devis"
      />
      {/* Page de conversion sur laquelle le visiteur cherche à nous joindre :
          adresse, horaires et téléphone y sont déclarés au complet. */}
      <SchemaOrg organization="full" customFaq={FAQ_DEVIS} />
      <TopBar />
      <ServiceNavbar />

      <main id="main-content">
        <section
          className="relative py-20 md:py-28 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #132073 0%, #0D1B5E 60%, #1A2A8A 100%)' }}
        >
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.div variants={fadeUp}>
                <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mb-6">
                  <ArrowLeft className="w-4 h-4" />
                  Retour à l'accueil
                </Link>
              </motion.div>
              <motion.div variants={fadeUp}>
                <span className="inline-block bg-yellow text-navy text-[13px] font-bold rounded-full px-4 py-1.5 mb-4">
                  CONTACT & DEVIS
                </span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl font-black uppercase text-white leading-tight">
                Demandez votre devis gratuit
              </motion.h1>
              <motion.p variants={fadeUp} className="text-white/80 text-lg mt-4 max-w-2xl">
                Remplissez le formulaire ci-dessous ou contactez-nous directement. Réponse garantie sous 24h ouvrables, gratuit et sans engagement.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="bg-offwhite py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="bg-navy rounded-2xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-6">Nos coordonnées</h3>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-yellow" />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Adresse</p>
                        <p className="text-white/90">{ENTREPRISE.adresse.rue}<br />{ENTREPRISE.adresse.codePostal} {ENTREPRISE.adresse.localite} ({ENTREPRISE.adresse.province})</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-yellow" />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Téléphone</p>
                        <a href="tel:+3242645016" className="block text-white/90 hover:text-white transition-colors">04 264 50 16</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-yellow" />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Email</p>
                        <a href="mailto:contact@demenagements-gramme.be" className="text-white/90 hover:text-white transition-colors break-all text-sm">
                          contact@demenagements-gramme.be
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-yellow" />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Réponse</p>
                        <p className="text-white/90">Sous 24h ouvrables</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-gray-100">
                  <h3 className="text-navy font-bold text-lg mb-4">Pourquoi nous choisir ?</h3>
                  <ul className="space-y-3">
                    {[
                      'Devis gratuit et sans engagement',
                      `Plus de ${anneesExperience()} ans d'expérience`,
                      'Assurance tous risques incluse',
                      'Équipe qualifiée et ponctuelle',
                      'Belgique et international',
                      'Entreprise familiale depuis 1948',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
                        <span className="text-muted text-[15px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow/10 border border-yellow/30 rounded-2xl p-6">
                  <p className="text-navy font-bold text-sm mb-1">Besoin d'une réponse rapide ?</p>
                  <p className="text-muted text-sm mb-4">Appelez-nous directement :</p>
                  <a
                    href="tel:+3242645016"
                    className="flex items-center justify-center gap-2 bg-navy text-yellow font-bold uppercase py-3 px-6 rounded-xl hover:bg-navy/90 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    04 264 50 16
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm"
              >
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 bg-navy text-yellow rounded-xl px-6 py-5 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Demande envoyée avec succès !</p>
                      <p className="text-yellow/80 text-sm mt-1">Nous vous recontacterons sous 24h ouvrables.</p>
                    </div>
                  </motion.div>
                )}

                <form method="POST" onSubmit={envoyer} noValidate
                toolname="demander_devis_demenagement"
                tooldescription="Prépare une demande de devis gratuit pour un déménagement ou un garde-meubles chez Déménagements Gramme. Le formulaire est rempli mais reste soumis par la personne : renseigner les champs ne crée aucune demande."
              >
                  <div className="mb-8" role="group" aria-labelledby="cd-service-label">
                    {/* Intitulé d'un groupe de boutons, pas d'un champ : un <label> sans
                        contrôle associé est invalide. On nomme donc le groupe. */}
                    <p id="cd-service-label" className="block text-navy font-bold text-sm uppercase tracking-wider mb-3">
                      Type de service
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {SERVICES.map(({ libelle, valeur }) => {
                        const Icon = ICONES[valeur];
                        return (
                        <button
                          key={valeur}
                          type="button"
                          onClick={() => set('service', valeur)}
                          className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-200 ${
                            form.service === valeur
                              ? 'border-navy bg-navy text-yellow'
                              : 'border-gray-200 text-navy hover:border-navy/30 hover:bg-navy/[0.02]'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-xs font-bold uppercase">{libelle}</span>
                        </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cd-firstName" className="block text-sm font-medium text-navy mb-1.5">Prénom *</label>
                        <input id="cd-firstName" type="text" name="firstName" required placeholder="Votre prénom" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className={inputClass('firstName')} />
                        {submitted && errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label htmlFor="cd-lastName" className="block text-sm font-medium text-navy mb-1.5">Nom *</label>
                        <input id="cd-lastName" type="text" name="lastName" required placeholder="Votre nom" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} className={inputClass('lastName')} />
                        {submitted && errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cd-email" className="block text-sm font-medium text-navy mb-1.5">Email *</label>
                        <input id="cd-email" type="email" name="email" required placeholder="votre@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass('email')} />
                        {submitted && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label htmlFor="cd-phone" className="block text-sm font-medium text-navy mb-1.5">Téléphone *</label>
                        <input id="cd-phone" type="tel" name="phone" required placeholder="+32 4XX XX XX XX" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass('phone')} />
                        {submitted && errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cd-addressFrom" className="block text-sm font-medium text-navy mb-1.5">Ville de départ *</label>
                        <input id="cd-addressFrom" type="text" name="addressFrom" required placeholder="Ex : Liège" value={form.cityFrom} onChange={(e) => set('cityFrom', e.target.value)} className={inputClass('cityFrom')} />
                        {submitted && errors.cityFrom && <p className="text-red-500 text-xs mt-1">{errors.cityFrom}</p>}
                      </div>
                      <div>
                        <label htmlFor="cd-addressTo" className="block text-sm font-medium text-navy mb-1.5">Ville d'arrivée *</label>
                        <input id="cd-addressTo" type="text" name="addressTo" required placeholder="Ex : Bruxelles" value={form.cityTo} onChange={(e) => set('cityTo', e.target.value)} className={inputClass('cityTo')} />
                        {submitted && errors.cityTo && <p className="text-red-500 text-xs mt-1">{errors.cityTo}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cd-date" className="block text-sm font-medium text-navy mb-1.5">Date souhaitée *</label>
                        <input id="cd-date" type="date" name="date" required value={form.date} onChange={(e) => set('date', e.target.value)} className={inputClass('date')} />
                        {submitted && errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                      </div>
                      <div>
                        <label htmlFor="cd-volume" className="block text-sm font-medium text-navy mb-1.5">Volume estimé</label>
                        <select id="cd-volume" name="volume" value={form.volume} onChange={(e) => set('volume', e.target.value)} className={inputClass('volume')}>
                          <option value="">Sélectionnez un volume</option>
                          {VOLUMES.map((v) => (
                            <option key={v.valeur} value={v.valeur}>{v.libelle}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="cd-message" className="block text-sm font-medium text-navy mb-1.5">Message / Précisions</label>
                      <textarea id="cd-message" name="message" placeholder="Décrivez votre projet : nombre de pièces, étage, accès difficile, objets spéciaux..." rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} className={inputClass('message')} />
                    </div>

                    <div>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" name="consent" checked={form.privacy} onChange={(e) => set('privacy', e.target.checked)} className="mt-1 w-4 h-4 accent-navy rounded" />
                        <span className="text-sm text-muted group-hover:text-text transition-colors">
                          J'accepte que mes données soient utilisées pour traiter ma demande conformément à la{' '}
                          <Link to="/politique-confidentialite" className="text-navy underline hover:text-navy/70 transition-colors">
                            politique de confidentialité
                          </Link>. *
                        </span>
                      </label>
                      {submitted && errors.privacy && <p className="text-red-500 text-xs mt-1 ml-7">{errors.privacy}</p>}
                    </div>

                    {/* Échec de l'enregistrement. `role="alert"` pour que l'assistance vocale
                        l'annonce : sans lui, la personne relance le même envoi sans savoir ce
                        qui a échoué. */}
                    {erreurEnvoi && (
                      <div role="alert" className="mb-4 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3">
                        <p className="text-red-700 text-sm font-semibold">{erreurEnvoi}</p>
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-yellow text-navy font-bold uppercase py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-navy hover:text-yellow transition-colors duration-200 disabled:opacity-70 text-lg tracking-wide"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Envoyer ma demande
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>

                    <p className="text-center text-muted text-xs">
                      * Champs obligatoires. Réponse garantie sous 24h ouvrables.
                    </p>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Ce qui se passe après l'envoi. Placé APRÈS le formulaire : le
            visiteur arrive ici pour déposer une demande, pas pour lire une procédure. */}
        <section className="bg-white py-12 md:py-14">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-2xl md:text-[2rem] font-black uppercase text-navy mb-3">
              Ce qui se passe après votre demande
            </h2>
            <p className="text-muted text-[17px] leading-relaxed mb-8 max-w-3xl">
              Quatre étapes, sans engagement à aucune d'elles. Vous ne signez rien
              avant d'avoir reçu un prix détaillé par écrit.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {APRES_ENVOI.map((etape, i) => (
                <motion.div
                  key={etape.titre}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="bg-offwhite rounded-2xl p-5 border border-gray-100"
                >
                  <span className="inline-flex w-7 h-7 rounded-full bg-navy text-yellow font-black text-sm items-center justify-center mb-3">
                    {i + 1}
                  </span>
                  <h3 className="text-navy font-bold text-[17px] mb-2">{etape.titre}</h3>
                  <p className="text-muted text-[15px] leading-relaxed">{etape.texte}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Questions posées avant l'envoi du formulaire, pas après. Réponses
            présentes dans le HTML, comme partout ailleurs sur le site. */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 md:px-8">
            <h2 className="text-2xl md:text-[2rem] font-black uppercase text-navy mb-8">
              Questions fréquentes sur le devis
            </h2>
            <div className="space-y-6">
              {FAQ_DEVIS.map((item) => (
                <div key={item.q}>
                  <h3 className="text-navy font-bold text-lg mb-2">{item.q}</h3>
                  <p className="text-muted text-[16px] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-offwhite py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <span className="inline-block bg-navy text-yellow text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-1.5 mb-4">
                LOCALISATION
              </span>
              <h2 className="text-2xl md:text-[2rem] font-black uppercase text-navy">
                Rendez-nous visite
              </h2>
              <p className="text-muted mt-3 max-w-xl mx-auto">
                Nos bureaux se situent à Seraing, aux portes de Liège. N'hésitez pas à venir nous rencontrer.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            >
              <iframe
                title="Déménagements Gramme - Localisation"
                src={CARTE_EMBED_URL}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {success && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-6 right-6 bg-navy text-yellow rounded-xl px-6 py-4 shadow-xl flex items-center gap-3 z-50"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold text-sm">Demande envoyée ! Réponse sous 24h.</span>
        </motion.div>
      )}
    </div>
  );
}
