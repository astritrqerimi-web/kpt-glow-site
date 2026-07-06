import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { aboutQuery } from "@/lib/site-content";
import { CheckCircle2, Target, Users2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/rreth-nesh")({
  head: () => ({
    meta: [
      { title: "Rreth Nesh — KPT Consulting" },
      { name: "description", content: "Njihuni me KPT Consulting — kompani e specializuar në kontabilitet, tatime dhe konsulencë biznesi, e udhëhequr nga Mr. Sc Astrit Qerimi." },
      { property: "og:title", content: "Rreth Nesh — KPT Consulting" },
      { property: "og:description", content: "Kompani profesionale e kontabilitetit dhe konsulencës në Kosovë." },
    ],
  }),
  loader: ({ context }) => { context.queryClient.ensureQueryData(aboutQuery()); },
  component: AboutPage,
});

function AboutPage() {
  const { data: about } = useSuspenseQuery(aboutQuery());
  const values = [
    { icon: ShieldCheck, title: "Besueshmëri", desc: "Punojmë me integritet dhe transparencë të plotë." },
    { icon: Target, title: "Saktësi", desc: "Standarde të larta profesionale në çdo detyrë." },
    { icon: Users2, title: "Partneritet", desc: "Marrëdhënie afatgjata të bazuara në rezultate." },
    { icon: CheckCircle2, title: "Përputhshmëri", desc: "Në përputhje të plotë me legjislacionin." },
  ];
  return (
    <>
      <section className="container-page pt-16 md:pt-24 pb-16">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-primary animate-fade-up">Rreth Nesh</div>
          <h1 className="mt-4 font-display text-4xl md:text-6xl leading-tight text-foreground animate-fade-up" style={{ animationDelay: "80ms" }}>
            Partneri juaj për <span className="text-gradient-brand">zgjidhje financiare</span>
          </h1>
        </div>
      </section>

      <section className="container-page pb-16 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-3 space-y-6 animate-fade-up">
          <p className="text-lg leading-relaxed text-foreground/85">{about.intro}</p>
          <p className="text-base leading-relaxed text-muted-foreground">{about.services}</p>
          <div className="rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-6 shadow-soft">
            <div className="text-xs uppercase tracking-[0.18em] text-primary">Udhëheqja</div>
            <p className="mt-3 text-base leading-relaxed text-foreground/85">{about.leader}</p>
          </div>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-4 content-start">
          {values.map((v, i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-5 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: "var(--gradient-brand)" }}>
                <v.icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div className="mt-3 font-semibold text-foreground">{v.title}</div>
              <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
