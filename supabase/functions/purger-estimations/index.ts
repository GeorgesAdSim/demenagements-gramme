// Purge des estimations de volume — Edge Function planifiée.
//
// Anonymise les lignes échues plutôt que de les supprimer : photos effacées du
// Storage, coordonnées et empreinte d'IP vidées, log brut du modèle retiré. Le
// chiffré reste, parce que l'écart entre volume_m3 et volume_ajuste est la
// seule mesure de dérive de l'estimateur. Voir la migration 20260810140000.
//
// Pourquoi une Edge Function et pas du pg_cron seul : supprimer des lignes de
// storage.objects en SQL retire la métadonnée et laisse les octets dans
// l'object store. Seule l'API Storage efface réellement le fichier.
//
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY sont injectés automatiquement.
//
//   GET|POST /purger-estimations        exécute
//   GET|POST /purger-estimations?dry=1  rapporte sans rien effacer

import { createClient } from "npm:@supabase/supabase-js@2";

const BUCKET = "volume-photos";

// Un dossier plus récent que ce délai n'est jamais balayé : `estimate-volume`
// dépose les photos AVANT d'insérer la ligne, et la purge tombant dans cet
// intervalle effacerait une estimation en cours de création. Fenêtre étroite,
// panne indiagnosticable.
const AGE_MINIMAL_ORPHELIN_MS = 24 * 3600 * 1000;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRole) return json({ error: "env_manquant" }, 500);

  // `verify_jwt` ne suffit pas : la clé anon est elle aussi un JWT valide, et
  // elle est publiée dans le bundle du site. On exige donc explicitement la
  // clé service_role, seule à ne circuler qu'entre le planificateur et ici.
  const porteur = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!porteur || porteur !== serviceRole) return json({ error: "non_autorise" }, 401);

  const dry = new URL(req.url).searchParams.has("dry");
  const supabase = createClient(url, serviceRole);

  const rapport = {
    dry,
    echues: 0,
    anonymisees: 0,
    photos_supprimees: 0,
    dossiers_orphelins_supprimes: 0,
    erreurs: [] as string[],
  };

  // ── 1. Les lignes échues, pas encore anonymisées ──────────────────────────
  const { data: echues, error: lectureError } = await supabase
    .from("volume_estimations")
    .select("id, photos_paths, detected_items")
    .lt("expires_at", new Date().toISOString())
    .is("anonymized_at", null);

  if (lectureError) return json({ error: "lecture_echouee", message: lectureError.message }, 500);
  rapport.echues = echues?.length ?? 0;

  for (const ligne of echues ?? []) {
    const chemins: string[] = ligne.photos_paths ?? [];

    if (chemins.length && !dry) {
      const { error: supprError } = await supabase.storage.from(BUCKET).remove(chemins);
      if (supprError) {
        // On n'anonymise pas une ligne dont les photos sont encore là : sinon
        // `photos_paths` est perdu et plus rien ne dit où elles se trouvent.
        rapport.erreurs.push(`photos ${ligne.id} : ${supprError.message}`);
        continue;
      }
    }
    rapport.photos_supprimees += chemins.length;

    // Le log brut peut contenir des descriptions littérales de l'intérieur.
    // Le découpage par pièce reste : un inventaire de meubles sans photo, sans
    // contact et sans IP n'identifie personne.
    const detailsAlleges = ligne.detected_items?.rooms
      ? { rooms: ligne.detected_items.rooms }
      : ligne.detected_items ?? null;

    if (!dry) {
      const { error: majError } = await supabase
        .from("volume_estimations")
        .update({
          lead_email: null,
          lead_phone: null,
          ip_hash: null,
          photos_paths: null,
          detected_items: detailsAlleges,
          anonymized_at: new Date().toISOString(),
        })
        .eq("id", ligne.id);
      if (majError) {
        rapport.erreurs.push(`ligne ${ligne.id} : ${majError.message}`);
        continue;
      }
    }
    rapport.anonymisees++;
  }

  // ── 2. Balayage des orphelins ─────────────────────────────────────────────
  // Le bucket peut contenir des dossiers sans ligne correspondante : insertion
  // échouée après l'upload, ou suppression manuelle depuis le back-office, qui
  // ne touche pas au Storage. Personne ne les voit plus, donc personne ne les
  // supprimera jamais — sauf ici.
  const { data: reference, error: refError } = await supabase
    .from("volume_estimations")
    .select("photos_paths")
    .not("photos_paths", "is", null);

  if (refError) {
    rapport.erreurs.push(`référence orphelins : ${refError.message}`);
    return json(rapport);
  }

  // Les chemins ont la forme `<id estimation>/<pièce>-<n>.jpg`.
  const dossiersVivants = new Set(
    (reference ?? []).flatMap((r) => (r.photos_paths ?? []).map((p: string) => p.split("/")[0])),
  );

  const limite = new Date(Date.now() - AGE_MINIMAL_ORPHELIN_MS);

  // La racine est entièrement collectée AVANT toute suppression : effacer le
  // contenu d'un dossier le fait disparaître du listing, et les pages
  // suivantes se décaleraient — on sauterait une entrée sur deux.
  const racine: { name: string }[] = [];
  for (let offset = 0; ; offset += 100) {
    const { data: page, error: listeError } = await supabase.storage
      .from(BUCKET)
      .list("", { limit: 100, offset });
    if (listeError) {
      rapport.erreurs.push(`liste racine : ${listeError.message}`);
      break;
    }
    if (!page?.length) break;
    racine.push(...page);
    if (page.length < 100) break;
  }

  for (const entree of racine) {
    if (dossiersVivants.has(entree.name)) continue;

    const { data: contenu, error: contenuError } = await supabase.storage
      .from(BUCKET)
      .list(entree.name, { limit: 100 });
    if (contenuError) {
      rapport.erreurs.push(`liste ${entree.name} : ${contenuError.message}`);
      continue;
    }
    if (!contenu?.length) continue;

    // `list()` ne date pas les préfixes ; on se rabat sur le plus récent objet
    // qu'ils contiennent.
    const plusRecent = contenu.reduce((max, o) => {
      const d = o.created_at ? new Date(o.created_at) : null;
      return d && (!max || d > max) ? d : max;
    }, null as Date | null);
    if (plusRecent && plusRecent > limite) continue;

    const aSupprimer = contenu.map((o) => `${entree.name}/${o.name}`);
    if (!dry) {
      const { error: supprError } = await supabase.storage.from(BUCKET).remove(aSupprimer);
      if (supprError) {
        rapport.erreurs.push(`orphelin ${entree.name} : ${supprError.message}`);
        continue;
      }
    }
    rapport.dossiers_orphelins_supprimes++;
    rapport.photos_supprimees += aSupprimer.length;
  }

  return json(rapport);
});
