import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles } from "lucide-react";
import { explainPayroll } from "@/lib/payroll-ai/explain.functions";
import { explanationInputSchema, type ExplanationInput } from "@/lib/payroll-ai/input";
import type { PayrollCopyKey } from "@/lib/payroll-copy";
import { PayrollButton } from "./PayrollButton";

export function SalaryExplanation({ input, text }: { input: ExplanationInput; text: (key: PayrollCopyKey) => string }) {
  const explain = useServerFn(explainPayroll);
  const [pending,setPending] = useState(false);
  const [answer,setAnswer] = useState("");
  const [error,setError] = useState("");
  const generate = async () => {
    if (pending || !explanationInputSchema.safeParse(input).success) return;
    setPending(true); setError(""); setAnswer("");
    try {
      const response = await explain({data:input});
      if (response.error) setError(response.error);
      else setAnswer(response.text ?? "");
    } catch { setError(text("aiError")); }
    finally { setPending(false); }
  };
  return <section className="mt-7 border-t border-border pt-6">
    <PayrollButton active disabled={pending} onClick={generate}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{text(pending ? "aiLoading" : "aiExplain")}</PayrollButton>
    {pending && <p role="status" className="sr-only">{text("aiLoading")}</p>}
    {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
    {answer && <div className="mt-5" aria-live="polite"><h2 className="text-xl tracking-normal">{text("aiTitle")}</h2><p data-testid="salary-explanation" className="mt-4 whitespace-pre-line break-words text-sm leading-relaxed">{answer}</p><p className="mt-4 text-xs text-muted-foreground">{text("aiDisclaimer")}</p></div>}
  </section>;
}