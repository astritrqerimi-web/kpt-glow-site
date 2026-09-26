import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarDays, ChevronLeft, ChevronRight, List, Loader2, Settings2, Trash2, X, Plus } from "lucide-react";
import {
  allSlots, DEFAULT_SETTINGS, fmtDate, isoDate, STATUS_CLASS, STATUS_LABEL, todayISO,
  type ApptBlock, type ApptSettings, type ApptStatus,
} from "@/lib/appointments";

type Appt = {
  id: string; name: string; email: string; phone: string | null; subject: string | null; message: string;
  appointment_date: string; appointment_time: string; status: ApptStatus; internal_notes: string | null; created_at: string;
};

const db = supabase as any;
const inputCls = "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const DAY_NAMES = ["Hë", "Ma", "Më", "En", "Pr", "Sh", "Di"];
const MONTHS = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];

function StatusBadge({ s }: { s: ApptStatus }) {
  return <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_CLASS[s]}`}>{STATUS_LABEL[s]}</span>;
}

export function AppointmentsAdmin() {
  const [items, setItems] = useState<Appt[] | null>(null);
  const [view, setView] = useState<"calendar" | "list" | "settings">("calendar");
  const [selected, setSelected] = useState<Appt | null>(null);

  const load = async () => {
    const { data, error } = await db.from("contact_messages").select("*").not("appointment_date", "is", null)
      .order("appointment_date", { ascending: true }).order("appointment_time", { ascending: true });
    if (error) return toast.error(error.message);
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  if (!items) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
  const newCount = items.filter((a) => a.status === "new").length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl">
          Terminet <span className="text-sm font-normal text-muted-foreground">({items.length} · {newCount} të reja)</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {([["calendar", "Kalendari", CalendarDays], ["list", "Lista", List], ["settings", "Orari & bllokimet", Settings2]] as const).map(([k, l, I]) => (
            <button key={k} onClick={() => setView(k)} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs border transition ${view === k ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`}>
              <I className="h-3.5 w-3.5" /> {l}
            </button>
          ))}
        </div>
      </div>
      {view === "calendar" && <CalendarView items={items} onOpen={setSelected} />}
      {view === "list" && <ListView items={items} onOpen={setSelected} />}
      {view === "settings" && <AvailabilitySettings />}
      {selected && <DetailsModal appt={selected} onClose={() => setSelected(null)} onSaved={async () => { setSelected(null); await load(); }} />}
    </div>
  );
}

