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
  trustQuery,
  pick,
} from "@/lib/site-content";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { TrustMarquee } from "@/components/site/TrustMarquee";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroVisual from "@/assets/hero-visual.jpg.asset.json";
import { useI18n, SERVICE_TRANSLATIONS } from "@/lib/i18n";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KPT Consulting — Kontabilitet, Program dhe Trajnime" },
      {
        name: "description",
        content:
          "Shërbime profesionale të kontabilitetit, deklarimeve tatimore, regjistrimit të bizneseve dhe konsulencës financiare në Kosovë.",
      },
      { property: "og:title", content: "KPT Consulting — Kontabilitet, Program dhe Trajnime" },
      { property: "og:description", content: "Zgjidhje financiare profesionale për biznesin tuaj në Kosovë." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(heroQuery());
    context.queryClient.ensureQueryData(aboutQuery());
    context.queryClient.ensureQueryData(servicesQuery());
    context.queryClient.ensureQueryData(companyQuery());
    context.queryClient.ensureQueryData(trustQuery());
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
  const { t, lang } = useI18n();
  const title = pick(hero.title, lang, t("hero.title"));
  const subtitle = pick(hero.subtitle, lang, t("hero.subtitle"));
  const badge = pick(hero.badge, lang, t("hero.badge"));
  const ctaContact = pick(hero.ctaContact, lang, t("hero.ctaContact"));
  const ctaServices = pick(hero.ctaServices, lang, t("hero.ctaServices"));


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
            <span className="uppercase tracking-[0.14em]">{badge}</span>
          </div>

          <h1
            className="mt-6 font-display text-[2.75rem] leading-[1.02] text-foreground sm:text-6xl md:text-7xl lg:text-[5.25rem] animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            <span className="text-gradient-brand">{title}</span>
          </h1>

          <p
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg animate-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            {subtitle}
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
              <span className="relative">{ctaContact}</span>
              <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#sherbimet"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-8 py-4 text-sm font-semibold text-foreground shadow-soft transition-all duration-300 hover:border-primary/40 hover:bg-background hover:-translate-y-0.5"
            >
              {ctaServices}
              <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
            </a>

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
                src={hero.image || heroVisual.url}
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
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{t("hero.stat.growth")}</div>
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
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{t("hero.stat.compliance")}</div>
                <div className="font-display text-lg text-foreground">100%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust marquee below hero */}
      <div className="container-page pb-16 md:pb-20 animate-fade-up" style={{ animationDelay: "360ms" }}>
        <TrustMarquee />
      </div>
    </section>
  );
}

