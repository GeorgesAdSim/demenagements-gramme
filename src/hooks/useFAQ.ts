import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { FAQ } from '../lib/supabase';

export function useFAQ(pageSlug?: string) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        setLoading(true);
        let query = supabase.from('faq').select('*').order('ordre');

        if (pageSlug) {
          query = query.eq('page_slug', pageSlug);
        }

        const { data, error } = await query;

        if (error) throw error;
        setFaqs(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchFAQs();
  }, [pageSlug]);

  return { faqs, loading, error };
}
