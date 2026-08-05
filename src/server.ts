import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/**
 * Public marketing pages are identical for every visitor, so their SSR output is
 * safe to hold at the edge. The browser still revalidates on every navigation
 * (`max-age=0, must-revalidate`), while the CDN serves a warm copy for a minute
 * and keeps serving it while it refreshes in the background. This removes the
 * full backend round trip from the critical path of a cold page load.
 */
const CACHEABLE_PATHS = /^\/(?:$|lajme(?:\/|$)|rreth-nesh$|sherbimet$|kontakt$)/;
const HTML_CACHE_CONTROL =
  "public, max-age=0, must-revalidate, s-maxage=60, stale-while-revalidate=86400";

function isPubliclyCacheable(request: Request): boolean {
  if (request.method !== "GET") return false;
  if (request.headers.get("authorization")) return false;
  const cookie = request.headers.get("cookie") ?? "";
  // Any signed-in visitor (admin) always gets a freshly rendered page.
  if (cookie.includes("sb-") || cookie.includes("supabase")) return false;
  const { pathname, search } = new URL(request.url);
  if (search) return false;
  return CACHEABLE_PATHS.test(pathname);
}

function isHtmlResponse(response: Response): boolean {
  return (response.headers.get("content-type") ?? "").includes("text/html");
}

type EdgeCache = {
  match: (request: Request) => Promise<Response | undefined>;
  put: (request: Request, response: Response) => Promise<void>;
};

function getEdgeCache(): EdgeCache | null {
  const c = (globalThis as { caches?: { default?: EdgeCache } }).caches;
  return c?.default ?? null;
}

function waitUntil(ctx: unknown, promise: Promise<unknown>) {
  const maybe = ctx as { waitUntil?: (p: Promise<unknown>) => void } | undefined;
  if (maybe?.waitUntil) maybe.waitUntil(promise);
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const cacheable = isPubliclyCacheable(request);
      const cache = cacheable ? getEdgeCache() : null;

      if (cache) {
        try {
          const hit = await cache.match(request);
          if (hit) return hit;
        } catch {
          // Cache API unavailable in this runtime — fall through to a live render.
        }
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);

      if (
        cacheable &&
        normalized.status === 200 &&
        isHtmlResponse(normalized) &&
        !normalized.headers.has("set-cookie")
      ) {
        const headers = new Headers(normalized.headers);
        headers.set("cache-control", HTML_CACHE_CONTROL);
        const withCaching = new Response(normalized.body, {
          status: normalized.status,
          statusText: normalized.statusText,
          headers,
        });
        if (cache) {
          try {
            waitUntil(ctx, cache.put(request, withCaching.clone()));
          } catch {
            // Non-fatal: the response is still served normally.
          }
        }
        return withCaching;
      }

      return normalized;
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};

