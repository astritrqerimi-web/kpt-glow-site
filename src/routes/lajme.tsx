import { createFileRoute } from "@tanstack/react-router";
import { Newspaper } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/lajme")({
  head: () => ({
    meta: [
      { title: "Lajme & Njoftime — KPT Consulting" },
      {
        name: "description",
        content:
          "Lajmet dhe njoftimet më të fundit nga KPT Consulting — përditësime tatimore, ligjore dhe zhvillime profesionale.",
      },
      { property: "og:title", content: "Lajme & Njoftime — KPT Consulting" },
      {
        property: "og:description",
        content:
          "Lajmet dhe njoftimet më të fundit nga KPT Consulting.",
      },
    ],
  }),
  component: LajmePage,
});

function LajmePage() {
  const { lang } = useI18n();
  const isEn = lang === "en";

  return (
    <section className="container-page py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block text-xs uppercase tracking-[0.18em] text-primary font-medium">
          {isEn ? "News & Announcements" : "Lajme & Njoftime"}
        </span>
        <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
          {isEn ? "Latest news from KPT Consulting" : "Lajmet më të fundit nga KPT Consulting"}
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground">
          {isEn
            ? "Stay up to date with tax, legal and professional updates that matter to your business."
            : "Qëndroni të informuar për përditësimet tatimore, ligjore dhe profesionale që kanë rëndësi për biznesin tuaj."}
        </p>
      </div>

      <div className="mt-16 mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border bg-background/60 backdrop-blur-xl p-10 md:p-14 text-center shadow-soft">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Newspaper className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-xl md:text-2xl font-semibold text-foreground">
            {isEn ? "Coming soon" : "Së shpejti"}
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            {isEn
              ? "We're preparing this section. New articles and announcements will be published here shortly."
              : "Ky seksion është duke u përgatitur. Së shpejti do të publikohen artikuj dhe njoftime të reja."}
          </p>
        </div>
      </div>
    </section>
  );
}
