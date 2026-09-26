export type ApptSettings = {
  working_days: number[]; // ISO 1=Mon..7=Sun
  open_time: string;
  close_time: string;
  slot_minutes: number;
};
export type ApptBlock = { id: string; block_date: string; block_time: string | null; reason: string | null };
export type ApptStatus = "new" | "confirmed" | "cancelled";

export const DEFAULT_SETTINGS: ApptSettings = { working_days: [1, 2, 3, 4, 5], open_time: "08:00", close_time: "16:00", slot_minutes: 30 };

export const STATUS_LABEL: Record<ApptStatus, string> = { new: "I RI", confirmed: "I KONFIRMUAR", cancelled: "I ANULUAR" };
export const STATUS_CLASS: Record<ApptStatus, string> = {
  new: "bg-primary text-primary-foreground",
  confirmed: "bg-accent text-accent-foreground border border-primary/30",
  cancelled: "bg-muted text-muted-foreground line-through",
};

const pad = (n: number) => String(n).padStart(2, "0");
export const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
export const fromMin = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => isoDate(new Date());
export const fmtDate = (iso: string) => iso.split("-").reverse().join(".");
export const isoDow = (iso: string) => { const d = new Date(iso + "T12:00:00"); return ((d.getDay() + 6) % 7) + 1; };

/** All slots defined by working hours for a date (ignores bookings/blocks). */
export function allSlots(s: ApptSettings, date: string): string[] {
  if (!date || !s.working_days.includes(isoDow(date))) return [];
  const out: string[] = [];
  for (let m = toMin(s.open_time); m + s.slot_minutes <= toMin(s.close_time); m += s.slot_minutes) out.push(fromMin(m));
  return out;
}

export function availableSlots(s: ApptSettings, blocks: ApptBlock[], booked: string[], date: string): string[] {
  if (!date || date < todayISO()) return [];
  const dayBlocks = blocks.filter((b) => b.block_date === date);
  if (dayBlocks.some((b) => !b.block_time)) return [];
  const blockedTimes = new Set(dayBlocks.map((b) => b.block_time));
  const now = new Date();
  const cur = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  return allSlots(s, date).filter((t) => !blockedTimes.has(t) && !booked.includes(t) && (date !== todayISO() || t > cur));
}
