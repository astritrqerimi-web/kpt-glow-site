import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, ShieldCheck, Award } from "lucide-react";
import { heroQuery, servicesQuery } from "@/lib/site-content";
import { ServiceIcon } from "@/components/site/ServiceIcon";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(heroQuery());
    context.queryClient.ensureQueryData(servicesQuery());
  },
  component: HomePage,
});

function HomePage() {
  const { data: hero } = useSuspenseQuery(heroQuery());
  const { data: services } = useSuspenseQuery(servicesQuery());
  const featured = services.slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="container-page pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground animate-fade-up">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-glow animate-pulse" />
            Kontabilitet · Tatime · Konsulencë
          </div>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-foreground md:text-7xl animate-fade-up" style={{ animationDelay: "80ms" }}>
            <span className="text-gradient-brand">{hero.title}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl animate-fade-up" style={{ animationDelay: "160ms" }}>
            {hero.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "240ms" }}>
            <Link
              to="/kontakti"
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-white shadow-elegant transition-all duration-300 hover:shadow-hover hover:-translate-y-0.5"
              style={{ background: "var(--gradient-brand)" }}
            >
              Na Kontaktoni
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/sherbimet"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-7 py-3.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/40 hover:bg-background hover:-translate-y-0.5"
            >
              Shërbimet
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            {[
              { icon: ShieldCheck, label: "Në përputhje me legjislacionin" },
              { icon: Award, label: "Kontabilist i Certifikuar" },
              { icon: CheckCircle2, label: "Partneritete afatgjata" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 backdrop-blur px-4 py-3 shadow-soft animate-fade-up" style={{ animationDelay: `${320 + i * 80}ms` }}>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: "var(--gradient-brand)" }}>
                  <item.icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="container-page pb-24 md:pb-32">
        <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary">Shërbimet Tona</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-foreground">
              Zgjidhje profesionale <span className="text-gradient-brand">për çdo biznes</span>
            </h2>
          </div>
          <Link to="/sherbimet" className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all">
            Të gjitha shërbimet <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s, i) => (
            <div
              key={s.id}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 backdrop-blur p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-hover hover:border-primary/30 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div
                className="absolute inset-x-0 -top-px h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "var(--gradient-brand)" }}
              />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-soft transition-transform duration-500 group-hover:scale-110" style={{ background: "var(--gradient-brand)" }}>
                <ServiceIcon name={s.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">{s.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 md:hidden">
          <Link to="/sherbimet" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Të gjitha shërbimet <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-[2rem] p-10 md:p-16 shadow-elegant" style={{ background: "var(--gradient-brand)" }}>
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-display text-3xl md:text-5xl text-white leading-tight">
              Le të flasim për biznesin tuaj
            </h2>
            <p className="mt-4 text-white/85 text-base md:text-lg">
              Kontaktoni ekipin tonë për një konsultim fillestar pa pagesë dhe zgjidhje të përshtatura.
            </p>
            <Link
              to="/kontakti"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
            >
              Na Kontaktoni <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        </div>
      </section>
    </>
  );
}
