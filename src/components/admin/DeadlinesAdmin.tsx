import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { deadlinesQuery, type DeadlinesContent, type DeadlineRow, type RateRow } from "@/lib/deadlines-content";
import { PayrollButton } from "@/components/payroll/PayrollButton";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

const fieldClass = "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

const emptyDeadlineRow = (): DeadlineRow => ({ formAl: "", formEn: "", abbr: "", deadlineAl: "", deadlineEn: "", methodAl: "", methodEn: "" });
const emptyRateRow = (): RateRow => ({ labelAl: "", labelEn: "", thresholdAl: "", thresholdEn: "", rate: "", section: false });

export function DeadlinesAdmin() {
  const { data } = useQuery(deadlinesQuery());
  const qc = useQueryClient();
  const [draft, setDraft] = useState<DeadlinesContent | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (data) setDraft(previous => previous ?? structuredClone(data)); }, [data]);
  if (!draft) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;

  const setDeadlines = (rows: DeadlineRow[]) => setDraft({ ...draft, deadlines: { ...draft.deadlines, rows } });
  const setRates = (rows: RateRow[]) => setDraft({ ...draft, rates: { ...draft.rates, rows } });
  const patchDeadline = (i: number, patch: Partial<DeadlineRow>) =>
    setDeadlines(draft.deadlines.rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const patchRate = (i: number, patch: Partial<RateRow>) =>
    setRates(draft.rates.rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_content").upsert({ key: "filing_deadlines", value: draft as unknown as Json });
    setSaving(false);
    if (error) return toast.error("Ruajtja dështoi. Provoni përsëri.");
    await qc.invalidateQueries({ queryKey: ["site_content", "filing_deadlines"] });
    toast.success("Afatet dhe normat u përditësuan");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl tracking-normal">Afatet e Deklarimit & Normat Tatimore</h2>
        <PayrollButton active disabled={saving} onClick={save}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Ruaj ndryshimet
        </PayrollButton>
      </div>

      <section className="border-b border-border pb-8">
        <h3 className="mb-4 text-xl tracking-normal">Afatet e Deklarimit</h3>
        <div className="mb-5 grid gap-3 md:grid-cols-2">
          <label className="text-sm">Titulli (SQ)<input value={draft.deadlines.titleAl} onChange={e => setDraft({ ...draft, deadlines: { ...draft.deadlines, titleAl: e.target.value } })} className={fieldClass} /></label>
          <label className="text-sm">Title (EN)<input value={draft.deadlines.titleEn} onChange={e => setDraft({ ...draft, deadlines: { ...draft.deadlines, titleEn: e.target.value } })} className={fieldClass} /></label>
          <label className="text-sm">Shënimi (SQ)<input value={draft.deadlines.noteAl} onChange={e => setDraft({ ...draft, deadlines: { ...draft.deadlines, noteAl: e.target.value } })} className={fieldClass} /></label>
          <label className="text-sm">Note (EN)<input value={draft.deadlines.noteEn} onChange={e => setDraft({ ...draft, deadlines: { ...draft.deadlines, noteEn: e.target.value } })} className={fieldClass} /></label>
        </div>
        <div className="space-y-4">
          {draft.deadlines.rows.map((r, i) => (
            <fieldset key={i} className="rounded-lg border border-border p-4">
              <legend className="px-1 text-sm font-semibold">Rreshti {i + 1}{r.abbr ? ` — ${r.abbr}` : ""}</legend>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-xs text-muted-foreground">Formulari (SQ)<input value={r.formAl} onChange={e => patchDeadline(i, { formAl: e.target.value })} className={fieldClass} /></label>
                <label className="text-xs text-muted-foreground">Form (EN)<input value={r.formEn} onChange={e => patchDeadline(i, { formEn: e.target.value })} className={fieldClass} /></label>
                <label className="text-xs text-muted-foreground">Shkurtesa<input value={r.abbr} onChange={e => patchDeadline(i, { abbr: e.target.value })} className={fieldClass} /></label>
                <label className="text-xs text-muted-foreground">Afati (SQ)<input value={r.deadlineAl} onChange={e => patchDeadline(i, { deadlineAl: e.target.value })} className={fieldClass} /></label>
                <label className="text-xs text-muted-foreground">Deadline (EN)<input value={r.deadlineEn} onChange={e => patchDeadline(i, { deadlineEn: e.target.value })} className={fieldClass} /></label>
                <label className="text-xs text-muted-foreground">Mënyra (SQ)<input value={r.methodAl} onChange={e => patchDeadline(i, { methodAl: e.target.value })} className={fieldClass} /></label>
                <label className="text-xs text-muted-foreground">Method (EN)<input value={r.methodEn} onChange={e => patchDeadline(i, { methodEn: e.target.value })} className={fieldClass} /></label>
              </div>
              <PayrollButton className="mt-3" aria-label={`Hiq rreshtin ${i + 1}`} title="Hiq rreshtin" onClick={() => setDeadlines(draft.deadlines.rows.filter((_, j) => j !== i))}>
                <Trash2 className="h-4 w-4" />Hiq rreshtin
              </PayrollButton>
            </fieldset>
          ))}
        </div>
        <PayrollButton className="mt-4" onClick={() => setDeadlines([...draft.deadlines.rows, emptyDeadlineRow()])}>
          <Plus className="h-4 w-4" />Shto rresht
        </PayrollButton>
      </section>

      <section>
        <h3 className="mb-4 text-xl tracking-normal">Normat Tatimore</h3>
        <div className="mb-5 grid gap-3 md:grid-cols-2">
          <label className="text-sm">Titulli (SQ)<input value={draft.rates.titleAl} onChange={e => setDraft({ ...draft, rates: { ...draft.rates, titleAl: e.target.value } })} className={fieldClass} /></label>
          <label className="text-sm">Title (EN)<input value={draft.rates.titleEn} onChange={e => setDraft({ ...draft, rates: { ...draft.rates, titleEn: e.target.value } })} className={fieldClass} /></label>
          <label className="text-sm">Shënimi (SQ)<input value={draft.rates.noteAl} onChange={e => setDraft({ ...draft, rates: { ...draft.rates, noteAl: e.target.value } })} className={fieldClass} /></label>
          <label className="text-sm">Note (EN)<input value={draft.rates.noteEn} onChange={e => setDraft({ ...draft, rates: { ...draft.rates, noteEn: e.target.value } })} className={fieldClass} /></label>
        </div>
        <div className="space-y-4">
          {draft.rates.rows.map((r, i) => (
            <fieldset key={i} className="rounded-lg border border-border p-4">
              <legend className="px-1 text-sm font-semibold">Rreshti {i + 1}{r.section ? " — Nëntitull" : ""}</legend>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-xs text-muted-foreground">Emërtimi (SQ)<input value={r.labelAl} onChange={e => patchRate(i, { labelAl: e.target.value })} className={fieldClass} /></label>
                <label className="text-xs text-muted-foreground">Label (EN)<input value={r.labelEn} onChange={e => patchRate(i, { labelEn: e.target.value })} className={fieldClass} /></label>
                <label className="text-xs text-muted-foreground">Pragu (SQ)<input value={r.thresholdAl} onChange={e => patchRate(i, { thresholdAl: e.target.value })} className={fieldClass} /></label>
                <label className="text-xs text-muted-foreground">Threshold (EN)<input value={r.thresholdEn} onChange={e => patchRate(i, { thresholdEn: e.target.value })} className={fieldClass} /></label>
                <label className="text-xs text-muted-foreground">Norma<input value={r.rate} onChange={e => patchRate(i, { rate: e.target.value })} className={fieldClass} /></label>
                <label className="mt-5 inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={r.section} onChange={e => patchRate(i, { section: e.target.checked })} className="h-4 w-4 accent-primary" />
                  Nëntitull (rresht seksioni)
                </label>
              </div>
              <PayrollButton className="mt-3" aria-label={`Hiq rreshtin ${i + 1}`} title="Hiq rreshtin" onClick={() => setRates(draft.rates.rows.filter((_, j) => j !== i))}>
                <Trash2 className="h-4 w-4" />Hiq rreshtin
              </PayrollButton>
            </fieldset>
          ))}
        </div>
        <PayrollButton className="mt-4" onClick={() => setRates([...draft.rates.rows, emptyRateRow()])}>
          <Plus className="h-4 w-4" />Shto rresht
        </PayrollButton>
      </section>

      <PayrollButton active disabled={saving} onClick={save}>
        <Save className="h-4 w-4" />Ruaj ndryshimet
      </PayrollButton>
    </div>
  );
}
