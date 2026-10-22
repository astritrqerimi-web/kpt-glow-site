import { createClient } from "@supabase/supabase-js";
import { APICallError } from "ai";
import { calculatePayroll, resolvePayrollConfig } from "../payroll";
import { createResponsesCall } from "./responses.server.ts";
import type { ExplanationInput } from "./input";

export async function explainSalary(input: ExplanationInput, request: Request) {
  const apiKey = process.env.LOVABLE_API_KEY;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  const fallback = input.language === "sq" ? "Shpjegimi me AI nuk është i disponueshëm tani. Provoni më vonë." : "AI explanation is unavailable right now. Please try later.";
  if (!apiKey || !url || !key) return { error: fallback, status: 503 };
  try {
    const db = createClient(url, key, { auth: { persistSession: false }, global: { fetch: (resource, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey",key);
      return fetch(resource, {...init,headers});
    } } });
    const { data, error } = await db.from("site_content").select("value").eq("key","payroll_calculator").maybeSingle();
    if (error) return { error: fallback, status: 503 };
    const config = {...resolvePayrollConfig(data?.value), employeeRate: input.employeeRate, employerRate: input.employerRate};
    const result = calculatePayroll(input.amount,input.mode,config,input.employer,input.fullTime);
    const { result: generation } = createResponsesCall(request, { apiKey, baseURL: "https://ai.gateway.lovable.dev/v1", model: "openai/gpt-6-astra" }, [{ role: "user", content: JSON.stringify({ language: input.language, employer: input.employer, fullTime: input.fullTime, employeeRate: input.employeeRate, employerRate: input.employerRate, secondaryRate: config.secondaryRate, minimumWage: config.minimumWage, employerMinimumRate: config.employerMinimumRate, amountsInEuroCents: {...result, bands: result.bands.map(band => ({...band,upper: Number.isFinite(band.upper) ? band.upper : null}))} }) }],
      "You explain KPT Consulting's Kosovo monthly salary calculation. Reply only in the requested language (sq=Albanian, en=English), in 4 short plain-text paragraphs, at most 180 words. The supplied deterministic amounts in euro cents are authoritative: divide by 100 for EUR, never recalculate or change them. Explain gross pay, employee pension deducted before salary tax, progressive brackets for primary or flat tax for secondary, and exact net salary paid into the bank account. Explain employer pension is an additional employer cost, NOT deducted from employee net. Mention the full-time minimum contribution base only when it affects the result. Do not invent laws, rates, claims or exemptions. End with a brief indicative-calculation caveat. No markdown headings or tables.");
    const text = await generation.text;
    if (await generation.finishReason === "content-filter") return { error: input.language === "sq" ? "AI nuk mund ta shpjegojë këtë përllogaritje." : "AI cannot explain this calculation.", status: 403 };
    if (!text.trim()) return { error: fallback, status: 502 };
    return { text, status: 200 };
  } catch (error) {
    if (request.signal.aborted) return { error: input.language === "sq" ? "Shpjegimi u ndal." : "Explanation stopped.", status: 499 };
    if (APICallError.isInstance(error)) {
      let message = fallback;
      try {
        const body = JSON.parse(error.responseBody ?? "{}");
        const safe = body.message ?? body.error?.message;
        if (typeof safe === "string") message = safe;
      } catch { /* Do not expose raw provider payloads. */ }
      return { error: message, status: error.statusCode ?? 502 };
    }
    return { error: fallback, status: 502 };
  }
}