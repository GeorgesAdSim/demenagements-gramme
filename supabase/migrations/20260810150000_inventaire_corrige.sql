-- ============================================================================
-- L'inventaire corrigé par l'opérateur, à côté de celui du modèle
--
-- `volume_ajuste` demandait à l'opérateur un nombre de mètres cubes saisi de
-- tête — c'est-à-dire exactement le travail que l'estimateur est censé lui
-- épargner. Or le volume n'est pas produit par le modèle : il est CALCULÉ à
-- partir de l'inventaire par le barème (volumes unitaires, contenu caché, taux
-- de remplissage, coefficient de foisonnement).
--
-- Corriger l'inventaire rend donc la correction calculable au lieu d'estimée.
-- `volume_ajuste` devient le résultat du recalcul, plus une saisie.
--
-- Même raisonnement que pour `volume_m3` : `detected_items` n'est jamais
-- réécrit. Écraser l'inventaire du modèle détruirait la donnée de calibration —
-- et celle-ci vaut bien mieux qu'un écart en mètres cubes, puisqu'elle dit CE
-- QUE le modèle rate : confondre un bureau avec une table, ignorer des cartons,
-- se tromper sur le remplissage d'une armoire. C'est ce niveau de détail qui
-- permet de corriger le prompt, pas un delta global.
-- ============================================================================

alter table public.volume_estimations
  add column if not exists corrected_items jsonb;

comment on column public.volume_estimations.corrected_items is
  'Inventaire corrigé dans le back-office, même forme que detected_items ({rooms:[...]}). Nul tant que personne n''a corrigé ; detected_items reste l''inventaire du modèle.';

-- ---------------------------------------------------------------------------
-- Contrôle. Attendu : corrected_items présente et nulle partout.
-- ---------------------------------------------------------------------------
select
  count(*)                                            as total,
  count(*) filter (where corrected_items is not null) as corrigees,
  count(*) filter (where volume_ajuste  is not null)  as avec_volume_ajuste
from public.volume_estimations;
