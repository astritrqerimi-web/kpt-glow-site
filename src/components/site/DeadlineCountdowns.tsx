import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { sq, enGB } from "date-fns/locale";
import { nextDeadline, formatCountdownTitle, type CountdownGroup } from "@/lib/deadline-countdown";

export function DeadlineCountdowns({ groups, al }: { groups: CountdownGroup[]; al: boolean }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("focus", update);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", update); window.removeEventListener("focus", update); };
  }, []);
  if (groups.length === 0) return null;
  return <section aria-labelledby="upcoming-deadlines" className="mb-10">
    <h2 id="upcoming-deadlines" className="mb-2 text-2xl tracking-normal">{al ? "Afatet e ardhshme" : "Upcoming deadlines"}</h2>
    <p className="mb-5 text-sm text-muted-foreground">{al ? "Sipas kohës lokale në Kosovë. Afatet që bien në fundjavë shtyhen për të hënën." : "Kosovo local time. Weekend deadlines are postponed to Monday."}</p>
    <div className="grid gap-4 sm:grid-cols-2">
      {groups.map((group, i) => {
        const due = now ? nextDeadline(group, now) : null;
        return <article key={i} className="min-w-0 rounded-lg border border-border bg-card p-5 shadow-soft">
          <h3 className="flex items-start gap-2 text-base leading-tight font-semibold tracking-normal"><CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{formatCountdownTitle(al ? group.titleAl : group.titleEn, due?.date ?? null)}</h3>
          <div className="mt-1 mb-2.5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-2.5">
            <time dateTime={due?.isoDate} className="text-base font-semibold">{due ? `${due.date.getUTCDate()} ${(al ? sq : enGB).localize.month(due.date.getUTCMonth() as 0, { width: "wide" })} ${due.date.getUTCFullYear()}` : "—"}</time>
            <div className="flex min-h-8 flex-wrap justify-end gap-1.5" aria-live="off" aria-atomic="true">{due && (() => { const units: [number, string][] = [[due.remaining.days, al ? "ditë" : "days"], [due.remaining.hours, al ? "orë" : "hrs"], [due.remaining.minutes, al ? "min" : "min"], [due.remaining.seconds, al ? "sek" : "sec"]]; const done = units.every(([v]) => v === 0); return done ? <span className="self-center text-xs font-bold text-primary sm:text-sm">{al ? "Afati sot" : "Due today"}</span> : units.map(([value, label], k) => <span key={k} className="min-w-[42px] rounded-lg border border-border bg-muted/30 px-1 py-1 text-center sm:min-w-[48px]"><span className="block text-sm font-bold leading-tight tabular-nums text-primary sm:text-base">{value}</span><span className="block text-[9px] font-medium leading-tight text-muted-foreground sm:text-[10px]">{label}</span></span>); })()}</div>
          </div>
          <ul className="space-y-3">{group.forms.map((form, j) => <li key={j} className="text-sm leading-relaxed [overflow-wrap:anywhere]">{form.abbr && <span className="mr-1 font-semibold text-primary">{form.abbr} —</span>}{al ? form.formAl : form.formEn}</li>)}</ul>
        </article>;
      })}
    </div>
  </section>;
}