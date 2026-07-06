import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { servicesQuery, companyQuery, heroQuery, aboutQuery, seoQuery } from "@/lib/site-content";
import { ServiceIcon, ICON_NAMES } from "@/components/site/ServiceIcon";
import { LogOut, Plus, Trash2, Save, Mail, Home, FileEdit, Settings2, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import logoAsset from "@/assets/kpt-logo.png.asset.json";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

type Tab = "services" | "messages" | "content" | "settings";

function AdminPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("services");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setEmail(u.user.email ?? "");
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!error && !!data);
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }
  if (!isAdmin) return <NotAdmin email={email} onSignOut={signOut} />;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="KPT" className="h-9 w-9 object-contain" />
            <div className="hidden sm:block">
              <div className="text-sm font-semibold">KPT Consulting</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Paneli i Administrimit</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs text-muted-foreground mr-2">{email}</span>
            <Link to="/" className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted transition">
              <Home className="h-3.5 w-3.5" /> Faqja
            </Link>
            <button onClick={signOut} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted transition">
              <LogOut className="h-3.5 w-3.5" /> Dilni
            </button>
          </div>
        </div>
      </header>

      <div className="container-page py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          <TabBtn active={tab === "services"} onClick={() => setTab("services")} icon={<FileEdit className="h-4 w-4" />}>Shërbimet</TabBtn>
          <TabBtn active={tab === "messages"} onClick={() => setTab("messages")} icon={<Mail className="h-4 w-4" />}>Mesazhet</TabBtn>
          <TabBtn active={tab === "content"} onClick={() => setTab("content")} icon={<FileEdit className="h-4 w-4" />}>Përmbajtja</TabBtn>
          <TabBtn active={tab === "settings"} onClick={() => setTab("settings")} icon={<Settings2 className="h-4 w-4" />}>Cilësimet</TabBtn>
        </div>

        {tab === "services" && <ServicesAdmin />}
        {tab === "messages" && <MessagesAdmin />}
        {tab === "content" && <ContentAdmin />}
        {tab === "settings" && <SettingsAdmin />}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${active ? "text-white shadow-soft" : "border border-border bg-background/70 backdrop-blur text-foreground hover:bg-muted"}`}
      style={active ? { background: "var(--gradient-brand)" } : undefined}>
      {icon}{children}
    </button>
  );
}

function NotAdmin({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center rounded-3xl border border-border/60 bg-background/85 backdrop-blur p-8 shadow-elegant">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white" style={{ background: "var(--gradient-brand)" }}>
          <ShieldAlert className="h-6 w-6" />
        </span>
        <h1 className="mt-5 font-display text-2xl">Qasje e kufizuar</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Llogaria juaj ({email}) nuk ka të drejta administratori. Kontaktoni administratorin e sistemit për akses.
        </p>
        <p className="mt-4 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Për të parin administrator:</strong> ekzekutoni në bazën e të dhënave:<br/>
          <code className="text-[11px]">INSERT INTO user_roles(user_id, role) VALUES ('{'<user_id>'}', 'admin');</code>
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/" className="rounded-full border border-border px-5 py-2 text-sm">Ballina</Link>
          <button onClick={onSignOut} className="rounded-full px-5 py-2 text-sm text-white" style={{ background: "var(--gradient-brand)" }}>Dilni</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Services ----------
function ServicesAdmin() {
  const qc = useQueryClient();
  const { data: services, refetch } = useQuery(servicesQuery(true));
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ title: string; description: string; icon: string; sort_order: number; is_active: boolean }>({ title: "", description: "", icon: "Briefcase", sort_order: 0, is_active: true });
  const [creating, setCreating] = useState(false);

  const startCreate = () => { setEditing("new"); setCreating(true); setDraft({ title: "", description: "", icon: "Briefcase", sort_order: (services?.length ?? 0) * 10 + 10, is_active: true }); };
  const startEdit = (s: any) => { setEditing(s.id); setCreating(false); setDraft({ title: s.title, description: s.description, icon: s.icon, sort_order: s.sort_order, is_active: s.is_active }); };

  const save = async () => {
    if (creating) {
      const { error } = await supabase.from("services").insert(draft);
      if (error) return toast.error(error.message);
      toast.success("Shërbimi u shtua");
    } else if (editing) {
      const { error } = await supabase.from("services").update(draft).eq("id", editing);
      if (error) return toast.error(error.message);
      toast.success("Shërbimi u ruajt");
    }
    setEditing(null); setCreating(false);
    qc.invalidateQueries({ queryKey: ["services"] });
    refetch();
  };
  const remove = async (id: string) => {
    if (!confirm("Fshi këtë shërbim?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("U fshi");
    qc.invalidateQueries({ queryKey: ["services"] });
    refetch();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl">Shërbimet</h2>
        <button onClick={startCreate} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-white shadow-soft" style={{ background: "var(--gradient-brand)" }}>
          <Plus className="h-4 w-4" /> Shto
        </button>
      </div>

      {editing && (
        <div className="mb-6 rounded-2xl border border-border bg-background/80 backdrop-blur p-5 shadow-elegant">
          <div className="grid gap-3 md:grid-cols-2">
            <TextInput label="Titulli" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
            <div>
              <label className="mb-1.5 block text-xs font-medium">Ikona</label>
              <select value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
                {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium">Përshkrimi</label>
              <textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
            </div>
            <TextInput label="Renditja" type="number" value={String(draft.sort_order)} onChange={(v) => setDraft({ ...draft, sort_order: Number(v) })} />
            <label className="flex items-center gap-2 mt-6">
              <input type="checkbox" checked={draft.is_active} onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })} />
              <span className="text-sm">Aktive</span>
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={save} className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm text-white" style={{ background: "var(--gradient-brand)" }}>
              <Save className="h-4 w-4" /> Ruaj
            </button>
            <button onClick={() => { setEditing(null); setCreating(false); }} className="rounded-full border border-border px-5 py-2 text-sm">Anulo</button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {(services ?? []).map((s) => (
          <div key={s.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-4 shadow-soft">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shrink-0" style={{ background: "var(--gradient-brand)" }}>
              <ServiceIcon name={s.icon} className="h-5 w-5" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{s.title} {!s.is_active && <span className="ml-2 text-[10px] uppercase tracking-wider text-muted-foreground">(joaktive)</span>}</div>
              <div className="text-xs text-muted-foreground line-clamp-1">{s.description}</div>
            </div>
            <button onClick={() => startEdit(s)} className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted">Ndrysho</button>
            <button onClick={() => remove(s.id)} className="text-xs p-2 rounded-full border border-border hover:bg-destructive/10 hover:border-destructive hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
  );
}

// ---------- Messages ----------
function MessagesAdmin() {
  const [items, setItems] = useState<any[] | null>(null);
  const load = async () => {
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);
  const toggleRead = async (id: string, is_read: boolean) => {
    await supabase.from("contact_messages").update({ is_read: !is_read }).eq("id", id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Fshi këtë mesazh?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    load();
  };

  if (!items) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
  return (
    <div>
      <h2 className="font-display text-2xl mb-4">Mesazhet e Kontaktit ({items.length})</h2>
      {items.length === 0 && <div className="text-sm text-muted-foreground">Ende asnjë mesazh.</div>}
      <div className="grid gap-3">
        {items.map((m) => (
          <div key={m.id} className={`rounded-2xl border p-5 backdrop-blur shadow-soft ${m.is_read ? "border-border/40 bg-background/50" : "border-primary/30 bg-background/85"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">{m.name} <span className="text-xs font-normal text-muted-foreground">· {m.email}</span></div>
                {m.phone && <div className="text-xs text-muted-foreground">{m.phone}</div>}
                {m.subject && <div className="mt-1 text-sm font-medium">{m.subject}</div>}
                <p className="mt-2 text-sm text-foreground/85 whitespace-pre-wrap">{m.message}</p>
                <div className="mt-2 text-[11px] text-muted-foreground">{new Date(m.created_at).toLocaleString("sq-AL")}</div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => toggleRead(m.id, m.is_read)} className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted">
                  {m.is_read ? "Shëno si e palexuar" : "Shëno si e lexuar"}
                </button>
                <button onClick={() => remove(m.id)} className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-destructive/10 hover:text-destructive">Fshi</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Content ----------
