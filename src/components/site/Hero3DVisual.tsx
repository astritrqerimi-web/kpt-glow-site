import { TrendingUp, ShieldCheck } from "lucide-react";
import heroAsset from "@/assets/hero-3d-finance.png.asset.json";
import { useI18n } from "@/lib/i18n";

interface Props {
  imageUrl?: string | null;
  alt?: string;
}

/**
 * Hero visual — static card matching the "Ekspertizë Profesionale" trust card
 * (rounded, border, glass background, soft shadow). No auto-rotate, no parallax,
 * no floating animation on the image itself.
 */
export function Hero3DVisual({ imageUrl, alt }: Props) {
  const { t } = useI18n();
  const src = imageUrl || heroAsset.url;

  return (
    <div className="relative mx-auto w-full max-w-[42rem] px-4 sm:px-5 lg:max-w-none lg:px-0">
      {/* Soft ambient glow behind card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-50"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, oklch(0.78 0.18 165 / 0.35), transparent 70%)",
        }}
      />

      {/* Static card — mirrors TrustCards styling */}
      <div className="group relative overflow-hidden rounded-3xl border border-border/60 bg-background/75 backdrop-blur-xl p-4 sm:p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-hover hover:border-primary/40">
        <div
          aria-hidden
          className="absolute inset-x-0 -top-px h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "var(--gradient-brand-strong)" }}
        />

        <img
          src={src}
          alt={alt || "Vizualizim premium — kontabilitet dhe konsulencë biznesi"}
          width={1536}
          height={1024}
          loading="eager"
          decoding="async"
          className="block h-auto w-full max-w-full select-none rounded-2xl"
          style={{ objectFit: "contain" }}
          draggable={false}
        />

        {/* Floating glass stat badges — small on mobile, standard on desktop */}
        <div
          className="absolute left-6 top-6 sm:left-8 sm:top-8 md:-left-3 md:-top-3 z-10 flex glass-panel rounded-xl md:rounded-2xl px-2.5 py-2 md:px-4 md:py-3 shadow-soft md:shadow-elegant items-center gap-2 md:gap-3"
        >
          <span
            className="inline-flex h-7 w-7 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl text-white shadow-glow"
            style={{ background: "var(--gradient-brand-strong)" }}
          >
            <TrendingUp className="h-3.5 w-3.5 md:h-5 md:w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.12em] md:tracking-[0.14em] text-muted-foreground">
              {t("hero.stat.growth")}
            </div>
            <div className="font-display text-sm md:text-lg text-foreground">+34%</div>
          </div>
        </div>

        <div
          className="absolute right-6 bottom-6 sm:right-8 sm:bottom-8 md:-right-3 md:-bottom-3 z-10 flex glass-panel rounded-xl md:rounded-2xl px-2.5 py-2 md:px-4 md:py-3 shadow-soft md:shadow-elegant items-center gap-2 md:gap-3"
        >
          <span
            className="inline-flex h-7 w-7 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl text-white shadow-glow"
            style={{ background: "var(--gradient-brand-strong)" }}
          >
            <ShieldCheck className="h-3.5 w-3.5 md:h-5 md:w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.12em] md:tracking-[0.14em] text-muted-foreground">
              {t("hero.stat.compliance")}
            </div>
            <div className="font-display text-sm md:text-lg text-foreground">100%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
