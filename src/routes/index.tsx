import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Award,
  Target,
  Users2,
  Mail,
  MapPin,
  Phone,
  Send,
  Facebook,
  Instagram,
  Linkedin,
  Sparkles,
  TrendingUp,
  Handshake,
  Star,
} from "lucide-react";
import {
  heroQuery,
  aboutQuery,
  servicesQuery,
  companyQuery,
} from "@/lib/site-content";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroVisual from "@/assets/hero-visual.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KPT Consulting — Kontabilitet, Tatime dhe Konsulencë Biznesi" },
      {
        name: "description",
        content:
          "Shërbime profesionale të kontabilitetit, deklarimeve tatimore, regjistrimit të bizneseve dhe konsulencës financiare në Kosovë.",
      },
      { property: "og:title", content: "KPT Consulting — Kontabilitet, Tatime dhe Konsulencë" },
      { property: "og:description", content: "Zgjidhje financiare profesionale për biznesin tuaj në Kosovë." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(heroQuery());
    context.queryClient.ensureQueryData(aboutQuery());
    context.queryClient.ensureQueryData(servicesQuery());
    context.queryClient.ensureQueryData(companyQuery());
  },
  component: HomePage,
});

const sectionAnchor = "scroll-mt-28 md:scroll-mt-32";

function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
    </>
  );
}

