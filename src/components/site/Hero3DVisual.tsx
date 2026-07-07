import { useEffect, useRef, useState } from "react";
import { TrendingUp, ShieldCheck } from "lucide-react";
import heroAsset from "@/assets/hero-3d-finance.png.asset.json";
import { useI18n } from "@/lib/i18n";

interface Props {
  imageUrl?: string | null;
  alt?: string;
}

/**
 * Premium 3D hero visual:
 *  - slow auto-rotation
 *  - mouse-parallax tilt (perspective transform on layers)
 *  - floating orbs/cards
 *  - dynamic light reflection that follows the pointer
 *  - hover pop-out effect
 */
export function Hero3DVisual({ imageUrl, alt }: Props) {
  const { t } = useI18n();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, lx: 50, ly: 50, active: false });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * 14; // rotateX max ±7deg
      const ry = (px - 0.5) * 18; // rotateY max ±9deg
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setTilt({ x: rx, y: ry, lx: px * 100, ly: py * 100, active: true }),
      );
    };
    const onLeave = () =>
      setTilt({ x: 0, y: 0, lx: 50, ly: 50, active: false });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const src = imageUrl || heroAsset.url;

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto w-full max-w-[42rem] lg:max-w-none"
      style={{ perspective: "1400px" }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-80"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, oklch(0.78 0.18 165 / 0.55), transparent 70%)",
        }}
      />

      {/* 3D scene wrapper — auto rotation + mouse tilt */}
      <div
        className="relative animate-scene-rotate"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: tilt.active
            ? "transform 120ms ease-out"
            : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      >
        {/* Image card — transparent, rounded corners belong to the image */}
        <div
          className="group relative overflow-hidden rounded-[1.75rem] sm:rounded-[2.25rem] lg:rounded-[2.5rem] shadow-elegant animate-float-hero transition-transform duration-500 hover:scale-[1.04]"
          style={{ transformStyle: "preserve-3d", background: "transparent" }}
        >
          <img
            src={src}
            alt={alt || "Vizualizim premium 3D — kontabilitet dhe konsulencë biznesi"}
            width={1536}
            height={1024}
            loading="eager"
            decoding="async"
            className="block h-auto w-full select-none rounded-[1.75rem] sm:rounded-[2.25rem] lg:rounded-[2.5rem]"
            style={{
              transform: "translateZ(40px)",
              imageRendering: "auto",
            }}
            draggable={false}
          />

          {/* Dynamic light reflection following pointer */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-500"
            style={{
              opacity: tilt.active ? 0.9 : 0.55,
              background: `radial-gradient(circle at ${tilt.lx}% ${tilt.ly}%, rgba(255,255,255,0.55), rgba(255,255,255,0.08) 30%, transparent 55%)`,
            }}
          />

          {/* Soft top/bottom sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 28%, transparent 72%, rgba(255,255,255,0.10) 100%)",
            }}
          />

          {/* Animated shine sweep */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 animate-shine-sweep"
            style={{
              background:
                "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
            }}
          />
        </div>

        {/* Floating glass stat cards (shown on all breakpoints) */}
        <div
          className="absolute -left-2 sm:-left-4 top-4 sm:top-8 flex glass-panel rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-elegant items-center gap-2 sm:gap-3 animate-float-hero"
          style={{ transform: "translateZ(90px)", animationDelay: "1s" }}
        >
          <span
            className="inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl text-white shadow-glow"
            style={{ background: "var(--gradient-brand-strong)" }}
          >
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {t("hero.stat.growth")}
            </div>
            <div className="font-display text-base sm:text-lg text-foreground">+34%</div>
          </div>
        </div>

        <div
          className="absolute -right-2 sm:-right-4 bottom-4 sm:bottom-8 flex glass-panel rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-elegant items-center gap-2 sm:gap-3 animate-float-hero"
          style={{ transform: "translateZ(110px)", animationDelay: "2.5s" }}
        >
          <span
            className="inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl text-white shadow-glow"
            style={{ background: "var(--gradient-brand-strong)" }}
          >
            <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {t("hero.stat.compliance")}
            </div>
            <div className="font-display text-base sm:text-lg text-foreground">100%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
