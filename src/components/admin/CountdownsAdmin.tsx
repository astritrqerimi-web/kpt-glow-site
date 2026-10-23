import { Plus, Trash2 } from "lucide-react";
import { PayrollButton } from "@/components/payroll/PayrollButton";
import { type CountdownGroup } from "@/lib/deadline-countdown";

const fieldClass = "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
export function CountdownsAdmin({ groups, onChange }: { groups: CountdownGroup[]; onChange: (groups: CountdownGroup[]) => void }) {
  const patch = (i: number, change: Partial<CountdownGroup>) => onChange(groups.map((g, j) => i === j ? { ...g, ...change } : g));
  return <section className="border-b border-border pb-8">
    <h3 className="mb-4 text-xl tracking-normal">Numërimi i afateve të ardhshme</h3>
    <div className="space-y-4">{groups.map((g, i) => <fieldset key={i} className="rounded-lg border border-border p-4">
      <legend className="px-1 text-sm font-semibold">Grupi {i + 1}</legend>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">Titulli (SQ)<input className={fieldClass} value={g.titleAl} onChange={e => patch(i, { titleAl: e.target.value })} /></label>
        <label className="text-sm">Title (EN)<input className={fieldClass} value={g.titleEn} onChange={e => patch(i, { titleEn: e.target.value })} /></label>
        <label className="text-sm">Përsëritja<select className={fieldClass} value={g.frequency} onChange={e => { const frequency = e.target.value; if (frequency === "monthly" || frequency === "quarterly" || frequency === "annual") patch(i, { frequency }); }}><option value="monthly">Çdo muaj</option><option value="quarterly">Pas çdo tremujori</option><option value="annual">Çdo vit</option></select></label>
        <label className="text-sm">Dita e afatit<input className={fieldClass} type="number" min={1} max={31} value={g.day} onChange={e => patch(i, { day: Number(e.target.value) })} /></label>
        {g.frequency === "annual" && <label className="text-sm">Muaji (1–12)<input className={fieldClass} type="number" min={1} max={12} value={g.month} onChange={e => patch(i, { month: Number(e.target.value) })} /></label>}
      </div>
      <div className="mt-4 space-y-3">{g.forms.map((f, j) => {
        const update = (change: Partial<typeof f>) => patch(i, { forms: g.forms.map((form, k) => j === k ? { ...form, ...change } : form) });
        return <div key={j} className="grid items-end gap-3 border-t border-border pt-3 md:grid-cols-[1fr_1fr_100px_auto]">
          <label className="text-xs text-muted-foreground">Formulari (SQ)<input className={fieldClass} value={f.formAl} onChange={e => update({ formAl: e.target.value })} /></label>
          <label className="text-xs text-muted-foreground">Form (EN)<input className={fieldClass} value={f.formEn} onChange={e => update({ formEn: e.target.value })} /></label>
          <label className="text-xs text-muted-foreground">Kodi<input className={fieldClass} value={f.abbr} onChange={e => update({ abbr: e.target.value })} /></label>
          <PayrollButton title="Hiq formularin" aria-label={`Hiq formularin ${j + 1} nga grupi ${i + 1}`} onClick={() => patch(i, { forms: g.forms.filter((_, k) => k !== j) })}><Trash2 className="h-4 w-4" /></PayrollButton>
        </div>;
      })}</div>
      <div className="mt-4 flex flex-wrap gap-3">
        <PayrollButton onClick={() => patch(i, { forms: [...g.forms, { formAl: "", formEn: "", abbr: "" }] })}><Plus className="h-4 w-4" />Shto formular</PayrollButton>
        <PayrollButton onClick={() => onChange(groups.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" />Hiq grupin</PayrollButton>
      </div>
    </fieldset>)}</div>
    <PayrollButton className="mt-4" onClick={() => onChange([...groups, { titleAl: "", titleEn: "", frequency: "monthly", day: 15, month: 3, forms: [] }])}><Plus className="h-4 w-4" />Shto grup</PayrollButton>
  </section>;
}