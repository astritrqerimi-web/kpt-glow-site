import { Star } from "lucide-react";

const items = [
  { title: "Klientë të kënaqur", desc: "Besim nga klientët tanë" },
  { title: "Besueshmëri dhe Profesionalizëm", desc: "Shërbime të sakta dhe korrekte" },
  { title: "Shërbim me Cilësi të Lartë", desc: "Përkushtim në çdo detaj" },
  { title: "Standarde të Larta Profesionale", desc: "Punë serioze dhe transparente" },
];

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="group shrink-0 w-[280px] sm:w-[320px] rounded-2xl border border-border/70 bg-background/70 backdrop-blur-sm px-6 py-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant hover:border-primary/30">
      <div className="flex items-center gap-0.5 mb-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-4 w-4 fill-current" style={{ color: "var(--brand-gold)" }} />
        ))}
      </div>
      <div className="text-sm font-semibold text-foreground leading-tight">{title}</div>
      <div className="text-xs text-muted-foreground mt-1">{desc}</div>
    </div>
  );
}

export function TrustMarquee() {
  const loop = [...items, ...items];
  return (
    <div
      className="relative mt-10 w-full overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      {/* Desktop: marquee */}
      <div className="hidden md:block group">
        <div
          className="flex gap-4 w-max animate-trust-marquee group-hover:[animation-play-state:paused]"
        >
          {loop.map((it, idx) => (
            <Card key={idx} {...it} />
          ))}
        </div>
      </div>

      {/* Mobile: swipeable snap scroll */}
      <div className="md:hidden -mx-6 px-6 overflow-x-auto flex gap-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {items.map((it, idx) => (
          <div key={idx} className="snap-start">
            <Card {...it} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes trust-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-trust-marquee {
          animation: trust-marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
