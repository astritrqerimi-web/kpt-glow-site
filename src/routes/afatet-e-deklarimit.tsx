import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarClock, Percent } from "lucide-react";
import { deadlinesQuery } from "@/lib/deadlines-content";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/afatet-e-deklarimit")({
  loader: ({ context }) => context.queryClient.ensureQueryData(deadlinesQuery()),
  head: () => ({ meta: [
    { title: "Afatet e Deklarimit dhe Normat Tatimore — KPT Consulting" },
    { name: "description", content: "Afatet e deklarimit dhe pagesës së tatimeve dhe kontributeve në Kosovë, si dhe normat tatimore në fuqi — nga KPT Consulting." },
    { property: "og:title", content: "Afatet e Deklarimit dhe Normat Tatimore — KPT Consulting" },
    { property: "og:description", content: "Afatet e deklarimit dhe normat tatimore në Kosovë, të përditësuara nga KPT Consulting." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "https://www.kptconsulting.al/afatet-e-deklarimit" }] }),
  component: FilingDeadlinesPage,
});

const thClass = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const tdClass = "px-4 py-3 text-sm align-top";

function FilingDeadlinesPage() {
  const { data } = useSuspenseQuery(deadlinesQuery());
  const { lang } = useI18n();
  const al = lang === "sq";
  const { deadlines, rates } = data;

  return (
    <section className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-[1000px]">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
            <CalendarClock className="h-4 w-4" />
            {al ? "Tatime & Kontribute" : "Taxes & Contributions"}
          </span>
          <h1 className="mt-4 text-4xl leading-tight md:text-5xl tracking-normal">
            {al ? deadlines.titleAl : deadlines.titleEn}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            {al
              ? "Afatet e deklarimit dhe pagesës së tatimeve dhe kontributeve në Kosovë."
              : "Declaration and payment deadlines for taxes and contributions in Kosovo."}
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-soft">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className={thClass}>{al ? "Nr" : "No."}</th>
                <th className={thClass}>{al ? "Emërtimi i Formularit" : "Form Name"}</th>
                <th className={thClass}>{al ? "Shkurtesa" : "Abbreviation"}</th>
                <th className={thClass}>{al ? "Afati i deklarimit dhe pagesës" : "Declaration and payment deadline"}</th>
                <th className={thClass}>{al ? "Mënyra e deklarimit" : "Filing method"}</th>
              </tr>
            </thead>
            <tbody>
              {deadlines.rows.map((r, i) => (
                <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                  <td className={`${tdClass} text-muted-foreground`}>{i + 1}</td>
                  <td className={`${tdClass} font-medium`}>{al ? r.formAl : r.formEn}</td>
                  <td className={`${tdClass} whitespace-nowrap font-semibold text-primary`}>{r.abbr}</td>
                  <td className={tdClass}>{al ? r.deadlineAl : r.deadlineEn}</td>
                  <td className={tdClass}>{al ? r.methodAl : r.methodEn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs italic text-muted-foreground">{al ? deadlines.noteAl : deadlines.noteEn}</p>

        <div className="mt-14 mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
            <Percent className="h-4 w-4" />
            {al ? "Shkallët në fuqi" : "Rates in force"}
          </span>
          <h2 className="mt-4 text-3xl leading-tight md:text-4xl tracking-normal">
            {al ? rates.titleAl : rates.titleEn}
          </h2>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-soft">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className={thClass}>{al ? "Lloji i tatimit" : "Tax type"}</th>
                <th className={thClass}>{al ? "Pragu i qarkullimit" : "Turnover threshold"}</th>
                <th className={`${thClass} text-right`}>{al ? "Norma tatimore" : "Tax rate"}</th>
              </tr>
            </thead>
            <tbody>
              {rates.rows.map((r, i) =>
                r.section ? (
                  <tr key={i} className="border-b border-border/60 bg-muted/40">
                    <td colSpan={3} className="px-4 py-2.5 text-center text-sm font-semibold">
                      {al ? r.labelAl : r.labelEn}
                    </td>
                  </tr>
                ) : (
                  <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className={`${tdClass} font-medium`}>{al ? r.labelAl : r.labelEn}</td>
                    <td className={`${tdClass} text-muted-foreground`}>{al ? r.thresholdAl : r.thresholdEn}</td>
                    <td className={`${tdClass} text-right font-semibold`}>{r.rate}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs italic text-muted-foreground">{al ? rates.noteAl : rates.noteEn}</p>
      </div>
    </section>
  );
}
