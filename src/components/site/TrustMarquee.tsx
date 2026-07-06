import { Star, BadgeCheck, ShieldCheck, Briefcase, TrendingUp, Award, Handshake, Users2, CheckCircle2, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { trustQuery } from "@/lib/site-content";
import { useI18n } from "@/lib/i18n";

const ICONS: Record<string, LucideIcon> = {
  BadgeCheck, ShieldCheck, Briefcase, TrendingUp, Award, Handshake, Users2, CheckCircle2, Target,
};

function StarBadge({ title }: { title: string }) {
  return (
    <div className="shrink-0 flex flex-col items-center text-center w-[230px] sm:w-[280px] px-5 py-2">
      <div className="flex items-center justify-center gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-current" style={{ color: "#C9A227" }} />
        ))}
      </div>
      <div className="mt-2 text-sm font-semibold text-foreground tracking-tight leading-snug">{title}</div>
    </div>
  );
}

function IconBadge({ icon: Icon, title, color }: { icon: LucideIcon; title: string; color: string }) {
  return (
    <div className="shrink-0 flex flex-col items-center text-center w-[230px] sm:w-[280px] px-5 py-2">
      <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.5} />
      <div className="mt-2 text-sm font-semibold text-foreground tracking-tight leading-snug">{title}</div>
    </div>
  );
}

export function TrustMarquee() {
  const { data } = useSuspenseQuery(trustQuery());
  const { lang } = useI18n();
  const items = data.items ?? [];
  const loop = [...items, ...items, ...items, ...items];

  return (
    <div
      className="relative mt-14 md:mt-16 mb-4 md:mb-6 w-full overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      <div className="group">
        <div className="flex items-center gap-6 sm:gap-8 w-max animate-trust-marquee">
          {loop.map((it, idx) => {
            const title = lang === "en" ? (it.title_en || it.title_al) : (it.title_al || it.title_en);
            if (it.type === "stars") return <StarBadge key={idx} title={title} />;
            const Icon = ICONS[it.icon || "BadgeCheck"] ?? BadgeCheck;
            return <IconBadge key={idx} icon={Icon} title={title} color={it.color || "#0F8B8D"} />;
          })}
        </div>
      </div>

      <style>{`
        @keyframes trust-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-trust-marquee { animation: trust-marquee 40s linear infinite; will-change: transform; }
        @media (hover: hover) { .group:hover .animate-trust-marquee { animation-play-state: paused; } }
      `}</style>
    </div>
  );
}
