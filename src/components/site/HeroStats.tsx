import { Users, LineChart, ShieldCheck, Headphones } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Stat {
  icon: LucideIcon;
  value: string;
  labelAl: string;
  labelEn: string;
}

const STATS: Stat[] = [
  { icon: Users, value: "50+", labelAl: "Klientë të kënaqur", labelEn: "Happy clients" },
  { icon: LineChart, value: "10+", labelAl: "Vite përvojë", labelEn: "Years of experience" },
  { icon: ShieldCheck, value: "100%", labelAl: "Përputhshmëri ligjore", labelEn: "Legal compliance" },
  { icon: Headphones, value: "24/7", labelAl: "Mbështetje & Këshillim", labelEn: "Support & Advisory" },
];

function StatItem({ item, lang }: { item: Stat; lang: string }) {
  const Icon = item.icon;
  const label = lang === "en" ? item.labelEn : item.labelAl;
  return (
    <div className="shrink-0 flex items-center gap-4 px-8 sm:px-12">
      <span
        className="inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15"
      >
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.6} />
      </span>
      <div className="leading-tight text-left">
        <div className="font-display text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          {item.value}
        </div>
        <div className="text-[11px] sm:text-xs uppercase tracking-[0.12em] text-muted-foreground mt-0.5 whitespace-nowrap">
          {label}
        </div>
      </div>
    </div>
  );
}

export function HeroStats() {
  const { lang } = useI18n();
  // Repeat items enough times for a seamless loop across viewports
  const loop = [...STATS, ...STATS, ...STATS, ...STATS];

  return (
    <div className="container-page relative z-20 -mt-10 md:-mt-16 mb-10 md:mb-14">
      <div
        className="group relative overflow-hidden rounded-[28px] md:rounded-[32px] border border-white/50 bg-white/60 backdrop-blur-2xl shadow-[0_20px_60px_-24px_rgba(15,139,141,0.35)]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 100%)",
        }}
      >
        {/* Edge fades */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 z-10"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0))",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 z-10"
          style={{
            background:
              "linear-gradient(to left, rgba(255,255,255,0.95), rgba(255,255,255,0))",
          }}
        />

        <div className="py-6 md:py-7">
          <div className="flex w-max animate-hero-stats-marquee items-center">
            {loop.map((item, i) => (
              <div key={i} className="flex items-center">
                <StatItem item={item} lang={lang} />
                <span
                  aria-hidden
                  className="h-10 w-px bg-gradient-to-b from-transparent via-border to-transparent"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-stats-marquee {
          0% { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-25%, 0, 0); }
        }
        .animate-hero-stats-marquee {
          animation: hero-stats-marquee 50s linear infinite;
          will-change: transform;
        }
        @media (hover: hover) {
          .group:hover .animate-hero-stats-marquee { animation-play-state: paused; }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-hero-stats-marquee { animation-duration: 180s; }
        }
      `}</style>
    </div>
  );
}
