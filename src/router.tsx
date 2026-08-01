import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Data fetched during SSR is dehydrated into the HTML and reused on the
        // client, so the first client render paints identical markup (no CLS,
        // no hydration suspense fallback).
        staleTime: 60_000,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Prefetch the next page's code + data as soon as the user shows intent
    // (hover/touchstart on a link) — makes in-site navigation feel instant.
    defaultPreload: "intent",
    defaultPreloadDelay: 50,
    defaultPreloadStaleTime: 30_000,
  });

  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
};
