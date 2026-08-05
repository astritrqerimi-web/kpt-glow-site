/**
 * Rewrites backend storage image URLs to the same-origin `/api/public/img/*`
 * proxy, which adds a one-year immutable cache header (storage itself replies
 * `no-cache`). Pixel-identical bytes — only the transport changes.
 * Non-storage URLs (or anything unexpected) are returned untouched.
 */
const STORAGE_MARKER = "/storage/v1/object/public/site-images/";

export function cachedImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const i = url.indexOf(STORAGE_MARKER);
  if (i === -1) return url;
  const key = url.slice(i + STORAGE_MARKER.length);
  if (!key || key.includes("..")) return url;
  return `/api/public/img/${key}`;
}
