import { createClient } from "@supabase/supabase-js";

/*
 * Single Supabase client for the whole app.
 *
 * Set these in `.env.local` (see `.env.example`):
 *   VITE_SUPABASE_URL=https://your-project.supabase.co
 *   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
