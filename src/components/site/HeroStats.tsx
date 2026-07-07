import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Users,
  Users2,
  LineChart,
  TrendingUp,
  ShieldCheck,
  BadgeCheck,
  Award,
  Headphones,
  Handshake,
  Briefcase,
  CheckCircle2,
  Target,
  Star,
  Sparkles,
  Clock,
  Globe,
  Heart,
  ThumbsUp,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { heroTrustQuery } from "@/lib/site-content";
import { useI18n } from "@/lib/i18n";

export const HERO_TRUST_ICONS: Record<string, LucideIcon> = {
  Users,
  Users2,
  LineChart,
  TrendingUp,
  ShieldCheck,
  BadgeCheck,
  Award,
  Headphones,
  Handshake,
  Briefcase,
  CheckCircle2,
  Target,
  Star,
  Sparkles,
  Clock,
  Globe,
  Heart,
  ThumbsUp,
  Trophy,
};
export const HERO_TRUST_ICON_NAMES = Object.keys(HERO_TRUST_ICONS);

export function HeroStats() {
  const { data } = useSuspenseQuery(heroTrustQuery());
  const { lang } = useI18n();

  const items = (data.items ?? [])
    .filter((i) => i.is_active)
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  if (items.length === 0) return null;

  // Repeat items enough times for a seamless loop
  const loop = [...items, ...items, ...items, ...items];

  const speed = Math.max(5, Number(data.speed) || 50);
  const direction = data.direction === "right" ? "reverse" : "normal";
  const pauseOnHover = data.pause_on_hover !== false;

  return (
    <div className="container-page relative z-20 -mt-10 md:-mt-16 mb-10 md:mb-14">
      <div
        className="hero-stats-card group relative overflow-hidden rounded-[28px] md:rounded-[32px] border border-white/50 bg-white/60 backdrop-blur-2xl shadow-[0_20px_60px_-24px_rgba(15,139,141,0.35)]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 100%)",
        }}
      >
        {/* Edge fades */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 z-10"
          style={{ background: "linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0))" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 z-10"
          style={{ background: "linear-gradient(to left, rgba(255,255,255,0.95), rgba(255,255,255,0))" }}
        />

        <div className="py-6 md:py-7">
          <div
            className="flex w-max animate-hero-stats-marquee items-center"
            style={{ animationDuration: `${speed}s`, animationDirection: direction }}
          >
            {loop.map((item, i) => {
              const Icon = HERO_TRUST_ICONS[item.icon] ?? BadgeCheck;
              const value = lang === "en" ? item.value_en || item.value_al : item.value_al || item.value_en;
              const label = lang === "en" ? item.label_en || item.label_al : item.label_al || item.label_en;
              const color = item.color || "#0F8B8D";
              return (
                <div key={i} className="flex items-center">
                  <div className="shrink-0 flex items-center gap-4 px-8 sm:px-12">
                    <span
                      className="inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl ring-1"
                      style={{
                        backgroundColor: `${color}1A`,
                        color,
                        boxShadow: `inset 0 0 0 1px ${color}26`,
                      }}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.6} />
                    </span>
                    <div className="leading-tight text-left">
                      <div className="font-display text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                        {value}
                      </div>
                      <div className="text-[11px] sm:text-xs uppercase tracking-[0.12em] text-muted-foreground mt-0.5 whitespace-nowrap">
                        {label}
                      </div>
                    </div>
                  </div>
                  <span
                    aria-hidden
                    className="h-10 w-px bg-gradient-to-b from-transparent via-border to-transparent"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-stats-marquee {
          0% { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-25%, 0, 0); }
        }
        .animate-hero-stats-marquee {
          animation-name: hero-stats-marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        ${pauseOnHover ? `@media (hover: hover) { .hero-stats-card:hover .animate-hero-stats-marquee { animation-play-state: paused; } }` : ""}
      `}</style>
    </div>
  );
}
