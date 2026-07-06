import { Star, Users, ShieldCheck, Briefcase, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StarItem {
  type: "stars";
  title: string;
  desc: string;
}

interface IconItem {
  type: "icon";
  icon: LucideIcon;
  title: string;
  desc: string;
}

type Item = StarItem | IconItem;

const items: Item[] = [
  { type: "stars", title: "Klientë të kënaqur", desc: "Besim nga klientët tanë" },
  { type: "icon", icon: Users, title: "Staf i Certifikuar", desc: "Ekspertizë profesionale në kontabilitet dhe këshillim tatimor." },
  { type: "stars", title: "Besueshmëri dhe Profesionalizëm", desc: "Shërbime të sakta dhe korrekte." },
  { type: "icon", icon: ShieldCheck, title: "Në Përputhje me Legjislacionin", desc: "Shërbime të sakta dhe në përputhje me rregullat ligjore." },
  { type: "stars", title: "Shërbim me Cilësi të Lartë", desc: "Përkushtim në çdo detaj." },
  { type: "icon", icon: Briefcase, title: "Biznese të Asistuara", desc: "Mbështetje profesionale për shumë biznese në zhvillimin e tyre." },
  { type: "stars", title: "Standarde të Larta Profesionale", desc: "Punë serioze dhe transparente." },
  { type: "icon", icon: TrendingUp, title: "Përvojë Profesionale", desc: "Vite përvoje në kontabilitet, tatime dhe konsulencë financiare." },
];

function StarCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="shrink-0 flex flex-col items-center text-center w-[200px] sm:w-[240px] rounded-xl border border-border/60 bg-background/60 backdrop-blur-sm px-4 py-3 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant hover:border-primary/25">
      <div className="flex items-center justify-center gap-0.5 mb-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-3 w-3 fill-current" style={{ color: "var(--brand-gold)" }} />
        ))}
      </div>
      <div className="text-xs font-semibold text-foreground leading-snug">{title}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{desc}</div>
    </div>
  );
}

function IconCard({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="shrink-0 w-[200px] sm:w-[240px] rounded-xl border border-border/60 bg-background/60 backdrop-blur-sm px-4 py-3 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant hover:border-primary/25">
      <div className="flex items-center mb-1.5">
        <span
          className="inline-flex h-5 w-5 items-center justify-center rounded-md text-white"
          style={{ background: "var(--gradient-brand-strong)" }}
        >
          <Icon className="h-3 w-3" strokeWidth={2.5} />
        </span>
      </div>
      <div className="text-xs font-semibold text-foreground leading-snug">{title}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{desc}</div>
    </div>
  );
}

function Card({ item }: { item: Item }) {
  if (item.type === "stars") {
    return <StarCard title={item.title} desc={item.desc} />;
  }
  return <IconCard icon={item.icon} title={item.title} desc={item.desc} />;
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
        <div className="flex gap-3 w-max animate-trust-marquee">
          {loop.map((it, idx) => (
            <Card key={idx} item={it} />
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
