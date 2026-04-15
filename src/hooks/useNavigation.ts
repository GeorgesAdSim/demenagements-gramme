import { useEffect, useState } from 'react';
import { supabase, Navigation } from '../lib/supabase';

export function useNavigation() {
  const [navigation, setNavigation] = useState<Navigation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchNavigation() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('navigation')
          .select('*')
          .order('ordre');

        if (error) throw error;
        setNavigation(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchNavigation();
  }, []);

  return { navigation, loading, error };
}
