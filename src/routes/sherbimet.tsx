import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { servicesQuery } from "@/lib/site-content";
import { ServiceIcon } from "@/components/site/ServiceIcon";

export const Route = createFileRoute("/sherbimet")({
  head: () => ({
    meta: [
      { title: "Shërbimet — KPT Consulting" },
      { name: "description", content: "Shërbime të kontabilitetit, deklarimeve tatimore, regjistrimit të bizneseve, pagave, konsulencës financiare dhe trajnimeve profesionale." },
      { property: "og:title", content: "Shërbimet — KPT Consulting" },
      { property: "og:description", content: "Gamë e plotë shërbimesh të kontabilitetit dhe konsulencës për biznese." },
    ],
  }),
  loader: ({ context }) => { context.queryClient.ensureQueryData(servicesQuery()); },
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services } = useSuspenseQuery(servicesQuery());
  return (
    <>
      <section className="container-page pt-16 md:pt-24 pb-10">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-primary animate-fade-up">Shërbimet</div>
          <h1 className="mt-4 font-display text-4xl md:text-6xl leading-tight text-foreground animate-fade-up" style={{ animationDelay: "80ms" }}>
            Gjithçka që biznesi juaj <span className="text-gradient-brand">ka nevojë</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl animate-fade-up" style={{ animationDelay: "160ms" }}>
            Nga themelimi i biznesit deri te menaxhimi financiar i përditshëm — mbulojmë çdo aspekt profesional.
          </p>
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={s.id}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 backdrop-blur p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-hover hover:border-primary/30 animate-fade-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="absolute inset-x-0 -top-px h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "var(--gradient-brand)" }} />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-soft transition-transform duration-500 group-hover:scale-110" style={{ background: "var(--gradient-brand)" }}>
                <ServiceIcon name={s.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
