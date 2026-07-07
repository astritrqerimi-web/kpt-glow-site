import DOMPurify from "isomorphic-dompurify";

/** Sanitize admin-authored HTML for safe rendering (SSR + client). */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target", "rel"],
  });
}
