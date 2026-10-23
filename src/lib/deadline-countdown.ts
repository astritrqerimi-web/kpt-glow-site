import { z } from "zod";

export const KOSOVO_TIME_ZONE = "Europe/Belgrade";
const formSchema = z.object({ formAl: z.string(), formEn: z.string(), abbr: z.string() });
export const countdownGroupSchema = z.object({
  titleAl: z.string(), titleEn: z.string(),
  frequency: z.enum(["monthly", "quarterly", "annual"]),
  day: z.number().int().min(1).max(31),
  month: z.number().int().min(1).max(12),
  forms: z.array(formSchema),
});
export type CountdownGroup = z.infer<typeof countdownGroupSchema>;
const DAY_MS = 86400000;

// Treat civil dates as UTC day numbers, not elapsed 24-hour intervals across DST.
export function kosovoDay(now: Date): number {
  const parts = new Intl.DateTimeFormat("en", { timeZone: KOSOVO_TIME_ZONE, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(now);
  const part = (type: string) => Number(parts.find(p => p.type === type)?.value);
  return Date.UTC(part("year"), part("month") - 1, part("day")) / DAY_MS;
}

function adjustedDay(year: number, month: number, day: number): number {
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const date = new Date(Date.UTC(year, month - 1, Math.min(day, lastDay)));
  const weekday = date.getUTCDay();
  return date.getTime() / DAY_MS + (weekday === 6 ? 2 : weekday === 0 ? 1 : 0);
}

// Wall-clock reading in Kosovo time, expressed as if it were UTC (DST-safe civil arithmetic).
function kosovoWallMs(now: Date): number {
  const parts = new Intl.DateTimeFormat("en", { timeZone: KOSOVO_TIME_ZONE, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).formatToParts(now);
  const part = (type: string) => Number(parts.find(p => p.type === type)?.value);
  return Date.UTC(part("year"), part("month") - 1, part("day"), part("hour"), part("minute"), part("second"));
}

export interface RemainingTime { days: number; hours: number; minutes: number }

export function splitRemaining(ms: number): RemainingTime {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  return { days: Math.floor(totalMinutes / 1440), hours: Math.floor(totalMinutes / 60) % 24, minutes: totalMinutes % 60 };
}

export function nextDeadline(group: CountdownGroup, now: Date) {
  const today = kosovoDay(now);
  const year = new Date(today * DAY_MS).getUTCFullYear();
  const months = group.frequency === "annual" ? [group.month] : group.frequency === "quarterly" ? [1, 4, 7, 10] : Array.from({ length: 12 }, (_, i) => i + 1);
  // Include previous year's candidates because weekend deferral may cross New Year.
  const candidates = [year - 1, year, year + 1].flatMap(y => months.map(m => adjustedDay(y, m, group.day))).filter(day => day >= today);
  const due = Math.min(...candidates);
  const dueDate = new Date(due * DAY_MS);
  // Remaining time until the end of the due date (local midnight), counted in Kosovo wall-clock time.
  const dueEndWall = Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate() + 1);
  return {
    date: dueDate,
    daysRemaining: due - today,
    isoDate: dueDate.toISOString().slice(0, 10),
    remaining: splitRemaining(dueEndWall - kosovoWallMs(now)),
  };
}

// Titles may contain the "20xx" placeholder, replaced with the upcoming deadline's year.
export function formatCountdownTitle(title: string, date: Date | null): string {
  return date ? title.replace(/20xx/g, String(date.getUTCFullYear())) : title;
}