-- ============================================================================
-- Le bouton « Archiver » des devis ne faisait rien
--
-- DevisListPage propose « Archiver » à deux endroits — l'icône de la liste et
-- le bouton de la fiche — et un filtre « Archivé ». Les trois écrivent
-- `status = 'archived'`.
--
-- `devis_statut_valide` n'autorise que 'new', 'read' et 'replied'. Postgres
-- rejette donc l'update (23514), et comme handleStatusChange ne regarde pas le
-- retour de Supabase, la page met quand même son état local à jour : la ligne
-- s'affiche « Archivé » jusqu'au prochain rechargement, où elle réapparaît
-- telle quelle. Silencieux des deux côtés — aucune erreur en console, aucune
-- trace côté base.
--
-- Deux issues possibles : retirer l'archivage de l'interface, ou l'autoriser en
-- base. La seconde est retenue — trois affordances et un filtre disent assez
-- que la fonction est voulue, et `volume_estimations` a été créée avec
-- 'archived' dès le départ pour cette raison. Les deux listes d'arrivées du
-- back-office ont ainsi le même cycle.
--
-- La correction n'est complète qu'avec le test des erreurs d'écriture dans
-- DevisListPage, livré dans le même commit : sans lui, la prochaine valeur
-- ajoutée à l'interface repartira dans le même silence.
-- ============================================================================

alter table public.devis_requests
  drop constraint if exists devis_statut_valide;

alter table public.devis_requests
  add constraint devis_statut_valide
  check (status in ('new', 'read', 'replied', 'archived'));

-- ---------------------------------------------------------------------------
-- Contrôle. Attendu : la contrainte cite les quatre valeurs, et aucune ligne
-- existante ne se trouve hors de cette liste — les updates rejetés n'ayant
-- jamais abouti, il ne devrait exister aucun 'archived' en base.
-- ---------------------------------------------------------------------------
select conname, pg_get_constraintdef(oid)
from pg_constraint
where conrelid = 'public.devis_requests'::regclass
  and conname = 'devis_statut_valide';

select status, count(*)
from public.devis_requests
group by status
order by status;