// ---------- Calendar ----------
function startOfWeek(d: Date) { const x = new Date(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }

function ApptChip({ a, onOpen }: { a: Appt; onOpen: (a: Appt) => void }) {
  return (
    <button onClick={() => onOpen(a)} className={`w-full text-left rounded-lg px-2 py-1 text-[11px] leading-tight border transition hover:shadow-soft ${a.status === "new" ? "border-primary bg-primary/10 ring-1 ring-primary/40" : a.status === "cancelled" ? "border-border/50 bg-muted/50 opacity-60" : "border-primary/20 bg-background"}`}>
      <div className="font-semibold">{a.appointment_time} · {a.name}</div>
      <div className="truncate text-muted-foreground">{a.subject}</div>
      <StatusBadge s={a.status} />
    </button>
  );
}

function CalendarView({ items, onOpen }: { items: Appt[]; onOpen: (a: Appt) => void }) {
  const [mode, setMode] = useState<"month" | "week" | "day">("month");
  const [cursor, setCursor] = useState(new Date());
  const byDate = useMemo(() => {
    const m: Record<string, Appt[]> = {};
    for (const a of items) (m[a.appointment_date] ??= []).push(a);
    return m;
  }, [items]);
  const today = todayISO();

  const move = (dir: number) => {
    const d = new Date(cursor);
    if (mode === "month") d.setMonth(d.getMonth() + dir);
    else d.setDate(d.getDate() + dir * (mode === "week" ? 7 : 1));
    setCursor(d);
  };

  let title = "";
  let body: React.ReactNode = null;
  if (mode === "month") {
    title = `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`;
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = startOfWeek(first);
    const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));
    body = (
      <div className="grid grid-cols-7 gap-1">
        {DAY_NAMES.map((d) => <div key={d} className="text-center text-[11px] uppercase text-muted-foreground py-1">{d}</div>)}
        {days.map((d) => {
          const iso = isoDate(d);
          const list = byDate[iso] ?? [];
          const other = d.getMonth() !== cursor.getMonth();
          return (
            <div key={iso} className={`min-h-[64px] sm:min-h-[96px] rounded-xl border p-1 ${iso === today ? "border-primary" : "border-border/50"} ${other ? "opacity-40" : "bg-background/60"}`}>
              <button onClick={() => { setCursor(d); setMode("day"); }} className="text-[11px] font-medium hover:text-primary">{d.getDate()}</button>
              <div className="mt-1 space-y-1 hidden sm:block">
                {list.slice(0, 3).map((a) => <ApptChip key={a.id} a={a} onOpen={onOpen} />)}
                {list.length > 3 && <div className="text-[10px] text-muted-foreground">+{list.length - 3} të tjera</div>}
              </div>
              {list.length > 0 && (
                <button onClick={() => { setCursor(d); setMode("day"); }} className="sm:hidden mt-1 flex gap-0.5 flex-wrap">
                  {list.map((a) => <span key={a.id} className={`h-1.5 w-1.5 rounded-full ${a.status === "new" ? "bg-primary" : a.status === "confirmed" ? "bg-foreground/60" : "bg-muted-foreground/40"}`} />)}
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  } else if (mode === "week") {
    const start = startOfWeek(cursor);
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    title = `${fmtDate(isoDate(days[0]))} – ${fmtDate(isoDate(days[6]))}`;
    body = (
      <div className="grid gap-2 md:grid-cols-7">
        {days.map((d, i) => {
          const iso = isoDate(d);
          const list = byDate[iso] ?? [];
          return (
            <div key={iso} className={`rounded-xl border p-2 min-h-[80px] md:min-h-[240px] ${iso === today ? "border-primary" : "border-border/50"} bg-background/60`}>
              <div className="text-xs font-medium mb-2">{DAY_NAMES[i]} {d.getDate()}.{d.getMonth() + 1}</div>
              <div className="space-y-1">
                {list.map((a) => <ApptChip key={a.id} a={a} onOpen={onOpen} />)}
                {list.length === 0 && <div className="text-[11px] text-muted-foreground">—</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    const iso = isoDate(cursor);
    title = `${DAY_NAMES[(cursor.getDay() + 6) % 7]}, ${fmtDate(iso)}`;
    const list = byDate[iso] ?? [];
    body = (
      <div className="space-y-2">
        {list.length === 0 && <div className="text-sm text-muted-foreground">Asnjë termin për këtë ditë.</div>}
        {list.map((a) => <ApptChip key={a.id} a={a} onOpen={onOpen} />)}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-3 sm:p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => move(-1)} className="rounded-full border border-border p-1.5 hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => setCursor(new Date())} className="rounded-full border border-border px-3 py-1 text-xs hover:bg-muted">Sot</button>
          <button onClick={() => move(1)} className="rounded-full border border-border p-1.5 hover:bg-muted"><ChevronRight className="h-4 w-4" /></button>
          <div className="ml-2 font-semibold">{title}</div>
        </div>
        <div className="flex gap-1">
          {([["month", "Muaji"], ["week", "Java"], ["day", "Dita"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setMode(k)} className={`rounded-full px-3 py-1 text-xs border ${mode === k ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`}>{l}</button>
          ))}
        </div>
      </div>
      {body}
    </div>
  );
}

// ---------- List ----------
function ListView({ items, onOpen }: { items: Appt[]; onOpen: (a: Appt) => void }) {
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | ApptStatus>("upcoming");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");
  const today = todayISO();
  const query = q.trim().toLowerCase();
  const filtered = items.filter((a) => {
    if (filter === "today" && a.appointment_date !== today) return false;
    if (filter === "upcoming" && (a.appointment_date < today || a.status === "cancelled")) return false;
    if ((filter === "new" || filter === "confirmed" || filter === "cancelled") && a.status !== filter) return false;
    if (from && a.appointment_date < from) return false;
    if (to && a.appointment_date > to) return false;
    if (query && ![a.name, a.email, a.phone].some((v) => (v ?? "").toLowerCase().includes(query))) return false;
    return true;
  });
  const chips: [typeof filter, string][] = [["all", "Të gjitha"], ["today", "Sot"], ["upcoming", "Në vijim"], ["new", "Të reja"], ["confirmed", "Të konfirmuara"], ["cancelled", "Të anuluara"]];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-2">
        {chips.map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} className={`rounded-full px-3 py-1.5 text-xs border ${filter === k ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`}>{l}</button>
        ))}
        <label className="text-[11px] text-muted-foreground">Nga<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls + " mt-0.5 !py-1.5"} /></label>
        <label className="text-[11px] text-muted-foreground">Deri<input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputCls + " mt-0.5 !py-1.5"} /></label>
        <input type="search" placeholder="Kërko emër, email, telefon..." value={q} onChange={(e) => setQ(e.target.value)} className="w-full sm:w-64 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
      </div>
      {filtered.length === 0 && <div className="text-sm text-muted-foreground">Asnjë termin.</div>}
      <div className="grid gap-2">
        {filtered.map((a) => (
          <button key={a.id} onClick={() => onOpen(a)} className={`text-left rounded-2xl border p-4 backdrop-blur shadow-soft transition hover:shadow-elegant ${a.status === "new" ? "border-primary/40 bg-background/90 ring-1 ring-primary/30" : "border-border/40 bg-background/60"}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-semibold">📅 {fmtDate(a.appointment_date)} · {a.appointment_time}</div>
              <StatusBadge s={a.status} />
            </div>
            <div className="mt-1 text-sm">{a.name} <span className="text-xs text-muted-foreground">· {a.email} · {a.phone}</span></div>
            {a.subject && <div className="text-xs text-muted-foreground">{a.subject}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Details ----------
function DetailsModal({ appt, onClose, onSaved }: { appt: Appt; onClose: () => void; onSaved: () => void }) {
  const [date, setDate] = useState(appt.appointment_date);
  const [time, setTime] = useState(appt.appointment_time);
  const [notes, setNotes] = useState(appt.internal_notes ?? "");
  const [busy, setBusy] = useState(false);

  const save = async (patch: Record<string, unknown>) => {
    setBusy(true);
    const { error } = await db.from("contact_messages").update({ ...patch, is_read: true }).eq("id", appt.id);
    setBusy(false);
    if (error) {
      if (error.code === "23505" || /slot_unavailable/.test(error.message)) toast.error("Ky orar është i zënë ose i bllokuar.");
      else toast.error(error.message);
      return;
    }
    toast.success("U ruajt");
    onSaved();
  };

  const row = (k: string, v: React.ReactNode) => (
    <div className="grid grid-cols-[130px_1fr] gap-2 py-1.5 border-b border-border/40 text-sm"><div className="text-muted-foreground">{k}</div><div className="min-w-0 break-words">{v}</div></div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 p-0 sm:p-4" onClick={onClose}>
      <div className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-border bg-background p-5 sm:p-6 shadow-elegant" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-xl">Detajet e terminit</h3>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        {row("Emri i klientit", appt.name)}
        {row("Email", <a className="text-primary" href={`mailto:${appt.email}`}>{appt.email}</a>)}
        {row("Telefoni", appt.phone ? <a className="text-primary" href={`tel:${appt.phone}`}>{appt.phone}</a> : "-")}
        {row("Shërbimi", appt.subject ?? "-")}
        {row("Data e terminit", fmtDate(appt.appointment_date))}
        {row("Ora", appt.appointment_time)}
        {row("Mesazhi", <span className="whitespace-pre-wrap">{appt.message}</span>)}
        {row("Dërguar më", new Date(appt.created_at).toLocaleString("sq-AL"))}
        {row("Statusi", <StatusBadge s={appt.status} />)}

        <div className="mt-4 flex flex-wrap gap-2">
          <button disabled={busy || appt.status === "confirmed"} onClick={() => save({ status: "confirmed" })} className="rounded-full px-4 py-2 text-xs font-medium text-white shadow-soft disabled:opacity-50" style={{ background: "var(--gradient-brand)" }}>Konfirmo</button>
          <button disabled={busy || appt.status === "cancelled"} onClick={() => save({ status: "cancelled" })} className="rounded-full border border-border px-4 py-2 text-xs hover:bg-destructive/10 hover:text-destructive disabled:opacity-50">Anulo</button>
          {appt.status !== "new" && <button disabled={busy} onClick={() => save({ status: "new" })} className="rounded-full border border-border px-4 py-2 text-xs hover:bg-muted">Kthe në "I ri"</button>}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="text-xs text-muted-foreground">Ndrysho datën<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls + " mt-1"} /></label>
          <label className="text-xs text-muted-foreground">Ndrysho orën<input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls + " mt-1"} /></label>
        </div>
        <label className="mt-3 block text-xs text-muted-foreground">Shënime të brendshme
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls + " mt-1 resize-none"} />
        </label>
        <button disabled={busy} onClick={() => save({ appointment_date: date, appointment_time: time, internal_notes: notes || null })} className="mt-3 rounded-full border border-primary px-4 py-2 text-xs text-primary hover:bg-primary/10 disabled:opacity-50">
          {busy ? "Duke ruajtur..." : "Ruaj ndryshimet"}
        </button>
      </div>
    </div>
  );
}

// ---------- Availability settings ----------
function AvailabilitySettings() {
  const [s, setS] = useState<ApptSettings | null>(null);
  const [blocks, setBlocks] = useState<ApptBlock[]>([]);
  const [nb, setNb] = useState({ date: "", time: "", reason: "" });
  const [saving, setSaving] = useState(false);

  const loadBlocks = async () => {
    const { data } = await db.from("appointment_blocks").select("*").gte("block_date", todayISO()).order("block_date").order("block_time");
    setBlocks(data ?? []);
  };
  useEffect(() => {
    (async () => {
      const { data } = await db.from("appointment_settings").select("*").eq("id", 1).maybeSingle();
      setS(data ?? DEFAULT_SETTINGS);
      loadBlocks();
    })();
  }, []);
  if (!s) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;

  const saveSettings = async () => {
    if (s.open_time >= s.close_time) return toast.error("Ora e mbylljes duhet të jetë pas hapjes.");
    setSaving(true);
    const { error } = await db.from("appointment_settings").upsert({ id: 1, working_days: s.working_days, open_time: s.open_time, close_time: s.close_time, slot_minutes: s.slot_minutes, updated_at: new Date().toISOString() });
    setSaving(false);
    error ? toast.error(error.message) : toast.success("Orari u ruajt");
  };
  const addBlock = async () => {
    if (!nb.date) return toast.error("Zgjidhni datën.");
    const { error } = await db.from("appointment_blocks").insert({ block_date: nb.date, block_time: nb.time || null, reason: nb.reason || null });
    if (error) return toast.error(error.message);
    setNb({ date: "", time: "", reason: "" });
    loadBlocks();
  };
  const delBlock = async (id: string) => { await db.from("appointment_blocks").delete().eq("id", id); loadBlocks(); };
  const slotOpts = nb.date ? allSlots({ ...s, working_days: [1, 2, 3, 4, 5, 6, 7] }, nb.date) : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-5 shadow-soft space-y-4">
        <h3 className="font-semibold">Orari i punës</h3>
        <div>
          <div className="text-xs text-muted-foreground mb-2">Ditët e punës</div>
          <div className="flex flex-wrap gap-1.5">
            {DAY_NAMES.map((d, i) => {
              const n = i + 1; const on = s.working_days.includes(n);
              return <button key={d} onClick={() => setS({ ...s, working_days: on ? s.working_days.filter((x) => x !== n) : [...s.working_days, n].sort() })} className={`rounded-full px-3 py-1.5 text-xs border ${on ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>{d}</button>;
            })}
          </div>
        </div>
        <div className="grid gap-3 grid-cols-3">
          <label className="text-xs text-muted-foreground">Hapja<input type="time" value={s.open_time} onChange={(e) => setS({ ...s, open_time: e.target.value })} className={inputCls + " mt-1"} /></label>
          <label className="text-xs text-muted-foreground">Mbyllja<input type="time" value={s.close_time} onChange={(e) => setS({ ...s, close_time: e.target.value })} className={inputCls + " mt-1"} /></label>
          <label className="text-xs text-muted-foreground">Kohëzgjatja (min)
            <select value={s.slot_minutes} onChange={(e) => setS({ ...s, slot_minutes: Number(e.target.value) })} className={inputCls + " mt-1"}>
              {[15, 20, 30, 45, 60, 90, 120].map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
        </div>
        <button disabled={saving} onClick={saveSettings} className="rounded-full px-5 py-2 text-xs font-medium text-white shadow-soft disabled:opacity-60" style={{ background: "var(--gradient-brand)" }}>{saving ? "Duke ruajtur..." : "Ruaj orarin"}</button>
      </div>

      <div className="rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-5 shadow-soft space-y-4">
        <h3 className="font-semibold">Bllokimet (festa, pushime, takime)</h3>
        <div className="grid gap-2 sm:grid-cols-[1fr_1fr]">
          <label className="text-xs text-muted-foreground">Data<input type="date" min={todayISO()} value={nb.date} onChange={(e) => setNb({ ...nb, date: e.target.value, time: "" })} className={inputCls + " mt-1"} /></label>
          <label className="text-xs text-muted-foreground">Orari
            <select value={nb.time} onChange={(e) => setNb({ ...nb, time: e.target.value })} className={inputCls + " mt-1"}>
              <option value="">Gjithë dita</option>
              {slotOpts.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <input placeholder="Arsyeja (p.sh. Festë zyrtare)" value={nb.reason} onChange={(e) => setNb({ ...nb, reason: e.target.value })} className={inputCls} />
        <button onClick={addBlock} className="inline-flex items-center gap-1.5 rounded-full border border-primary px-4 py-2 text-xs text-primary hover:bg-primary/10"><Plus className="h-3.5 w-3.5" /> Shto bllokim</button>
        <div className="space-y-1.5">
          {blocks.length === 0 && <div className="text-xs text-muted-foreground">Asnjë bllokim aktiv.</div>}
          {blocks.map((b) => (
            <div key={b.id} className="flex items-center justify-between gap-2 rounded-xl border border-border/50 px-3 py-2 text-sm">
              <div>{fmtDate(b.block_date)} · <span className="font-medium">{b.block_time ?? "Gjithë dita"}</span>{b.reason && <span className="text-muted-foreground"> — {b.reason}</span>}</div>
              <button onClick={() => delBlock(b.id)} className="rounded-full p-1.5 hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
