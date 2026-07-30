// Déclarations de types pour les attributs déclaratifs WebMCP.
//
// Ces attributs HTML ne figurent pas dans @types/react, puisque WebMCP n'est
// pas encore une norme — l'annotation déclarative des formulaires est même
// toujours marquée TODO dans la spec. Sans cette augmentation, TypeScript
// refuse `toolname` sur un <form> et `toolparamdescription` sur un <input>.
//
// À supprimer si un jour @types/react les intègre nativement.
import 'react';

declare module 'react' {
  interface FormHTMLAttributes<T> {
    /** Identifiant de l'outil synthétisé par le navigateur à partir du formulaire. */
    toolname?: string;
    /** Description en langage naturel de ce que fait — et ne fait pas — le formulaire. */
    tooldescription?: string;
  }

  interface HTMLAttributes<T> {
    /** Description d'un champ, pour qu'un agent le remplisse correctement. */
    toolparamdescription?: string;
  }
}
