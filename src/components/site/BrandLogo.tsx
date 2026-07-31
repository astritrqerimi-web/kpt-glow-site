import { LOGO_AVIF_SRCSET, LOGO_WEBP_SRCSET, LOGO_FALLBACK_URL } from "@/lib/logo-image";

interface Props {
  alt: string;
  className?: string;
  /** CSS pixel size of the rendered box, used for `sizes`. */
  sizes?: string;
  eager?: boolean;
}

/**
 * Responsive KPT logo mark. Serves AVIF/WebP at 128/192/256w with a small
 * PNG fallback — visually identical to the original artwork.
 */
export function BrandLogo({ alt, className, sizes = "64px", eager }: Props) {
  return (
    <picture>
      <source type="image/avif" srcSet={LOGO_AVIF_SRCSET} sizes={sizes} />
      <source type="image/webp" srcSet={LOGO_WEBP_SRCSET} sizes={sizes} />
      <img
        src={LOGO_FALLBACK_URL}
        alt={alt}
        width={256}
        height={187}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        {...(eager ? { fetchPriority: "high" as const } : {})}
        className={className}
      />
    </picture>
  );
}
