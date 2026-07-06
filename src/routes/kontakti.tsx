import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, Phone, Send, Facebook, Instagram, Linkedin } from "lucide-react";
import { companyQuery } from "@/lib/site-content";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/kontakti")({
  head: () => ({
    meta: [
      { title: "Kontakti — KPT Consulting" },
      { name: "description", content: "Na kontaktoni për shërbime të kontabilitetit, tatimeve dhe konsulencës. Fushë Kosovë, Kosovë." },
      { property: "og:title", content: "Kontakti — KPT Consulting" },
      { property: "og:description", content: "Kontaktoni ekipin tonë profesional për një konsultim." },
    ],
  }),
  loader: ({ context }) => { context.queryClient.ensureQueryData(companyQuery()); },
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Emri është i detyrueshëm").max(100),
  email: z.string().trim().email("Email-i nuk është valid").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Mesazhi është shumë i shkurtër").max(5000),
});

function ContactPage() {
  const { data: company } = useSuspenseQuery(companyQuery());
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Dërgimi dështoi. Ju lutemi provoni përsëri.");
      return;
    }
    toast.success("Mesazhi u dërgua me sukses. Do t'ju kontaktojmë së shpejti.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(company.mapsQuery)}&output=embed`;

  return (
    <>
      <section className="container-page pt-16 md:pt-24 pb-10">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-primary animate-fade-up">Kontakti</div>
          <h1 className="mt-4 font-display text-4xl md:text-6xl leading-tight text-foreground animate-fade-up" style={{ animationDelay: "80ms" }}>
            Le të <span className="text-gradient-brand">bisedojmë</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl animate-fade-up" style={{ animationDelay: "160ms" }}>
            Kontaktoni ekipin tonë për një konsultim ose plotësoni formularin dhe do t'ju përgjigjemi sa më shpejt.
          </p>
        </div>
      </section>

      <section className="container-page pb-24 grid gap-8 lg:grid-cols-5">
        {/* Info */}
        <div className="lg:col-span-2 space-y-4">
          <ContactCard icon={<Phone className="h-5 w-5" />} title="Telefoni" value={company.phone} href={`tel:${company.phone.replace(/\s/g,"")}`} />
          <ContactCard icon={<Mail className="h-5 w-5" />} title="Email" value={company.email} href={`mailto:${company.email}`} />
          <ContactCard icon={<MapPin className="h-5 w-5" />} title="Adresa" value={company.address} />

          <div className="rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-5 shadow-soft">
            <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">Na Ndiqni</div>
            <div className="flex items-center gap-2">
              {company.facebook && <SocialIcon href={company.facebook} label="Facebook"><Facebook className="h-4 w-4" /></SocialIcon>}
              {company.instagram && <SocialIcon href={company.instagram} label="Instagram"><Instagram className="h-4 w-4" /></SocialIcon>}
              {company.linkedin && <SocialIcon href={company.linkedin} label="LinkedIn"><Linkedin className="h-4 w-4" /></SocialIcon>}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="lg:col-span-3 rounded-3xl border border-border/60 bg-background/80 backdrop-blur p-6 md:p-8 shadow-elegant space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Emri i plotë *" error={errors.name}>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </Field>
            <Field label="Email *" error={errors.email}>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </Field>
            <Field label="Telefoni" error={errors.phone}>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </Field>
            <Field label="Subjekti" error={errors.subject}>
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </Field>
          </div>
          <Field label="Mesazhi *" error={errors.message}>
            <textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </Field>
          <button type="submit" disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-white shadow-soft transition-all hover:shadow-elegant hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "var(--gradient-brand)" }}>
            {submitting ? "Duke dërguar..." : (<>Dërgo mesazhin <Send className="h-4 w-4" /></>)}
          </button>
        </form>
      </section>

      <section className="container-page pb-24">
        <div className="overflow-hidden rounded-3xl border border-border/60 shadow-elegant">
          <iframe
            src={mapsSrc}
            title="KPT Consulting në Google Maps"
            className="w-full h-[420px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function ContactCard({ icon, title, value, href }: { icon: React.ReactNode; title: string; value: string; href?: string }) {
  const inner = (
    <>
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shrink-0" style={{ background: "var(--gradient-brand)" }}>{icon}</span>
      <div>
        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{title}</div>
        <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
      </div>
    </>
  );
  const cls = "flex items-start gap-4 rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-5 shadow-soft transition hover:shadow-elegant hover:-translate-y-0.5";
  return href ? <a href={href} className={cls}>{inner}</a> : <div className={cls}>{inner}</div>;
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition">
      {children}
    </a>
  );
}
