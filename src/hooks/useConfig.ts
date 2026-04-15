import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Config } from '../lib/supabase';

export function useConfig(key?: string) {
  const [config, setConfig] = useState<Config | Config[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true);

        if (key) {
          const { data, error } = await supabase
            .from('config')
            .select('*')
            .eq('key', key)
            .single();

          if (error) throw error;
          setConfig(data);
        } else {
          const { data, error } = await supabase
            .from('config')
            .select('*');

          if (error) throw error;
          setConfig(data || []);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, [key]);

  return { config, loading, error };
}
