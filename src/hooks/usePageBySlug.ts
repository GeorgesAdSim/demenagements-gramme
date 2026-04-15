import { useEffect, useState } from 'react';
import { supabase, Page } from '../lib/supabase';

export function usePageBySlug(slug: string) {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPage() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setPage(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  return { page, loading, error };
}
