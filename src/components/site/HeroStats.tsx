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

  const speed = Math.max(5, Number(data.speed) || 50);
  const pauseOnHover = data.pause_on_hover !== false;

  if (items.length === 0) return null;

  const repetitions = items.length >= 6 ? 1 : items.length >= 3 ? 2 : 4;
  const sequence = Array.from({ length: repetitions }, () => items).flat();
  const duration = speed * repetitions;

  const renderSequence = (duplicate: boolean) => (
    <div className="trust-marquee__group" aria-hidden={duplicate || undefined}>
      {sequence.map((item, index) => {
        const Icon = HERO_TRUST_ICONS[item.icon] ?? BadgeCheck;
        const value = lang === "en" ? item.value_en || item.value_al : item.value_al || item.value_en;
        const label = lang === "en" ? item.label_en || item.label_al : item.label_al || item.label_en;
        const color = item.color || "#0F8B8D";

        return (
          <div key={`${item.id ?? item.sort_order}-${index}`} className="flex items-center">
            <div className="shrink-0 flex items-center gap-2.5 sm:gap-3 px-5 sm:px-8">
              <span
                className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}14`, color }}
              >
                <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
              </span>
              <div className="leading-tight text-left flex items-baseline gap-1.5">
                <span className="font-display text-base sm:text-lg font-semibold text-foreground tracking-tight whitespace-nowrap">
                  {value}
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.1em] text-muted-foreground whitespace-nowrap">
                  {label}
                </span>
              </div>
            </div>
            <span aria-hidden className="h-5 sm:h-6 w-px bg-border/60" />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="container-page relative z-20 -mt-10 md:-mt-16 lg:-mt-20 mb-10 md:mb-14">
      <div
        className={`trust-marquee group relative rounded-2xl md:rounded-[20px] shadow-[0_10px_30px_-18px_rgba(15,139,141,0.25)]${pauseOnHover ? " trust-marquee--pausable" : ""}`}
      >
        <div
          aria-hidden
          className="absolute inset-0 rounded-2xl md:rounded-[20px] border border-white/40 bg-white/45 backdrop-blur-md"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.45) 100%)",
          }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 z-10 rounded-l-2xl md:rounded-l-[20px]"
          style={{ background: "linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0))" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 z-10 rounded-r-2xl md:rounded-r-[20px]"
          style={{ background: "linear-gradient(to left, rgba(255,255,255,0.9), rgba(255,255,255,0))" }}
        />

        <div className="trust-marquee__viewport relative h-[64px] sm:h-[72px] md:h-[80px] flex items-center overflow-hidden rounded-2xl md:rounded-[20px]">
          <div
            className={`trust-marquee__track${data.direction === "right" ? " trust-marquee__track--right" : ""}`}
            style={{ animationDuration: `${duration}s` }}
          >
            {renderSequence(false)}
            {renderSequence(true)}
          </div>
        </div>
      </div>
    </div>
  );
}
