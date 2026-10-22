import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { payrollQuery } from "@/lib/payroll-content";
import { payrollConfigSchema, type PayrollConfig } from "@/lib/payroll";
import { type PayrollCopyKey } from "@/lib/payroll-copy";
import { PayrollButton } from "@/components/payroll/PayrollButton";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

const fieldClass = "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
export function PayrollAdmin() {
  const { data } = useQuery(payrollQuery());
  const qc = useQueryClient();
  const [draft, setDraft] = useState<PayrollConfig | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (data) setDraft(previous => previous ?? structuredClone(data)); }, [data]);
  if (!draft) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
  const changeNumber = (key: "employeeRate" | "employerRate" | "secondaryRate" | "minimumWage" | "employerMinimumRate", value: string) => setDraft({ ...draft, [key]: Number(value) });
  const save = async () => {
    const parsed = payrollConfigSchema.safeParse(draft);
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "Parametra të pavlefshëm");
    setSaving(true);
    const { error } = await supabase.from("site_content").upsert({ key: "payroll_calculator", value: parsed.data as unknown as Json });
    setSaving(false);
    if (error) return toast.error("Ruajtja dështoi. Provoni përsëri.");
    await qc.invalidateQueries({ queryKey: ["site_content", "payroll_calculator"] });
    toast.success("Kalkulatori u përditësua");
  };
  return <div className="space-y-8">
    <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl tracking-normal">Kalkulatori i pagës</h2><PayrollButton active disabled={saving} onClick={save}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Ruaj ndryshimet</PayrollButton></div>
    <section className="border-b border-border pb-8"><h3 className="mb-4 text-xl tracking-normal">Normat dhe kontributet</h3>
      <div className="grid gap-4 md:grid-cols-3">{([
        ["employeeRate", "Kontributi i punëmarrësit (%)"], ["employerRate", "Kontributi i punëdhënësit (%)"], ["secondaryRate", "Tatimi sekondar (%)"],
        ["minimumWage", "Paga minimale bruto (€)"], ["employerMinimumRate", "Norma minimale e punëdhënësit (%)"],
      ] as const).map(([key, label]) => <label key={key} className="text-sm">{label}<input type="number" step="0.01" min="0" value={draft[key]} onChange={e => changeNumber(key, e.target.value)} className={fieldClass} /></label>)}
        <label className="text-sm">Shkallët në fuqi nga<input type="date" value={draft.effectiveFrom} onChange={e => setDraft({...draft,effectiveFrom:e.target.value})} className={fieldClass} /></label>
        <label className="text-sm md:col-span-3">Burimi zyrtar (HTTPS)<input type="url" value={draft.sourceUrl} onChange={e => setDraft({...draft,sourceUrl:e.target.value})} className={fieldClass} /></label>
      </div>
    </section>
    <section className="border-b border-border pb-8"><h3 className="mb-4 text-xl tracking-normal">Shkallët tatimore mujore — punëdhënësi primar</h3>
      <div className="space-y-3">{draft.brackets.map((band, i) => <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
        <label className="text-sm">Deri në (€){band.upTo === null ? <div className={`${fieldClass} text-muted-foreground`}>Pa kufi</div> : <input type="number" min="0.01" step="0.01" value={band.upTo} onChange={e => setDraft({...draft,brackets:draft.brackets.map((b,j) => j===i ? {...b,upTo:Number(e.target.value)} : b)})} className={fieldClass} />}</label>
        <label className="text-sm">Norma (%)<input type="number" min="0" max="100" step="0.01" value={band.rate} onChange={e => setDraft({...draft,brackets:draft.brackets.map((b,j) => j===i ? {...b,rate:Number(e.target.value)} : b)})} className={fieldClass} /></label>
        <PayrollButton aria-label={`Hiq shkallën ${i+1}`} title="Hiq shkallën" disabled={band.upTo === null} onClick={() => setDraft({...draft,brackets:draft.brackets.filter((_,j) => j!==i)})}><Trash2 className="h-4 w-4" /></PayrollButton>
      </div>)}</div>
      <PayrollButton className="mt-4" onClick={() => { const bands=[...draft.brackets]; const last=bands.pop(); if (!last) return; const previous=bands.at(-1)?.upTo ?? 0; setDraft({...draft,brackets:[...bands,{upTo:previous+200,rate:last.rate},last]}); }}><Plus className="h-4 w-4" />Shto shkallë</PayrollButton>
    </section>
    <section><h3 className="mb-4 text-xl tracking-normal">Tekstet shqip / anglisht</h3>
      <div className="space-y-5">{(Object.keys(draft.texts) as PayrollCopyKey[]).map(key => <fieldset key={key} className="border-b border-border pb-5"><legend className="mb-2 text-sm font-semibold">{data?.texts[key].al ?? key}</legend><div className="grid gap-3 md:grid-cols-2">{(["al","en"] as const).map(language => <label key={language} className="text-xs text-muted-foreground">{language.toUpperCase()}<textarea rows={key==='help'||key==='description'||key==='disclaimer'||key==='floorHelp' ? 3 : 1} value={draft.texts[key][language]} onChange={e => setDraft({...draft,texts:{...draft.texts,[key]:{...draft.texts[key],[language]:e.target.value}}})} className={fieldClass} /></label>)}</div></fieldset>)}</div>
    </section>
    <PayrollButton active disabled={saving} onClick={save}><Save className="h-4 w-4" />Ruaj ndryshimet</PayrollButton>
  </div>;
}