import { useEffect, useState } from 'react';
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
import { supabase } from '../lib/supabase';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

const serviceOptions = [
  { label: 'Déménagement', value: 'demenagement', icon: Truck },
  { label: 'Garde-Meubles', value: 'garde-meuble', icon: Warehouse },
  { label: 'International', value: 'international', icon: Globe },
  { label: 'Monte-Meubles', value: 'monte-meubles', icon: ArrowUpFromLine },
];

const volumes = [
  { label: '< 20m\u00B3', value: '<20' },
  { label: '20 - 50m\u00B3', value: '20-50' },
  { label: '50 - 100m\u00B3', value: '50-100' },
  { label: '> 100m\u00B3', value: '>100' },
  { label: 'Je ne sais pas', value: 'unknown' },
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
  service: 'demenagement',
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

export default function ContactDevisPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = 'Prénom requis';
    if (!form.lastName.trim()) e.lastName = 'Nom requis';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    if (!form.phone.trim()) e.phone = 'Téléphone requis';
    if (!form.cityFrom.trim()) e.cityFrom = 'Ville de départ requise';
    if (!form.cityTo.trim()) e.cityTo = "Ville d'arrivée requise";
    if (!form.date) e.date = 'Date requise';
    if (!form.privacy) e.privacy = 'Vous devez accepter la politique';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitted(true);
    if (!validate()) return;
    setLoading(true);

    await supabase.from('devis_requests').insert({
      service_type: form.service,
      firstname: form.firstName,
      lastname: form.lastName,
      email: form.email,
      phone: form.phone,
      departure_city: form.cityFrom,
      arrival_city: form.cityTo,
      move_date: form.date || null,
      volume: form.volume || 'unknown',
      message: form.message,
    });

    setLoading(false);
    setSuccess(true);
    setSubmitted(false);
    setErrors({});
    setForm(initialForm);
    setTimeout(() => setSuccess(false), 6000);
  };

  const set = (key: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const inputBase =
    'w-full border rounded-xl px-4 py-3.5 text-base outline-none transition-all duration-200 bg-white focus:ring-2 placeholder:text-muted/60';

  const inputClass = (key: keyof FormData) =>
    `${inputBase} ${errors[key] ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-navy/20 focus:border-navy'}`;

  return (
    <div className="font-sans">
      <SeoHead
        title="Contact & Devis Gratuit — Déménagements Gramme Liège"
        description="Contactez Déménagements Gramme pour un devis gratuit et sans engagement. Formulaire en ligne, téléphone et adresse à Herstal (Liège)."
        canonical="/contact-devis"
      />
      <SchemaOrg />
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
                        <p className="text-white/90">Rue des Naiveux 64<br />4040 Herstal (Liège)</p>
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
                      "Plus de 75 ans d'expérience",
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

                <form method="POST" onSubmit={handleSubmit} noValidate>
                  <div className="mb-8">
                    <label className="block text-navy font-bold text-sm uppercase tracking-wider mb-3">
                      Type de service
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {serviceOptions.map(({ label, value, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => set('service', value)}
                          className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-200 ${
                            form.service === value
                              ? 'border-navy bg-navy text-yellow'
                              : 'border-gray-200 text-navy hover:border-navy/30 hover:bg-navy/[0.02]'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-xs font-bold uppercase">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy mb-1.5">Prénom *</label>
                        <input type="text" name="firstName" required placeholder="Votre prénom" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className={inputClass('firstName')} />
                        {submitted && errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy mb-1.5">Nom *</label>
                        <input type="text" name="lastName" required placeholder="Votre nom" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} className={inputClass('lastName')} />
                        {submitted && errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy mb-1.5">Email *</label>
                        <input type="email" name="email" required placeholder="votre@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass('email')} />
                        {submitted && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy mb-1.5">Téléphone *</label>
                        <input type="tel" name="phone" required placeholder="+32 4XX XX XX XX" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass('phone')} />
                        {submitted && errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy mb-1.5">Ville de départ *</label>
                        <input type="text" name="addressFrom" required placeholder="Ex : Liège" value={form.cityFrom} onChange={(e) => set('cityFrom', e.target.value)} className={inputClass('cityFrom')} />
                        {submitted && errors.cityFrom && <p className="text-red-500 text-xs mt-1">{errors.cityFrom}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy mb-1.5">Ville d'arrivée *</label>
                        <input type="text" name="addressTo" required placeholder="Ex : Bruxelles" value={form.cityTo} onChange={(e) => set('cityTo', e.target.value)} className={inputClass('cityTo')} />
                        {submitted && errors.cityTo && <p className="text-red-500 text-xs mt-1">{errors.cityTo}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy mb-1.5">Date souhaitée *</label>
                        <input type="date" name="date" required value={form.date} onChange={(e) => set('date', e.target.value)} className={inputClass('date')} />
                        {submitted && errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy mb-1.5">Volume estimé</label>
                        <select name="volume" value={form.volume} onChange={(e) => set('volume', e.target.value)} className={inputClass('volume')}>
                          <option value="">Sélectionnez un volume</option>
                          {volumes.map((v) => (
                            <option key={v.value} value={v.value}>{v.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy mb-1.5">Message / Précisions</label>
                      <textarea name="message" placeholder="Décrivez votre projet : nombre de pièces, étage, accès difficile, objets spéciaux..." rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} className={inputClass('message')} />
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
              className="text-center mb-10"
            >
              <span className="inline-block bg-navy text-yellow text-[11px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-1.5 mb-4">
                LOCALISATION
              </span>
              <h2 className="text-2xl md:text-[2rem] font-black uppercase text-navy">
                Rendez-nous visite
              </h2>
              <p className="text-muted mt-3 max-w-xl mx-auto">
                Notre dépôt se situe à Herstal, aux portes de Liège. N'hésitez pas à venir nous rencontrer.
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2530.8!2d5.6338!3d50.6668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c0f5e2c5b5b5b5%3A0x0!2sRue+des+Naiveux+64%2C+4040+Herstal!5e0!3m2!1sfr!2sbe!4v1710000000000!5m2!1sfr!2sbe"
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
