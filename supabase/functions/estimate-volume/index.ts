// Estimateur de volume par photos — Edge Function.
// Reçoit les photos par pièce, appelle le modèle vision UNE FOIS PAR PIÈCE
// (évite le double comptage inter-pièces, permet le parallélisme), calcule
// le volume côté code via le barème, stocke photos + résultat, renvoie
// l'estimation structurée.
//
// Secrets requis : ANTHROPIC_API_KEY (supabase secrets set).
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY sont injectés automatiquement.

import { createClient } from "npm:@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk";

// ── Barème (copie de src/lib/volumeBareme.ts — garder synchronisé) ──────────
const VOLUME_TABLE: Record<string, number> = {
  canape_2p: 1.0, canape_3p: 1.5, canape_angle: 2.5,
  fauteuil: 0.5, pouf: 0.2, table_basse: 0.3,
  meuble_tv: 0.5, bibliotheque: 0.9, buffet: 1.2,
  vitrine: 1.0, commode: 0.6,
  armoire_2p: 1.5, armoire_3p: 2.2, dressing_mobile: 1.0,
  lit_1p: 1.0, lit_2p: 1.8, lit_superpose: 2.0,
  matelas_simple: 0.4, matelas_double: 0.7, sommier: 0.5,
  table_de_nuit: 0.2, berceau: 0.5, table_a_langer: 0.4,
  table_repas_4p: 0.8, table_repas_8p: 1.3, chaise: 0.2,
  tabouret: 0.15, bureau: 0.7, caisson_bureau: 0.3,
  frigo: 0.5, frigo_americain: 0.9, congelateur: 0.5,
  cuisiniere: 0.4, four: 0.2, lave_linge: 0.4,
  seche_linge: 0.4, lave_vaisselle: 0.4, micro_ondes: 0.1,
  hotte_mobile: 0.2,
  tv_ecran_plat: 0.2, ordinateur_fixe: 0.2, imprimante: 0.15,
  enceinte_colonne: 0.2,
  velo: 0.5, trottinette: 0.2, poussette: 0.3,
  tondeuse: 0.3, barbecue: 0.4, salon_jardin: 1.2,
  parasol: 0.2, etabli: 0.8, escabeau: 0.2,
  outillage_lot: 0.5, coffre_rangement: 0.4, valise: 0.15,
  carton_visible: 0.1, machine_sport: 0.8,
  piano_droit: 1.5, piano_queue: 2.8, coffre_fort: 0.6,
  aquarium: 0.5, billard: 2.0,
  objet_divers_volumineux: 0.4,
};
const HIDDEN_CONTENT: Record<string, number> = {
  armoire_3p: 1.2, armoire_2p: 0.8, dressing_mobile: 0.6,
  commode: 0.4, buffet: 0.5, bibliotheque: 0.6,
  vitrine: 0.3, meuble_tv: 0.2, caisson_bureau: 0.2,
  coffre_rangement: 0.3, bureau: 0.2,
};
const FILL_FACTOR: Record<string, number> = { vide: 0, partiel: 0.5, plein: 1.0, inconnu: 0.7 };
const LOADING_COEFFICIENT = 1.12;
const RANGE: Record<string, number> = { high: 0.10, medium: 0.18, low: 0.30 };
const CONFIDENCE_ORDER: Record<string, number> = { high: 2, medium: 1, low: 0 };

