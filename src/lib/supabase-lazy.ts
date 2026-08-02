import type { supabase as SupabaseClient } from "@/integrations/supabase/client";

/**
 * Loads the backend client on demand. Public pages get their data dehydrated
 * from SSR, so the client bundle no longer needs the ~200 kB client upfront —
 * it is only fetched when a real request (refetch, mutation, auth) happens.
 */
export async function getSupabase(): Promise<typeof SupabaseClient> {
  const mod = await import("@/integrations/supabase/client");
  return mod.supabase;
}
