import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Cliente de Supabase. Si no hay variables, devuelve un cliente "placeholder" para que la app arranque sin BD. */
export function createClient(): SupabaseClient {
  const url = supabaseUrl || "https://placeholder.supabase.co";
  const key = supabaseAnonKey || "placeholder";
  return createSupabaseClient(url, key);
}

/** true si Supabase está configurado con valores reales (no placeholder). */
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "https://placeholder.supabase.co");
}
