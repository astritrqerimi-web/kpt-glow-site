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
      <TrustCards />
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
    <section
      id="ballina"
      className={`relative overflow-hidden ${sectionAnchor}`}
    >
      {/* Local hero ambience — layered orbs behind the content */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-24 right-[-10%] h-[36rem] w-[36rem] rounded-full blur-3xl animate-pulse-glow"
          style={{ background: "radial-gradient(circle, oklch(0.78 0.18 165 / 0.45), transparent 65%)" }}
        />
        <div
          className="absolute top-1/2 -left-32 h-[28rem] w-[28rem] rounded-full blur-3xl animate-pulse-glow"
          style={{
            animationDelay: "2s",
            background: "radial-gradient(circle, oklch(0.55 0.15 200 / 0.35), transparent 65%)",
          }}
        />
      </div>

      <div className="container-page grid gap-12 pt-14 pb-20 md:pt-20 md:pb-28 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
        {/* LEFT — copy */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-primary shadow-soft animate-fade-up">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="uppercase tracking-[0.14em]">Kontabilitet · Tatime · Konsulencë</span>
          </div>

          <h1
            className="mt-6 font-display text-[2.75rem] leading-[1.02] text-foreground sm:text-6xl md:text-7xl lg:text-[5.25rem] animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            <span className="text-gradient-brand">{hero.title}</span>
          </h1>

          <p
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg animate-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            {hero.subtitle}
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "240ms" }}>
            <a
              href="#kontakti"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-semibold text-white shadow-elegant transition-all duration-300 hover:shadow-hover hover:-translate-y-0.5"
              style={{ background: "var(--gradient-brand-strong)" }}
            >
              <span
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
                }}
              />
              <span className="relative">Na Kontaktoni</span>
              <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#sherbimet"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-8 py-4 text-sm font-semibold text-foreground shadow-soft transition-all duration-300 hover:border-primary/40 hover:bg-background hover:-translate-y-0.5"
            >
              Shërbimet
              <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Meta strip */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-xs text-muted-foreground animate-fade-up" style={{ animationDelay: "320ms" }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" style={{ color: "var(--brand-gold)" }} />
                ))}
              </div>
              <span className="font-medium text-foreground/85">Klientë të kënaqur</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Në përputhje me legjislacionin</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>Kontabilist i Certifikuar</span>
            </div>
          </div>
        </div>

        {/* RIGHT — 3D visual */}
        <div
          className="relative animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          {/* Glow behind image */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 blur-3xl opacity-70"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, oklch(0.78 0.18 165 / 0.55), transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-lg lg:max-w-none">
            <div
              className="relative overflow-hidden rounded-[2.25rem] border border-white/40 bg-background/40 backdrop-blur-xl shadow-elegant animate-float-slow"
            >
              <img
                src={heroVisual.url}
                alt="Vizualizim premium — kontabilitet dhe konsulencë biznesi"
                width={1280}
                height={1280}
                className="block h-auto w-full"
              />
              {/* Subtle inner highlight */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.08) 100%)",
                }}
              />
            </div>

            {/* Floating glass stat cards */}
            <div
              className="absolute -left-4 top-8 hidden md:flex glass-panel rounded-2xl px-4 py-3 shadow-elegant items-center gap-3 animate-float-slow"
              style={{ animationDelay: "1s" }}
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-glow"
                style={{ background: "var(--gradient-brand-strong)" }}
              >
                <TrendingUp className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Rritje mesatare</div>
                <div className="font-display text-lg text-foreground">+34%</div>
              </div>
            </div>

            <div
              className="absolute -right-4 bottom-8 hidden md:flex glass-panel rounded-2xl px-4 py-3 shadow-elegant items-center gap-3 animate-float-slow"
              style={{ animationDelay: "2.5s" }}
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-glow"
                style={{ background: "var(--gradient-brand-strong)" }}
              >
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Përputhshmëri</div>
                <div className="font-display text-lg text-foreground">100%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRUST CARDS ---------------- */
function TrustCards() {
  const cards = [
    {
      icon: Award,
      emoji: "🏆",
      title: "Ekspertizë Profesionale",
      desc: "Shërbime kontabiliteti, tatimore dhe financiare të ofruara me profesionalizëm dhe përkushtim.",
    },
    {
      icon: TrendingUp,
      emoji: "📈",
      title: "Rritje dhe Zhvillim",
      desc: "Zgjidhje financiare që mbështesin rritjen dhe suksesin afatgjatë të biznesit tuaj.",
    },
    {
      icon: ShieldCheck,
      emoji: "🛡️",
      title: "Besim dhe Transparencë",
      desc: "Marrëdhënie të ndërtuara mbi korrektësi, integritet dhe besueshmëri.",
    },
    {
      icon: Handshake,
      emoji: "🤝",
      title: "Partneritet Afatgjatë",
      desc: "Partneri juaj i besueshëm në çdo fazë të zhvillimit të biznesit.",
    },
  ];
  return (
    <section className="container-page -mt-8 pb-24 md:-mt-14 md:pb-28">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-3xl border border-border/60 bg-background/75 backdrop-blur-xl p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-hover hover:border-primary/40 animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div
              aria-hidden
              className="absolute inset-x-0 -top-px h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "var(--gradient-brand-strong)" }}
            />
            <div
              className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-glow transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
              style={{ background: "var(--gradient-brand-strong)" }}
            >
              <c.icon className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <h3 className="mt-5 font-display text-xl text-foreground">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
              style={{ background: "radial-gradient(circle, oklch(0.78 0.18 165 / 0.6), transparent 70%)" }}
            />
          </div>
        ))}
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
