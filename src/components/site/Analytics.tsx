import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { trackPageView } from "@/lib/analytics";

/** Sends a GA4 page_view on every SPA route change (initial view included, exactly once). */
export function Analytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.searchStr });
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const full = `${pathname}${search ? `?${search.replace(/^\?/, "")}` : ""}`;
    if (lastPath.current === full) return;
    lastPath.current = full;
    trackPageView(full);
  }, [pathname, search]);

  return null;
}