const SYSTEM_PROMPT = `Tu es un métreur professionnel spécialisé en déménagement. On te fournit
entre 1 et 4 photos d'UNE SEULE pièce, prises sous des angles différents.

TA MISSION : identifier et compter le mobilier et les objets volumineux
visibles, puis retourner un inventaire structuré.

RÈGLES ABSOLUES :
1. N'estime JAMAIS de volume en m³. Tu identifies et tu comptes uniquement.
   Le calcul volumétrique est fait par le système en aval.
2. Les photos représentent LA MÊME PIÈCE sous des angles différents. Un
   canapé visible sur 3 photos est UN SEUL canapé. Raisonne sur la pièce
   entière, jamais photo par photo.
3. Utilise exclusivement les identifiants du catalogue ci-dessous. Si un
   objet ne correspond à aucune entrée, utilise "objet_divers_volumineux"
   et décris-le dans le champ note.
4. Ne compte pas : les objets décoratifs de moins de 30 cm, les plantes en
   pot de moins de 50 cm, les tableaux, les rideaux, les tapis, les objets
   posés sur les meubles.
5. Ne compte pas les éléments intégrés au bâtiment : cuisine équipée
   encastrée, placards muraux, dressing sur mesure, radiateurs, sanitaires.
   Signale-les dans le champ built_in.
6. Pour chaque meuble de rangement (armoire, commode, bibliothèque, buffet,
   meuble de cuisine), indique son état de remplissage apparent :
   "vide" | "partiel" | "plein" | "inconnu". Si tu ne vois pas l'intérieur,
   réponds "inconnu".
7. Signale tout objet nécessitant une manutention spéciale : piano, coffre-
   fort, aquarium de plus de 200L, œuvre d'art encadrée de grande taille,
   appareil de fitness lourd, billard, spa.

CATALOGUE D'IDENTIFIANTS AUTORISÉS :
canape_2p, canape_3p, canape_angle, fauteuil, pouf, table_basse, meuble_tv,
bibliotheque, buffet, vitrine, commode, armoire_2p, armoire_3p, dressing_mobile,
table_repas_4p, table_repas_8p, chaise, tabouret, bureau, caisson_bureau,
lit_1p, lit_2p, lit_superpose, matelas_simple, matelas_double, sommier,
table_de_nuit, berceau, table_a_langer,
frigo, frigo_americain, congelateur, cuisiniere, four, lave_linge,
seche_linge, lave_vaisselle, micro_ondes, hotte_mobile,
tv_ecran_plat, ordinateur_fixe, imprimante, enceinte_colonne,
velo, trottinette, poussette, tondeuse, barbecue, salon_jardin, parasol,
etabli, escabeau, outillage_lot, coffre_rangement, valise, carton_visible,
machine_sport, piano_droit, piano_queue, coffre_fort, aquarium, billard,
objet_divers_volumineux

Champ "confidence" :
- "high" : pièce bien éclairée, angles complémentaires, mobilier clairement identifiable
- "medium" : angle unique, ou zones d'ombre, ou pièce partiellement visible
- "low" : photo floue, sombre, cadrage trop serré, pièce quasi vide alors qu'elle semble meublée

Champ "warnings" : messages courts en français destinés au client, par
exemple "Photo sombre, certains meubles peuvent avoir été manqués" ou
"Une seule photo fournie, pensez à cadrer l'angle opposé".

Si les photos ne montrent pas un intérieur de logement (photo de rue,
selfie, document, écran noir), réponds room_readable: false avec items vide,
confidence "low" et un warning "Cette photo ne semble pas montrer une pièce à déménager".`;

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    room_readable: { type: "boolean" },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          qty: { type: "integer" },
          fill: { type: ["string", "null"], enum: ["vide", "partiel", "plein", "inconnu", null] },
          note: { type: ["string", "null"] },
        },
        required: ["id", "qty", "fill", "note"],
        additionalProperties: false,
      },
    },
    built_in: { type: "array", items: { type: "string" } },
    special_handling: { type: "array", items: { type: "string" } },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    warnings: { type: "array", items: { type: "string" } },
  },
  required: ["room_readable", "items", "built_in", "special_handling", "confidence", "warnings"],
  additionalProperties: false,
} as const;

interface RoomInput {
  id: string;
  label: string;
  type: string;
  images: string[]; // data URLs ou base64 JPEG
}

