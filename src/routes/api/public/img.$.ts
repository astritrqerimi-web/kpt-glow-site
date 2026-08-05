import { createFileRoute } from "@tanstack/react-router";

/**
 * Same-origin proxy for images stored in the backend "site-images" bucket.
 *
 * Storage serves every object with `cache-control: no-cache`, so browsers and
 * the CDN re-download article covers on every page view. Object paths are
 * content-unique (timestamp + random suffix), so they are safe to cache
 * forever. Serving them from our own origin also removes an extra DNS lookup +
 * TLS handshake on the critical path.
 *
 * Only the project's own storage host is ever fetched (no user-supplied
 * origins), so there is no SSRF surface.
 */
const BUCKET = "site-images";
const ONE_YEAR = "public, max-age=31536000, immutable";

function storageBase(): string {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"] || "";
  return `${url.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/`;
}

export const Route = createFileRoute("/api/public/img/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as { _splat?: string })._splat ?? "";
        // Reject traversal / absolute URLs — only plain bucket keys are allowed.
        if (!path || path.includes("..") || path.includes("://")) {
          return new Response("Bad request", { status: 400 });
        }

        const base = storageBase();
        if (!base.startsWith("https://")) {
          return new Response("Not configured", { status: 500 });
        }

        const upstream = await fetch(base + path.split("/").map(encodeURIComponent).join("/"));
        if (!upstream.ok || !upstream.body) {
          return new Response("Not found", { status: upstream.status === 404 ? 404 : 502 });
        }

        const headers = new Headers();
        headers.set(
          "content-type",
          upstream.headers.get("content-type") ?? "application/octet-stream",
        );
        const len = upstream.headers.get("content-length");
        if (len) headers.set("content-length", len);
        headers.set("cache-control", ONE_YEAR);
        headers.set("x-content-type-options", "nosniff");
        return new Response(upstream.body, { status: 200, headers });
      },
    },
  },
});
