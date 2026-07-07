import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { servicesQuery, companyQuery, heroQuery, aboutQuery, seoQuery, trustQuery, type Bilingual, type TrustItem } from "@/lib/site-content";
import { ServiceIcon, ICON_NAMES } from "@/components/site/ServiceIcon";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { LogOut, Plus, Trash2, Save, Mail, Home, FileEdit, Settings2, Loader2, ShieldAlert, Star, Newspaper } from "lucide-react";
import { ArticlesAdmin } from "@/components/admin/ArticlesAdmin";
import { toast } from "sonner";
import logoAsset from "@/assets/kpt-logo-symbol.png.asset.json";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

type Tab = "services" | "articles" | "messages" | "content" | "settings";

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
  const [query, setQuery] = useState("");
  const [replyTo, setReplyTo] = useState<any | null>(null);
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

  const q = query.trim().toLowerCase();
  const filtered = q
    ? items.filter((m) =>
        [m.name, m.email, m.phone, m.subject, m.message].some((v) => (v ?? "").toString().toLowerCase().includes(q))
      )
    : items;
  const unreadCount = items.filter((m) => !m.is_read).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl">
          Mesazhet e Kontaktit <span className="text-sm font-normal text-muted-foreground">({items.length} · {unreadCount} të palexuara)</span>
        </h2>
        <input
          type="search"
          placeholder="Kërko sipas emrit, email-it, subjektit..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-72 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      {filtered.length === 0 && <div className="text-sm text-muted-foreground">{items.length === 0 ? "Ende asnjë mesazh." : "Asnjë mesazh nuk përputhet me kërkimin."}</div>}
      <div className="grid gap-3">
        {filtered.map((m) => (
          <div key={m.id} className={`rounded-2xl border p-5 backdrop-blur shadow-soft ${m.is_read ? "border-border/40 bg-background/50" : "border-primary/30 bg-background/85"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{m.name} <span className="text-xs font-normal text-muted-foreground">· {m.email}</span></div>
                {m.phone && <div className="text-xs text-muted-foreground">{m.phone}</div>}
                {m.subject && <div className="mt-1 text-sm font-medium">{m.subject}</div>}
                <p className="mt-2 text-sm text-foreground/85 whitespace-pre-wrap">{m.message}</p>
                <div className="mt-2 text-[11px] text-muted-foreground">{new Date(m.created_at).toLocaleString("sq-AL")}</div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => setReplyTo(m)} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-white shadow-soft" style={{ background: "var(--gradient-brand)" }}>
                  <Mail className="h-3 w-3" /> Përgjigju
                </button>
                <button onClick={() => toggleRead(m.id, m.is_read)} className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted">
                  {m.is_read ? "Shëno si e palexuar" : "Shëno si e lexuar"}
                </button>
                <button onClick={() => remove(m.id)} className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-destructive/10 hover:text-destructive">Fshi</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {replyTo && <ReplyModal message={replyTo} onClose={() => setReplyTo(null)} onSent={() => { setReplyTo(null); toggleRead(replyTo.id, false); }} />}
    </div>
  );
}

function ReplyModal({ message, onClose, onSent }: { message: any; onClose: () => void; onSent: () => void }) {
  const [subject, setSubject] = useState(`Re: ${message.subject || "Mesazhi juaj"}`);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!body.trim()) { toast.error("Shkruani përgjigjen."); return; }
    setSending(true);
    const { data, error } = await supabase.functions.invoke("send-smtp", {
      body: { mode: "reply", to: message.email, subject, message: body },
    });
    setSending(false);
    if (error || (data as any)?.error) {
      toast.error(((data as any)?.error) || error?.message || "Dërgimi dështoi.");
      return;
    }
    toast.success("Email u dërgua me sukses");
    onSent();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-xl rounded-2xl border border-border bg-background shadow-elegant" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-border p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Përgjigju</div>
          <div className="mt-1 font-display text-lg">{message.name} <span className="text-sm font-normal text-muted-foreground">· {message.email}</span></div>
        </div>
        <div className="p-5 grid gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium">Subjekti</span>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium">Mesazhi</span>
            <textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Shkruani përgjigjen tuaj këtu..." className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </label>
          <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
            <div className="font-medium text-foreground mb-1">Mesazhi origjinal:</div>
            <div className="whitespace-pre-wrap line-clamp-4">{message.message}</div>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-border p-4">
          <button onClick={onClose} className="rounded-full border border-border px-5 py-2 text-sm">Anulo</button>
          <button onClick={send} disabled={sending} className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm text-white shadow-soft disabled:opacity-60" style={{ background: "var(--gradient-brand)" }}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            {sending ? "Duke dërguar..." : "Dërgo"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Bilingual helpers ----------
function bg(value: Bilingual): { al: string; en: string } {
  if (value == null) return { al: "", en: "" };
  if (typeof value === "string") return { al: value, en: value };
  return { al: value.al ?? "", en: value.en ?? "" };
}

function BilingualField({
  label,
  value,
  onChange,
  rows = 1,
}: {
  label: string;
  value: Bilingual;
  onChange: (v: { al: string; en: string }) => void;
  rows?: number;
}) {
  const v = bg(value);
  const Input = rows > 1 ? "textarea" : "input";
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-3">
      <div className="mb-2 text-xs font-medium text-foreground">{label}</div>
      <div className="grid gap-2 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">🇦🇱 Shqip</span>
          <Input
            {...(rows > 1 ? { rows } : { type: "text" })}
            value={v.al}
            onChange={(e: any) => onChange({ ...v, al: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">🇬🇧 English</span>
          <Input
            {...(rows > 1 ? { rows } : { type: "text" })}
            value={v.en}
            onChange={(e: any) => onChange({ ...v, en: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
      </div>
    </div>
  );
}

// ---------- Content ----------
function ContentAdmin() {
  const qc = useQueryClient();
  const { data: hero } = useQuery(heroQuery());
  const { data: about } = useQuery(aboutQuery());
  const { data: trust } = useQuery(trustQuery());
  const [heroDraft, setHeroDraft] = useState<any>(null);
  const [aboutDraft, setAboutDraft] = useState<any>(null);
  const [trustDraft, setTrustDraft] = useState<{ items: TrustItem[] } | null>(null);
  useEffect(() => { if (hero && !heroDraft) setHeroDraft(hero); }, [hero]); // eslint-disable-line
  useEffect(() => { if (about && !aboutDraft) setAboutDraft(about); }, [about]); // eslint-disable-line
  useEffect(() => { if (trust && !trustDraft) setTrustDraft({ items: trust.items ?? [] }); }, [trust]); // eslint-disable-line

  const save = async (key: string, value: any) => {
    const { error } = await supabase.from("site_content").upsert({ key, value });
    if (error) return toast.error(error.message);
    toast.success("U ruajt");
    qc.invalidateQueries({ queryKey: ["site_content"] });
  };

  if (!heroDraft || !aboutDraft || !trustDraft) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;

  const iconOptions = ["BadgeCheck", "ShieldCheck", "Briefcase", "TrendingUp", "Award", "Handshake", "Users2", "CheckCircle2", "Target"];

  const updateTrustItem = (idx: number, patch: Partial<TrustItem>) => {
    const items = [...trustDraft.items];
    items[idx] = { ...items[idx], ...patch };
    setTrustDraft({ items });
  };
  const addTrustItem = (type: "stars" | "icon") => {
    setTrustDraft({
      items: [
        ...trustDraft.items,
        type === "stars"
          ? { type: "stars", title_al: "Titull", title_en: "Title" }
          : { type: "icon", icon: "BadgeCheck", color: "#0F8B8D", title_al: "Titull", title_en: "Title" },
      ],
    });
  };
  const removeTrustItem = (idx: number) => {
    setTrustDraft({ items: trustDraft.items.filter((_, i) => i !== idx) });
  };
  const moveTrustItem = (idx: number, dir: -1 | 1) => {
    const items = [...trustDraft.items];
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    [items[idx], items[j]] = [items[j], items[idx]];
    setTrustDraft({ items });
  };

  return (
    <div className="grid gap-6">
      {/* HERO */}
      <section className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur p-5 shadow-soft">
        <h3 className="font-display text-xl mb-4">Ballina — Hero</h3>
        <div className="grid gap-3">
          <BilingualField label="Titulli kryesor" value={heroDraft.title} onChange={(v) => setHeroDraft({ ...heroDraft, title: v })} />
          <BilingualField label="Nëntitulli / përshkrimi" value={heroDraft.subtitle} onChange={(v) => setHeroDraft({ ...heroDraft, subtitle: v })} rows={3} />
          <BilingualField label='Badge sipër titullit ("Kontabilitet • Program • Trajnime")' value={heroDraft.badge} onChange={(v) => setHeroDraft({ ...heroDraft, badge: v })} />
          <div className="grid md:grid-cols-2 gap-3">
            <BilingualField label="Butoni 1 (CTA primar)" value={heroDraft.ctaContact} onChange={(v) => setHeroDraft({ ...heroDraft, ctaContact: v })} />
            <BilingualField label="Butoni 2 (CTA sekondar)" value={heroDraft.ctaServices} onChange={(v) => setHeroDraft({ ...heroDraft, ctaServices: v })} />
          </div>
          <ImageUpload
            label="Imazhi i Hero-s (opsional — zëvendëson vizualin standard)"
            value={heroDraft.image}
            folder="hero"
            hint="PNG/JPG deri 5 MB"
            onChange={(url) => setHeroDraft({ ...heroDraft, image: url })}
          />
          <button onClick={() => save("hero", heroDraft)} className="self-start inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm text-white" style={{ background: "var(--gradient-brand)" }}>
            <Save className="h-4 w-4" /> Ruaj Hero
          </button>
        </div>
      </section>

      {/* ABOUT */}
      <section className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur p-5 shadow-soft">
        <h3 className="font-display text-xl mb-4">Rreth Nesh</h3>
        <div className="grid gap-3">
          <BilingualField label="Hyrje" value={aboutDraft.intro} onChange={(v) => setAboutDraft({ ...aboutDraft, intro: v })} rows={4} />
          <BilingualField label="Shërbimet (paragraf)" value={aboutDraft.services} onChange={(v) => setAboutDraft({ ...aboutDraft, services: v })} rows={4} />
          <BilingualField label="Udhëheqja (Astrit Qerimi)" value={aboutDraft.leader} onChange={(v) => setAboutDraft({ ...aboutDraft, leader: v })} rows={4} />
          <button onClick={() => save("about", aboutDraft)} className="self-start inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm text-white" style={{ background: "var(--gradient-brand)" }}>
            <Save className="h-4 w-4" /> Ruaj Rreth Nesh
          </button>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl">Trust Strip (shiriti lëvizës nën Hero)</h3>
          <div className="flex gap-2">
            <button onClick={() => addTrustItem("stars")} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted">
              <Star className="h-3 w-3" /> Shto Yje
            </button>
            <button onClick={() => addTrustItem("icon")} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted">
              <Plus className="h-3 w-3" /> Shto Ikonë
            </button>
          </div>
        </div>
        <div className="grid gap-3">
          {trustDraft.items.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-border/60 bg-background/60 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  #{idx + 1} — {item.type === "stars" ? "⭐⭐⭐⭐⭐ (5 yje)" : "Ikonë"}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => moveTrustItem(idx, -1)} className="rounded-full border border-border px-2 py-0.5 text-xs hover:bg-muted">↑</button>
                  <button onClick={() => moveTrustItem(idx, 1)} className="rounded-full border border-border px-2 py-0.5 text-xs hover:bg-muted">↓</button>
                  <button onClick={() => removeTrustItem(idx)} className="rounded-full border border-border p-1 hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                </div>
              </div>
              {item.type === "icon" && (
                <div className="mb-3 grid md:grid-cols-2 gap-2">
                  <label className="block">
                    <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">Ikona</span>
                    <select value={item.icon ?? "BadgeCheck"} onChange={(e) => updateTrustItem(idx, { icon: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                      {iconOptions.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">Ngjyra</span>
                    <input type="color" value={item.color ?? "#0F8B8D"} onChange={(e) => updateTrustItem(idx, { color: e.target.value })}
                      className="h-10 w-full rounded-lg border border-input bg-background px-2" />
                  </label>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-2">
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">🇦🇱 Titulli (AL)</span>
                  <input type="text" value={item.title_al} onChange={(e) => updateTrustItem(idx, { title_al: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">🇬🇧 Title (EN)</span>
                  <input type="text" value={item.title_en} onChange={(e) => updateTrustItem(idx, { title_en: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </label>
              </div>
            </div>
          ))}
          {trustDraft.items.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-6">Asnjë badge. Klikoni "Shto Yje" ose "Shto Ikonë".</div>
          )}
        </div>
        <button onClick={() => save("trust", trustDraft)} className="mt-4 inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm text-white" style={{ background: "var(--gradient-brand)" }}>
          <Save className="h-4 w-4" /> Ruaj Trust Strip
        </button>
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
