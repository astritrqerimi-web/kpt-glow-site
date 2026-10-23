import { test } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";
import { countdownGroupSchema, kosovoDay, nextDeadline, type CountdownGroup } from "./deadline-countdown";
import { resolveDeadlinesContent } from "./deadlines-content";

const group = (frequency: CountdownGroup["frequency"], day: number, month = 3): CountdownGroup => ({ titleAl: "", titleEn: "", frequency, day, month, forms: [] });
test("monthly 15 groups WM/CM and WR and advances to November 16 after weekend", () => {
  const g = resolveDeadlinesContent(null).countdowns[0];
  deepStrictEqual(g.forms.map(f => f.abbr), ["WM/CM", "WR"]);
  strictEqual(nextDeadline(g, new Date("2026-10-23T01:23:00Z")).isoDate, "2026-11-16");
});
test("monthly 20 groups TV and advances after expiry", () => {
  const g = resolveDeadlinesContent(null).countdowns[1];
  deepStrictEqual(g.forms.map(f => f.abbr), ["TV"]);
  strictEqual(nextDeadline(g, new Date("2026-10-23T01:23:00Z")).isoDate, "2026-11-20");
});
test("quarterly 15 after quarter end groups IS IL QS QL", () => {
  const g = resolveDeadlinesContent(null).countdowns[2];
  deepStrictEqual(g.forms.map(f => f.abbr), ["IS", "IL", "QS", "QL"]);
  strictEqual(nextDeadline(g, new Date("2026-10-23T01:23:00Z")).isoDate, "2027-01-15");
});
test("annual March 31 groups PD CD", () => {
  const g = resolveDeadlinesContent(null).countdowns[3];
  deepStrictEqual(g.forms.map(f => f.abbr), ["PD", "CD"]);
  strictEqual(nextDeadline(g, new Date("2026-10-23T01:23:00Z")).isoDate, "2027-03-31");
});
test("Saturday and Sunday both defer to Monday", () => {
  strictEqual(nextDeadline(group("monthly", 15), new Date("2026-08-01T10:00:00Z")).isoDate, "2026-08-17");
  strictEqual(nextDeadline(group("monthly", 15), new Date("2026-11-01T10:00:00Z")).isoDate, "2026-11-16");
});
test("deadline remains due throughout Kosovo due date, then advances at local midnight", () => {
  const g = group("monthly", 15);
  strictEqual(nextDeadline(g, new Date("2026-11-16T22:59:59Z")).daysRemaining, 0);
  strictEqual(nextDeadline(g, new Date("2026-11-16T23:00:00Z")).isoDate, "2026-12-15");
});
test("day counting crosses DST without elapsed-hour errors", () => {
  strictEqual(kosovoDay(new Date("2026-10-25T23:00:00Z")) - kosovoDay(new Date("2026-10-24T22:00:00Z")), 1);
  strictEqual(nextDeadline(group("monthly", 15), new Date("2026-10-23T01:23:00Z")).daysRemaining, 24);
});
test("annual weekend postponement can cross year end", () => strictEqual(nextDeadline(group("annual", 31, 12), new Date("2023-01-01T10:00:00Z")).isoDate, "2023-01-02"));
test("admin edited recurrence, names and codes persist through resolution", () => {
  const custom = { ...group("annual", 20, 6), forms: [{ formAl: "Test", formEn: "Test EN", abbr: "X" }] };
  const resolved = resolveDeadlinesContent({ countdowns: [custom] });
  deepStrictEqual(resolved.countdowns, [custom]);
  strictEqual(nextDeadline(resolved.countdowns[0], new Date("2026-01-01T10:00:00Z")).isoDate, "2026-06-22");
});
test("invalid configured days rejected", () => strictEqual(countdownGroupSchema.safeParse(group("monthly", 32)).success, false));