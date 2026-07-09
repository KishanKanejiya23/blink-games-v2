import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Read-only Supabase client for Server Components.
 * Uses the anon key + RLS "public read" policies. Never expose service role here.
 */
export function getSupabase() {
  if (!url || !anon) {
    // Fail soft during local setup so the UI still renders with a clear message.
    return null;
  }
  return createClient(url, anon, {
    auth: { persistSession: false },
  });
}
