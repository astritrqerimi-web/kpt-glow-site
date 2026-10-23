import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { sq, enGB } from "date-fns/locale";
import { nextDeadline, formatCountdownTitle, type CountdownGroup } from "@/lib/deadline-countdown";

export function DeadlineCountdowns({ groups, al }: { groups: CountdownGroup[]; al: boolean }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 15000);
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
            <div className="min-h-12 text-right text-primary" aria-live="polite" aria-atomic="true">{due && (() => { const { days, hours, minutes } = due.remaining; const done = days === 0 && hours === 0 && minutes === 0; return <><span className="block text-3xl font-bold leading-[1.15] tabular-nums">{days}</span><span className="text-xs font-bold leading-tight">{done ? (al ? "Afati sot" : "Due today") : al ? `ditë · ${hours} orë · ${minutes} min` : `days · ${hours} hr · ${minutes} min`}</span></>; })()}</div>
          </div>
          <ul className="space-y-3">{group.forms.map((form, j) => <li key={j} className="text-sm leading-relaxed [overflow-wrap:anywhere]">{form.abbr && <span className="mr-1 font-semibold text-primary">{form.abbr} —</span>}{al ? form.formAl : form.formEn}</li>)}</ul>
        </article>;
      })}
    </div>
  </section>;
}