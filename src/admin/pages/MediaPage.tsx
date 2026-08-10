import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Copy, Trash2, FileText, Image as ImageIcon, Search, Loader as Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { displayName, formatSize, type LigneMedia } from '../lib/media';

export default function MediaPage() {
  const [media, setMedia] = useState<LigneMedia[]>([]);
  const [filterType, setFilterType] = useState('Tous');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    setLoading(true);
    const { data, error: lectureError } = await supabase
      .from('gramme_media')
      .select('*')
      .order('created_at', { ascending: false });
    if (lectureError) {
      setError(`Impossible de charger la médiathèque : ${lectureError.message}`);
      setMedia([]);
      setLoading(false);
      return;
    }
    setMedia((data as LigneMedia[]) || []);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setError(null);

    // Les échecs sont accumulés puis affichés ensemble, comme dans
    // MediaPickerModal : sur un envoi multiple, un fichier en erreur ne doit
    // pas masquer le sort des autres.
    const echecs: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const storagePath = `uploads/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(storagePath, file);

      if (uploadError) {
        echecs.push(`${file.name} : ${uploadError.message}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(storagePath);

      const { error: insertError } = await supabase.from('gramme_media').insert({
        filename,
        original_name: file.name,
        storage_path: storagePath,
        public_url: publicUrl,
        mime_type: file.type,
        size_bytes: file.size,
        alt_text: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      });

      if (insertError) {
        echecs.push(`${file.name} : ${insertError.message}`);
      }
    }

    setUploading(false);
    await fetchMedia();
    if (echecs.length) {
      setError(
        `${echecs.length} fichier(s) n'ont pas pu être ajoutés à la médiathèque — ${echecs.join(' ; ')}`
      );
    }
    if (fileRef.current) fileRef.current.value = '';
  }

  const handleDelete = async (item: LigneMedia) => {
    if (!window.confirm('Supprimer ce fichier ?')) return;
    setError(null);

    // Le fichier du Storage part en premier, la ligne ensuite. Si la seconde
    // suppression échoue, la vignette reste — c'est volontaire : elle pointe
    // alors vers un fichier absent, et la faire disparaître de l'écran
    // laisserait une ligne morte en base que plus personne ne verrait.
    const { error: storageError } = await supabase.storage
      .from('media')
      .remove([item.filename.includes('/') ? item.filename : `uploads/${item.filename}`]);
    if (storageError) {
      setError(`Suppression du fichier refusée : ${storageError.message}`);
      return;
    }

    const { error: supprError } = await supabase.from('gramme_media').delete().eq('id', item.id);
    if (supprError) {
      setError(`Le fichier a été supprimé du stockage, mais la ligne n'a pas pu être retirée de la médiathèque : ${supprError.message}`);
      return;
    }

    setMedia((prev) => prev.filter((m) => m.id !== item.id));
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const isImage = (mime: string | null | undefined) => !!mime && mime.startsWith('image/');

  const filtered = media.filter((m) => {
    if (filterType === 'Images' && !isImage(m.mime_type)) return false;
    if (filterType === 'Documents' && isImage(m.mime_type)) return false;
    if (search && !displayName(m).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="font-sans">
      <div className="bg-white border-b border-[#E5E3DF] px-4 lg:px-8 py-5 flex items-center justify-between">
        <h1 className="font-black uppercase text-[#132073] text-xl">MÉDIATHÈQUE</h1>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="bg-[#F0B800] text-[#132073] font-bold uppercase rounded-md px-5 py-2 text-sm hover:bg-[#EAB000] transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          UPLOADER
        </button>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={handleUpload} />
      </div>

      {error && (
        <div className="mx-4 lg:mx-8 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-red-700 text-sm font-bold">Erreur</p>
          <p className="text-red-600 text-xs mt-1 break-words">{error}</p>
        </div>
      )}

      <div className="bg-white border-b border-[#E5E3DF] px-4 lg:px-8 py-3 flex flex-wrap gap-4 items-center">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-[#E5E3DF] rounded-lg px-3 py-2 text-sm outline-none"
        >
          <option>Tous</option>
          <option>Images</option>
          <option>Documents</option>
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#85868C]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un fichier..."
            className="w-full border border-[#E5E3DF] rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-[#132073]"
          />
        </div>
      </div>

      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-[#E5E3DF] rounded-2xl p-8 lg:p-12 text-center mx-4 lg:mx-8 mt-6 bg-white cursor-pointer hover:border-[#132073] transition-colors"
      >
        {uploading ? (
          <Loader2 className="w-12 h-12 text-[#132073] mx-auto mb-3 animate-spin" />
        ) : (
          <Upload className="w-12 h-12 text-[#85868C] mx-auto mb-3" />
        )}
        <p className="text-[#333333] text-sm">
          Glissez vos fichiers ici ou{' '}
          <span className="text-[#132073] font-bold underline">parcourir</span>
        </p>
        <p className="text-[#85868C] text-[13px] mt-1">PNG, JPG, PDF jusqu'à 10MB</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#132073]" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-4 lg:mx-8 mt-6 mb-8">
          {filtered.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-xl overflow-hidden border border-[#E5E3DF] group relative"
            >
              <div className="bg-[#F4F2EE] h-32 flex items-center justify-center relative">
                {isImage(m.mime_type) ? (
                  <img
                    src={m.public_url}
                    alt={m.alt_text || displayName(m)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-[#F0B800]/20 w-full h-full flex items-center justify-center">
                    <FileText className="w-10 h-10 text-[#132073]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-[#132073]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopy(m.public_url, m.id); }}
                    className="bg-white rounded-lg p-2 hover:bg-[#F0B800] transition-colors"
                  >
                    <Copy className="w-4 h-4 text-[#132073]" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(m); }}
                    className="bg-white rounded-lg p-2 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-[#132073] text-xs font-bold truncate" title={displayName(m)}>
                  {displayName(m)}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[#85868C] text-[11px]">{formatSize(m.size_bytes || 0)}</span>
                  {isImage(m.mime_type) ? (
                    <ImageIcon className="w-3 h-3 text-[#85868C]" />
                  ) : (
                    <FileText className="w-3 h-3 text-[#85868C]" />
                  )}
                </div>
                {copied === m.id && (
                  <span className="text-green-600 text-[11px] block mt-1">URL copiée !</span>
                )}
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && !loading && (
            <div className="col-span-full py-16 text-center text-[#85868C]">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Aucun fichier</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
