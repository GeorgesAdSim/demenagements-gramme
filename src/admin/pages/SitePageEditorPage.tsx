import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader as Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import TipTapEditor from '../components/TipTapEditor';
import SeoPanel from '../components/SeoPanel';
import { TextField, ListField, ObjectListField, Section } from '../components/JsonFieldEditor';

const LEGAL_SLUGS = ['mentions-legales', 'confidentialite', 'cgv'];

const SLUG_LABELS: Record<string, string> = {
  accueil: 'Page d\'accueil',
  demenagements: 'Déménagements',
  'garde-meubles': 'Garde-Meubles',
  transports: 'Transports',
  contact: 'Contact',
  'mentions-legales': 'Mentions Légales',
  confidentialite: 'Confidentialité',
  cgv: 'CGV',
};

const DEFAULT_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Demenagements Gramme SCRL",
  "telephone": "+3242645016",
  "url": "https://demenagements-gramme.be",
}, null, 2);

interface PageRow {
  id: string;
  title: string;
  slug: string;
  content: Record<string, unknown>;
  status: string;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  page_type: string;
}

export default function SitePageEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [page, setPage] = useState<PageRow | null>(null);
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  useEffect(() => {
    if (id) loadPage(id);
  }, [id]);

  async function loadPage(pageId: string) {
    setLoading(true);
    const { data } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .maybeSingle();

    if (data) {
      setPage(data as PageRow);
      setContent(typeof data.content === 'object' && data.content !== null ? data.content as Record<string, unknown> : {});
      setMetaTitle(data.meta_title || '');
      setMetaDesc(data.meta_description || '');
      setOgImage(data.og_image || '');
      setCanonicalUrl(data.canonical_url || '');
    }
    setLoading(false);
  }

  const save = useCallback(async () => {
    if (!page) return;
    setSaving(true);
    setSaveError(null);

    const { error } = await supabase.from('pages').update({
      content,
      meta_title: metaTitle,
      meta_description: metaDesc,
      og_image: ogImage,
      canonical_url: canonicalUrl,
      updated_at: new Date().toISOString(),
    }).eq('id', page.id);

    setSaving(false);

    if (error) {
      setSaveError('Erreur lors de la sauvegarde');
      setTimeout(() => setSaveError(null), 5000);
    } else {
      const { clearSitePageCache } = await import('../../lib/useSitePageContent');
      clearSitePageCache(page.slug);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }, [page, content, metaTitle, metaDesc, ogImage, canonicalUrl]);

  useEffect(() => {
    if (loading || !page) return;
    const interval = setInterval(() => save(), 30000);
    return () => clearInterval(interval);
  }, [save, loading, page]);

  const updateContent = (path: string, value: unknown) => {
    setContent((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const getStr = (path: string): string => {
    const keys = path.split('.');
    let obj: unknown = content;
    for (const k of keys) {
      if (obj && typeof obj === 'object') obj = (obj as Record<string, unknown>)[k];
      else return '';
    }
    return typeof obj === 'string' ? obj : '';
  };

  const getArr = <T,>(path: string): T[] => {
    const keys = path.split('.');
    let obj: unknown = content;
    for (const k of keys) {
      if (obj && typeof obj === 'object') obj = (obj as Record<string, unknown>)[k];
      else return [];
    }
    return Array.isArray(obj) ? obj : [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-8 h-8 animate-spin text-[#132073]" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="p-8 text-center text-[#85868C]">Page introuvable</div>
    );
  }

  const isLegal = LEGAL_SLUGS.includes(page.slug);
  const slug = page.slug;

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
          {saveError && (
            <span className="bg-red-100 text-red-700 rounded-full px-3 py-1 text-xs font-bold">
              {saveError}
            </span>
          )}
          <button
            onClick={() => save()}
            disabled={saving}
            className="bg-[#F0B800] text-[#132073] font-bold rounded-lg px-5 py-2 text-sm hover:bg-[#EAB000] transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Enregistrer
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 lg:w-[65%] p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="font-black text-2xl lg:text-[2rem] text-[#132073] uppercase">
              {SLUG_LABELS[slug] || page.title}
            </h1>
            <span className="bg-[#132073] text-[#F0B800] rounded-full px-3 py-1 text-[11px] font-bold uppercase">
              Page du site
            </span>
          </div>
          <div className="bg-[#F4F2EE] rounded-lg px-4 py-2 font-mono text-[13px] text-[#85868C] mb-6">
            demenagements-gramme.be/{slug === 'accueil' ? '' : slug}
          </div>

          {isLegal ? (
            <LegalEditor
              html={getStr('html')}
              onChange={(html) => updateContent('html', html)}
            />
          ) : slug === 'accueil' ? (
            <HomepageEditor content={content} updateContent={updateContent} getStr={getStr} getArr={getArr} />
          ) : slug === 'contact' ? (
            <ContactEditor content={content} updateContent={updateContent} getStr={getStr} getArr={getArr} />
          ) : (
            <ServiceEditor content={content} updateContent={updateContent} getStr={getStr} getArr={getArr} />
          )}
        </div>

        <div className="lg:w-[35%] p-4 lg:p-6 space-y-6 lg:sticky lg:top-0 lg:self-start lg:max-h-screen lg:overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 border border-[#E5E3DF]">
            <h3 className="font-bold text-[#132073] mb-4">Informations</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#85868C]">Type</span>
                <span className="font-bold text-[#132073]">Page du site</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#85868C]">Statut</span>
                <span className="text-green-600 font-bold">Publié</span>
              </div>
            </div>
            {slug && (
              <a
                href={`/${slug === 'accueil' ? '' : slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 bg-white border border-[#E5E3DF] text-[#85868C] rounded-lg py-2.5 w-full text-sm flex items-center justify-center gap-2 hover:bg-[#F4F2EE] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Voir la page
              </a>
            )}
          </div>

          <SeoPanel
            metaTitle={metaTitle}
            metaDescription={metaDesc}
            slug={slug === 'accueil' ? '' : slug}
            ogImage={ogImage}
            canonicalUrl={canonicalUrl}
            onMetaTitleChange={setMetaTitle}
            onMetaDescriptionChange={setMetaDesc}
            onSlugChange={() => {}}
            onOgImageChange={setOgImage}
            onCanonicalUrlChange={setCanonicalUrl}
            structuredData={DEFAULT_JSON_LD}
          />
        </div>
      </div>
    </div>
  );
}

function LegalEditor({ html, onChange }: { html: string; onChange: (v: string) => void }) {
  return <TipTapEditor content={html} onChange={onChange} />;
}

interface EditorProps {
  content: Record<string, unknown>;
  updateContent: (path: string, value: unknown) => void;
  getStr: (path: string) => string;
  getArr: <T>(path: string) => T[];
}

function HomepageEditor({ updateContent, getStr, getArr }: EditorProps) {
  return (
    <div className="space-y-6">
      <Section title="Hero">
        <TextField label="Badge" value={getStr('hero.badge')} onChange={(v) => updateContent('hero.badge', v)} />
        <TextField label="Titre ligne 1" value={getStr('hero.title_line1')} onChange={(v) => updateContent('hero.title_line1', v)} />
        <TextField label="Titre surligné" value={getStr('hero.title_highlight')} onChange={(v) => updateContent('hero.title_highlight', v)} />
        <TextField label="Titre ligne 3" value={getStr('hero.title_line3')} onChange={(v) => updateContent('hero.title_line3', v)} />
        <TextField label="Sous-titre" value={getStr('hero.subtitle')} onChange={(v) => updateContent('hero.subtitle', v)} multiline />
        <TextField label="CTA primaire" value={getStr('hero.cta_primary')} onChange={(v) => updateContent('hero.cta_primary', v)} />
        <TextField label="CTA secondaire" value={getStr('hero.cta_secondary')} onChange={(v) => updateContent('hero.cta_secondary', v)} />
        <TextField label="Image de fond (URL)" value={getStr('hero.background_image')} onChange={(v) => updateContent('hero.background_image', v)} />
        <ListField label="Badges" items={getArr<string>('hero.badges')} onChange={(v) => updateContent('hero.badges', v)} placeholder="Texte du badge" />
      </Section>

      <Section title="Statistiques" defaultOpen={false}>
        <ObjectListField
          label="Chiffres clés"
          items={getArr('stats')}
          onChange={(v) => updateContent('stats', v)}
          fields={[
            { key: 'value', label: 'Valeur (nombre)', placeholder: '75' },
            { key: 'suffix', label: 'Suffixe', placeholder: '+' },
            { key: 'label', label: 'Label', placeholder: "Ans d'expérience" },
          ]}
          defaultItem={{ value: 0, suffix: '', label: '' }}
        />
      </Section>

      <Section title="Services" defaultOpen={false}>
        <TextField label="Titre de section" value={getStr('services.sectionTitle')} onChange={(v) => updateContent('services.sectionTitle', v)} />
        <TextField label="Sous-titre" value={getStr('services.sectionSubtitle')} onChange={(v) => updateContent('services.sectionSubtitle', v)} multiline />
        <ObjectListField
          label="Cartes de services"
          items={getArr('services.cards')}
          onChange={(v) => updateContent('services.cards', v)}
          fields={[
            { key: 'title', label: 'Titre', placeholder: 'Déménagements' },
            { key: 'description', label: 'Description', multiline: true },
          ]}
          defaultItem={{ title: '', description: '', items: [] }}
        />
      </Section>

      <Section title="Pourquoi nous" defaultOpen={false}>
        <TextField label="Badge" value={getStr('whyus.badge')} onChange={(v) => updateContent('whyus.badge', v)} />
        <TextField label="Titre" value={getStr('whyus.sectionTitle')} onChange={(v) => updateContent('whyus.sectionTitle', v)} />
        <TextField label="Sous-titre" value={getStr('whyus.sectionSubtitle')} onChange={(v) => updateContent('whyus.sectionSubtitle', v)} multiline />
        <ObjectListField
          label="Avantages"
          items={getArr('whyus.advantages')}
          onChange={(v) => updateContent('whyus.advantages', v)}
          fields={[
            { key: 'num', label: 'Numéro', placeholder: '01' },
            { key: 'title', label: 'Titre' },
            { key: 'text', label: 'Texte', multiline: true },
          ]}
          defaultItem={{ num: '', title: '', text: '' }}
        />
        <ObjectListField
          label="Métriques"
          items={getArr('whyus.metrics')}
          onChange={(v) => updateContent('whyus.metrics', v)}
          fields={[
            { key: 'value', label: 'Valeur', placeholder: '75+' },
            { key: 'label', label: 'Label' },
          ]}
          defaultItem={{ value: '', label: '', featured: false }}
        />
      </Section>

      <Section title="Zones de service" defaultOpen={false}>
        <TextField label="Titre" value={getStr('service_area.title')} onChange={(v) => updateContent('service_area.title', v)} />
        <TextField label="Sous-titre" value={getStr('service_area.subtitle')} onChange={(v) => updateContent('service_area.subtitle', v)} multiline />
        <TextField label="Texte bannière" value={getStr('service_area.banner_text')} onChange={(v) => updateContent('service_area.banner_text', v)} multiline />
        <ObjectListField
          label="Destinations"
          items={getArr('service_area.destinations')}
          onChange={(v) => updateContent('service_area.destinations', v)}
          fields={[
            { key: 'flag', label: 'Drapeau (emoji)', placeholder: '' },
            { key: 'country', label: 'Pays' },
            { key: 'desc', label: 'Description' },
          ]}
          defaultItem={{ flag: '', country: '', desc: '', featured: false }}
        />
      </Section>

      <Section title="FAQ" defaultOpen={false}>
        <ObjectListField
          label="Questions"
          items={getArr('faq')}
          onChange={(v) => updateContent('faq', v)}
          fields={[
            { key: 'q', label: 'Question' },
            { key: 'a', label: 'Réponse', multiline: true },
          ]}
          defaultItem={{ q: '', a: '' }}
        />
      </Section>

      <Section title="Contact (section accueil)" defaultOpen={false}>
        <TextField label="Titre" value={getStr('contact.title')} onChange={(v) => updateContent('contact.title', v)} />
        <TextField label="Sous-titre" value={getStr('contact.subtitle')} onChange={(v) => updateContent('contact.subtitle', v)} />
      </Section>
    </div>
  );
}

function ServiceEditor({ updateContent, getStr, getArr }: EditorProps) {
  return (
    <div className="space-y-6">
      <Section title="Hero">
        <TextField label="Badge" value={getStr('hero.badge')} onChange={(v) => updateContent('hero.badge', v)} />
        <TextField label="Titre" value={getStr('hero.title')} onChange={(v) => updateContent('hero.title', v)} />
        <TextField label="Sous-titre" value={getStr('hero.subtitle')} onChange={(v) => updateContent('hero.subtitle', v)} multiline />
        <ListField label="Garanties" items={getArr<string>('hero.guarantees')} onChange={(v) => updateContent('hero.guarantees', v)} />
        <ObjectListField
          label="Statistiques hero"
          items={getArr('hero.stats')}
          onChange={(v) => updateContent('hero.stats', v)}
          fields={[
            { key: 'value', label: 'Valeur' },
            { key: 'label', label: 'Label' },
          ]}
          defaultItem={{ value: '', label: '' }}
        />
      </Section>

      <Section title="Prestations" defaultOpen={false}>
        <TextField label="Titre de section" value={getStr('prestations.sectionTitle')} onChange={(v) => updateContent('prestations.sectionTitle', v)} />
        <ObjectListField
          label="Prestations"
          items={getArr('prestations.items')}
          onChange={(v) => updateContent('prestations.items', v)}
          fields={[
            { key: 'title', label: 'Titre' },
            { key: 'desc', label: 'Description', multiline: true },
          ]}
          defaultItem={{ title: '', desc: '' }}
        />
      </Section>

      <Section title="Étapes" defaultOpen={false}>
        <TextField label="Titre de section" value={getStr('steps.sectionTitle')} onChange={(v) => updateContent('steps.sectionTitle', v)} />
        <ObjectListField
          label="Étapes"
          items={getArr('steps.items')}
          onChange={(v) => updateContent('steps.items', v)}
          fields={[
            { key: 'title', label: 'Titre' },
            { key: 'desc', label: 'Description', multiline: true },
          ]}
          defaultItem={{ title: '', desc: '' }}
        />
      </Section>

      <Section title="Infos pratiques" defaultOpen={false}>
        <TextField label="Titre de section" value={getStr('info.sectionTitle')} onChange={(v) => updateContent('info.sectionTitle', v)} />
        <ObjectListField
          label="Informations"
          items={getArr('info.items')}
          onChange={(v) => updateContent('info.items', v)}
          fields={[
            { key: 'title', label: 'Titre' },
            { key: 'desc', label: 'Description', multiline: true },
          ]}
          defaultItem={{ title: '', desc: '' }}
        />
      </Section>

      <Section title="Tarifs" defaultOpen={false}>
        <TextField label="Titre de section" value={getStr('pricing.sectionTitle')} onChange={(v) => updateContent('pricing.sectionTitle', v)} />
        <TextField label="Sous-titre" value={getStr('pricing.subtitle')} onChange={(v) => updateContent('pricing.subtitle', v)} multiline />
        <ObjectListField
          label="Grille tarifaire"
          items={getArr('pricing.tiers')}
          onChange={(v) => updateContent('pricing.tiers', v)}
          fields={[
            { key: 'volume', label: 'Volume', placeholder: '1 m3' },
            { key: 'price', label: 'Prix', placeholder: '30' },
            { key: 'unit', label: 'Unite', placeholder: 'par mois' },
          ]}
          defaultItem={{ volume: '', price: '', unit: 'par mois' }}
        />
        <TextField label="Note supplementaire" value={getStr('pricing.extraNote')} onChange={(v) => updateContent('pricing.extraNote', v)} multiline />
        <ListField label="Notes informatives" items={getArr<string>('pricing.notes')} onChange={(v) => updateContent('pricing.notes', v)} placeholder="Note..." />
        <TextField label="Titre assurances" value={getStr('pricing.insurance.title')} onChange={(v) => updateContent('pricing.insurance.title', v)} />
        <ListField label="Details assurances" items={getArr<string>('pricing.insurance.items')} onChange={(v) => updateContent('pricing.insurance.items', v)} placeholder="Detail assurance..." />
      </Section>

      <Section title="Call-to-action" defaultOpen={false}>
        <TextField label="Titre" value={getStr('cta.title')} onChange={(v) => updateContent('cta.title', v)} />
        <TextField label="Sous-titre" value={getStr('cta.subtitle')} onChange={(v) => updateContent('cta.subtitle', v)} multiline />
        <TextField label="Texte du bouton" value={getStr('cta.buttonText')} onChange={(v) => updateContent('cta.buttonText', v)} />
        <TextField label="Telephone" value={getStr('cta.phone')} onChange={(v) => updateContent('cta.phone', v)} />
      </Section>
    </div>
  );
}

function ContactEditor({ updateContent, getStr, getArr }: EditorProps) {
  return (
    <div className="space-y-6">
      <Section title="Hero">
        <TextField label="Badge" value={getStr('hero.badge')} onChange={(v) => updateContent('hero.badge', v)} />
        <TextField label="Titre" value={getStr('hero.title')} onChange={(v) => updateContent('hero.title', v)} />
        <TextField label="Sous-titre" value={getStr('hero.subtitle')} onChange={(v) => updateContent('hero.subtitle', v)} multiline />
      </Section>

      <Section title="Barre latérale" defaultOpen={false}>
        <ListField label="Pourquoi nous choisir" items={getArr<string>('sidebar.whyChooseUs')} onChange={(v) => updateContent('sidebar.whyChooseUs', v)} />
        <TextField label="Titre urgence" value={getStr('sidebar.urgentTitle')} onChange={(v) => updateContent('sidebar.urgentTitle', v)} />
        <TextField label="Sous-titre urgence" value={getStr('sidebar.urgentSubtitle')} onChange={(v) => updateContent('sidebar.urgentSubtitle', v)} />
      </Section>

      <Section title="Processus" defaultOpen={false}>
        <TextField label="Titre de section" value={getStr('process.sectionTitle')} onChange={(v) => updateContent('process.sectionTitle', v)} />
        <ObjectListField
          label="Étapes"
          items={getArr('process.steps')}
          onChange={(v) => updateContent('process.steps', v)}
          fields={[
            { key: 'step', label: 'Numéro', placeholder: '01' },
            { key: 'title', label: 'Titre' },
            { key: 'desc', label: 'Description', multiline: true },
          ]}
          defaultItem={{ step: '', title: '', desc: '' }}
        />
      </Section>

      <Section title="Section visite" defaultOpen={false}>
        <TextField label="Titre" value={getStr('visit.title')} onChange={(v) => updateContent('visit.title', v)} />
        <TextField label="Sous-titre" value={getStr('visit.subtitle')} onChange={(v) => updateContent('visit.subtitle', v)} multiline />
      </Section>
    </div>
  );
}
