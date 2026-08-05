import { FilterXSS } from "xss";

/**
 * Pure-JS sanitizer (no DOM / jsdom) so the exact same output is produced in the
 * browser, during SSR in the Cloudflare Worker, and at build time. The previous
 * jsdom-backed implementation threw inside the Worker, which aborted the SSR
 * Suspense boundary and forced the whole page to render client-side.
 */
const COMMON = ["style", "class"];

const filter = new FilterXSS({
  whiteList: {
    a: ["href", "title", "target", "rel", ...COMMON],
    b: COMMON,
    blockquote: ["cite", ...COMMON],
    br: [],
    code: COMMON,
    div: COMMON,
    em: COMMON,
    h1: COMMON,
    h2: COMMON,
    h3: COMMON,
    h4: COMMON,
    h5: COMMON,
    h6: COMMON,
    hr: COMMON,
    i: COMMON,
    img: ["src", "alt", "title", "width", "height", "loading", "decoding", ...COMMON],
    li: COMMON,
    ol: ["start", ...COMMON],
    p: COMMON,
    pre: COMMON,
    s: COMMON,
    span: COMMON,
    strong: COMMON,
    sub: COMMON,
    sup: COMMON,
    table: COMMON,
    tbody: COMMON,
    td: ["colspan", "rowspan", ...COMMON],
    th: ["colspan", "rowspan", ...COMMON],
    thead: COMMON,
    tr: COMMON,
    u: COMMON,
    ul: COMMON,
  },
  css: {
    whiteList: {
      color: true,
      "background-color": true,
      "font-family": true,
      "font-size": true,
      "font-weight": true,
      "font-style": true,
      "text-align": true,
      "text-decoration": true,
      "line-height": true,
      "letter-spacing": true,
    },
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script", "style"],
});


/** Sanitize admin-authored HTML for safe rendering (SSR + client). */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return filter.process(html);
}
