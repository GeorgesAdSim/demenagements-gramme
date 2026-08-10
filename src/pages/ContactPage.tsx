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
} from 'lucide-react';
import TopBar from '../components/TopBar';
import ServiceNavbar from '../components/ServiceNavbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import SchemaOrg from '../components/SchemaOrg';

import { useSitePageContent } from '../lib/useSitePageContent';
import type { ContactPageContent } from '../lib/types';
import { anneesExperience } from '../lib/anciennete';
import { SERVICES, VOLUMES, useFormulaireDevis, type ChampsDevis } from '../lib/devis';
import { ENTREPRISE } from '../data/entreprise';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

// Sous-ensemble affiché sur cette page. Les valeurs viennent du socle : les
// redéclarer est ce qui avait fait diverger les listes d'un formulaire à
// l'autre. Que /contact propose deux services quand /contact-devis en propose
// quatre reste une question de contenu, à trancher séparément.
const ICONES: Record<string, typeof Truck> = { 'demenagement': Truck, 'garde-meuble': Warehouse };
const SERVICES_AFFICHES = SERVICES.filter((s) => s.valeur in ICONES);

const VOLUMES_AFFICHES = VOLUMES.filter((v) => v.valeur !== '>100');

const defaultContent: ContactPageContent = {
  hero: {
    badge: 'CONTACT',
    title: 'Demandez votre devis gratuit',
    subtitle: 'Remplissez le formulaire ci-dessous et recevez une offre personnalisée sous 24h. Gratuit et sans engagement.',
  },
  sidebar: {
    whyChooseUs: [
      'Devis gratuit et sans engagement',
      `Plus de ${anneesExperience()} ans d'expérience`,
      'Assurance tous risques incluse',
      'Équipe qualifiée et ponctuelle',
      'Belgique et international',
    ],
    urgentTitle: "Besoin d'une réponse rapide ?",
    urgentSubtitle: 'Appelez-nous directement :',
  },
  process: {
    sectionTitle: 'Comment ça marche',
    steps: [
      { step: '01', title: 'Formulaire', desc: 'Remplissez le formulaire ci-dessus avec les détails de votre projet.' },
      { step: '02', title: 'Devis 24h', desc: 'Nous analysons votre demande et vous envoyons un devis personnalisé sous 24h.' },
      { step: '03', title: 'Confirmation', desc: "Vous validez le devis et nous fixons ensemble la date d'intervention." },
      { step: '04', title: 'Réalisation', desc: 'Notre équipe intervient selon le planning convenu, avec soin et professionnalisme.' },
    ],
  },
  visit: {
    title: 'Rendez-nous visite',
    subtitle: "Nos bureaux se situent à Seraing, aux portes de Liège. N'hésitez pas à venir nous rencontrer.",
  },
};

