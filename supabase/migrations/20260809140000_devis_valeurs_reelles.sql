-- ============================================================================
-- devis_requests : élargir les contraintes aux valeurs que les formulaires
-- produisent réellement
--
-- La migration 20260809110000 posait deux CHECK écrits d'après un seul
-- formulaire — celui de l'accueil — et d'après les six lignes présentes en
-- base. Ni l'un ni l'autre ne disait ce que les trois autres formulaires
-- savent envoyer.
--
-- /contact-devis propose quatre services et quatre tranches de volume :
--
--   service_type   demenagement, garde-meuble, international, monte-meubles
--   volume         <20, 20-50, 50-100, >100
--
-- Trois de ces valeurs étaient rejetées. Et comme cette page affiche sa
-- confirmation sans consulter le résultat de l'insertion, le visiteur qui
-- choisissait « International », « Monte-Meubles » ou « plus de 100 m³ » voyait
-- « merci » alors que sa demande n'existait nulle part : ni en base, ni par
-- courriel, puisque la notification est conditionnée à la réussite de
-- l'insertion.
--
-- Deux leçons, inscrites ici parce qu'elles se reperdront autrement :
--
--   · une contrainte tirée d'un seul appelant contraint tous les autres. Il n'y
--     avait pas un formulaire mais quatre, et il fallait les lire tous les
--     quatre avant d'écrire un `check`.
--
--   · un `check` n'est sûr que si l'appelant regarde l'erreur. Ici l'écran
--     confirmait quoi qu'il arrive : la contrainte, censée protéger la qualité
--     des données, détruisait des demandes. Le correctif côté interface est
--     indispensable et vient séparément — celui-ci ne fait que rouvrir ce qui
--     n'aurait jamais dû être fermé.
--
-- `unknown` reste accepté sur les deux colonnes : le formulaire de l'accueil
-- l'envoie quand le visiteur répond « Je ne sais pas », et le rappel de
-- l'estimateur de volume s'en sert aussi.
-- ============================================================================

alter table public.devis_requests
  drop constraint if exists devis_service_valide;

alter table public.devis_requests
  add constraint devis_service_valide
  check (service_type in (
    'demenagement',
    'garde-meuble',
    'international',
    'monte-meubles'
  ));

alter table public.devis_requests
  drop constraint if exists devis_volume_valide;

alter table public.devis_requests
  add constraint devis_volume_valide
  check (volume is null or volume in (
    '<20',
    '20-50',
    '50-100',
    '>100',
    'unknown'
  ));

notify pgrst, 'reload schema';

-- ---------------------------------------------------------------------------
-- Contrôle : les huit valeurs que les formulaires savent produire doivent
-- toutes passer. Le bloc annule tout à la fin — il vérifie, il n'insère pas.
-- ---------------------------------------------------------------------------
do $$
declare
  s text;
  v text;
begin
  foreach s in array array['demenagement','garde-meuble','international','monte-meubles']
  loop
    foreach v in array array['<20','20-50','50-100','>100','unknown']
    loop
      insert into public.devis_requests
        (service_type, firstname, lastname, email, phone, departure_city, arrival_city, volume)
      values (s, 'controle', 'controle', 'controle@example.invalid', '0', '-', '-', v);
    end loop;
  end loop;

  raise notice 'Les 20 combinaisons service × volume sont acceptées.';
  raise exception using errcode = 'triggered_action_exception',
    message = 'Contrôle terminé — annulation volontaire, aucune ligne conservée.';
exception
  when triggered_action_exception then
    raise notice 'Contrôle réussi, rien n''a été écrit.';
end $$;
