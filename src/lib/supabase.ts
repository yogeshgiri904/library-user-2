import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // App still renders a beautiful setup screen; console error helps developers.
  console.warn('Missing Supabase env vars. Copy .env.example to .env.local and fill values.');
}

export const supabase = createClient(supabaseUrl || 'https://example.supabase.co', supabaseAnonKey || 'missing-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export function libraryIdToAuthEmail(libraryId: string) {
  return `${libraryId.trim().toLowerCase()}@bhaiyaji.local`;
}
