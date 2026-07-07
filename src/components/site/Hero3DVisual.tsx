import { TrendingUp, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import heroAsset from "@/assets/hero-3d-finance.png.asset.json";
import { useI18n } from "@/lib/i18n";

interface Props {
  imageUrl?: string | null;
  alt?: string;
}

/**
 * Hero visual — frameless premium card with soft shadow, rounded corners,
 * floating animation, subtle parallax on mouse-move, and gently drifting badges.
 */
export function Hero3DVisual({ imageUrl, alt }: Props) {
  const { t } = useI18n();
  const src = imageUrl || heroAsset.url;
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      setTilt({ x: px, y: py });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const rotY = tilt.x * 14; // deg — stronger parallax
  const rotX = -tilt.y * 12;
  const tx = tilt.x * 22;
  const ty = tilt.y * 22;
  const lightX = 50 + tilt.x * 60;
  const lightY = 40 + tilt.y * 60;

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto w-full max-w-[46rem] px-4 sm:px-5 lg:max-w-none lg:px-0"
      style={{ perspective: "1400px" }}
    >
      {/* Soft ambient glow behind card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 55%, oklch(0.78 0.18 165 / 0.38), transparent 70%)",
        }}
      />

      {/* Auto-rotating scene wrapper */}
      <div
        className="animate-scene-rotate"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Floating frameless card with parallax + hover pop-out */}
        <div
          className="group relative animate-float-hero rounded-[28px] sm:rounded-[32px] lg:rounded-[36px] overflow-hidden transition-transform duration-500 ease-out hover:scale-[1.04]"
          style={{
            transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) translate3d(${tx}px, ${ty}px, 0)`,
            transformStyle: "preserve-3d",
            boxShadow:
              "0 50px 100px -40px oklch(0.40 0.09 210 / 0.35), 0 22px 50px -20px oklch(0.40 0.09 210 / 0.22), 0 6px 14px -6px oklch(0.40 0.09 210 / 0.12)",
          }}
        >
        <img
          src={src}
          alt={alt || "Vizualizim premium — kontabilitet dhe konsulencë biznesi"}
          width={1536}
          height={1024}
          loading="eager"
          decoding="async"
          className="block h-auto w-full select-none object-contain"
          draggable={false}
          style={{ transform: "translateZ(0)" }}
        />

        {/* Dynamic light reflection */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-screen opacity-70 transition-opacity duration-300"
          style={{
            background: `radial-gradient(45% 40% at ${lightX}% ${lightY}%, oklch(1 0 0 / 0.35), transparent 70%)`,
          }}
        />
        {/* Shine sweep */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 animate-shine-sweep"
          style={{
            background:
              "linear-gradient(115deg, transparent 20%, oklch(1 0 0 / 0.28) 50%, transparent 80%)",
          }}
        />



        {/* Growth badge — top left */}
        <div
          className="absolute left-2 top-2 sm:left-4 sm:top-4 md:left-5 md:top-5 z-10 flex glass-panel rounded-lg sm:rounded-xl md:rounded-2xl px-2 py-1.5 sm:px-2.5 sm:py-2 md:px-4 md:py-3 shadow-elegant items-center gap-1.5 sm:gap-2 md:gap-3 animate-float-hero"
          style={{
            animationDuration: "6s",
            animationDelay: "-2s",
            transform: `translate3d(${tx * -1.6}px, ${ty * -1.6}px, 40px)`,
          }}
        >
          <span
            className="inline-flex h-5 w-5 sm:h-7 sm:w-7 md:h-10 md:w-10 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl text-white shadow-glow"
            style={{ background: "var(--gradient-brand-strong)" }}
          >
            <TrendingUp className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 md:h-5 md:w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.12em] md:tracking-[0.14em] text-muted-foreground">
              {t("hero.stat.growth")}
            </div>
            <div className="font-display text-xs sm:text-sm md:text-lg text-foreground">+34%</div>
          </div>
        </div>

        {/* Compliance badge — bottom right */}
        <div
          className="absolute right-2 bottom-2 sm:right-4 sm:bottom-4 md:right-5 md:bottom-5 z-10 flex glass-panel rounded-lg sm:rounded-xl md:rounded-2xl px-2 py-1.5 sm:px-2.5 sm:py-2 md:px-4 md:py-3 shadow-elegant items-center gap-1.5 sm:gap-2 md:gap-3 animate-float-hero"
          style={{
            animationDuration: "8s",
            animationDelay: "-4s",
            transform: `translate3d(${tx * -1.6}px, ${ty * -1.6}px, 40px)`,
          }}
        >
          <span
            className="inline-flex h-5 w-5 sm:h-7 sm:w-7 md:h-10 md:w-10 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl text-white shadow-glow"
            style={{ background: "var(--gradient-brand-strong)" }}
          >
            <ShieldCheck className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 md:h-5 md:w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.12em] md:tracking-[0.14em] text-muted-foreground">
              {t("hero.stat.compliance")}
            </div>
            <div className="font-display text-xs sm:text-sm md:text-lg text-foreground">100%</div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

