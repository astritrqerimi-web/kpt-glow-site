import { Star, BadgeCheck, ShieldCheck, Briefcase, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StarItem {
  type: "stars";
  title: string;
}

interface IconItem {
  type: "icon";
  icon: LucideIcon;
  title: string;
  color: string;
}

type Item = StarItem | IconItem;

const items: Item[] = [
  { type: "stars", title: "Klientë të kënaqur" },
  { type: "icon", icon: BadgeCheck, title: "Staf i Certifikuar", color: "#0F8B8D" },
  { type: "stars", title: "Besueshmëri dhe Profesionalizëm" },
  { type: "icon", icon: ShieldCheck, title: "Në Përputhje me Legjislacionin", color: "#1F3A5F" },
  { type: "stars", title: "Shërbim me Cilësi të Lartë" },
  { type: "icon", icon: Briefcase, title: "Biznese të Asistuara", color: "#5B6C7D" },
  { type: "stars", title: "Standarde të Larta Profesionale" },
  { type: "icon", icon: TrendingUp, title: "Përvojë Profesionale", color: "#F2C94C" },
];

function StarBadge({ title }: { title: string }) {
  return (
    <div className="shrink-0 flex flex-col items-center text-center w-[230px] sm:w-[280px] px-5 py-2">
      <div className="flex items-center justify-center gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-current" style={{ color: "#C9A227" }} />
        ))}
      </div>
      <div className="mt-2 text-sm font-semibold text-foreground tracking-tight leading-snug">
        {title}
      </div>
    </div>
  );
}

function IconBadge({ icon: Icon, title, color }: { icon: LucideIcon; title: string; color: string }) {
  return (
    <div className="shrink-0 flex flex-col items-center text-center w-[230px] sm:w-[280px] px-5 py-2">
      <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.5} />
      <div className="mt-2 text-sm font-semibold text-foreground tracking-tight leading-snug">
        {title}
      </div>
    </div>
  );
}

function Badge({ item }: { item: Item }) {
  if (item.type === "stars") {
    return <StarBadge title={item.title} />;
  }
  return <IconBadge icon={item.icon} title={item.title} color={item.color} />;
}

export function TrustMarquee() {
  const loop = [...items, ...items, ...items, ...items];

  return (
    <div
      className="relative mt-14 md:mt-16 mb-4 md:mb-6 w-full overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      <div className="group">
        <div className="flex items-center gap-6 sm:gap-8 w-max animate-trust-marquee">
          {loop.map((it, idx) => (
            <Badge key={idx} item={it} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes trust-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-trust-marquee {
          animation: trust-marquee 40s linear infinite;
          will-change: transform;
        }
        @media (hover: hover) {
          .group:hover .animate-trust-marquee {
            animation-play-state: paused;
          }
        }
      `}</style>
    </div>
  );
}