function ContentAdmin() {
  const qc = useQueryClient();
  const { data: hero } = useQuery(heroQuery());
  const { data: about } = useQuery(aboutQuery());
  const [heroDraft, setHeroDraft] = useState<any>(null);
  const [aboutDraft, setAboutDraft] = useState<any>(null);
  useEffect(() => { if (hero && !heroDraft) setHeroDraft(hero); }, [hero]); // eslint-disable-line
  useEffect(() => { if (about && !aboutDraft) setAboutDraft(about); }, [about]); // eslint-disable-line

  const save = async (key: string, value: any) => {
    const { error } = await supabase.from("site_content").upsert({ key, value });
    if (error) return toast.error(error.message);
    toast.success("U ruajt");
    qc.invalidateQueries({ queryKey: ["site_content"] });
  };

  if (!heroDraft || !aboutDraft) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur p-5 shadow-soft">
        <h3 className="font-display text-xl mb-3">Ballina — Hero</h3>
        <div className="grid gap-3">
          <TextInput label="Titulli" value={heroDraft.title} onChange={(v) => setHeroDraft({ ...heroDraft, title: v })} />
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium">Nëntitulli</span>
            <textarea rows={3} value={heroDraft.subtitle} onChange={(e) => setHeroDraft({ ...heroDraft, subtitle: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
          </label>
          <button onClick={() => save("hero", heroDraft)} className="self-start inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm text-white" style={{ background: "var(--gradient-brand)" }}>
            <Save className="h-4 w-4" /> Ruaj
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur p-5 shadow-soft">
        <h3 className="font-display text-xl mb-3">Rreth Nesh</h3>
        <div className="grid gap-3">
          {(["intro", "services", "leader"] as const).map((k) => (
            <label key={k} className="block">
              <span className="mb-1.5 block text-xs font-medium capitalize">{k === "intro" ? "Hyrje" : k === "services" ? "Shërbimet (paragraf)" : "Udhëheqja"}</span>
              <textarea rows={4} value={aboutDraft[k]} onChange={(e) => setAboutDraft({ ...aboutDraft, [k]: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
            </label>
          ))}
          <button onClick={() => save("about", aboutDraft)} className="self-start inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm text-white" style={{ background: "var(--gradient-brand)" }}>
            <Save className="h-4 w-4" /> Ruaj
          </button>
        </div>
      </section>
    </div>
  );
}

// ---------- Settings (company info + SEO + socials) ----------
function SettingsAdmin() {
  const qc = useQueryClient();
  const { data: company } = useQuery(companyQuery());
  const { data: seo } = useQuery(seoQuery());
  const [c, setC] = useState<any>(null);
  const [s, setS] = useState<any>(null);
  useEffect(() => { if (company && !c) setC(company); }, [company]); // eslint-disable-line
  useEffect(() => { if (seo && !s) setS(seo); }, [seo]); // eslint-disable-line
  const save = async (key: string, value: any) => {
    const { error } = await supabase.from("site_content").upsert({ key, value });
    if (error) return toast.error(error.message);
    toast.success("U ruajt");
    qc.invalidateQueries({ queryKey: ["site_content"] });
  };
  if (!c || !s) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur p-5 shadow-soft">
        <h3 className="font-display text-xl mb-3">Informacioni i Kompanisë</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <TextInput label="Emri" value={c.name} onChange={(v) => setC({ ...c, name: v })} />
          <TextInput label="Telefoni (i shfaqur)" value={c.phone} onChange={(v) => setC({ ...c, phone: v })} />
          <TextInput label="WhatsApp (vetëm shifra)" value={c.whatsapp} onChange={(v) => setC({ ...c, whatsapp: v })} />
          <TextInput label="Email" value={c.email} onChange={(v) => setC({ ...c, email: v })} />
          <div className="md:col-span-2"><TextInput label="Adresa" value={c.address} onChange={(v) => setC({ ...c, address: v })} /></div>
          <div className="md:col-span-2"><TextInput label="Google Maps (adresa/kërkim)" value={c.mapsQuery} onChange={(v) => setC({ ...c, mapsQuery: v })} /></div>
          <TextInput label="Facebook URL" value={c.facebook} onChange={(v) => setC({ ...c, facebook: v })} />
          <TextInput label="Instagram URL" value={c.instagram} onChange={(v) => setC({ ...c, instagram: v })} />
          <TextInput label="LinkedIn URL" value={c.linkedin} onChange={(v) => setC({ ...c, linkedin: v })} />
        </div>
        <button onClick={() => save("company", c)} className="mt-4 inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm text-white" style={{ background: "var(--gradient-brand)" }}>
          <Save className="h-4 w-4" /> Ruaj
        </button>
      </section>

      <section className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur p-5 shadow-soft">
        <h3 className="font-display text-xl mb-3">SEO</h3>
        <div className="grid gap-3">
          <TextInput label="Titulli (meta)" value={s.title} onChange={(v) => setS({ ...s, title: v })} />
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium">Përshkrimi (meta)</span>
            <textarea rows={2} value={s.description} onChange={(e) => setS({ ...s, description: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
          </label>
          <TextInput label="Fjalët kyçe" value={s.keywords} onChange={(v) => setS({ ...s, keywords: v })} />
          <button onClick={() => save("seo", s)} className="self-start inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm text-white" style={{ background: "var(--gradient-brand)" }}>
            <Save className="h-4 w-4" /> Ruaj
          </button>
        </div>
      </section>
    </div>
  );
}
