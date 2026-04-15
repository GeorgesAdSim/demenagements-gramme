import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types Supabase
export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  cocon: 'principal' | 'demenagement' | 'international' | 'garde-meubles' | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  h1: string | null;
  status: 'draft' | 'published';
  ordre: number | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  page_slug: string | null;
  ordre: number | null;
  created_at: string;
}

export interface Service {
  id: string;
  slug: string | null;
  name: string;
  description: string | null;
  icon: string | null;
  ordre: number | null;
  created_at: string;
}

export interface Navigation {
  id: string;
  label: string;
  href: string;
  parent_id: string | null;
  ordre: number | null;
  created_at: string;
}

export interface Config {
  id: string;
  key: string;
  value: any;
  updated_at: string;
}
