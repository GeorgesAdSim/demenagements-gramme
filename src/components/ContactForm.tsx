import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ArrowRight, Loader as Loader2, CircleCheck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SITE_IMAGES } from '../data/images';
import type { HomepageContent } from '../lib/types';

const FACEBOOK_URL = 'https://www.facebook.com/GrammeDemenagements';

const serviceOptions = ['Déménagement', 'Garde-Meubles'];
const volumes = ['< 20m³', '20–50m³', '50–100m³', 'Je ne sais pas'];

const REASSURANCES = [
  'Réponse garantie sous 24h ouvrables',
  'Devis 100 % gratuit et sans engagement',
  'Assurance tous risques incluse',
  '+75 ans d\'expérience à votre service',
];

interface FormData {
  service: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cityFrom: string;
  cityTo: string;
  date: string;
  volume: string;
  message: string;
  privacy: boolean;
}

const initialForm: FormData = {
  service: serviceOptions[0],
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  cityFrom: '',
  cityTo: '',
  date: '',
  volume: '',
  message: '',
  privacy: false,
};

interface Props {
  data?: HomepageContent['contact'] | null;
}

export default function ContactForm({ data }: Props) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = 'Prénom requis';
    if (!form.lastName.trim()) e.lastName = 'Nom requis';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    if (!form.phone.trim()) e.phone = 'Téléphone requis';
    if (!form.cityFrom.trim()) e.cityFrom = 'Adresse de départ requise';
    if (!form.cityTo.trim()) e.cityTo = "Adresse d'arrivée requise";
    if (!form.date) e.date = 'Date requise';
    if (!form.privacy) e.privacy = 'Vous devez accepter la politique';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const SERVICE_DB_MAP: Record<string, string> = {
    'Déménagement': 'demenagement',
    'Garde-Meubles': 'garde-meuble',
  };

  const VOLUME_DB_MAP: Record<string, string> = {
    '< 20m³': '<20',
    '20–50m³': '20-50',
    '50–100m³': '50-100',
    'Je ne sais pas': 'unknown',
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitted(true);
    if (!validate()) return;
    setLoading(true);

    const { error } = await supabase.from('devis_requests').insert({
      service_type: SERVICE_DB_MAP[form.service] || 'demenagement',
      firstname: form.firstName,
      lastname: form.lastName,
      email: form.email,
      phone: form.phone,
      departure_city: form.cityFrom,
      arrival_city: form.cityTo,
      move_date: form.date || null,
      volume: VOLUME_DB_MAP[form.volume] || 'unknown',
      message: form.message,
    });

    setLoading(false);
    if (error) {
      setErrors({ message: 'Une erreur est survenue. Merci de réessayer ou de nous appeler au 04 264 50 16.' });
      return;
    }

    // Envoi de la notification email (best-effort — ne bloque pas le succès)
    fetch('/api/send-devis-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: form.service,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        cityFrom: form.cityFrom,
        cityTo: form.cityTo,
        date: form.date,
        volume: form.volume,
        message: form.message,
      }),
    }).catch(() => { /* silencieux — le lead est déjà en base */ });
    setSuccess(true);
    setSubmitted(false);
    setErrors({});
    setForm(initialForm);
    setTimeout(() => setSuccess(false), 5000);
  };

  const set = (key: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const inputClass = (key: keyof FormData) =>
    `w-full border-2 rounded-xl px-4 py-3 text-base outline-none transition-all focus:ring-2 bg-white ${
      errors[key]
        ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
        : 'border-gray-200 focus:ring-yellow/30 focus:border-yellow'
    }`;

  return (
    <section id="contact" className="bg-offwhite py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10 lg:gap-16 items-start">

          {/* LEFT — Vendre le devis */}
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
              {REASSURANCES.map((item) => (
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
                { icon: MapPin, text: 'Rue des Naiveux 64, 4040 Herstal' },
                { icon: Phone, text: '04 264 50 16', href: 'tel:+3242645016' },
                { icon: Mail, text: 'contact@demenagements-gramme.be', href: 'mailto:contact@demenagements-gramme.be' },
                { icon: Clock, text: 'Lun–Ven : 8h–18h | Sam : 8h–12h' },
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
                alt={SITE_IMAGES.team.alt}
                className="w-full h-full object-cover"
                loading="lazy"
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

              <form method="POST" onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="flex flex-wrap gap-3 mb-2">
                  {serviceOptions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set('service', s)}
                      className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase transition-all duration-200 ${
                        form.service === s
                          ? 'bg-navy text-yellow'
                          : 'border-2 border-navy/20 text-navy hover:border-navy/50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cf-firstName" className="sr-only">Prénom</label>
                    <input
                      id="cf-firstName"
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
                      id="cf-lastName"
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
                      id="cf-email"
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
                      id="cf-phone"
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
                      id="cf-addressFrom"
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
                      id="cf-addressTo"
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
                      id="cf-date"
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
                      id="cf-volume"
                      name="volume"
                      value={form.volume}
                      onChange={(e) => set('volume', e.target.value)}
                      className={inputClass('volume')}
                    >
                      <option value="">Volume estimé</option>
                      {volumes.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="cf-message" className="sr-only">Message</label>
                  <textarea
                    id="cf-message"
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
                      <Link to="/confidentialite" className="text-navy underline hover:text-navy/70 transition-colors">
                        politique de confidentialité
                      </Link>
                    </span>
                  </label>
                  {submitted && errors.privacy && <p className="text-red-500 text-xs mt-1">{errors.privacy}</p>}
                </div>

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
