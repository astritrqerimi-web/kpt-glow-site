/**
 * Loads the backend client on demand. Public pages get their data dehydrated
 * from SSR, so the client bundle no longer needs the auth/postgrest client
 * upfront — it is only fetched when a real request (refetch, mutation, auth)
 * happens.
 */
export async function getSupabase() {
  const mod = await import("@/integrations/supabase/client");
  return mod.supabase;
}
