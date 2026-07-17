interface SeoPanelProps {
  metaTitle: string;
  metaDescription: string;
  slug: string;
  ogImage: string;
  canonicalUrl: string;
  onMetaTitleChange: (v: string) => void;
  onMetaDescriptionChange: (v: string) => void;
  onSlugChange: (v: string) => void;
  onOgImageChange: (v: string) => void;
  onCanonicalUrlChange: (v: string) => void;
  structuredData: string;
}

export default function SeoPanel({
  metaTitle,
  metaDescription,
  slug,
  ogImage,
  canonicalUrl,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onSlugChange,
  onOgImageChange,
  onCanonicalUrlChange,
  structuredData,
}: SeoPanelProps) {
  const metaTitleLen = metaTitle.length;
  const metaDescLen = metaDescription.length;
  const titleColor = metaTitleLen > 60 ? 'text-red-500' : metaTitleLen > 55 ? 'text-orange-500' : 'text-green-600';
  const descColor = metaDescLen > 160 ? 'text-red-500' : metaDescLen > 140 ? 'text-orange-500' : 'text-green-600';

  const titleScore = metaTitleLen >= 30 && metaTitleLen <= 60 ? 100 : metaTitleLen > 0 ? 50 : 0;
  const descScore = metaDescLen >= 80 && metaDescLen <= 160 ? 100 : metaDescLen > 0 ? 50 : 0;
  const slugScore = slug.length > 0 ? 100 : 0;
  const overallScore = Math.round((titleScore + descScore + slugScore) / 3);
  const scoreColor = overallScore >= 80 ? 'text-green-600 bg-green-100' : overallScore >= 50 ? 'text-orange-600 bg-orange-100' : 'text-red-600 bg-red-100';

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E3DF]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#132073]">SEO</h3>
        <span className={`${scoreColor} rounded-full px-3 py-1 text-xs font-bold`}>
          {overallScore}%
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[13px] font-bold text-[#132073] mb-1">Meta title</label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => onMetaTitleChange(e.target.value)}
            className="w-full border border-[#E5E3DF] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#132073]"
            placeholder="Titre SEO de la page"
          />
          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs ${titleColor}`}>{metaTitleLen}/60</span>
            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${metaTitleLen > 60 ? 'bg-red-500' : metaTitleLen > 55 ? 'bg-orange-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(100, (metaTitleLen / 60) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-[#132073] mb-1">Meta description</label>
          <textarea
            rows={3}
            value={metaDescription}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            className="w-full border border-[#E5E3DF] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#132073] resize-none"
            placeholder="Description pour les moteurs de recherche"
          />
          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs ${descColor}`}>{metaDescLen}/160</span>
            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${metaDescLen > 160 ? 'bg-red-500' : metaDescLen > 140 ? 'bg-orange-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(100, (metaDescLen / 160) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-[#132073] mb-1">Slug canonique</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            className="w-full border border-[#E5E3DF] rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-[#132073]"
          />
        </div>

        <div>
          <label className="block text-[13px] font-bold text-[#132073] mb-1">URL canonique</label>
          <input
            type="text"
            value={canonicalUrl}
            onChange={(e) => onCanonicalUrlChange(e.target.value)}
            placeholder="https://demenagements-gramme.be/..."
            className="w-full border border-[#E5E3DF] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#132073]"
          />
        </div>

        <div>
          <label className="block text-[13px] font-bold text-[#132073] mb-1">Image OG</label>
          <input
            type="text"
            value={ogImage}
            onChange={(e) => onOgImageChange(e.target.value)}
            placeholder="URL de l'image pour les réseaux sociaux"
            className="w-full border border-[#E5E3DF] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#132073]"
          />
        </div>
      </div>

      <div className="bg-[#F9F9F9] rounded-xl p-4 border border-[#E5E3DF] mt-4">
        <span className="text-[#85868C] text-[11px] uppercase tracking-widest block mb-3">Aperçu Google</span>
        <p className="text-green-700 text-[13px]">demenagements-gramme.be &rsaquo; {slug || 'slug'}</p>
        <p className="text-blue-700 text-lg underline truncate">{metaTitle || 'Titre de la page'}</p>
        <p className="text-[#85868C] text-sm line-clamp-2">{metaDescription || 'Description de la page...'}</p>
      </div>

      <div className="mt-4">
        <label className="block text-[13px] font-bold text-[#132073] mb-1">JSON-LD</label>
        <textarea
          rows={6}
          value={structuredData}
          readOnly
          className="w-full bg-[#F4F2EE] font-mono text-xs rounded-lg p-3 border border-[#E5E3DF] resize-none"
        />
      </div>
    </div>
  );
}
