import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Loader as Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import TipTapEditor from '../components/TipTapEditor';
import SeoPanel from '../components/SeoPanel';
import { ENTREPRISE } from '../../data/entreprise';

const COCONES = ['demenagement', 'transport', 'garde-meuble', 'general'];
const COCON_LABELS: Record<string, string> = {
  demenagement: 'Déménagement',
  transport: 'Transport',
  'garde-meuble': 'Garde-meuble',
  general: 'Général',
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const DEFAULT_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Demenagements Gramme SCRL",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": ENTREPRISE.adresse.rue,
    "addressLocality": ENTREPRISE.adresse.localite,
    "postalCode": ENTREPRISE.adresse.codePostal,
    "addressCountry": "BE",
  },
  "telephone": "+3242645016",
  "url": "https://demenagements-gramme.be",
}, null, 2);

export default function PageEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('<h1>Nouveau titre</h1><p>Commencez à écrire ici...</p>');
  const [published, setPublished] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [cocon, setCocon] = useState('general');
  const [coconPages, setCoconPages] = useState<{ id: string; title: string }[]>([]);
  const [pageId, setPageId] = useState<string | undefined>(isNew ? undefined : id);

  useEffect(() => {
    if (!isNew && id) {
      loadPage(id);
    }
  }, [id, isNew]);

  useEffect(() => {
    if (isNew) {
      setSlug(slugify(title));
    }
  }, [title, isNew]);

  useEffect(() => {
    loadCoconPages();
  }, [cocon, pageId]);

  async function loadPage(pageId: string) {
    setLoading(true);
    setError(null);
    const { data, error: lectureError } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .maybeSingle();

    if (lectureError) {
      setError(`Impossible de charger la page : ${lectureError.message}`);
      setLoading(false);
      return;
    }

    if (data) {
      setTitle(data.title || '');
      setSlug(data.slug || '');
      setContent(typeof data.content === 'string' ? data.content : (data.content as { html?: string })?.html || '');
      setPublished(data.status === 'published');
      setMetaTitle(data.meta_title || '');
      setMetaDesc(data.meta_description || '');
      setOgImage(data.og_image || '');
      setCanonicalUrl(data.canonical_url || '');
      setCocon(data.cocon || 'general');
      setPageId(data.id);
    }
    setLoading(false);
  }

  async function loadCoconPages() {
    const query = supabase
      .from('pages')
      .select('id, title')
      .eq('cocon', cocon)
      .limit(5);

    if (pageId) {
      query.neq('id', pageId);
    }

    // Cet échec-là ne bloque pas l'édition, mais il ne doit pas se déguiser en
    // « aucune autre page dans ce cocon » : le bandeau reste le seul endroit où
    // l'on apprend que la liste est incomplète. On ne l'efface pas ici, pour ne
    // pas masquer une erreur d'enregistrement plus grave.
    const { data, error: coconError } = await query;
    if (coconError) {
      setError(`Impossible de charger les autres pages du cocon : ${coconError.message}`);
      setCoconPages([]);
      return;
    }
    setCoconPages(data || []);
  }

  const save = useCallback(async (publish?: boolean) => {
    setSaving(true);
    setError(null);
    const status = publish !== undefined ? (publish ? 'published' : 'draft') : (published ? 'published' : 'draft');

    // `structured_data` et `published_at` figuraient ici et n'existent dans
    // aucune migration : les colonnes de `pages` sont slug, title, content,
    // cocon, meta_*, og_image, canonical_url, h1, status, page_type,
    // is_deletable, ordre, created_at, updated_at. PostgREST répondait donc
    // PGRST204 à chaque enregistrement — le même refus que celui de la
    // médiathèque en PR #48 — et rien ne le lisait : l'écran affichait
    // « Sauvegardé », l'autosave répétait l'échec toutes les 30 s, et le
    // contenu était perdu au rechargement.
    //
    // Elles sont retirées plutôt qu'ajoutées au schéma. `structured_data`
    // aurait stocké le même JSON-LD constant pour toutes les pages — le
    // SeoPanel l'affiche en lecture seule, il n'est pas éditable — et
    // `published_at` n'était lu nulle part dans le dépôt.
    const payload = {
      title,
      slug,
      content: { html: content },
      status,
      cocon,
      meta_title: metaTitle,
      meta_description: metaDesc,
      og_image: ogImage,
      canonical_url: canonicalUrl,
      updated_at: new Date().toISOString(),
    };

    if (pageId) {
      const { error: majError } = await supabase.from('pages').update(payload).eq('id', pageId);
      if (majError) {
        setError(`Enregistrement refusé : ${majError.message}`);
        setSaving(false);
        return;
      }
    } else {
      const { data, error: creaError } = await supabase.from('pages').insert(payload).select('id').maybeSingle();
      if (creaError) {
        setError(`Création refusée : ${creaError.message}`);
        setSaving(false);
        return;
      }
      if (data) {
        setPageId(data.id);
        window.history.replaceState(null, '', `/admin/pages/${data.id}/edit`);
      }
    }

    if (publish !== undefined) setPublished(publish);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [title, slug, content, published, metaTitle, metaDesc, ogImage, canonicalUrl, cocon, pageId]);

  useEffect(() => {
    if (loading || isNew && !pageId) return;
    const interval = setInterval(() => save(), 30000);
    return () => clearInterval(interval);
  }, [save, loading, isNew, pageId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-8 h-8 animate-spin text-[#132073]" />
      </div>
    );
  }

  return (
    <div className="font-sans">
      <div className="bg-white border-b border-[#E5E3DF] px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate('/admin/pages')}
          className="flex items-center gap-2 text-[#85868C] hover:text-[#132073] text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux pages
        </button>
        <div className="flex items-center gap-3">
          {saving && <Loader2 className="w-4 h-4 animate-spin text-[#85868C]" />}
          {saved && (
            <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-bold">
              Sauvegardé
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="mx-4 lg:mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-red-700 text-sm font-bold">Erreur</p>
          <p className="text-red-600 text-xs mt-1 break-words">{error}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 lg:w-[65%] p-4 lg:p-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la page"
            className="w-full font-black text-2xl lg:text-[2rem] text-[#132073] outline-none mb-3 bg-transparent uppercase"
          />
          <div className="bg-[#F4F2EE] rounded-lg px-4 py-2 font-mono text-[13px] text-[#85868C] mb-4">
            demenagements-gramme.be/{slug}
          </div>

          <TipTapEditor content={content} onChange={setContent} />
        </div>

        <div className="lg:w-[35%] p-4 lg:p-6 space-y-6 lg:sticky lg:top-0 lg:self-start lg:max-h-screen lg:overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 border border-[#E5E3DF]">
            <h3 className="font-bold text-[#132073] mb-4">Publication</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#333333]">Statut</span>
              <button
                onClick={() => setPublished(!published)}
                className={`relative w-12 h-6 rounded-full transition-colors ${published ? 'bg-[#132073]' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${published ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <span className={`text-sm ${published ? 'text-green-600 font-bold' : 'text-[#85868C]'}`}>
              {published ? 'Publié' : 'Brouillon'}
            </span>
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => save()}
                disabled={saving}
                className="bg-[#F4F2EE] text-[#132073] rounded-lg py-2.5 w-full text-sm font-bold hover:bg-[#E5E3DF] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Enregistrer
              </button>
              <button
                onClick={() => save(true)}
                disabled={saving}
                className="bg-[#F0B800] text-[#132073] font-bold rounded-lg py-2.5 w-full text-sm hover:bg-[#EAB000] transition-colors disabled:opacity-70"
              >
                Publier
              </button>
              {slug && (
                <a
                  href={`/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-[#E5E3DF] text-[#85868C] rounded-lg py-2.5 w-full text-sm flex items-center justify-center gap-2 hover:bg-[#F4F2EE] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Voir la page
                </a>
              )}
            </div>
          </div>

          <SeoPanel
            metaTitle={metaTitle}
            metaDescription={metaDesc}
            slug={slug}
            ogImage={ogImage}
            canonicalUrl={canonicalUrl}
            onMetaTitleChange={setMetaTitle}
            onMetaDescriptionChange={setMetaDesc}
            onSlugChange={setSlug}
            onOgImageChange={setOgImage}
            onCanonicalUrlChange={setCanonicalUrl}
            structuredData={DEFAULT_JSON_LD}
          />

          <div className="bg-white rounded-2xl p-6 border border-[#E5E3DF]">
            <h3 className="font-bold text-[#132073] mb-4">Cocon sémantique</h3>
            <select
              value={cocon}
              onChange={(e) => setCocon(e.target.value)}
              className="w-full bg-[#F4F2EE] rounded-lg px-3 py-2 text-sm outline-none border border-[#E5E3DF] mb-4"
            >
              {COCONES.map((c) => (
                <option key={c} value={c}>{COCON_LABELS[c]}</option>
              ))}
            </select>
            <p className="text-[#85868C] text-xs mb-2">Autres pages du cocon :</p>
            <ul className="space-y-2">
              {coconPages.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => navigate(`/admin/pages/${p.id}/edit`)}
                    className="text-[#132073] text-sm hover:underline"
                  >
                    {p.title}
                  </button>
                </li>
              ))}
              {coconPages.length === 0 && (
                <li className="text-[#85868C] text-xs">Aucune autre page dans ce cocon</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
