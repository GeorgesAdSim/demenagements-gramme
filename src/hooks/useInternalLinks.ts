import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface InternalLink {
  id: string;
  source_slug: string;
  target_slug: string;
  anchor_text: string;
  cocon: string | null;
  created_at: string;
}

export function useInternalLinks(slug: string) {
  const [links, setLinks] = useState<InternalLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchInternalLinks() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('internal_links')
          .select('*')
          .eq('source_slug', slug)
          .order('anchor_text', { ascending: true });

        if (error) throw error;
        setLinks(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchInternalLinks();
    }
  }, [slug]);

  return { links, loading, error };
}
