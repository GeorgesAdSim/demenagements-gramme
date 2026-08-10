import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ArrowRight, Loader as Loader2, CircleCheck, Shield, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

import { SITE_IMAGES } from '../data/images';
import type { HomepageContent } from '../lib/types';
import { anneesExperience } from '../lib/anciennete';
import { mesurerEstimationPhotos } from '../lib/mesure';
import { SERVICES, VOLUMES, useFormulaireDevis, type ChampsDevis } from '../lib/devis';
import { ADRESSE_COURTE } from '../data/entreprise';

const FACEBOOK_URL = 'https://www.facebook.com/GrammeDemenagements';

// Sous-ensemble affiché ici : deux services, et pas de tranche « > 100 m³ ».
// Les VALEURS viennent du socle — c'est leur divergence qui casse des choses.
const SERVICES_AFFICHES = SERVICES.filter(
  (s) => s.valeur === 'demenagement' || s.valeur === 'garde-meuble',
);

// Les libellés de cette page diffèrent de ceux du socle : « 20–50m³ » avec un
// tiret demi-cadratin et sans espaces, là où /contact écrit « 20 - 50m³ ». La
// différence est purement typographique et visible sur soixante-douze pages ;
// l'harmoniser est une décision de contenu, pas un effet de bord du
// remaniement. Les valeurs, elles, sont bien les mêmes.
const LIBELLES_VOLUME: Record<string, string> = {
  '<20': '< 20m³',
  '20-50': '20–50m³',
  '50-100': '50–100m³',
  'unknown': 'Je ne sais pas',
};
const VOLUMES_AFFICHES = VOLUMES.filter((v) => v.valeur in LIBELLES_VOLUME);

const REASSURANCES = () => [
  'Réponse garantie sous 24h ouvrables',
  'Devis 100 % gratuit et sans engagement',
  'Assurance tous risques incluse',
  `+${anneesExperience()} ans d'expérience à votre service`,
];

interface Props {
  data?: HomepageContent['contact'] | null;
  /**
   * `complet` (défaut) : rendu inchangé — accueil, /contact-devis,
   * /zones-intervention, satellites. Aucune de ces pages ne passe la prop, et
   * aucune ne bouge d'un pixel.
   *
   * `locale` : variante des pages communes. La colonne de gauche disparaît —
   * quatre puces de réassurance, coordonnées, horaires, photo d'équipe,
   * Facebook, numéro de TVA : environ 110 mots strictement identiques sur les
   * soixante-dix pages communes, et déjà présents dans le pied de page comme
   * dans le hero. Le formulaire, lui, ne change pas : mêmes champs, même
   * validation, même insertion.
   */
  variant?: 'complet' | 'locale';
  /**
   * Commune pré-remplie dans « Adresse de départ », sur les pages locales.
   * Le champ reste modifiable : c'est une amorce, pas une valeur imposée.
   */
  villeParDefaut?: string;
}

