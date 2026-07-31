import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { loadGtag, trackPageView } from "@/lib/analytics";

/** Sends a GA4 page_view on every SPA route change (initial view included, exactly once). */
export function Analytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.searchStr });
  const lastPath = useRef<string | null>(null);

  // Load the GA script once the browser is idle so it never blocks first paint.
  useEffect(() => {
    const idle =
      window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2000));
    const id = idle(() => loadGtag());
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
      else window.clearTimeout(id as number);
    };
  }, []);

  useEffect(() => {
    const full = `${pathname}${search ? `?${search.replace(/^\?/, "")}` : ""}`;
    if (lastPath.current === full) return;
    lastPath.current = full;
    trackPageView(full);
  }, [pathname, search]);

  return null;
}
