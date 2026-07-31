import avif128 from "@/assets/logo/logo-128.avif.asset.json";
import avif192 from "@/assets/logo/logo-192.avif.asset.json";
import avif256 from "@/assets/logo/logo-256.avif.asset.json";
import webp128 from "@/assets/logo/logo-128.webp.asset.json";
import webp192 from "@/assets/logo/logo-192.webp.asset.json";
import webp256 from "@/assets/logo/logo-256.webp.asset.json";
import png256 from "@/assets/logo/logo-256.png.asset.json";

/** Small PNG fallback (32 KB) — replaces the old 1.27 MB source PNG. */
export const LOGO_FALLBACK_URL = png256.url;

export const LOGO_AVIF_SRCSET = [
  `${avif128.url} 128w`,
  `${avif192.url} 192w`,
  `${avif256.url} 256w`,
].join(", ");

export const LOGO_WEBP_SRCSET = [
  `${webp128.url} 128w`,
  `${webp192.url} 192w`,
  `${webp256.url} 256w`,
].join(", ");
