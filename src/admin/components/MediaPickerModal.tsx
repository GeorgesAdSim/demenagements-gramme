import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Search, Image as ImageIcon, Loader as Loader2, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { displayName, formatSize, type LigneMedia } from '../lib/media';

interface Props {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function MediaPickerModal({ onSelect, onClose }: Props) {
  const [media, setMedia] = useState<LigneMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('gramme_media')
      .select('*')
      .like('mime_type', 'image/%')
      .order('created_at', { ascending: false });
    if (fetchError) {
      setError(`Impossible de charger la médiathèque : ${fetchError.message}`);
      setMedia([]);
    } else {
      setMedia(data || []);
    }
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setError(null);

    const failures: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const storagePath = `uploads/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(storagePath, file);

      if (uploadError) {
        failures.push(`${file.name} : ${uploadError.message}`);
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
        failures.push(`${file.name} : ${insertError.message}`);
      }
    }

    setUploading(false);
    await fetchMedia();
    if (failures.length) {
      setError(
        `${failures.length} fichier(s) n'ont pas pu être ajoutés à la médiathèque — ${failures.join(' ; ')}`
      );
    }
    if (fileRef.current) fileRef.current.value = '';
  }

  const filtered = media.filter(
    (m) => !search || displayName(m).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E3DF]">
            <h2 className="font-black uppercase text-[#132073] text-lg">
              Choisir une image
            </h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-[#85868C]" />
            </button>
          </div>

          <div className="px-6 py-3 border-b border-[#E5E3DF] flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#85868C]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full border border-[#E5E3DF] rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-[#132073]"
              />
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="bg-[#F0B800] text-[#132073] font-bold rounded-lg px-4 py-2 text-sm hover:bg-[#EAB000] transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Uploader
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </div>

          {error && (
            <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-red-700 text-sm font-bold">Erreur</p>
              <p className="text-red-600 text-xs mt-1 break-words">{error}</p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-[#132073]" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-[#85868C]">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Aucune image trouvée</p>
                <p className="text-xs mt-1">Uploadez des images pour les insérer dans vos pages</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {filtered.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelected(m.public_url)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-square ${
                      selected === m.public_url ? 'border-[#F0B800] ring-2 ring-[#F0B800]/30' : 'border-[#E5E3DF] hover:border-[#132073]'
                    }`}
                  >
                    <img
                      src={m.public_url}
                      alt={m.alt_text || displayName(m)}
                      className="w-full h-full object-cover"
                    />
                    {selected === m.public_url && (
                      <div className="absolute top-2 right-2 bg-[#F0B800] rounded-full p-1">
                        <Check className="w-3 h-3 text-[#132073]" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-[10px] truncate" title={displayName(m)}>
                        {displayName(m)}
                      </p>
                      <p className="text-white/60 text-[9px]">{formatSize(m.size_bytes || 0)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-[#E5E3DF] flex justify-end gap-3">
            <button
              onClick={onClose}
              className="border border-[#E5E3DF] text-[#85868C] font-bold rounded-lg px-6 py-2.5 text-sm hover:bg-[#F4F2EE] transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => selected && onSelect(selected)}
              disabled={!selected}
              className="bg-[#132073] text-[#F0B800] font-bold rounded-lg px-6 py-2.5 text-sm hover:bg-[#0D1B5E] transition-colors disabled:opacity-40"
            >
              Insérer l'image
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
