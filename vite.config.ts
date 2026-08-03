// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          // Keep the backend SDK (and the heavy editor deps) in their own
          // chunks instead of letting them be hoisted into the entry chunk —
          // they are only imported dynamically, so public pages never load them.
          advancedChunks: {
            groups: [
              // React must win over the groups below, otherwise it gets pulled
              // into the tiptap chunk and every public page downloads the editor.
              {
                name: "react",
                priority: 100,
                test: /node_modules[\\/](react|react-dom|scheduler|use-sync-external-store)[\\/]/,
              },
              { name: "supabase", priority: 10, test: /node_modules[\\/](@supabase)[\\/]/ },
              { name: "editor", priority: 10, test: /node_modules[\\/](@tiptap|prosemirror-[^\\/]+)[\\/]/ },
            ],
          },
        },
      },
    },
  },
});
