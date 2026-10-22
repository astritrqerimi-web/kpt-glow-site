// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [{
      name: "email-server-environment",
      config(_config, { mode }) {
        // Server variables stay in process.env, never in browser defines.
        Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
      },
    }],
    resolve: {
      alias: {
        "entities/lib/decode.js": fileURLToPath(new URL("./node_modules/entities/lib/decode.js", import.meta.url)),
        "entities/lib/encode.js": fileURLToPath(new URL("./node_modules/entities/lib/encode.js", import.meta.url)),
        entities: fileURLToPath(new URL("./node_modules/entities", import.meta.url)),
      },
    },
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
              // Vite's __vitePreload helper is used by every dynamic import. If
              // it is placed inside a vendor chunk, the entry statically imports
              // that chunk and each page modulepreloads it.
              {
                name: "preload-helper",
                priority: 200,
                test: /preload-helper/,
              },
              // tslib is shared between the backend SDK and other vendors. If it
              // lands inside the supabase chunk, the entry chunk statically
              // imports that 200KB chunk and every public page modulepreloads it.
              {
                name: "tslib",
                priority: 100,
                test: /node_modules[\\/]tslib[\\/]/,
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