export default function ContactForm({ data, variant = 'complet', villeParDefaut }: Props) {
  const locale = variant === 'locale';
  const [estimationId, setEstimationId] = useState<string | null>(null);

  const { form, set, remplacer, errors, submitted, loading, success, erreurEnvoi, envoyer } =
    useFormulaireDevis({
      source: 'formulaire-contact',
      libelleVilles: 'adresse',
      valeursInitiales: villeParDefaut ? { cityFrom: villeParDefaut } : undefined,
      suffixeMessage: estimationId ? `[estimation_id: ${estimationId}]` : undefined,
    });
  // Retour depuis l'estimateur de volume : pré-remplit le volume et rattache
  // l'estimation au devis via son id (champ caché ajouté au message).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('gramme_devis_draft');
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (draft.estimation_id) setEstimationId(draft.estimation_id);
      if (typeof draft.volume_m3 === 'number') {
        const tranche = draft.volume_m3 < 20 ? '<20' : draft.volume_m3 <= 50 ? '20-50' : '50-100';
        remplacer({
          volume: tranche,
          message: `Volume estimé via l'outil photos : ${draft.volume_m3} m³.`,
        });
      }
    } catch { /* draft corrompu — ignoré */ }
  }, []);

  const inputClass = (key: keyof ChampsDevis) =>
    `w-full border-2 rounded-xl px-4 py-3 text-base outline-none transition-all focus:ring-2 bg-white ${
      errors[key]
        ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
        : 'border-gray-200 focus:ring-yellow/30 focus:border-yellow'
    }`;

  return (
    <section id="contact" className="bg-offwhite py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Variante locale : un titre, une ligne, le formulaire. Tout le reste
            — argumentaire, coordonnées, photo — est du texte identique d'une
            commune à l'autre, et déjà servi ailleurs sur la même page. */}
        {locale && (
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black uppercase text-navy leading-tight">
              {villeParDefaut ? `Votre devis pour ${villeParDefaut}` : 'Votre devis gratuit'}
            </h2>
            <p className="text-muted text-lg mt-3">
              Réponse sous 24 heures ouvrables, sans engagement.
            </p>
          </div>
        )}

        <div
          className={
            locale
              ? 'max-w-2xl mx-auto'
              : 'grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10 lg:gap-16 items-start'
          }
        >

          {/* LEFT — Vendre le devis */}
          {!locale && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            <div>
              <span className="inline-block bg-yellow text-navy text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-1.5 mb-4">
                DEVIS GRATUIT EN 24H
              </span>
              <h2 className="text-3xl md:text-4xl font-black uppercase text-navy leading-tight">
                {data?.title || 'Demandez votre devis personnalisé'}
              </h2>
              <p className="text-muted text-lg mt-3 leading-relaxed">
                {data?.subtitle || 'Réponse garantie sous 24h. Gratuit et sans engagement.'}
              </p>
            </div>

            <ul className="space-y-3">
              {REASSURANCES().map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CircleCheck className="w-4 h-4 text-navy" />
                  </div>
                  <span className="text-navy/80 text-[15px] leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              {[
                { icon: MapPin, text: ADRESSE_COURTE },
                { icon: Phone, text: '04 264 50 16', href: 'tel:+3242645016' },
                { icon: Mail, text: 'contact@demenagements-gramme.be', href: 'mailto:contact@demenagements-gramme.be' },
                { icon: Clock, text: 'Lun : 8h–18h | Mar–Ven : 8h–17h' },
              ].map(({ icon: Icon, text, href }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-yellow flex-shrink-0" />
                  {href ? (
                    <a href={href} className="text-navy/80 hover:text-navy transition-colors text-sm">
                      {text}
                    </a>
                  ) : (
                    <span className="text-navy/70 text-sm">{text}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden aspect-[16/9] shadow-md">
              <img
                src={SITE_IMAGES.team.src}
                srcSet={SITE_IMAGES.team.srcSet}
                sizes="(min-width: 1024px) 600px, 100vw"
                alt={SITE_IMAGES.team.alt}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="flex items-center justify-between">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-10 h-10 rounded-full bg-navy items-center justify-center hover:bg-yellow transition-colors group"
                aria-label="Facebook Déménagements Gramme"
              >
                <svg className="w-5 h-5 text-yellow group-hover:text-navy transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <p className="text-navy/30 text-xs">TVA BE 0775.264.382</p>
            </div>
          </motion.div>
          )}

          {/* RIGHT — Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
              {success && (
                <div className="mb-6 bg-navy text-yellow rounded-xl px-5 py-4 flex items-center gap-3">
                  <CircleCheck className="w-5 h-5 flex-shrink-0" />
                  <span className="font-bold text-sm">Votre demande a été envoyée ! Réponse sous 24h ouvrables.</span>
                </div>
              )}

              <form method="POST" onSubmit={envoyer} className="space-y-5" noValidate
                toolname="demander_devis_demenagement"
                tooldescription="Prépare une demande de devis gratuit pour un déménagement ou un garde-meubles chez Déménagements Gramme. Le formulaire est rempli mais reste soumis par la personne : renseigner les champs ne crée aucune demande."
              >
                <div className="flex flex-wrap gap-3 mb-2">
                  {SERVICES_AFFICHES.map((s) => (
                    <button
                      key={s.valeur}
                      type="button"
                      onClick={() => set('service', s.valeur)}
                      className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase transition-all duration-200 ${
                        form.service === s.valeur
                          ? 'bg-navy text-yellow'
                          : 'border-2 border-navy/20 text-navy hover:border-navy/50'
                      }`}
                    >
                      {s.libelle}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cf-firstName" className="sr-only">Prénom</label>
                    <input
                      id="cf-firstName" toolparamdescription="Prénom de la personne qui déménage"
                      type="text"
                      name="firstName"
                      required
                      placeholder="Prénom"
                      value={form.firstName}
                      onChange={(e) => set('firstName', e.target.value)}
                      className={inputClass('firstName')}
                    />
                    {submitted && errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="cf-lastName" className="sr-only">Nom</label>
                    <input
                      id="cf-lastName" toolparamdescription="Nom de famille"
                      type="text"
                      name="lastName"
                      required
                      placeholder="Nom"
                      value={form.lastName}
                      onChange={(e) => set('lastName', e.target.value)}
                      className={inputClass('lastName')}
                    />
                    {submitted && errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cf-email" className="sr-only">Email</label>
                    <input
                      id="cf-email" toolparamdescription="Adresse email pour recevoir le devis"
                      type="email"
                      name="email"
                      required
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      className={inputClass('email')}
                    />
                    {submitted && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="cf-phone" className="sr-only">Téléphone</label>
                    <input
                      id="cf-phone" toolparamdescription="Numéro de téléphone"
                      type="tel"
                      name="phone"
                      required
                      placeholder="Téléphone"
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      className={inputClass('phone')}
                    />
                    {submitted && errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cf-addressFrom" className="sr-only">Adresse de départ</label>
                    <input
                      id="cf-addressFrom" toolparamdescription="Adresse complète du logement actuel, point de départ"
                      type="text"
                      name="addressFrom"
                      required
                      placeholder="Adresse de départ"
                      value={form.cityFrom}
                      onChange={(e) => set('cityFrom', e.target.value)}
                      className={inputClass('cityFrom')}
                    />
                    {submitted && errors.cityFrom && <p className="text-red-500 text-xs mt-1">{errors.cityFrom}</p>}
                  </div>
                  <div>
                    <label htmlFor="cf-addressTo" className="sr-only">Adresse d'arrivée</label>
                    <input
                      id="cf-addressTo" toolparamdescription="Adresse complète du logement d'arrivée"
                      type="text"
                      name="addressTo"
                      required
                      placeholder="Adresse d'arrivée"
                      value={form.cityTo}
                      onChange={(e) => set('cityTo', e.target.value)}
                      className={inputClass('cityTo')}
                    />
                    {submitted && errors.cityTo && <p className="text-red-500 text-xs mt-1">{errors.cityTo}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cf-date" className="sr-only">Date souhaitée</label>
                    <input
                      id="cf-date" toolparamdescription="Date souhaitée du déménagement, au format AAAA-MM-JJ"
                      type="date"
                      name="date"
                      required
                      value={form.date}
                      onChange={(e) => set('date', e.target.value)}
                      className={inputClass('date')}
                    />
                    {submitted && errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label htmlFor="cf-volume" className="sr-only">Volume estimé</label>
                    <select
                      id="cf-volume" toolparamdescription="Volume estimé à déménager : moins de 20 m³, 20 à 50 m³, 50 à 100 m³, ou inconnu"
                      name="volume"
                      value={form.volume}
                      onChange={(e) => set('volume', e.target.value)}
                      className={inputClass('volume')}
                    >
                      <option value="">Volume estimé</option>
                      {VOLUMES_AFFICHES.map((v) => (
                        <option key={v.valeur} value={v.valeur}>{LIBELLES_VOLUME[v.valeur]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Link
                  to="/estimation-volume"
                  onClick={() => mesurerEstimationPhotos('formulaire')}
                  className="inline-flex items-center gap-2 border-2 border-navy text-navy font-bold text-sm uppercase rounded-lg px-5 py-2.5 hover:bg-navy hover:text-yellow transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  Estimer mon volume en photos →
                </Link>

                <div>
                  <label htmlFor="cf-message" className="sr-only">Message</label>
                  <textarea
                    id="cf-message" toolparamdescription="Précisions libres : étage, ascenseur, objets fragiles, contraintes d'accès"
                    name="message"
                    placeholder="Message / précisions (facultatif)"
                    rows={3}
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    className={inputClass('message')}
                  />
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={form.privacy}
                      onChange={(e) => set('privacy', e.target.checked)}
                      className="mt-1 w-4 h-4 accent-navy rounded"
                    />
                    <span className="text-sm text-muted">
                      J'accepte la{' '}
                      <Link to="/politique-confidentialite" className="text-navy underline hover:text-navy/70 transition-colors">
                        politique de confidentialité
                      </Link>
                    </span>
                  </label>
                  {submitted && errors.privacy && <p className="text-red-500 text-xs mt-1">{errors.privacy}</p>}
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
                  className="w-full bg-yellow text-navy font-black uppercase py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-navy hover:text-yellow transition-colors duration-200 disabled:opacity-70 text-sm tracking-wide shadow-lg"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Envoyer ma demande de devis
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                <p className="flex items-center justify-center gap-2 text-muted text-xs text-center">
                  <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                  Vos données sont sécurisées et ne seront jamais partagées
                </p>
              </form>
            </div>

            {locale && (
              <p className="text-center text-muted text-sm mt-5">
                Besoin d'un devis détaillé ?{' '}
                <Link to="/contact-devis" className="text-navy font-bold underline hover:text-navy/70">
                  Utilisez le formulaire complet
                </Link>
                .
              </p>
            )}
          </motion.div>

        </div>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-6 right-6 bg-navy text-yellow rounded-xl px-6 py-4 shadow-xl flex items-center gap-3 z-50"
        >
          <CircleCheck className="w-5 h-5" />
          <span className="font-bold text-sm">Votre demande a été envoyée ! Réponse sous 24h ouvrables.</span>
        </motion.div>
      )}
    </section>
  );
}