/* ---------------- HERO / BALLINA ---------------- */
function HeroSection() {
  const { data: hero } = useSuspenseQuery(heroQuery());
  return (
    <section id="ballina" className={`container-page pt-16 pb-24 md:pt-24 md:pb-32 ${sectionAnchor}`}>
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground animate-fade-up">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-glow animate-pulse" />
          Kontabilitet · Tatime · Konsulencë
        </div>
        <h1
          className="mt-6 font-display text-5xl leading-[1.05] text-foreground md:text-7xl animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          <span className="text-gradient-brand">{hero.title}</span>
        </h1>
        <p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          {hero.subtitle}
        </p>
        <div className="mt-10 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "240ms" }}>
          <a
            href="#kontakti"
            className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-white shadow-elegant transition-all duration-300 hover:shadow-hover hover:-translate-y-0.5"
            style={{ background: "var(--gradient-brand)" }}
          >
            Na Kontaktoni
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#sherbimet"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-7 py-3.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/40 hover:bg-background hover:-translate-y-0.5"
          >
            Shërbimet
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
          {[
            { icon: ShieldCheck, label: "Në përputhje me legjislacionin" },
            { icon: Award, label: "Kontabilist i Certifikuar" },
            { icon: CheckCircle2, label: "Partneritete afatgjata" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 backdrop-blur px-4 py-3 shadow-soft animate-fade-up"
              style={{ animationDelay: `${320 + i * 80}ms` }}
            >
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white"
                style={{ background: "var(--gradient-brand)" }}
              >
                <item.icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- RRETH NESH ---------------- */
function AboutSection() {
  const { data: about } = useSuspenseQuery(aboutQuery());
  const values = [
    { icon: ShieldCheck, title: "Besueshmëri", desc: "Punojmë me integritet dhe transparencë të plotë." },
    { icon: Target, title: "Saktësi", desc: "Standarde të larta profesionale në çdo detyrë." },
    { icon: Users2, title: "Partneritet", desc: "Marrëdhënie afatgjata të bazuara në rezultate." },
    { icon: CheckCircle2, title: "Përputhshmëri", desc: "Në përputhje të plotë me legjislacionin." },
  ];
  return (
    <section id="rreth-nesh" className={`container-page pt-8 pb-24 ${sectionAnchor}`}>
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Rreth Nesh</div>
        <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight text-foreground">
          Partneri juaj për <span className="text-gradient-brand">zgjidhje financiare</span>
        </h2>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-3 space-y-6">
          <p className="text-lg leading-relaxed text-foreground/85">{about.intro}</p>
          <p className="text-base leading-relaxed text-muted-foreground">{about.services}</p>
          <div className="rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-6 shadow-soft">
            <div className="text-xs uppercase tracking-[0.18em] text-primary">Udhëheqja</div>
            <p className="mt-3 text-base leading-relaxed text-foreground/85">{about.leader}</p>
          </div>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-4 content-start">
          {values.map((v, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-5 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-500"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white"
                style={{ background: "var(--gradient-brand)" }}
              >
                <v.icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div className="mt-3 font-semibold text-foreground">{v.title}</div>
              <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{v.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SHËRBIMET ---------------- */
function ServicesSection() {
  const { data: services } = useSuspenseQuery(servicesQuery());
  return (
    <section id="sherbimet" className={`container-page pb-24 ${sectionAnchor}`}>
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Shërbimet</div>
        <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight text-foreground">
          Gjithçka që biznesi juaj <span className="text-gradient-brand">ka nevojë</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
          Nga themelimi i biznesit deri te menaxhimi financiar i përditshëm — mbulojmë çdo aspekt profesional.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <div
            key={s.id}
            className="group relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 backdrop-blur p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-hover hover:border-primary/30"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div
              className="absolute inset-x-0 -top-px h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "var(--gradient-brand)" }}
            />
            <div
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-soft transition-transform duration-500 group-hover:scale-110"
              style={{ background: "var(--gradient-brand)" }}
            >
              <ServiceIcon name={s.icon} className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- KONTAKTI ---------------- */
const contactSchema = z.object({
  name: z.string().trim().min(2, "Emri është i detyrueshëm").max(100),
  email: z.string().trim().email("Email-i nuk është valid").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Mesazhi është shumë i shkurtër").max(5000),
});

function ContactSection() {
  const { data: company } = useSuspenseQuery(companyQuery());
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = contactSchema.safeParse(form);
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
    <section id="kontakti" className={`container-page pb-24 ${sectionAnchor}`}>
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Kontakti</div>
        <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight text-foreground">
          Le të <span className="text-gradient-brand">bisedojmë</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
          Kontaktoni ekipin tonë për një konsultim ose plotësoni formularin dhe do t'ju përgjigjemi sa më shpejt.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <ContactCard
            icon={<Phone className="h-5 w-5" />}
            title="Telefoni"
            value={company.phone}
            href={`tel:${company.phone.replace(/\s/g, "")}`}
          />
          <ContactCard
            icon={<Mail className="h-5 w-5" />}
            title="Email"
            value={company.email}
            href={`mailto:${company.email}`}
          />
          <ContactCard icon={<MapPin className="h-5 w-5" />} title="Adresa" value={company.address} />

          <div className="rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-5 shadow-soft">
            <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">Na Ndiqni</div>
            <div className="flex items-center gap-2">
              {company.facebook && (
                <SocialIcon href={company.facebook} label="Facebook">
                  <Facebook className="h-4 w-4" />
                </SocialIcon>
              )}
              {company.instagram && (
                <SocialIcon href={company.instagram} label="Instagram">
                  <Instagram className="h-4 w-4" />
                </SocialIcon>
              )}
              {company.linkedin && (
                <SocialIcon href={company.linkedin} label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </SocialIcon>
              )}
            </div>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="lg:col-span-3 rounded-3xl border border-border/60 bg-background/80 backdrop-blur p-6 md:p-8 shadow-elegant space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Emri i plotë *" error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>
            <Field label="Email *" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>
            <Field label="Telefoni" error={errors.phone}>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>
            <Field label="Subjekti" error={errors.subject}>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>
          </div>
          <Field label="Mesazhi *" error={errors.message}>
            <textarea
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-white shadow-soft transition-all hover:shadow-elegant hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "var(--gradient-brand)" }}
          >
            {submitting ? (
              "Duke dërguar..."
            ) : (
              <>
                Dërgo mesazhin <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-border/60 shadow-elegant">
        <iframe
          src={mapsSrc}
          title="KPT Consulting në Google Maps"
          className="w-full h-[420px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
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

function ContactCard({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <span
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shrink-0"
        style={{ background: "var(--gradient-brand)" }}
      >
        {icon}
      </span>
      <div>
        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{title}</div>
        <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
      </div>
    </>
  );
  const cls =
    "flex items-start gap-4 rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-5 shadow-soft transition hover:shadow-elegant hover:-translate-y-0.5";
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition"
    >
      {children}
    </a>
  );
}
