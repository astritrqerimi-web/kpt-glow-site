import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { PayrollButton } from "./PayrollButton";
import type { PayrollPdfData } from "@/lib/payroll-pdf";
export function PayrollPdfButton({data,label,loadingLabel,errorLabel}: {data:PayrollPdfData;label:string;loadingLabel:string;errorLabel:string}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState(false),[ready,setReady]=useState<Blob|null>(null);
  const download=async () => {
    setError(false);
    try {
      const {createPayrollPdf,downloadPayrollPdf}=await import("@/lib/payroll-pdf");
      if(ready){await downloadPayrollPdf(ready,"kpt-kalkulimi-i-pages.pdf");return;}
      setBusy(true);const blob=await createPayrollPdf(data);
      if(matchMedia("(pointer: coarse)").matches){setReady(blob);return;}
      await downloadPayrollPdf(blob,"kpt-kalkulimi-i-pages.pdf");
    } catch {setError(true);} finally {setBusy(false);}
  };
  return <div><PayrollButton active disabled={busy} onClick={download}>{busy?<Loader2 className="h-4 w-4 animate-spin"/>:<Download className="h-4 w-4"/>}{busy?loadingLabel:label}</PayrollButton>{error&&<p role="alert" className="mt-2 text-sm text-destructive">{errorLabel}</p>}</div>;
}