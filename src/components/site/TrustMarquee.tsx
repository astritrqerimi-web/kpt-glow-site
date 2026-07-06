import { Star } from "lucide-react";

const items = [
  { title: "Klientë të kënaqur", desc: "Besim nga klientët tanë" },
  { title: "Besueshmëri dhe Profesionalizëm", desc: "Shërbime të sakta dhe korrekte" },
  { title: "Shërbim me Cilësi të Lartë", desc: "Përkushtim në çdo detaj" },
  { title: "Standarde të Larta Profesionale", desc: "Punë serioze dhe transparente" },
];

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="group shrink-0 w-[200px] sm:w-[240px] rounded-xl border border-border/60 bg-background/60 backdrop-blur-sm px-4 py-3 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant hover:border-primary/25">
      <div className="flex items-center gap-0.5 mb-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-3 w-3 fill-current" style={{ color: "var(--brand-gold)" }} />
        ))}
      </div>
      <div className="text-xs font-semibold text-foreground leading-snug">{title}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{desc}</div>
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
          className="flex gap-3 w-max animate-trust-marquee group-hover:[animation-play-state:paused]"
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
