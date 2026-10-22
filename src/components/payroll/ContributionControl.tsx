import { Minus, Plus } from "lucide-react";
import { PayrollButton } from "./PayrollButton";

export function ContributionControl({ label, value, onChange, decrease, increase }: {
  label: string; value: number; onChange: (value: number) => void; decrease: string; increase: string;
}) {
  return <div className="flex min-w-0 items-center gap-2 text-xs">
    <span className="text-muted-foreground">{label}</span>
    <PayrollButton className="h-7 w-7 shrink-0 rounded-full p-0!" aria-label={`${decrease} — ${label}`} title={`${decrease} — ${label}`} disabled={value <= 5} onClick={() => onChange(Math.max(5, value - 1))}><Minus className="h-3 w-3 shrink-0" /></PayrollButton>
    <span className="w-10 shrink-0 text-center font-semibold tabular-nums">{value}%</span>
    <PayrollButton className="h-7 w-7 shrink-0 rounded-full p-0!" aria-label={`${increase} — ${label}`} title={`${increase} — ${label}`} disabled={value >= 15} onClick={() => onChange(Math.min(15, value + 1))}><Plus className="h-3 w-3 shrink-0" /></PayrollButton>
  </div>;
}