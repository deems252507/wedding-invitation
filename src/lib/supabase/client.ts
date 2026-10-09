import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anon && url.startsWith("http"));
}

let browserClient: SupabaseClient | null = null;

/** Browser client (anon key). Safe for public read + admin with RLS policies. */
export function createClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env",
    );
  }
  if (!browserClient) {
    browserClient = createSupabaseClient(url!, anon!);
  }
  return browserClient;
}
