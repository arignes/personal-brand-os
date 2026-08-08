// Server-only Supabase client. Uses the secret key (bypasses RLS) — never
// import this into client components. Needs SUPABASE_URL + SUPABASE_API_KEY.
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function supabaseConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_API_KEY);
}

export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured()) return null;
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_API_KEY!, {
      auth: { persistSession: false },
    });
  }
  return client;
}
