import { FilterXSS } from "xss";

/**
 * Pure-JS sanitizer (no DOM / jsdom) so the exact same output is produced in the
 * browser, during SSR in the Cloudflare Worker, and at build time. The previous
 * jsdom-backed implementation threw inside the Worker, which aborted the SSR
 * Suspense boundary and forced the whole page to render client-side.
 */
const filter = new FilterXSS({
  whiteList: {
    a: ["href", "title", "target", "rel"],
    b: [],
    blockquote: ["cite"],
    br: [],
    code: [],
    div: [],
    em: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    hr: [],
    i: [],
    img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
    li: [],
    ol: ["start"],
    p: [],
    pre: [],
    s: [],
    span: [],
    strong: [],
    sub: [],
    sup: [],
    table: [],
    tbody: [],
    td: ["colspan", "rowspan"],
    th: ["colspan", "rowspan"],
    thead: [],
    tr: [],
    u: [],
    ul: [],
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script", "style"],
});

/** Sanitize admin-authored HTML for safe rendering (SSR + client). */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return filter.process(html);
}
