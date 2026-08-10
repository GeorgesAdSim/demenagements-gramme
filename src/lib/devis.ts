/**
 * Socle commun des formulaires de demande de devis.
 *
 * Il y a quatre points de dépôt sur le site — le formulaire de l'accueil,
 * repris sur les pages communes et les satellites, /contact, /contact-devis, et
 * le rappel de l'estimateur de volume. Chacun avait sa copie de la même
 * logique, et les copies ont divergé. Ce qu'elles ont produit en une seule
 * journée :
 *
 *   · trois des quatre n'appelaient pas la notification par courriel ;
 *   · trois des quatre confirmaient au visiteur une demande que la base venait
 *     de refuser ;
 *   · les listes d'options ont divergé, si bien qu'une contrainte écrite
 *     d'après l'une rejetait ce que l'autre envoyait.
 *
 * Ce fichier porte les valeurs, la validation et l'envoi. Le rendu reste propre
 * à chaque page — les trois formulaires n'ont ni les mêmes libellés, ni la même
 * mise en page, et les unifier visuellement est une décision de contenu, pas de
 * code. Ce qui est mis en commun ici, c'est ce dont la divergence casse quelque
 * chose.
 */
import { useState } from 'react';
import { supabase } from './supabase';
import { notifierDevis } from './notifierDevis';
import { mesurerDevisEnvoye, type SourceDevis } from './mesure';
import { ENTREPRISE } from '../data/entreprise';

// ---------------------------------------------------------------------------
// Les valeurs autorisées
//
// `valeur` est ce qui part en base, `libelle` ce que le visiteur lit. Les deux
// ne doivent jamais être confondus : le formulaire de l'accueil stockait le
// libellé et le traduisait à l'envoi par un tableau de correspondance. Corriger
// une espace insécable dans un libellé aurait suffi à faire basculer tous les
// volumes sur « unknown », sans aucun message d'erreur.
//
// Ces listes sont aussi la source des contraintes CHECK de la table
// `devis_requests` : toute valeur ajoutée ici doit l'être là-bas, sinon la
// demande est refusée par la base et perdue.
// ---------------------------------------------------------------------------
export interface OptionDevis {
  valeur: string;
  libelle: string;
}

export const SERVICES: readonly OptionDevis[] = [
  { valeur: 'demenagement', libelle: 'Déménagement' },
  { valeur: 'garde-meuble', libelle: 'Garde-Meubles' },
  { valeur: 'international', libelle: 'International' },
  { valeur: 'monte-meubles', libelle: 'Monte-Meubles' },
] as const;

export const VOLUMES: readonly OptionDevis[] = [
  { valeur: '<20', libelle: '< 20m³' },
  { valeur: '20-50', libelle: '20 - 50m³' },
  { valeur: '50-100', libelle: '50 - 100m³' },
  { valeur: '>100', libelle: '> 100m³' },
  { valeur: 'unknown', libelle: 'Je ne sais pas' },
] as const;

/** Libellé lisible d'une valeur, pour le courriel de notification. */
export const libelleDe = (options: readonly OptionDevis[], valeur: string): string =>
  options.find((o) => o.valeur === valeur)?.libelle ?? valeur;

