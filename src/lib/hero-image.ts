import heroPng from "@/assets/hero-3d-finance.png.asset.json";
import avif768 from "@/assets/hero/hero-768.avif.asset.json";
import avif1024 from "@/assets/hero/hero-1024.avif.asset.json";
import avif1536 from "@/assets/hero/hero-1536.avif.asset.json";
import webp768 from "@/assets/hero/hero-768.webp.asset.json";
import webp1024 from "@/assets/hero/hero-1024.webp.asset.json";
import webp1536 from "@/assets/hero/hero-1536.webp.asset.json";

/** Original (unoptimized) default hero URL, still used as the ultimate fallback. */
export const DEFAULT_HERO_URL = heroPng.url;

export const HERO_SIZES = "(max-width: 640px) 92vw, (max-width: 1024px) 55vw, 640px";

export const HERO_AVIF_SRCSET = [
  `${avif768.url} 768w`,
  `${avif1024.url} 1024w`,
  `${avif1536.url} 1536w`,
].join(", ");

export const HERO_WEBP_SRCSET = [
  `${webp768.url} 768w`,
  `${webp1024.url} 1024w`,
  `${webp1536.url} 1536w`,
].join(", ");

/** Smallest modern variant — good preload/LCP candidate for mobile. */
export const HERO_PRELOAD_HREF = avif1024.url;

/** Only the bundled default hero has pre-generated AVIF/WebP variants. */
export function isDefaultHero(url?: string | null) {
  return !url || url === DEFAULT_HERO_URL;
}
