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

interface SvgTrustItem {
  key: string;
  Icon: LucideIcon;
  color: string;
  value: string;
  label: string;
  width: number;
}

const SVG_ROW_HEIGHT = 80;

function getSvgItemWidth(value: string, label: string) {
  const valueWidth = value ? Math.max(28, value.length * 10) : 0;
  const labelWidth = Math.max(92, label.length * 6.45);
  return Math.ceil(119 + valueWidth + labelWidth);
}

function TrustRowSvg({ items, duplicate }: { items: SvgTrustItem[]; duplicate: boolean }) {
  const width = items.reduce((total, item) => total + item.width, 0);
  let offset = 0;

  return (
    <svg
      className="trust-marquee__svg"
      width={width}
      height={SVG_ROW_HEIGHT}
      viewBox={`0 0 ${width} ${SVG_ROW_HEIGHT}`}
      role={duplicate ? undefined : "img"}
      aria-hidden={duplicate || undefined}
      aria-label={duplicate ? undefined : items.map((item) => `${item.value} ${item.label}`.trim()).join(", ")}
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      {items.map((item) => {
        const x = offset;
        const iconX = x + 32;
        const textX = iconX + 48;
        offset += item.width;

        return (
          <g key={item.key}>
            <rect x={iconX} y="22" width="36" height="36" rx="8" fill={item.color} fillOpacity="0.08" />
            <item.Icon
              x={iconX + 9}
              y="31"
              width="18"
              height="18"
              color={item.color}
              strokeWidth={1.75}
            />
            <text
              x={textX}
              y="45"
              fontFamily="var(--font-sans)"
            >
              {item.value ? (
                <tspan fill="var(--color-foreground)" fontFamily="var(--font-display)" fontSize="18" fontWeight="600">
                  {item.value}
                </tspan>
              ) : null}
              <tspan
                dx={item.value ? 6 : 0}
                dy="-1"
                fill="var(--color-muted-foreground)"
                fontSize="11"
                letterSpacing="1.1"
              >
                {item.label.toLocaleUpperCase()}
              </tspan>
            </text>
            <line
              x1={x + item.width - 1}
              x2={x + item.width - 1}
              y1="28"
              y2="52"
              stroke="var(--color-border)"
              strokeOpacity="0.6"
            />
          </g>
        );
      })}
    </svg>
  );
}

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
  const duration = speed * repetitions;
  const svgItems: SvgTrustItem[] = Array.from({ length: repetitions }, () => items).flat().map((item, index) => {
    const value = lang === "en" ? item.value_en || item.value_al : item.value_al || item.value_en;
    const label = lang === "en" ? item.label_en || item.label_al : item.label_al || item.label_en;
    return {
      key: `${item.id ?? item.sort_order}-${index}`,
      Icon: HERO_TRUST_ICONS[item.icon] ?? BadgeCheck,
      color: item.color || "#0F8B8D",
      value,
      label,
      width: getSvgItemWidth(value, label),
    };
  });

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
            <TrustRowSvg items={svgItems} duplicate={false} />
            <TrustRowSvg items={svgItems} duplicate />
          </div>
        </div>
      </div>
    </div>
  );
}