// ---------------------------------------------------------------------------
// Les champs
// ---------------------------------------------------------------------------
export interface ChampsDevis {
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

export const CHAMPS_VIDES: ChampsDevis = {
  service: SERVICES[0].valeur,
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

export type ErreursDevis = Partial<Record<keyof ChampsDevis, string>>;

/**
 * Validation commune.
 *
 * `date` n'y figure pas : les trois formulaires la rendaient obligatoire, mais
 * /contact l'affichait sans astérisque — l'étiquette annonçait un champ
 * facultatif et le formulaire le refusait. Plutôt que de reconduire l'un des
 * deux comportements en silence, la règle est portée par l'appelant, via
 * `dateObligatoire`.
 */
export function validerDevis(
  form: ChampsDevis,
  options: { dateObligatoire?: boolean; libelleVilles?: 'ville' | 'adresse' } = {},
): ErreursDevis {
  const { dateObligatoire = false, libelleVilles = 'ville' } = options;
  const depart = libelleVilles === 'adresse' ? 'Adresse de départ requise' : 'Ville de départ requise';
  const arrivee = libelleVilles === 'adresse' ? "Adresse d'arrivée requise" : "Ville d'arrivée requise";

  const e: ErreursDevis = {};
  if (!form.firstName.trim()) e.firstName = 'Prénom requis';
  if (!form.lastName.trim()) e.lastName = 'Nom requis';
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';

  // Le téléphone n'était testé que sur le non-vide : « 04 » passait. C'est le
  // canal de rappel principal, un numéro inexploitable rend la demande morte.
  // La règle reste large à dessein — indicatifs, espaces, points, tirets et
  // parenthèses sont admis — elle n'écarte que ce qui ne peut pas être un
  // numéro.
  const chiffres = form.phone.replace(/[^\d]/g, '');
  if (!form.phone.trim()) e.phone = 'Téléphone requis';
  else if (chiffres.length < 8) e.phone = 'Numéro incomplet';

  if (!form.cityFrom.trim()) e.cityFrom = depart;
  if (!form.cityTo.trim()) e.cityTo = arrivee;
  if (dateObligatoire && !form.date) e.date = 'Date requise';
  if (!form.privacy) e.privacy = 'Vous devez accepter la politique';
  return e;
}

// ---------------------------------------------------------------------------
// L'envoi
// ---------------------------------------------------------------------------
export interface OptionsFormulaireDevis {
  /** Origine, pour la mesure de conversion. */
  source: SourceDevis;
  /** Voir validerDevis : la règle diffère d'une page à l'autre. */
  dateObligatoire?: boolean;
  libelleVilles?: 'ville' | 'adresse';
  /** Valeurs initiales, pour les pages qui pré-remplissent une commune. */
  valeursInitiales?: Partial<ChampsDevis>;
  /** Ajouté au message envoyé, sans être affiché — rattachement d'estimation. */
  suffixeMessage?: string;
}

export function useFormulaireDevis(options: OptionsFormulaireDevis) {
  const {
    source, dateObligatoire = false, libelleVilles = 'ville',
    valeursInitiales, suffixeMessage,
  } = options;

  const initial: ChampsDevis = { ...CHAMPS_VIDES, ...valeursInitiales };

  const [form, setForm] = useState<ChampsDevis>(initial);
  const [errors, setErrors] = useState<ErreursDevis>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [erreurEnvoi, setErreurEnvoi] = useState<string | null>(null);

  const set = <K extends keyof ChampsDevis>(champ: K, valeur: ChampsDevis[K]) =>
    setForm((prev) => ({ ...prev, [champ]: valeur }));

  const remplacer = (valeurs: Partial<ChampsDevis>) =>
    setForm((prev) => ({ ...prev, ...valeurs }));

  const envoyer = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitted(true);

    const e = validerDevis(form, { dateObligatoire, libelleVilles });
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setErreurEnvoi(null);
    setLoading(true);

    const message = suffixeMessage ? `${form.message}\n${suffixeMessage}` : form.message;

    const { error } = await supabase.from('devis_requests').insert({
      service_type: form.service,
      firstname: form.firstName,
      lastname: form.lastName,
      email: form.email,
      phone: form.phone,
      departure_city: form.cityFrom,
      arrival_city: form.cityTo,
      move_date: form.date || null,
      volume: form.volume || 'unknown',
      message,
    });

    setLoading(false);

    // La confirmation dépend du résultat. Trois formulaires sur quatre
    // l'affichaient sans le consulter : une contrainte violée ou une base
    // indisponible produisaient un « merci » indistinguable d'un succès, et la
    // demande n'existait nulle part.
    if (error) {
      setErreurEnvoi(
        `Votre demande n'a pas pu être enregistrée. Merci de réessayer, ou de nous appeler au ${ENTREPRISE.telephone.affichage}.`,
      );
      return;
    }

    // La base a accepté : c'est ici, et pas plus haut, que la conversion existe.
    mesurerDevisEnvoye(source, form.service);

    notifierDevis({
      service: libelleDe(SERVICES, form.service),
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      cityFrom: form.cityFrom,
      cityTo: form.cityTo,
      date: form.date,
      volume: form.volume ? libelleDe(VOLUMES, form.volume) : '',
      message,
    });

    setSuccess(true);
    setSubmitted(false);
    setErrors({});
    setForm(initial);
    setTimeout(() => setSuccess(false), 6000);
  };

  return { form, set, remplacer, errors, submitted, loading, success, erreurEnvoi, envoyer };
}
