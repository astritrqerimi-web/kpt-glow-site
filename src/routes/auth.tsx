import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logoAsset from "@/assets/kpt-logo-symbol.png.asset.json";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/admin" });
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") navigate({ to: "/admin" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Mirë se erdhët!");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Llogaria u krijua. Kontaktoni administratorin për akses admin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoAsset.url} alt="KPT Consulting" className="mx-auto h-16 w-16 object-contain" />
          <h1 className="mt-4 font-display text-3xl text-foreground">Paneli i Administrimit</h1>
          <p className="mt-2 text-sm text-muted-foreground">KPT Consulting</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-3xl border border-border/60 bg-background/85 backdrop-blur p-7 shadow-elegant space-y-4">
          <div className="flex gap-1 p-1 rounded-full bg-muted/70">
            <button type="button" onClick={() => setMode("signin")}
              className={`flex-1 rounded-full py-2 text-sm font-medium transition ${mode === "signin" ? "bg-background shadow-soft text-foreground" : "text-muted-foreground"}`}>
              Kyçu
            </button>
            <button type="button" onClick={() => setMode("signup")}
              className={`flex-1 rounded-full py-2 text-sm font-medium transition ${mode === "signup" ? "bg-background shadow-soft text-foreground" : "text-muted-foreground"}`}>
              Regjistrohu
            </button>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium">Email</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium">Fjalëkalimi</span>
            <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </label>

          <button type="submit" disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-white shadow-soft transition hover:shadow-elegant disabled:opacity-60"
            style={{ background: "var(--gradient-brand)" }}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Kyçu" : "Krijo Llogari"}
          </button>
        </form>

        <a href="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-primary">← Kthehu në faqe</a>
      </div>
    </div>
  );
}
