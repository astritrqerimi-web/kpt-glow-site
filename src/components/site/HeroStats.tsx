import { useSuspenseQuery } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { heroTrustQuery } from "@/lib/site-content";
import { useI18n } from "@/lib/i18n";
import { HERO_TRUST_ICONS } from "@/components/site/hero-trust-icons";

interface MarqueeItem {
  key: string;
  Icon: LucideIcon;
  color: string;
  value: string;
  label: string;
  width: number;
}

function getItemWidth(value: string, label: string) {
  const valueWidth = value ? Math.max(28, value.length * 10) : 0;
  const labelWidth = Math.max(92, label.length * 6.45);
  return Math.ceil(119 + valueWidth + labelWidth);
}

function MarqueeSequence({ items, duplicate }: { items: MarqueeItem[]; duplicate?: boolean }) {
  return (
    <div className="hero-trust-sequence" aria-hidden={duplicate || undefined}>
      {items.map(({ key, Icon, color, value, label, width }) => (
        <div className="hero-trust-item" key={key} style={{ width }}>
          <span className="hero-trust-icon" style={{ color, backgroundColor: `color-mix(in srgb, ${color} 8%, transparent)` }}>
            <Icon aria-hidden size={18} strokeWidth={1.75} />
          </span>
          <span className="hero-trust-copy">
            {value ? <strong>{value}</strong> : null}
            <span>{label.toLocaleUpperCase()}</span>
          </span>
        </div>
      ))}
    </div>
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

  const copies = items.length >= 6 ? 1 : items.length >= 3 ? 2 : 4;
  const duration = speed * copies;
  const marqueeItems: MarqueeItem[] = Array.from({ length: copies }, () => items).flat().map((item, index) => {
    const value = lang === "en" ? item.value_en || item.value_al : item.value_al || item.value_en;
    const label = lang === "en" ? item.label_en || item.label_al : item.label_al || item.label_en;
    return {
      key: `${item.id ?? item.sort_order}-${index}`,
      Icon: HERO_TRUST_ICONS[item.icon] ?? BadgeCheck,
      color: item.color || "#0F8B8D",
      value,
      label,
      width: getItemWidth(value, label),
    };
  });

  return (
    <div className="container-page relative z-20 -mt-10 md:-mt-16 lg:-mt-20 mb-10 md:mb-14">
      <div
        className={`hero-trust relative rounded-2xl md:rounded-[20px] shadow-[0_10px_30px_-18px_rgba(15,139,141,0.25)]${pauseOnHover ? " hero-trust-pauses" : ""}`}
      >
        <div
          aria-hidden
          className="absolute inset-0 rounded-2xl md:rounded-[20px] border border-white/40 bg-white/45"
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

        <div className="hero-trust-viewport relative h-[64px] sm:h-[72px] md:h-[80px] overflow-hidden rounded-2xl md:rounded-[20px]">
          <div
            className={`hero-trust-track${data.direction === "right" ? " hero-trust-track-reverse" : ""}`}
            style={{ animationDuration: `${duration}s` }}
          >
            <MarqueeSequence items={marqueeItems} />
            <MarqueeSequence items={marqueeItems} duplicate />
          </div>
        </div>
      </div>
    </div>
  );
}
