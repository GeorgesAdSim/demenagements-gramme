import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera, Check, ChevronDown, Clock, EyeOff, FileText, Loader as Loader2,
  Minus, Phone, Plus, Shield, Trash2, X, ArrowRight, Pencil,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import SchemaOrg from '../components/SchemaOrg';
import { supabase } from '../lib/supabase';
import { compressImage } from '../lib/imageCompression';
import {
  ITEM_LABELS, VOLUME_TABLE, SPECIAL_ITEMS, computeRoomVolumes, computeTotals,
  type DetectedItem,
} from '../lib/volumeBareme';

// ────────────────────────────────────────────────────────────────────────────
const STEPS = ['Logement', 'Confidentialité', 'Photos', 'Analyse', 'Résultat'];

const HOUSING_TYPES = ['Appartement', 'Maison', 'Studio', 'Bureau'];

const ROOM_TYPES = [
  'Salon', 'Salle à manger', 'Cuisine', 'Chambre', 'Bureau', 'Salle de bain',
  'Cave', 'Grenier', 'Garage', 'Terrasse-Jardin', 'Autre',
];

const LOADING_MESSAGES = [
  'Analyse de vos photos…',
  'Identification du mobilier…',
  'Calcul du volume…',
  'Encore quelques secondes…',
];

const DRAFT_KEY = 'gramme_estimation_draft';
const DEVIS_DRAFT_KEY = 'gramme_devis_draft';

interface Room {
  id: string;
  type: string;
  label: string;
  photos: string[]; // data URLs compressées
}

interface RoomResult {
  id: string;
  label: string;
  readable: boolean;
  items: DetectedItem[];
  volume_meubles: number;
  volume_cache: number;
  confidence: string;
  warnings: string[];
}

interface EstimationResult {
  estimation_id: string;
  volume_m3: number;
  volume_min: number;
  volume_max: number;
  confidence: string;
  special_handling: string[];
  warnings: string[];
  rooms: RoomResult[];
}

