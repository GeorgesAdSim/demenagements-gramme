import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleCheck as CheckCircle2, Loader as Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Settings {
  id?: string;
  company_name: string;
  vat_number: string;
  phone_1: string;
  phone_2: string;
  email: string;
  facebook_url: string;
  address: string;
  google_tag_id: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    company_name: '',
    vat_number: '',
    phone_1: '',
    phone_2: '',
    email: '',
    facebook_url: '',
    address: '',
    google_tag_id: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chargementKo, setChargementKo] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setError(null);
    setChargementKo(false);
    const { data, error: lectureError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (lectureError) {
      // Sans ce test, une lecture refusée laissait le formulaire à ses valeurs
      // initiales — toutes vides. Enregistrer par-dessus écrasait alors les
      // coordonnées de l'entreprise par du vide, sans que rien n'ait signalé
      // que le chargement avait échoué.
      setError(`Impossible de charger les paramètres : ${lectureError.message}`);
      setChargementKo(true);
      setLoading(false);
      return;
    }
    if (data) {
      setSettings(data);
    }
    setLoading(false);
  }

  const set = (key: keyof Settings, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const { id, ...payload } = settings;
    if (id) {
      const { error: majError } = await supabase
        .from('site_settings')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (majError) {
        setError(`Enregistrement refusé : ${majError.message}`);
        setSaving(false);
        return;
      }
    } else {
      const { data, error: creaError } = await supabase.from('site_settings').insert(payload).select('id').maybeSingle();
      if (creaError) {
        setError(`Enregistrement refusé : ${creaError.message}`);
        setSaving(false);
        return;
      }
      if (data) setSettings((prev) => ({ ...prev, id: data.id }));
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass = 'w-full border border-[#E5E3DF] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#132073]/30 focus:border-[#132073] transition-all';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-8 h-8 animate-spin text-[#132073]" />
      </div>
    );
  }

  return (
    <div className="font-sans">
      <div className="bg-white border-b border-[#E5E3DF] px-4 lg:px-8 py-5">
        <h1 className="font-black uppercase text-[#132073] text-xl">PARAMÈTRES DU SITE</h1>
      </div>

      {error && (
        <div className="mx-4 lg:mx-8 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-red-700 text-sm font-bold">Erreur</p>
          <p className="text-red-600 text-xs mt-1 break-words">{error}</p>
          {chargementKo && (
            <p className="text-red-600 text-xs mt-2">
              L'enregistrement est bloqué : le formulaire est vide parce que rien n'a pu être lu,
              et l'enregistrer écraserait les coordonnées de l'entreprise. Rechargez la page.
            </p>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl mx-4 lg:mx-8 mt-6 p-6 lg:p-8 border border-[#E5E3DF]">
        <h3 className="font-bold text-[#132073] mb-6">Informations société</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[13px] font-bold text-[#132073] mb-1">Raison sociale</label>
            <input type="text" value={settings.company_name} onChange={(e) => set('company_name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#132073] mb-1">N TVA</label>
            <input type="text" value={settings.vat_number} onChange={(e) => set('vat_number', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#132073] mb-1">Téléphone 1</label>
            <input type="text" value={settings.phone_1} onChange={(e) => set('phone_1', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#132073] mb-1">Téléphone 2</label>
            <input type="text" value={settings.phone_2} onChange={(e) => set('phone_2', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#132073] mb-1">Email de contact</label>
            <input type="email" value={settings.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#132073] mb-1">URL Facebook</label>
            <input type="url" value={settings.facebook_url || ''} onChange={(e) => set('facebook_url', e.target.value)} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[13px] font-bold text-[#132073] mb-1">Adresse</label>
            <textarea rows={2} value={settings.address} onChange={(e) => set('address', e.target.value)} className={`${inputClass} resize-none`} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[13px] font-bold text-[#132073] mb-1">Google Tag ID</label>
            <input type="text" value={settings.google_tag_id || ''} onChange={(e) => set('google_tag_id', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      <div className="mx-4 lg:mx-8 mt-6 mb-8">
        <button
          onClick={handleSave}
          disabled={saving || chargementKo}
          className="bg-[#F0B800] text-[#132073] font-bold uppercase rounded-lg px-8 py-3 hover:bg-[#EAB000] transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          ENREGISTRER LES MODIFICATIONS
        </button>
      </div>

      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-6 right-6 bg-[#132073] text-[#F0B800] rounded-xl px-6 py-4 shadow-xl flex items-center gap-3 z-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm">Paramètres enregistrés !</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
