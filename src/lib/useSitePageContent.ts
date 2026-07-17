import { useState, useEffect } from 'react';
import { supabase } from './supabase';

interface SitePageRow {
  content: unknown;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
}

interface SitePageResult<T> {
  content: T | null;
  meta: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    ogImage: string;
  } | null;
  loading: boolean;
}

const cache = new Map<string, SitePageRow>();

export function clearSitePageCache(slug?: string) {
  if (slug) {
    cache.delete(slug);
  } else {
    cache.clear();
  }
}

export function useSitePageContent<T = Record<string, unknown>>(slug: string): SitePageResult<T> {
  const [data, setData] = useState<SitePageRow | null>(cache.get(slug) || null);
  const [loading, setLoading] = useState(!cache.has(slug));

  useEffect(() => {
    if (cache.has(slug)) {
      setData(cache.get(slug)!);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchPage() {
      const { data: row } = await supabase
        .from('pages')
        .select('content, meta_title, meta_description, canonical_url, og_image')
        .eq('slug', slug)
        .eq('page_type', 'site')
        .eq('status', 'published')
        .maybeSingle();

      if (cancelled) return;

      if (row) {
        cache.set(slug, row);
        setData(row);
      }
      setLoading(false);
    }

    fetchPage();
    return () => { cancelled = true; };
  }, [slug]);

  if (!data) {
    return { content: null, meta: null, loading };
  }

  // Le contenu peut être du HTML (autre app) ou du JSON valide.
  // On ne retourne un objet que si le parsing JSON réussit.
  let parsed: T | null = null;
  if (data.content) {
    if (typeof data.content === 'object') {
      parsed = data.content as T;
    } else if (typeof data.content === 'string') {
      try { parsed = JSON.parse(data.content) as T; } catch { parsed = null; }
    }
  }

  return {
    content: parsed,
    meta: {
      metaTitle: data.meta_title || '',
      metaDescription: data.meta_description || '',
      canonicalUrl: data.canonical_url || '',
      ogImage: data.og_image || '',
    },
    loading,
  };
}