// ────────────────────────────────────────────────────────────────────────────
function Stepper({ current }: { current: number }) {
  return (
    <>
      {/* Desktop : pastilles reliées */}
      <div className="hidden md:flex items-center justify-center gap-0 mb-10" aria-label={`Étape ${current + 1} sur 5`}>
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  i < current
                    ? 'bg-yellow text-navy'
                    : i === current
                      ? 'bg-navy text-yellow'
                      : 'border-2 border-[#E5E3DF] text-gray-400 bg-white'
                }`}
              >
                {i < current ? <Check className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`text-xs mt-1.5 font-medium ${i === current ? 'text-navy' : 'text-gray-400'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-14 h-0.5 mx-2 mb-5 ${i < current ? 'bg-yellow' : 'bg-[#E5E3DF]'}`} />
            )}
          </div>
        ))}
      </div>
      {/* Mobile : compteur + barre */}
      <div className="md:hidden mb-8">
        <p className="text-navy font-bold text-sm mb-2">Étape {current + 1} sur 5 — {STEPS[current]}</p>
        <div className="h-2 bg-[#E5E3DF] rounded-full overflow-hidden">
          <div className="h-full bg-yellow rounded-full transition-all" style={{ width: `${((current + 1) / 5) * 100}%` }} />
        </div>
      </div>
    </>
  );
}

function NumberStepper({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <div className="inline-flex items-center gap-3 border-2 border-gray-200 rounded-xl px-2 py-1 bg-white">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Diminuer"
        className="w-9 h-9 rounded-lg flex items-center justify-center text-navy hover:bg-offwhite focus:outline-none focus:ring-2 focus:ring-navy">
        <Minus className="w-4 h-4" />
      </button>
      <span className="font-bold text-navy text-lg w-8 text-center tabular-nums">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Augmenter"
        className="w-9 h-9 rounded-lg flex items-center justify-center text-navy hover:bg-offwhite focus:outline-none focus:ring-2 focus:ring-navy">
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
export default function EstimationVolumePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Étape 1
  const [housingType, setHousingType] = useState('');
  const [roomsCount, setRoomsCount] = useState(3);
  const [surface, setSurface] = useState('');
  const [floor, setFloor] = useState(0);
  const [hasElevator, setHasElevator] = useState(false);

  // Étape 2
  const [rgpdAccepted, setRgpdAccepted] = useState(false);

  // Étape 3
  const [rooms, setRooms] = useState<Room[]>([]);
  const [openRoom, setOpenRoom] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState('');

  // Étape 4
  const [progressIdx, setProgressIdx] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [analyseError, setAnalyseError] = useState('');

  // Étape 5
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [openResultRoom, setOpenResultRoom] = useState<string | null>(null);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustedRooms, setAdjustedRooms] = useState<RoomResult[] | null>(null);
  const [callbackMode, setCallbackMode] = useState(false);
  const [callbackForm, setCallbackForm] = useState({ name: '', phone: '' });
  const [callbackSent, setCallbackSent] = useState(false);

  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  // Reprise de progression (sans les photos, trop lourdes pour localStorage)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.housingType) setHousingType(d.housingType);
        if (d.roomsCount) setRoomsCount(d.roomsCount);
        if (d.surface) setSurface(d.surface);
        if (typeof d.floor === 'number') setFloor(d.floor);
        if (typeof d.hasElevator === 'boolean') setHasElevator(d.hasElevator);
      }
    } catch { /* draft corrompu — repartir de zéro */ }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ housingType, roomsCount, surface, floor, hasElevator }));
    } catch { /* stockage plein — non bloquant */ }
  }, [housingType, roomsCount, surface, floor, hasElevator]);

  // Messages rotatifs pendant l'analyse
  useEffect(() => {
    if (step !== 3) return;
    const t = setInterval(() => setLoadingMsg((m) => (m + 1) % LOADING_MESSAGES.length), 3000);
    return () => clearInterval(t);
  }, [step]);

  const totalPhotos = rooms.reduce((n, r) => n + r.photos.length, 0);

  // ── Gestion des pièces ────────────────────────────────────────────────────
  const addRoom = (type: string) => {
    if (rooms.length >= 10) return;
    const sameType = rooms.filter((r) => r.type === type).length;
    const label = sameType > 0 ? `${type} ${sameType + 1}` : type;
    const room: Room = { id: crypto.randomUUID(), type, label, photos: [] };
    setRooms((prev) => {
      // renomme la 1re occurrence en "X 1" dès qu'il y en a deux
      const next = prev.map((r) => (r.type === type && sameType === 1 && r.label === type ? { ...r, label: `${type} 1` } : r));
      return [...next, { ...room, label: sameType === 1 ? `${type} 2` : label }];
    });
    setOpenRoom(room.id);
  };

  const handleFiles = async (roomId: string, files: FileList | null) => {
    if (!files) return;
    setPhotoError('');
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;
    for (const file of Array.from(files)) {
      if (room.photos.length >= 4 || totalPhotos >= 30) break;
      try {
        const compressed = await compressImage(file);
        setRooms((prev) => prev.map((r) => (r.id === roomId && r.photos.length < 4 ? { ...r, photos: [...r.photos, compressed] } : r)));
      } catch (e) {
        setPhotoError(
          (e as Error).message === 'FILE_TOO_LARGE'
            ? 'Fichier trop lourd (max 15 Mo). Choisissez une autre photo.'
            : "Cette image n'a pas pu être lue. Essayez un autre format (JPEG/PNG).",
        );
      }
    }
  };

  // ── Analyse ───────────────────────────────────────────────────────────────
  const analyse = async () => {
    setStep(3);
    setAnalyseError('');
    setProgressIdx(0);
    const progressTimer = setInterval(() => setProgressIdx((i) => Math.min(i + 1, rooms.length - 1)), Math.max(3000, 25000 / rooms.length));
    const timeout = setTimeout(() => {
      clearInterval(progressTimer);
      setAnalyseError("L'analyse prend trop de temps. Vérifiez votre connexion et réessayez.");
    }, 90_000);
    try {
      const { data, error } = await supabase.functions.invoke('estimate-volume', {
        body: {
          rooms: rooms.map((r) => ({ id: r.id, label: r.label, type: r.type, images: r.photos })),
          housing: {
            type: housingType,
            roomsCount,
            surfaceM2: surface ? parseInt(surface, 10) : null,
            floor,
            hasElevator,
          },
        },
      });
      clearTimeout(timeout);
      clearInterval(progressTimer);
      if (error || !data || data.error) {
        if (data?.error === 'rate_limited') {
          setAnalyseError(data.message || 'Limite atteinte : 3 estimations par heure.');
        } else if (!navigator.onLine) {
          setAnalyseError('Pas de connexion internet. Reconnectez-vous et réessayez.');
        } else {
          setAnalyseError("L'analyse a échoué. Réessayez dans un instant ou appelez-nous au 04 264 50 16.");
        }
        return;
      }
      setResult(data as EstimationResult);
      setAdjustedRooms(null);
      setStep(4);
    } catch {
      clearTimeout(timeout);
      clearInterval(progressTimer);
      setAnalyseError("L'analyse a échoué. Réessayez dans un instant ou appelez-nous au 04 264 50 16.");
    }
  };

  // ── Résultat : valeurs affichées (ajustées ou brutes) ─────────────────────
  const displayRooms = adjustedRooms ?? result?.rooms ?? [];
  const totals = result
    ? adjustedRooms
      ? computeTotals(adjustedRooms, result.confidence)
      : { volumeFinal: result.volume_m3, volumeMin: result.volume_min, volumeMax: result.volume_max }
    : null;

  const hasSpecial = (result?.special_handling.length ?? 0) > 0
    || displayRooms.some((r) => r.items.some((it) => SPECIAL_ITEMS.has(it.id)));
  const needsVisit = result ? (totals!.volumeFinal > 45 || result.confidence === 'low' || hasSpecial) : false;

  const saveAdjustment = async (roomsAdj: RoomResult[]) => {
    if (!result) return;
    const t = computeTotals(roomsAdj, result.confidence);
    const rounded = {
      volume_m3: Math.round(t.volumeFinal * 10) / 10,
      volume_min: Math.round(t.volumeMin * 10) / 10,
      volume_max: Math.round(t.volumeMax * 10) / 10,
    };
    setAdjustedRooms(roomsAdj);
    supabase.functions.invoke('estimate-volume', {
      body: {
        action: 'adjust',
        estimation_id: result.estimation_id,
        ...rounded,
        detected_items: { rooms: roomsAdj, manually_adjusted: true },
      },
    }).catch(() => { /* best effort */ });
  };

  const goToDevis = () => {
    if (!result || !totals) return;
    try {
      sessionStorage.setItem(DEVIS_DRAFT_KEY, JSON.stringify({
        estimation_id: result.estimation_id,
        volume_m3: Math.round(totals.volumeFinal * 10) / 10,
      }));
    } catch { /* non bloquant */ }
    navigate('/contact-devis');
  };

  const requestCallback = async () => {
    if (!result || !callbackForm.phone.trim()) return;
    await supabase.functions.invoke('estimate-volume', {
      body: { action: 'lead', estimation_id: result.estimation_id, lead_phone: callbackForm.phone, lead_email: callbackForm.name },
    }).catch(() => {});
    await supabase.from('devis_requests').insert({
      service_type: 'demenagement',
      firstname: callbackForm.name || 'Rappel estimation',
      lastname: `(estimation ${result.estimation_id.slice(0, 8)})`,
      email: 'rappel@estimation.gramme',
      phone: callbackForm.phone,
      departure_city: '-', arrival_city: '-', volume: 'unknown',
      message: `Demande de rappel — estimateur photos. Volume estimé : ${totals?.volumeFinal.toFixed(0)} m³. ID : ${result.estimation_id}`,
    });
    setCallbackSent(true);
  };

  const confidenceBadge = result && (
    result.confidence === 'high'
      ? <span className="inline-block bg-green-500/20 text-green-300 text-xs font-bold rounded-full px-3 py-1">Estimation fiable</span>
      : result.confidence === 'medium'
        ? <span className="inline-block bg-yellow/20 text-yellow text-xs font-bold rounded-full px-3 py-1">Estimation à confirmer</span>
        : <span className="inline-block bg-orange-500/20 text-orange-300 text-xs font-bold rounded-full px-3 py-1">Une visite est recommandée</span>
  );

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-offwhite min-h-screen flex flex-col">
      <SeoHead
        title="Estimez le volume de votre déménagement en photos — Gramme"
        description="Photographiez vos pièces et obtenez en 1 minute une estimation du volume à déménager en m³. Gratuit, sans visite."
        canonical="/estimation-volume"
      />
      <SchemaOrg breadcrumbs={[{ name: "Accueil", url: "/" }, { name: "Estimateur de volume", url: "/estimation-volume" }]} />
      <Navbar />

      <main id="main-content" className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 py-10 md:py-14">
        <h1 className="text-2xl md:text-4xl font-black uppercase text-navy text-center mb-2">
          Estimateur de volume <span className="bg-yellow text-navy px-2 py-0.5 inline-block">en photos</span>
        </h1>
        <p className="text-muted text-center mb-10">Photographiez vos pièces, obtenez votre volume en m³ en 1 minute.</p>

        <Stepper current={step} />

        {/* ══ ÉTAPE 1 — LOGEMENT ══ */}
        {step === 0 && (
          <div className="space-y-8">
            <div>
              <label className="block font-bold text-navy mb-3">Type de logement</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {HOUSING_TYPES.map((t) => (
                  <button key={t} type="button" onClick={() => setHousingType(t)}
                    className={`rounded-xl border-2 py-4 font-bold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-navy ${
                      housingType === t ? 'border-navy bg-navy text-yellow' : 'border-gray-200 bg-white text-navy hover:border-navy/40'
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-bold text-navy mb-3">Nombre de pièces à déménager</label>
              <NumberStepper value={roomsCount} onChange={setRoomsCount} min={1} max={15} />
            </div>
            <div>
              <label htmlFor="ev-surface" className="block font-bold text-navy mb-2">Surface approximative (m²)</label>
              <input id="ev-surface" type="number" inputMode="numeric" min={5} max={1000} value={surface}
                onChange={(e) => setSurface(e.target.value)} placeholder="Ex. : 85"
                className="w-full md:w-64 border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:border-yellow focus:ring-2 focus:ring-yellow/30 outline-none" />
              <p className="text-muted text-xs mt-1.5">Facultatif — utilisé uniquement pour recouper l'estimation.</p>
            </div>
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <label htmlFor="ev-floor" className="block font-bold text-navy mb-2">Étage (départ)</label>
                <select id="ev-floor" value={floor} onChange={(e) => setFloor(parseInt(e.target.value, 10))}
                  className="border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:border-yellow outline-none">
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={i}>{i === 0 ? 'Rez-de-chaussée' : `Étage ${i}`}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer pb-3">
                <input type="checkbox" checked={hasElevator} onChange={(e) => setHasElevator(e.target.checked)} className="w-5 h-5 accent-navy" />
                <span className="text-navy font-medium">Ascenseur disponible</span>
              </label>
            </div>
            <button type="button" disabled={!housingType} onClick={() => setStep(1)}
              className="w-full md:w-auto bg-yellow text-navy font-bold uppercase py-4 px-10 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy hover:text-yellow transition-colors focus:outline-none focus:ring-2 focus:ring-navy">
              Continuer <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ══ ÉTAPE 2 — RGPD ══ */}
        {step === 1 && (
          <div className="bg-white border border-[#E5E3DF] rounded-xl p-8 md:p-10 space-y-6">
            <h2 className="text-xl font-bold text-navy">Vos photos, vos données</h2>
            <ul className="space-y-4 text-sm text-gray-700">
              <li className="flex gap-3"><Shield className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
                Vos photos servent uniquement à estimer votre volume. Elles ne sont jamais publiées ni transmises à des tiers.</li>
              <li className="flex gap-3"><Clock className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
                Elles sont supprimées automatiquement au bout de 90 jours, ou immédiatement sur simple demande.</li>
              <li className="flex gap-3"><EyeOff className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
                Évitez de photographier des documents, écrans ou objets de valeur identifiables.</li>
              <li className="flex gap-3"><FileText className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
                L'estimation obtenue est indicative et non contractuelle.</li>
            </ul>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={rgpdAccepted} onChange={(e) => setRgpdAccepted(e.target.checked)} className="mt-1 w-5 h-5 accent-navy" />
              <span className="text-sm text-navy font-medium">J'accepte que mes photos soient analysées pour estimer mon volume.</span>
            </label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(0)} className="border-2 border-navy text-navy font-bold uppercase py-3 px-6 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy">Retour</button>
              <button type="button" disabled={!rgpdAccepted} onClick={() => setStep(2)}
                className={`bg-yellow text-navy font-bold uppercase py-3 px-8 rounded-xl flex items-center gap-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-navy ${!rgpdAccepted ? 'opacity-40 cursor-not-allowed' : 'hover:bg-navy hover:text-yellow'}`}>
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ══ ÉTAPE 3 — PHOTOS ══ */}
        {step === 2 && (
          <div className="space-y-6 pb-28 md:pb-0">
            <div>
              <p className="font-bold text-navy mb-3">Ajoutez vos pièces</p>
              <div className="flex flex-wrap gap-2">
                {ROOM_TYPES.map((t) => (
                  <button key={t} type="button" onClick={() => addRoom(t)} disabled={rooms.length >= 10}
                    className="border-2 border-navy/20 text-navy text-sm font-bold rounded-full px-4 py-2 hover:border-navy hover:bg-navy hover:text-yellow transition-colors disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-navy">
                    + {t}
                  </button>
                ))}
              </div>
            </div>

            {rooms.map((room) => (
              <div key={room.id} className="bg-white border border-[#E5E3DF] rounded-xl overflow-hidden">
                <button type="button" onClick={() => setOpenRoom(openRoom === room.id ? null : room.id)}
                  className="w-full flex items-center justify-between px-5 py-4 focus:outline-none focus:ring-2 focus:ring-navy">
                  <span className="font-bold text-navy flex items-center gap-2">
                    {room.label}
                    <span className={`text-xs font-medium ${room.photos.length === 0 ? 'text-orange-500' : 'text-muted'}`}>{room.photos.length} / 4 photos</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" role="button" aria-label={`Supprimer ${room.label}`}
                      onClick={(e) => { e.stopPropagation(); setRooms((prev) => prev.filter((r) => r.id !== room.id)); }} />
                    <ChevronDown className={`w-5 h-5 text-navy transition-transform ${openRoom === room.id ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                {openRoom === room.id && (
                  <div className="px-5 pb-5 space-y-4">
                    <input
                      type="text" value={room.label} aria-label="Nom de la pièce"
                      onChange={(e) => setRooms((prev) => prev.map((r) => (r.id === room.id ? { ...r, label: e.target.value } : r)))}
                      className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-navy w-52 focus:border-yellow outline-none"
                    />
                    {room.photos.length < 4 && (
                      <button
                        type="button"
                        onClick={() => fileInputs.current[room.id]?.click()}
                        className="w-full border-2 border-dashed border-navy/30 rounded-xl py-10 flex flex-col items-center gap-2 text-navy hover:border-navy transition-colors focus:outline-none focus:ring-2 focus:ring-navy"
                      >
                        <Camera className="w-8 h-8" />
                        <span className="font-medium text-sm">Prendre une photo ou importer</span>
                      </button>
                    )}
                    <input
                      ref={(el) => { fileInputs.current[room.id] = el; }}
                      type="file" accept="image/*" capture="environment" multiple className="hidden"
                      aria-label={`Photos de ${room.label}`}
                      onChange={(e) => { handleFiles(room.id, e.target.files); e.target.value = ''; }}
                    />
                    {room.photos.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {room.photos.map((p, i) => (
                          <div key={i} className="relative">
                            <img src={p} alt={`${room.label} photo ${i + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                            <button type="button" aria-label="Supprimer la photo"
                              onClick={() => setRooms((prev) => prev.map((r) => (r.id === room.id ? { ...r, photos: r.photos.filter((_, j) => j !== i) } : r)))}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-navy text-white rounded-full flex items-center justify-center">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="bg-offwhite rounded-lg px-4 py-3 text-[13px] text-navy/70">
                      Placez-vous dans un angle de la pièce pour capturer un maximum de meubles d'un seul coup. 2 photos opposées suffisent généralement.
                    </div>
                  </div>
                )}
              </div>
            ))}

            {photoError && <p className="text-red-500 text-sm">{photoError}</p>}

            {/* Récapitulatif sticky */}
            <div className="fixed bottom-0 left-0 right-0 md:static bg-white md:bg-transparent border-t md:border-0 border-[#E5E3DF] px-4 py-3 md:px-0 md:py-0 z-40">
              <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                <span className="text-navy font-bold text-sm whitespace-nowrap">{rooms.length} pièce{rooms.length > 1 ? 's' : ''} · {totalPhotos} photo{totalPhotos > 1 ? 's' : ''}</span>
                <button type="button" onClick={analyse}
                  disabled={!rooms.some((r) => r.photos.length >= 1)}
                  className="flex-1 md:flex-none bg-yellow text-navy font-bold uppercase py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy hover:text-yellow transition-colors focus:outline-none focus:ring-2 focus:ring-navy">
                  Analyser mes photos <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ ÉTAPE 4 — ANALYSE ══ */}
        {step === 3 && (
          <div className="text-center space-y-8" aria-live="polite">
            {!analyseError ? (
              <>
                <p className="text-navy font-bold text-lg">{LOADING_MESSAGES[loadingMsg]}</p>
                <div className="h-2 bg-[#E5E3DF] rounded-full overflow-hidden max-w-md mx-auto">
                  <div className="h-full bg-yellow rounded-full transition-all duration-1000" style={{ width: `${((progressIdx + 1) / (rooms.length + 1)) * 100}%` }} />
                </div>
                <ul className="max-w-sm mx-auto text-left space-y-2">
                  {rooms.map((r, i) => (
                    <li key={r.id} className="flex items-center gap-3 text-sm">
                      {i < progressIdx ? <Check className="w-4 h-4 text-green-600" /> : i === progressIdx ? <Loader2 className="w-4 h-4 animate-spin text-navy" /> : <span className="w-4 h-4 rounded-full border-2 border-gray-300 inline-block" />}
                      <span className={i <= progressIdx ? 'text-navy font-medium' : 'text-gray-400'}>
                        {r.label} {i < progressIdx ? '— analysé' : i === progressIdx ? '— en cours' : '— en attente'}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="space-y-5">
                <p className="text-red-600 font-medium">{analyseError}</p>
                <button type="button" onClick={() => setStep(2)} className="bg-yellow text-navy font-bold uppercase py-3 px-8 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy">
                  Réessayer
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══ ÉTAPE 5 — RÉSULTAT ══ */}
        {step === 4 && result && totals && (
          <div className="space-y-6">
            <div className="bg-navy rounded-2xl py-12 px-6 text-center">
              <p className="text-yellow text-[11px] uppercase tracking-widest font-bold mb-3">Volume estimé</p>
              <p className="text-white font-black text-5xl md:text-7xl">{totals.volumeFinal.toFixed(0)}&nbsp;m³</p>
              <p className="text-white/70 mt-2">Fourchette : {totals.volumeMin.toFixed(0)} à {totals.volumeMax.toFixed(0)} m³</p>
              <div className="mt-4">{confidenceBadge}</div>
            </div>

            {/* Détail par pièce */}
            <div className="space-y-3">
              {displayRooms.map((room) => (
                <div key={room.id} className="bg-white rounded-xl border border-[#E5E3DF] overflow-hidden">
                  <button type="button" onClick={() => setOpenResultRoom(openResultRoom === room.id ? null : room.id)}
                    className="w-full flex items-center justify-between px-5 py-4 focus:outline-none focus:ring-2 focus:ring-navy">
                    <span className="font-bold text-navy">{room.label}</span>
                    <span className="flex items-center gap-3 text-sm text-muted">
                      {(room.volume_meubles + room.volume_cache).toFixed(1)} m³
                      <ChevronDown className={`w-5 h-5 transition-transform ${openResultRoom === room.id ? 'rotate-180' : ''}`} />
                    </span>
                  </button>
                  {openResultRoom === room.id && (
                    <div className="px-5 pb-5 overflow-x-auto">
                      {room.items.length > 0 ? (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-muted border-b border-gray-100">
                              <th className="py-2 font-medium">Objet</th>
                              <th className="py-2 font-medium text-right">Qté</th>
                              <th className="py-2 font-medium text-right">m³ unit.</th>
                              <th className="py-2 font-medium text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {room.items.map((it, i) => {
                              const unit = VOLUME_TABLE[it.id] ?? VOLUME_TABLE.objet_divers_volumineux;
                              return (
                                <tr key={i} className="border-b border-gray-50">
                                  <td className="py-2 text-navy">{ITEM_LABELS[it.id] ?? it.id}{it.note ? ` (${it.note})` : ''}</td>
                                  <td className="py-2 text-right tabular-nums">{it.qty}</td>
                                  <td className="py-2 text-right tabular-nums">{unit.toFixed(2)}</td>
                                  <td className="py-2 text-right tabular-nums font-medium">{(unit * it.qty).toFixed(2)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-muted text-sm">Aucun objet détecté dans cette pièce.</p>
                      )}
                      {room.volume_cache > 0 && (
                        <p className="italic text-gray-400 text-sm mt-3">Contenu estimé des rangements (cartons) : {room.volume_cache.toFixed(1)} m³</p>
                      )}
                      {room.warnings.map((w, i) => (
                        <p key={i} className="text-orange-600 text-xs mt-2">{w}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-offwhite border-l-4 border-yellow rounded-r-lg px-5 py-4 text-sm text-navy/80">
              Cette estimation est indicative et repose uniquement sur vos photos. Le volume définitif est confirmé par nos équipes avant l'intervention.
              Les objets situés dans les placards, caves ou greniers non photographiés ne sont pas comptabilisés.
            </div>

            <button type="button" onClick={() => setAdjustOpen(true)}
              className="inline-flex items-center gap-2 text-navy font-bold text-sm underline hover:text-navy/70 focus:outline-none focus:ring-2 focus:ring-navy rounded">
              <Pencil className="w-4 h-4" /> Ajuster la liste des objets
            </button>

            {/* CTA finaux */}
            {needsVisit ? (
              <div className="space-y-3">
                <p className="text-navy/80 text-sm">
                  Votre déménagement nécessite une évaluation sur place pour un devis précis. C'est gratuit et sans engagement.
                </p>
                <button type="button" onClick={goToDevis}
                  className="w-full bg-yellow text-navy font-black uppercase py-4 rounded-xl hover:bg-navy hover:text-yellow transition-colors focus:outline-none focus:ring-2 focus:ring-navy">
                  Planifier une visite gratuite →
                </button>
              </div>
            ) : (
              <button type="button" onClick={goToDevis}
                className="w-full bg-yellow text-navy font-black uppercase py-4 rounded-xl hover:bg-navy hover:text-yellow transition-colors focus:outline-none focus:ring-2 focus:ring-navy">
                Recevoir mon devis →
              </button>
            )}
            {!callbackSent ? (
              !callbackMode ? (
                <button type="button" onClick={() => setCallbackMode(true)}
                  className="w-full border-2 border-navy text-navy font-bold uppercase py-3.5 rounded-xl text-sm hover:bg-navy hover:text-yellow transition-colors focus:outline-none focus:ring-2 focus:ring-navy">
                  Être rappelé pour valider
                </button>
              ) : (
                <div className="bg-white border border-[#E5E3DF] rounded-xl p-5 space-y-3">
                  <label htmlFor="cb-name" className="sr-only">Nom</label>
                  <input id="cb-name" type="text" placeholder="Votre nom" value={callbackForm.name}
                    onChange={(e) => setCallbackForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-yellow outline-none" />
                  <label htmlFor="cb-phone" className="sr-only">Téléphone</label>
                  <input id="cb-phone" type="tel" placeholder="Votre téléphone" value={callbackForm.phone}
                    onChange={(e) => setCallbackForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-yellow outline-none" />
                  <button type="button" onClick={requestCallback} disabled={!callbackForm.phone.trim()}
                    className="w-full bg-navy text-yellow font-bold uppercase py-3 rounded-xl text-sm disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-navy">
                    <Phone className="w-4 h-4 inline mr-2" />Me faire rappeler
                  </button>
                </div>
              )
            ) : (
              <p className="text-green-700 font-medium text-center">Merci ! Nous vous rappelons rapidement pour valider votre estimation.</p>
            )}
          </div>
        )}

        {/* Modale d'ajustement */}
        {adjustOpen && result && (
          <AdjustModal
            rooms={displayRooms}
            confidence={result.confidence}
            onClose={() => setAdjustOpen(false)}
            onSave={(r) => { saveAdjustment(r); setAdjustOpen(false); }}
          />
        )}

        {step === 0 && (
          <p className="text-center text-muted text-sm mt-10">
            Vous préférez un devis classique ? <Link to="/contact-devis" className="text-navy underline font-medium">Remplissez le formulaire</Link> ou appelez le <a href="tel:+3242645016" className="text-navy underline font-medium">04 264 50 16</a>.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}

// ── Modale d'ajustement manuel ──────────────────────────────────────────────
function AdjustModal({ rooms, confidence, onClose, onSave }: {
  rooms: RoomResult[];
  confidence: string;
  onClose: () => void;
  onSave: (rooms: RoomResult[]) => void;
}) {
  const [draft, setDraft] = useState<RoomResult[]>(() => JSON.parse(JSON.stringify(rooms)));
  const [addTarget, setAddTarget] = useState(draft[0]?.id ?? '');
  const [addItem, setAddItem] = useState('');

  const totals = computeTotals(draft, confidence);

  const setQty = (roomId: string, idx: number, qty: number) => {
    setDraft((prev) => prev.map((r) => {
      if (r.id !== roomId) return r;
      const items = r.items.map((it, i) => (i === idx ? { ...it, qty: Math.max(0, qty) } : it)).filter((it) => it.qty > 0);
      const { volumeMeubles, volumeCache } = computeRoomVolumes(items);
      return { ...r, items, volume_meubles: volumeMeubles, volume_cache: volumeCache };
    }));
  };

  const addObject = () => {
    if (!addItem || !addTarget) return;
    setDraft((prev) => prev.map((r) => {
      if (r.id !== addTarget) return r;
      const existing = r.items.findIndex((it) => it.id === addItem);
      const items = existing >= 0
        ? r.items.map((it, i) => (i === existing ? { ...it, qty: it.qty + 1 } : it))
        : [...r.items, { id: addItem, qty: 1, fill: 'inconnu', note: null }];
      const { volumeMeubles, volumeCache } = computeRoomVolumes(items);
      return { ...r, items, volume_meubles: volumeMeubles, volume_cache: volumeCache };
    }));
    setAddItem('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy/60 flex items-end md:items-center justify-center p-0 md:p-6" role="dialog" aria-modal="true" aria-label="Ajuster la liste des objets">
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E3DF]">
          <h2 className="font-bold text-navy">Ajuster la liste des objets</h2>
          <button type="button" onClick={onClose} aria-label="Fermer" className="text-navy"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">
          {draft.map((room) => (
            <div key={room.id}>
              <p className="font-bold text-navy text-sm mb-2">{room.label} — {(room.volume_meubles + room.volume_cache).toFixed(1)} m³</p>
              {room.items.map((it, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 text-sm gap-3">
                  <span className="text-navy flex-1">{ITEM_LABELS[it.id] ?? it.id}</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setQty(room.id, i, it.qty - 1)} aria-label="Diminuer" className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-navy"><Minus className="w-3 h-3" /></button>
                    <span className="w-6 text-center tabular-nums font-medium">{it.qty}</span>
                    <button type="button" onClick={() => setQty(room.id, i, it.qty + 1)} aria-label="Augmenter" className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-navy"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="bg-offwhite rounded-xl p-4 space-y-3">
            <p className="font-bold text-navy text-sm">Ajouter un objet oublié</p>
            <div className="flex flex-wrap gap-2">
              <select value={addTarget} onChange={(e) => setAddTarget(e.target.value)} aria-label="Pièce"
                className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                {draft.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
              <select value={addItem} onChange={(e) => setAddItem(e.target.value)} aria-label="Objet"
                className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm bg-white flex-1 min-w-40">
                <option value="">Choisir un objet…</option>
                {Object.entries(ITEM_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
              <button type="button" onClick={addObject} disabled={!addItem}
                className="bg-navy text-yellow font-bold text-sm rounded-lg px-4 py-2 disabled:opacity-40">Ajouter</button>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#E5E3DF] flex items-center justify-between gap-4">
          <span className="font-black text-navy text-lg tabular-nums">{totals.volumeFinal.toFixed(1)} m³</span>
          <button type="button" onClick={() => onSave(draft)}
            className="bg-yellow text-navy font-bold uppercase py-3 px-8 rounded-xl text-sm hover:bg-navy hover:text-yellow transition-colors">
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}
