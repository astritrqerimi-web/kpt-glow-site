import { z } from "zod";
import { PAYROLL_COPY } from "./payroll-copy";

const bilingual = z.object({ al: z.string().max(4000), en: z.string().max(4000) });
const textShape = Object.fromEntries(Object.entries(PAYROLL_COPY).map(([key, copy]) => [key, bilingual.default(copy)])) as Record<keyof typeof PAYROLL_COPY, z.ZodDefault<typeof bilingual>>;
export const payrollConfigSchema = z.object({
  texts: z.object(textShape),
  employeeRate: z.number().min(5).max(15),
  employerRate: z.number().min(5).max(15),
  secondaryRate: z.number().min(0).max(100),
  minimumWage: z.number().min(0).max(100000),
  employerMinimumRate: z.number().min(0).max(100),
  brackets: z.array(z.object({ upTo: z.number().positive().nullable(), rate: z.number().min(0).max(100) })).min(1).max(12),
  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sourceUrl: z.string().url().refine(v => new URL(v).protocol === "https:"),
}).superRefine((v, ctx) => {
  let previous = 0;
  v.brackets.forEach((b, i) => {
    if ((b.upTo === null && i !== v.brackets.length - 1) || (b.upTo !== null && b.upTo <= previous))
      ctx.addIssue({ code: "custom", path: ["brackets", i, "upTo"], message: "Pragjet duhet të rriten; vetëm shkalla e fundit është pa kufi." });
    if (b.upTo !== null) previous = b.upTo;
  });
  if (v.brackets.at(-1)?.upTo !== null) ctx.addIssue({ code: "custom", path: ["brackets"], message: "Shkalla e fundit duhet të jetë pa kufi." });
});
export type PayrollConfig = z.infer<typeof payrollConfigSchema>;
export const DEFAULT_PAYROLL: PayrollConfig = {
  texts: PAYROLL_COPY,
  employeeRate: 5, employerRate: 5, secondaryRate: 10,
  minimumWage: 350, employerMinimumRate: 5,
  brackets: [{ upTo: 250, rate: 0 }, { upTo: 450, rate: 8 }, { upTo: null, rate: 10 }],
  effectiveFrom: "2024-08-23",
  sourceUrl: "https://www.atk-ks.org/en/notice-to-taxpayers-personal-income-tax-rates-are-changed/",
};
export function resolvePayrollConfig(value: unknown): PayrollConfig {
  const result = payrollConfigSchema.safeParse(value);
  return result.success ? result.data : DEFAULT_PAYROLL;
}
export type EmployerType = "primary" | "secondary";
export type PayrollMode = "gross" | "net";
export const cents = (amount: number) => Math.round((amount + Number.EPSILON) * 100);
const percent = (amountCents: number, rate: number) => Math.round(amountCents * rate / 100);
export function payrollFromGross(grossCents: number, config: PayrollConfig, employer: EmployerType, fullTime = true) {
  if (!Number.isSafeInteger(grossCents) || grossCents < 0) throw new Error("Invalid salary");
  const employee = percent(grossCents, config.employeeRate);
  const employerPension = grossCents === 0 ? 0 : Math.max(percent(grossCents, config.employerRate), fullTime ? percent(cents(config.minimumWage), config.employerMinimumRate) : 0);
  const taxable = Math.max(0, grossCents - employee);
  let lower = 0;
  const bands = config.brackets.map(b => {
    const upper = b.upTo === null ? Infinity : cents(b.upTo);
    const base = Math.max(0, Math.min(taxable, upper) - lower);
    const result = { lower, upper, rate: b.rate, base, tax: percent(base, b.rate) };
    lower = upper;
    return result;
  });
  const tax = employer === "secondary" ? percent(taxable, config.secondaryRate) : bands.reduce((sum, b) => sum + b.tax, 0);
  return { gross: grossCents, employee, employerPension, taxable, tax, net: taxable - tax, totalCost: grossCents + employerPension, bands };
}
export function calculatePayroll(amount: number, mode: PayrollMode, config: PayrollConfig, employer: EmployerType, fullTime = true) {
  if (!Number.isFinite(amount) || amount < 0 || amount > 10000000) throw new Error("Invalid salary");
  const target = cents(amount);
  if (mode === "gross") return payrollFromGross(target, config, employer, fullTime);
  let low = 0, high = Math.max(100, target * 2);
  while (payrollFromGross(high, config, employer, fullTime).net < target && high < 100000000000) high *= 2;
  if (payrollFromGross(high, config, employer, fullTime).net < target) throw new Error("Net salary cannot be reached with these rates");
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (payrollFromGross(mid, config, employer, fullTime).net >= target) high = mid;
    else low = mid + 1;
  }
  return payrollFromGross(low, config, employer, fullTime);
}