export default function ContactPage() {
  const { content, meta } = useSitePageContent<ContactPageContent>('contact');
  const c = content || defaultContent;

  const { form, set, errors, submitted, loading, success, erreurEnvoi, envoyer } =
    useFormulaireDevis({ source: 'contact' });

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
        title={meta?.metaTitle || 'Demandez votre devis gratuit | Déménagements Gramme'}
        description={
          meta?.metaDescription ||
          "Contactez Déménagements Gramme à Seraing (Liège) : devis gratuit et sans engagement, réponse garantie sous 24h. Téléphone, formulaire en ligne et horaires."
        }
        canonical={meta?.canonicalUrl || '/contact'}
      />
      {/* Page dont les coordonnées sont le sujet même : la déclaration
          complète de l'établissement y est à sa place, contrairement aux
          pages communes où elle n'était que de la répétition. */}
      <SchemaOrg organization="full" />
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
                {c.hero.badge}
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl font-black uppercase text-white leading-tight">
              {c.hero.title}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/80 text-lg mt-4 max-w-2xl">
              {c.hero.subtitle}
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
                      <p className="text-white/90">{ENTREPRISE.adresse.rue}<br />{ENTREPRISE.adresse.codePostal} {ENTREPRISE.adresse.localite}</p>
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
                      <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Horaires</p>
                      <p className="text-white/90">Lun : 8h–18h | Mar–Ven : 8h–17h</p>
                      <p className="text-white/90 text-sm">Sam–Dim : Fermé</p>
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
                  {c.sidebar.whyChooseUs.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
                      <span className="text-muted text-[15px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow/10 border border-yellow/30 rounded-2xl p-6">
                <p className="text-navy font-bold text-sm mb-1">{c.sidebar.urgentTitle}</p>
                <p className="text-muted text-sm mb-4">{c.sidebar.urgentSubtitle}</p>
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
                <div className="mb-8" role="group" aria-labelledby="cp-service-label">
                  {/* Intitulé d'un groupe de boutons, pas d'un champ : un <label> sans
                      contrôle associé est invalide. On nomme donc le groupe. */}
                  <p id="cp-service-label" className="block text-navy font-bold text-sm uppercase tracking-wider mb-3">
                    Type de service
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {SERVICES_AFFICHES.map(({ libelle, valeur }) => {
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
                      <label htmlFor="cp-firstName" className="block text-sm font-medium text-navy mb-1.5">Prénom *</label>
                      <input id="cp-firstName" autoComplete="given-name" aria-invalid={submitted && !!errors.firstName} aria-describedby={submitted && errors.firstName ? 'cp-firstName-erreur' : undefined} type="text" name="firstName" required placeholder="Votre prénom" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className={inputClass('firstName')} />
                      {submitted && errors.firstName && <p id='cp-firstName-erreur' className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label htmlFor="cp-lastName" className="block text-sm font-medium text-navy mb-1.5">Nom *</label>
                      <input id="cp-lastName" autoComplete="family-name" aria-invalid={submitted && !!errors.lastName} aria-describedby={submitted && errors.lastName ? 'cp-lastName-erreur' : undefined} type="text" name="lastName" required placeholder="Votre nom" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} className={inputClass('lastName')} />
                      {submitted && errors.lastName && <p id='cp-lastName-erreur' className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cp-email" className="block text-sm font-medium text-navy mb-1.5">Email *</label>
                      <input id="cp-email" autoComplete="email" aria-invalid={submitted && !!errors.email} aria-describedby={submitted && errors.email ? 'cp-email-erreur' : undefined} type="email" name="email" required placeholder="votre@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass('email')} />
                      {submitted && errors.email && <p id='cp-email-erreur' className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="cp-phone" className="block text-sm font-medium text-navy mb-1.5">Téléphone *</label>
                      <input id="cp-phone" autoComplete="tel" aria-invalid={submitted && !!errors.phone} aria-describedby={submitted && errors.phone ? 'cp-phone-erreur' : undefined} type="tel" name="phone" required placeholder="+32 4XX XX XX XX" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass('phone')} />
                      {submitted && errors.phone && <p id='cp-phone-erreur' className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cp-addressFrom" className="block text-sm font-medium text-navy mb-1.5">Ville de départ *</label>
                      <input id="cp-addressFrom" autoComplete="address-level2" aria-invalid={submitted && !!errors.cityFrom} aria-describedby={submitted && errors.cityFrom ? 'cp-addressFrom-erreur' : undefined} type="text" name="addressFrom" required placeholder="Ex : Liège" value={form.cityFrom} onChange={(e) => set('cityFrom', e.target.value)} className={inputClass('cityFrom')} />
                      {submitted && errors.cityFrom && <p id='cp-addressFrom-erreur' className="text-red-500 text-xs mt-1">{errors.cityFrom}</p>}
                    </div>
                    <div>
                      <label htmlFor="cp-addressTo" className="block text-sm font-medium text-navy mb-1.5">Ville d'arrivée *</label>
                      <input id="cp-addressTo" aria-invalid={submitted && !!errors.cityTo} aria-describedby={submitted && errors.cityTo ? 'cp-addressTo-erreur' : undefined} type="text" name="addressTo" required placeholder="Ex : Bruxelles" value={form.cityTo} onChange={(e) => set('cityTo', e.target.value)} className={inputClass('cityTo')} />
                      {submitted && errors.cityTo && <p id='cp-addressTo-erreur' className="text-red-500 text-xs mt-1">{errors.cityTo}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cp-date" className="block text-sm font-medium text-navy mb-1.5">Date souhaitée</label>
                      <input id="cp-date" aria-invalid={submitted && !!errors.date} aria-describedby={submitted && errors.date ? 'cp-date-erreur' : undefined} type="date" name="date" value={form.date} onChange={(e) => set('date', e.target.value)} className={inputClass('date')} />
                    </div>
                    <div>
                      <label htmlFor="cp-volume" className="block text-sm font-medium text-navy mb-1.5">Volume estimé</label>
                      <select id="cp-volume" aria-invalid={submitted && !!errors.volume} aria-describedby={submitted && errors.volume ? 'cp-volume-erreur' : undefined} name="volume" value={form.volume} onChange={(e) => set('volume', e.target.value)} className={inputClass('volume')}>
                        <option value="">Sélectionnez un volume</option>
                        {VOLUMES_AFFICHES.map((v) => (
                          <option key={v.valeur} value={v.valeur}>{v.libelle}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cp-message" className="block text-sm font-medium text-navy mb-1.5">Message / Précisions</label>
                    <textarea id="cp-message" aria-invalid={submitted && !!errors.message} aria-describedby={submitted && errors.message ? 'cp-message-erreur' : undefined} name="message" placeholder="Décrivez votre projet : nombre de pièces, étage, accès difficile, objets spéciaux..." rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} className={inputClass('message')} />
                  </div>

                  <div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" name="consent" aria-invalid={submitted && !!errors.privacy} aria-describedby={submitted && errors.privacy ? 'cp-consent-erreur' : undefined} checked={form.privacy} onChange={(e) => set('privacy', e.target.checked)} className="mt-1 w-4 h-4 accent-navy rounded" />
                      <span className="text-sm text-muted group-hover:text-text transition-colors">
                        J'accepte que mes données soient utilisées pour traiter ma demande conformément à la{' '}
                        <Link to="/politique-confidentialite" className="text-navy underline hover:text-navy/70 transition-colors">
                          politique de confidentialité
                        </Link>. *
                      </span>
                    </label>
                    {submitted && errors.privacy && <p id='cp-consent-erreur' className="text-red-500 text-xs mt-1 ml-7">{errors.privacy}</p>}
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

      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block bg-navy text-yellow text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-1.5 mb-4">
              PROCESSUS
            </span>
            <h2 className="text-2xl md:text-[2rem] font-black uppercase text-navy">
              {c.process.sectionTitle}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {c.process.steps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="text-center relative"
              >
                <div className="relative inline-flex mb-4">
                  <span className="text-5xl font-black text-navy/10">{item.step}</span>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px border-t-2 border-dashed border-navy/15" />
                )}
                <h3 className="text-navy font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-yellow" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black uppercase text-white mb-3">
              {c.visit.title}
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              {c.visit.subtitle}
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 max-w-lg mx-auto">
              <p className="text-white font-bold text-lg">Déménagements Gramme</p>
              <p className="text-white/70 mt-1">{ENTREPRISE.adresse.rue}</p>
              <p className="text-white/70">{ENTREPRISE.adresse.codePostal} {ENTREPRISE.adresse.localite}, {ENTREPRISE.adresse.pays}</p>
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href="tel:+3242645016" className="flex items-center gap-2 text-yellow hover:text-white transition-colors text-sm font-bold">
                  <Phone className="w-4 h-4" />
                  04 264 50 16
                </a>
                <span className="hidden sm:inline text-white/20">|</span>
                <a href="mailto:contact@demenagements-gramme.be" className="flex items-center gap-2 text-yellow hover:text-white transition-colors text-sm font-bold">
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </div>
            </div>
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
