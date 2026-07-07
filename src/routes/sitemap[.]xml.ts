import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://kpt-glow-site.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/lajme", priority: "0.9", changefreq: "daily" },
        ];

        let articleEntries: Array<{ path: string; lastmod?: string; priority: string; changefreq: string }> = [];
        try {
          const url = process.env.SUPABASE_URL;
          const key = process.env.SUPABASE_PUBLISHABLE_KEY;
          if (url && key) {
            const sb = createClient(url, key, {
              auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data } = await (sb as any)
              .from("articles")
              .select("slug, updated_at")
              .order("published_at", { ascending: false })
              .limit(1000);
            articleEntries = (data ?? []).map((r: { slug: string; updated_at: string }) => ({
              path: `/lajme/${r.slug}`,
              lastmod: r.updated_at,
              priority: "0.7",
              changefreq: "weekly",
            }));
          }
        } catch {
          // If DB is unreachable during build/prerender just emit static entries
        }

        const all = [...staticEntries, ...articleEntries];
        const urls = all
          .map((e) =>
            [
              `  <url>`,
              `    <loc>${BASE_URL}${e.path}</loc>`,
              (e as { lastmod?: string }).lastmod ? `    <lastmod>${(e as { lastmod?: string }).lastmod}</lastmod>` : null,
              `    <changefreq>${e.changefreq}</changefreq>`,
              `    <priority>${e.priority}</priority>`,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
