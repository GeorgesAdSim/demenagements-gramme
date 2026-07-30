/** Année de fondation de Déménagements Gramme. */
export const ANNEE_FONDATION = 1948;

/**
 * Ancienneté calculée, et non écrite en dur.
 *
 * Le site annonçait « 75 ans » et, par endroits, « plus de 60 ans » — deux
 * chiffres figés, dont le second plaçait Gramme derrière des concurrents moins
 * anciens. C'est pourtant le seul argument d'autorité que tout le secteur met
 * en avant : à Liège, le premier résultat revendique 60 ans, le troisième 67.
 * Un calcul dynamique reste juste sans maintenance.
 */
export function anneesExperience(): number {
  return new Date().getFullYear() - ANNEE_FONDATION;
}
