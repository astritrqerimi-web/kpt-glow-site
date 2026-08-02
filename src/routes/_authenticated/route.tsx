import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSupabase } from "@/lib/supabase-lazy";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: () => <Outlet />,
});
