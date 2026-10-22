import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Calculator, Copy, RotateCcw, Check, ExternalLink } from "lucide-react";
import { payrollQuery } from "@/lib/payroll-content";
import { calculatePayroll, type EmployerType, type PayrollMode } from "@/lib/payroll";
import { type PayrollCopyKey } from "@/lib/payroll-copy";
import { useI18n } from "@/lib/i18n";
import { pick } from "@/lib/site-content";
import { PayrollButton } from "@/components/payroll/PayrollButton";
import { ContributionControl } from "@/components/payroll/ContributionControl";
import { SalaryExplanation } from "@/components/payroll/SalaryExplanation";

export const Route = createFileRoute("/llogarite-pagen")({
  loader: ({ context }) => context.queryClient.ensureQueryData(payrollQuery()),
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.texts.title.al ?? "Llogarite Pagën"} — KPT Consulting` },
    { name: "description", content: loaderData?.texts.description.al ?? "Kalkulatori i pagës bruto dhe neto në Kosovë nga KPT Consulting." },
    { property: "og:title", content: "Llogarite Pagën — KPT Consulting" },
    { property: "og:description", content: "Përllogarit pagën, tatimin dhe kontributet pensionale në Kosovë." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "https://www.kptconsulting.al/llogarite-pagen" }] }),
  component: SalaryCalculator,
});

function SalaryCalculator() {
  const { data: config } = useSuspenseQuery(payrollQuery());
  const { lang } = useI18n();
  const [amount, setAmount] = useState("1000");
  const [mode, setMode] = useState<PayrollMode>("gross");
  const [employer, setEmployer] = useState<EmployerType>("primary");
  const [fullTime, setFullTime] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [rates, setRates] = useState<{ employeeRate?: number; employerRate?: number }>({});
  const calculationConfig = { ...config, ...rates };
  const text = (key: PayrollCopyKey) => pick(config.texts[key], lang);
  const money = (value: number) => new Intl.NumberFormat(lang === "sq" ? "de-DE" : "en-IE", { style: "currency", currency: "EUR" }).format(value / 100);
  const normalized = amount.replace(",", ".");
  const valid = /^\d+(?:\.\d{0,2})?$/.test(normalized) && Number(normalized) <= 10000000;
  let result: ReturnType<typeof calculatePayroll> | null = null;
  try { if (valid) result = calculatePayroll(Number(normalized), mode, calculationConfig, employer, fullTime); } catch { /* Invalid or unreachable net amount. */ }
  const example = calculatePayroll(1000, "gross", calculationConfig, employer, fullTime);
  const items = result ? [
    [text("gross"), result.gross], [text("employeePension") + ` (${calculationConfig.employeeRate}%)`, -result.employee],
    [text("employerPension") + ` (${calculationConfig.employerRate}%)`, result.employerPension],
    [text("taxable"), result.taxable], [text("tax"), -result.tax], [text("net"), result.net], [text("totalCost"), result.totalCost],
  ] as const : [];
  const copy = async () => {
    try {
      if (!result) return;
      const taxLines = employer === "primary" ? result.bands.map(band => `${money(band.base)} × ${band.rate}%: ${money(band.tax)}`) : [`${money(result.taxable)} × ${config.secondaryRate}%: ${money(result.tax)}`];
      await navigator.clipboard.writeText(["KPT Consulting — " + text("title"), text(employer), ...items.slice(0,4).map(([label, value]) => `${label}: ${money(value)}`), text("bands"), ...taxLines, ...items.slice(4).map(([label,value]) => `${label}: ${money(value)}`)].join("\n"));
      setCopied(true); setCopyError(false); setTimeout(() => setCopied(false), 2500);
    } catch { setCopyError(true); }
  };
  return <section data-payroll-page className="container-page py-10 md:py-14">
    <style>{`@media (min-width: 768px) and (max-width: 1023px) { body:has([data-payroll-page]) footer > .container-page { grid-template-columns: repeat(2, minmax(0, 1fr)); } }`}</style>
    <div className="mx-auto max-w-[1000px]">
      <div className="mb-8">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary"><Calculator className="h-4 w-4" />{text("eyebrow")}</span>
        <h1 className="mt-4 text-4xl leading-tight md:text-5xl tracking-normal">{text("title")}</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">{text("description")}</p>
      </div>
      <div className="grid gap-4 rounded-lg border border-border bg-card p-5 shadow-soft md:p-6 lg:grid-cols-[minmax(0,1fr)_auto]">
        <label className="min-w-0"><span className="block text-sm font-medium text-muted-foreground">{text("amount")} · {text(mode === "gross" ? "gross" : "net")}</span>
          <div className="mt-2 flex items-center gap-3"><input aria-label={text("amount")} inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} aria-invalid={!result} className="h-14 w-full min-w-0 rounded-lg border border-input bg-background px-4 text-3xl font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring" /><span className="text-xl text-muted-foreground">€</span></div>
        </label>
        <div className="flex min-w-0 flex-col gap-4 lg:justify-center">
          <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr]">
            <div className="grid grid-cols-2 rounded-lg bg-muted p-1" aria-label={text("amount")}>
              <PayrollButton className="px-3 text-xs" active={mode === "gross"} aria-pressed={mode === "gross"} onClick={() => setMode("gross")}>{text("grossToNet")}</PayrollButton>
              <PayrollButton className="px-3 text-xs" active={mode === "net"} aria-pressed={mode === "net"} onClick={() => setMode("net")}>{text("netToGross")}</PayrollButton>
            </div>
            <div className="grid grid-cols-2 rounded-lg bg-muted p-1" aria-label={text("employer")}>
              <PayrollButton className="px-3 text-xs" active={employer === "primary"} aria-pressed={employer === "primary"} onClick={() => setEmployer("primary")}>{text("primary")}</PayrollButton>
              <PayrollButton className="px-3 text-xs" active={employer === "secondary"} aria-pressed={employer === "secondary"} onClick={() => setEmployer("secondary")}>{text("secondary")}</PayrollButton>
            </div>
          </div>
          <fieldset className="flex flex-wrap gap-x-4 gap-y-2"><legend className="sr-only">{text("contributions")}</legend>
            <ContributionControl label={text("employee")} value={calculationConfig.employeeRate} onChange={employeeRate => setRates(previous => ({...previous, employeeRate}))} decrease={text("decrease")} increase={text("increase")} />
            <ContributionControl label={text("employer")} value={calculationConfig.employerRate} onChange={employerRate => setRates(previous => ({...previous, employerRate}))} decrease={text("decrease")} increase={text("increase")} />
          </fieldset>
        </div>
        <div className="flex min-w-0 flex-col gap-3 lg:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">{text(mode === "gross" ? "grossFlow" : "netFlow")} · {text(employer)} · {text(employer === "primary" ? "progressiveTax" : "flatTax")}{employer === "secondary" ? ` ${config.secondaryRate}%` : ""}</p>
          <label className="flex shrink-0 items-center gap-2 text-xs"><input type="checkbox" checked={fullTime} onChange={e => setFullTime(e.target.checked)} className="h-4 w-4 accent-primary" />{text("fullTime")}</label>
        </div>
      </div>
      {!result && <p role="alert" className="mt-4 text-sm text-destructive">{text("invalid")}</p>}
      {result && <>
        <div className="mt-5 grid gap-6 rounded-lg border border-border border-t-4 border-t-primary bg-card p-5 shadow-soft md:p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]" aria-live="polite">
          <div className="min-w-0"><p className="text-xs font-semibold uppercase text-primary">{text("net")}</p><p data-testid="net-result" className="mt-3 break-words text-4xl font-bold text-primary tabular-nums md:text-5xl">{money(result.net)}</p><p className="mt-2 text-xs text-muted-foreground">{text("gross")}: {money(result.gross)}</p></div>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">{([["gross", result.gross], ["tax", -result.tax], ["employeePension", -result.employee], ["totalCost", result.totalCost]] as const).map(([key, value]) => <div key={key} className="min-w-0 rounded-lg border border-border bg-muted/60 px-4 py-3"><dt className="text-xs text-muted-foreground">{text(key)}</dt><dd className="mt-1 break-words text-xl font-semibold tabular-nums">{money(value)}</dd></div>)}</dl>
        </div>
        <div className="mt-8 border-t border-border pt-7">
          <h2 className="text-xl tracking-normal">{text("breakdown")}</h2>
          <dl className="mt-5 divide-y divide-border">{items.slice(0, 4).map(([label, value]) => <div key={label} className="flex items-center justify-between gap-5 py-3 text-sm"><dt>{label}</dt><dd className="shrink-0 font-semibold tabular-nums">{money(value)}</dd></div>)}</dl>
          <h3 className="mt-5 text-sm tracking-normal">{text("bands")}</h3>
          <dl className="mt-2 divide-y divide-border">{employer === "primary" ? result.bands.map((band, i) => <div key={i} className="flex justify-between gap-3 py-3 text-sm"><dt className="text-muted-foreground">{band.upper === Infinity ? `${text("above")} ${money(band.lower)}` : `${text("from")} ${money(band.lower)} ${text("to")} ${money(band.upper)}`} ({band.rate}%)<span className="mt-1 block text-xs">{money(band.base)} × {band.rate}%</span></dt><dd className="shrink-0 font-semibold tabular-nums">{money(band.tax)}</dd></div>) : <div className="flex justify-between py-3 text-sm"><dt>{money(result.taxable)} × {config.secondaryRate}%</dt><dd>{money(result.tax)}</dd></div>}</dl>
          <div className="mt-3 flex justify-between gap-4 border-t border-border py-4 text-sm"><span>{text("tax")}</span><strong>{money(-result.tax)}</strong></div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg bg-accent p-4 text-accent-foreground"><strong className="text-sm">{text("net")}</strong><strong className="text-xl tabular-nums sm:text-2xl">{money(result.net)}</strong></div>
          <div className="mt-3 flex justify-between gap-4 py-3 text-sm"><span>{text("totalCost")}</span><strong className="shrink-0">{money(result.totalCost)}</strong></div>
          <div className="mt-4 flex flex-wrap gap-3"><PayrollButton onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{text(copied ? "copied" : "copy")}</PayrollButton><PayrollButton onClick={() => { setAmount("1000"); setMode("gross"); setEmployer("primary"); setFullTime(true); setRates({}); setCopied(false); setCopyError(false); }}><RotateCcw className="h-4 w-4" />{text("reset")}</PayrollButton></div>
          {copyError && <p role="alert" className="mt-3 text-sm text-destructive">{text("copyFailed")}</p>}
        </div>
        <SalaryExplanation key={JSON.stringify([normalized,mode,employer,fullTime,calculationConfig,lang])} input={{amount:Number(normalized),mode,employer,fullTime,employeeRate:calculationConfig.employeeRate,employerRate:calculationConfig.employerRate,language:lang}} text={text} />
      </>}
      <div className="mt-7 space-y-3 text-sm text-muted-foreground">
        <p>{text("example")} {money(example.gross)}: {money(example.gross)} − {money(example.employee)} − {money(example.tax)} = <strong className="text-foreground">{money(example.net)}</strong>.</p>
        <p>{text("help")}</p><p>{text("floorHelp")}</p><p>{text("disclaimer")}</p>
        <a href={config.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary underline underline-offset-4">{text("source")}<ExternalLink className="h-3 w-3" /></a>
      </div>
    </div>
  </section>;
}