interface HousingInput {
  type?: string;
  roomsCount?: number;
  surfaceM2?: number | null;
  floor?: number | null;
  hasElevator?: boolean;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function stripDataUrl(image: string): string {
  const comma = image.indexOf(",");
  return image.startsWith("data:") && comma !== -1 ? image.slice(comma + 1) : image;
}

// ── Appel vision Gemini (une pièce) ─────────────────────────────────────────
async function analyzeRoomGemini(
  apiKey: string,
  room: RoomInput,
// deno-lint-ignore no-explicit-any
): Promise<any> {
  const parts = [
    ...room.images.map((img) => ({
      inline_data: { mime_type: "image/jpeg", data: stripDataUrl(img) },
    })),
    { text: `Pièce : ${room.label} (type : ${room.type}). Analyse ces ${room.images.length} photo(s) de cette même pièce. Réponds UNIQUEMENT avec un objet JSON valide de la forme : {"room_readable": bool, "items": [{"id": str, "qty": int, "fill": "vide"|"partiel"|"plein"|"inconnu"|null, "note": str|null}], "built_in": [str], "special_handling": [str], "confidence": "high"|"medium"|"low", "warnings": [str]}` },
  ];
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts }],
        generationConfig: { responseMimeType: "application/json", temperature: 0 },
      }),
    },
  );
  if (!res.ok) throw new Error(`gemini_${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("gemini_empty_response");
  return JSON.parse(text);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const geminiKey = Deno.env.get("GEMINI_API_KEY");
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!geminiKey && !anthropicKey) return json({ error: "Service non configuré" }, 500);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let payload: {
    action?: string;
    estimation_id?: string;
    rooms: RoomInput[];
    housing?: HousingInput;
    volume_m3?: number;
    volume_min?: number;
    volume_max?: number;
    detected_items?: unknown;
    lead_email?: string;
    lead_phone?: string;
  };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  // ── Action secondaire : ajustement manuel ou rattachement d'un lead ───────
  // L'id uuid (non devinable, retourné uniquement au créateur) sert de jeton.
  if (payload.action === "adjust" || payload.action === "lead") {
    if (!payload.estimation_id) return json({ error: "missing_estimation_id" }, 400);
    const patch: Record<string, unknown> = {};
    if (payload.action === "adjust") {
      patch.manually_adjusted = true;
      if (typeof payload.volume_m3 === "number") patch.volume_m3 = payload.volume_m3;
      if (typeof payload.volume_min === "number") patch.volume_min = payload.volume_min;
      if (typeof payload.volume_max === "number") patch.volume_max = payload.volume_max;
      if (payload.detected_items) patch.detected_items = payload.detected_items;
    } else {
      if (payload.lead_email) patch.lead_email = String(payload.lead_email).slice(0, 200);
      if (payload.lead_phone) patch.lead_phone = String(payload.lead_phone).slice(0, 50);
    }
    const { error } = await supabase
      .from("volume_estimations")
      .update(patch)
      .eq("id", payload.estimation_id);
    return error ? json({ error: "update_failed" }, 500) : json({ ok: true });
  }

  // ── Rate limiting : 3 estimations par IP et par heure ─────────────────────
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = await sha256(ip);
  const oneHourAgo = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await supabase
    .from("volume_estimations")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", oneHourAgo);
  if ((count ?? 0) >= 3) {
    return json({ error: "rate_limited", message: "Limite atteinte : 3 estimations par heure. Réessayez plus tard ou appelez-nous au 04 264 50 16." }, 429);
  }

  const rooms = payload.rooms ?? [];
  const housing = payload.housing ?? {};
  if (!rooms.length) return json({ error: "no_rooms" }, 400);
  if (rooms.length > 10) return json({ error: "too_many_rooms" }, 400);
  const totalPhotos = rooms.reduce((n, r) => n + (r.images?.length ?? 0), 0);
  if (totalPhotos === 0) return json({ error: "no_photos" }, 400);
  if (totalPhotos > 30 || rooms.some((r) => r.images.length > 4)) {
    return json({ error: "too_many_photos" }, 400);
  }

  const estimationId = crypto.randomUUID();

  // ── Analyse : un appel modèle PAR PIÈCE, en parallèle ─────────────────────
  // Gemini en priorité (clé gratuite AI Studio), Anthropic sinon.
  const anthropic = anthropicKey ? new Anthropic({ apiKey: anthropicKey }) : null;
  const results = await Promise.allSettled(
    rooms.map(async (room) => {
      if (geminiKey) {
        return { room, analysis: await analyzeRoomGemini(geminiKey, room) };
      }

      const imageBlocks = room.images.map((img) => ({
        type: "image" as const,
        source: {
          type: "base64" as const,
          media_type: "image/jpeg" as const,
          data: stripDataUrl(img),
        },
      }));

      const response = await anthropic!.messages.create({
        model: "claude-sonnet-5",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        output_config: { format: { type: "json_schema", schema: OUTPUT_SCHEMA } },
        messages: [{
          role: "user",
          content: [
            ...imageBlocks,
            { type: "text", text: `Pièce : ${room.label} (type : ${room.type}). Analyse ces ${room.images.length} photo(s) de cette même pièce.` },
          ],
        }],
      });

      if (response.stop_reason === "refusal") {
        throw new Error("model_refusal");
      }
      const text = response.content.find((b) => b.type === "text");
      if (!text || text.type !== "text") throw new Error("empty_response");
      return { room, analysis: JSON.parse(text.text) };
    }),
  );

  // ── Calcul volumétrique côté code ─────────────────────────────────────────
  const roomResults: {
    id: string;
    label: string;
    readable: boolean;
    items: { id: string; qty: number; fill: string | null; note: string | null }[];
    volume_meubles: number;
    volume_cache: number;
    confidence: string;
    warnings: string[];
    built_in: string[];
    special_handling: string[];
    error?: string;
  }[] = [];

  let globalConfidence = "high";
  const specialHandling: string[] = [];
  const rawLogs: unknown[] = [];

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const room = rooms[i];
    if (r.status === "rejected") {
      // Une pièce en échec ne fait pas tomber l'estimation entière
      roomResults.push({
        id: room.id, label: room.label, readable: false, items: [],
        volume_meubles: 0, volume_cache: 0, confidence: "low",
        warnings: ["L'analyse de cette pièce a échoué. Ajoutez-la manuellement ou réessayez."],
        built_in: [], special_handling: [], error: String(r.reason?.message ?? r.reason),
      });
      globalConfidence = "low";
      continue;
    }
    const a = r.value.analysis;
    rawLogs.push({ room: room.label, analysis: a });

    let volumeMeubles = 0;
    let volumeCache = 0;
    for (const item of a.items ?? []) {
      const unit = VOLUME_TABLE[item.id] ?? VOLUME_TABLE.objet_divers_volumineux;
      volumeMeubles += unit * item.qty;
      const hidden = HIDDEN_CONTENT[item.id];
      if (hidden) {
        volumeCache += hidden * item.qty * (FILL_FACTOR[item.fill ?? "inconnu"] ?? 0.7);
      }
    }
    // La confiance globale est la plus basse de toutes les pièces
    if (CONFIDENCE_ORDER[a.confidence] < CONFIDENCE_ORDER[globalConfidence]) {
      globalConfidence = a.confidence;
    }
    specialHandling.push(...(a.special_handling ?? []));
    for (const item of a.items ?? []) {
      if (["piano_droit", "piano_queue", "coffre_fort", "aquarium", "billard"].includes(item.id)) {
        specialHandling.push(item.id);
      }
    }
    roomResults.push({
      id: room.id, label: room.label, readable: a.room_readable,
      items: a.items ?? [],
      volume_meubles: Math.round(volumeMeubles * 100) / 100,
      volume_cache: Math.round(volumeCache * 100) / 100,
      confidence: a.confidence, warnings: a.warnings ?? [],
      built_in: a.built_in ?? [], special_handling: a.special_handling ?? [],
    });
  }

  const volumeBrut = roomResults.reduce((s, r) => s + r.volume_meubles + r.volume_cache, 0);
  let volumeFinal = volumeBrut * LOADING_COEFFICIENT;

  // Recoupement de cohérence si la surface est renseignée
  // Repère métier : ~0,50 m³ par m² habitable meublé normalement
  const warningsGlobal: string[] = [];
  if (housing.surfaceM2 && housing.surfaceM2 > 0) {
    const attendu = housing.surfaceM2 * 0.5;
    if (Math.abs(volumeFinal - attendu) / attendu > 0.4) {
      if (globalConfidence === "high") globalConfidence = "medium";
      else globalConfidence = "low";
      warningsGlobal.push(
        "L'estimation s'écarte du volume habituel pour cette surface. Vérifiez que toutes les pièces ont été photographiées.",
      );
    }
  }

  volumeFinal = Math.round(volumeFinal * 10) / 10;
  const range = RANGE[globalConfidence] ?? RANGE.low;
  const volumeMin = Math.round(volumeFinal * (1 - range) * 10) / 10;
  const volumeMax = Math.round(volumeFinal * (1 + range) * 10) / 10;

  // ── Stockage des photos dans le bucket privé ──────────────────────────────
  const photosPaths: string[] = [];
  for (const room of rooms) {
    for (let i = 0; i < room.images.length; i++) {
      const path = `${estimationId}/${room.id}-${i}.jpg`;
      const bytes = Uint8Array.from(atob(stripDataUrl(room.images[i])), (c) => c.charCodeAt(0));
      const { error } = await supabase.storage.from("volume-photos").upload(path, bytes, {
        contentType: "image/jpeg",
      });
      if (!error) photosPaths.push(path);
    }
  }

  // ── Enregistrement (log complet du modèle inclus pour calibration) ────────
  const { error: dbError } = await supabase.from("volume_estimations").insert({
    id: estimationId,
    housing_type: housing.type ?? null,
    rooms_count: housing.roomsCount ?? rooms.length,
    surface_m2: housing.surfaceM2 ?? null,
    floor: housing.floor ?? null,
    has_elevator: housing.hasElevator ?? false,
    detected_items: { rooms: roomResults, raw_model_output: rawLogs },
    volume_m3: volumeFinal,
    volume_min: volumeMin,
    volume_max: volumeMax,
    confidence: globalConfidence,
    photos_paths: photosPaths,
    ip_hash: ipHash,
  });
  if (dbError) console.error("insert error:", dbError);

  return json({
    estimation_id: estimationId,
    volume_m3: volumeFinal,
    volume_min: volumeMin,
    volume_max: volumeMax,
    confidence: globalConfidence,
    special_handling: [...new Set(specialHandling)],
    warnings: warningsGlobal,
    rooms: roomResults,
  });
});
