import { createMiddleware } from "@tanstack/react-start";

import { getSupabase } from "@/lib/supabase-lazy";

/**
 * Same behaviour as the generated `attachSupabaseAuth`, but the auth client is
 * imported dynamically so it stays out of the critical client bundle. It is
 * only fetched when a server function is actually called.
 */
export const attachSupabaseAuthLazy = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const supabase = await getSupabase();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);