/* ---------------- TRUST CARDS ---------------- */
function TrustCards() {
  const { t } = useI18n();
  const cards = [
    { icon: Award, title: t("trust.1.title"), desc: t("trust.1.desc"), color: "#0F8B8D" },
    { icon: TrendingUp, title: t("trust.2.title"), desc: t("trust.2.desc"), color: "#1F3A5F" },
    { icon: ShieldCheck, title: t("trust.3.title"), desc: t("trust.3.desc"), color: "#5B6C7D" },
    { icon: Handshake, title: t("trust.4.title"), desc: t("trust.4.desc"), color: "#C9A227" },
  ];

  return (
    <section className="container-page -mt-8 pb-24 md:-mt-14 md:pb-28">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <div
            key={i}
            className="group relative flex flex-col items-center text-center overflow-hidden rounded-3xl border border-border/60 bg-background/75 backdrop-blur-xl p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-hover hover:border-primary/40 animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div
              aria-hidden
              className="absolute inset-x-0 -top-px h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "var(--gradient-brand-strong)" }}
            />
            <div
              className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-soft transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
              style={{ background: c.color }}
            >
              <c.icon className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <h3 className="mt-5 font-display text-xl text-foreground">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
              style={{ background: `radial-gradient(circle, ${c.color}33, transparent 70%)` }}
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
  const { t, lang } = useI18n();
  const intro = pick(about.intro, lang, t("about.intro"));
  const servicesText = pick(about.services, lang, t("about.services.text"));
  const leader = pick(about.leader, lang, t("about.leader"));
  const values = [
    { icon: ShieldCheck, title: t("about.value.1.title"), desc: t("about.value.1.desc") },
    { icon: Target, title: t("about.value.2.title"), desc: t("about.value.2.desc") },
    { icon: Users2, title: t("about.value.3.title"), desc: t("about.value.3.desc") },
    { icon: CheckCircle2, title: t("about.value.4.title"), desc: t("about.value.4.desc") },
  ];
  return (
    <section id="rreth-nesh" className={`container-page pt-8 pb-24 ${sectionAnchor}`}>
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">{t("about.eyebrow")}</div>
        <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight text-foreground">
          {t("about.title.a")} <span className="text-gradient-brand">{t("about.title.b")}</span>
        </h2>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-3 space-y-6">
          <p className="text-lg leading-relaxed text-foreground/85">{intro}</p>
          <p className="text-base leading-relaxed text-muted-foreground">{servicesText}</p>
          <div className="rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-6 shadow-soft">
            <div className="text-xs uppercase tracking-[0.18em] text-primary">{t("about.leadership")}</div>
            <p className="mt-3 text-base leading-relaxed text-foreground/85">{leader}</p>
          </div>
        </div>


        <div className="md:col-span-2 grid grid-cols-2 gap-4 content-start">
          {values.map((v, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-5 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-500"
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
  const { t, lang } = useI18n();
  return (
    <section id="sherbimet" className={`container-page pb-24 ${sectionAnchor}`}>
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">{t("services.eyebrow")}</div>
        <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight text-foreground">
          {t("services.title.a")} <span className="text-gradient-brand">{t("services.title.b")}</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
          {t("services.subtitle")}
        </p>
      </div>


      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.filter((s) => s.id !== "29a67d92-472c-4c24-9215-d1cfdd5c17ae").map((s, i) => {
          const tr = SERVICE_TRANSLATIONS[lang]?.[s.id];
          const title = tr?.title ?? s.title;
          const description = tr?.description ?? s.description;
          return (
            <div
              key={s.id}
              className="group relative flex flex-col items-center text-center overflow-hidden rounded-3xl border border-border/60 bg-background/70 backdrop-blur p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-hover hover:border-primary/30"
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
              <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          );
        })}

      </div>
    </section>
  );
}

/* ---------------- KONTAKTI ---------------- */
const SERVICE_OPTIONS = [
  "Regjistrimi i Biznesit",
  "Kontabiliteti dhe Mbajtja e Librave",
  "Përgatitja e Pasqyrave Financiare",
  "Konsulencë Tatimore dhe Financiare",
  "Aplikim për Grante dhe Subvencione",
  "Tjetër",
] as const;

const SERVICE_LABEL_KEYS: Record<(typeof SERVICE_OPTIONS)[number], string> = {
  "Regjistrimi i Biznesit": "svc.registration",
  "Kontabiliteti dhe Mbajtja e Librave": "svc.bookkeeping",
  "Përgatitja e Pasqyrave Financiare": "svc.financial",
  "Konsulencë Tatimore dhe Financiare": "svc.tax",
  "Aplikim për Grante dhe Subvencione": "svc.grants",
  "Tjetër": "svc.other",
};

function buildContactSchema(t: (k: string) => string) {
  return z
    .object({
      name: z.string().trim().min(2, t("form.err.name")).max(100),
      email: z.string().trim().email(t("form.err.email")).max(255),
      phone: z.string().trim().max(30).optional().or(z.literal("")),
      service: z.enum(SERVICE_OPTIONS, { message: t("form.err.service") }),
      serviceOther: z.string().trim().max(150).optional().or(z.literal("")),
      message: z.string().trim().min(10, t("form.err.message")).max(5000),
    })
    .refine((d) => d.service !== "Tjetër" || (d.serviceOther && d.serviceOther.length >= 2), {
      path: ["serviceOther"],
      message: t("form.err.serviceOther"),
    });
}


function ContactSection() {
  const { data: company } = useSuspenseQuery(companyQuery());
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", serviceOther: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = buildContactSchema(t).safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    const subjectValue =
      parsed.data.service === "Tjetër"
        ? `Tjetër: ${parsed.data.serviceOther}`
        : parsed.data.service;
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: subjectValue,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error(t("form.error"));
      return;
    }
    toast.success(t("form.success"));
    setForm({ name: "", email: "", phone: "", service: "", serviceOther: "", message: "" });
  };


  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(company.mapsQuery)}&output=embed`;

  return (
    <section id="kontakti" className={`container-page pb-24 ${sectionAnchor}`}>
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">{t("contact.eyebrow")}</div>
        <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight text-foreground">
          {t("contact.title.a")} <span className="text-gradient-brand">{t("contact.title.b")}</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
          {t("contact.subtitle")}
        </p>
      </div>


      <div className="mt-12 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <ContactCard
            icon={<Phone className="h-5 w-5" />}
            title={t("contact.phone")}
            value={company.phone}
            href={`tel:${company.phone.replace(/\s/g, "")}`}
          />
          <ContactCard
            icon={<Mail className="h-5 w-5" />}
            title={t("contact.email")}
            value={company.email}
            href={`mailto:${company.email}`}
          />
          <ContactCard icon={<MapPin className="h-5 w-5" />} title={t("contact.address")} value={company.address} />

          <div className="rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-5 shadow-soft">
            <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">{t("contact.follow")}</div>

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
            <Field label={t("form.name")} error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>
            <Field label={t("form.email")} error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>
            <Field label={t("form.phone")} error={errors.phone}>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>
          </div>
          <Field label={t("form.service")} error={errors.service}>
            <select
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value, serviceOther: e.target.value === "Tjetër" ? form.serviceOther : "" })}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="" disabled>{t("form.servicePlaceholder")}</option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{t(SERVICE_LABEL_KEYS[opt])}</option>
              ))}
            </select>
          </Field>
          {form.service === "Tjetër" && (
            <Field label={t("form.serviceOther")} error={errors.serviceOther}>
              <input
                value={form.serviceOther}
                onChange={(e) => setForm({ ...form, serviceOther: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder={t("form.serviceOtherPlaceholder")}
              />
            </Field>
          )}
          <Field label={t("form.message")} error={errors.message}>
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
              t("form.submitting")
            ) : (
              <>
                {t("form.submit")} <Send className="h-4 w-4" />
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
