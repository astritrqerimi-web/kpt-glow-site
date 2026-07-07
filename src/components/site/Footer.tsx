import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import logoAsset from "@/assets/kpt-logo-symbol.png.asset.json";
import { type CompanyInfo, footerQuery, pick } from "@/lib/site-content";
import { useI18n } from "@/lib/i18n";

export function Footer({ company }: { company: CompanyInfo }) {
  const { t, lang } = useI18n();
  const { data: f } = useQuery(footerQuery());
  const year = new Date().getFullYear();

  const desc = pick(f?.description, lang, t("footer.desc"));
  const menuTitle = pick(f?.menuTitle, lang, t("footer.menu"));
  const contactTitle = pick(f?.contactTitle, lang, t("footer.contact"));
  const rights = pick(f?.rights, lang, t("footer.rights"));
  const brand = f?.copyrightName || "KPT Consulting";
  const privacyLabel = pick(f?.privacyLabel, lang, "Politika e Privatësisë");
  const termsLabel = pick(f?.termsLabel, lang, "Kushtet e Përdorimit");
  const hours = pick(company.workingHours, lang, "");

  return (
    <footer className="mt-24 border-t border-border/60 bg-background/60 backdrop-blur">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt={brand} className="h-11 w-11 object-contain" />
            <div>
              <div className="text-lg text-foreground font-semibold" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {brand}
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("brand.taglineDot")}
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">{desc}</p>
          <div className="mt-5 flex items-center gap-2 flex-wrap">
            {company.facebook && <SocialLink href={company.facebook} label="Facebook"><Facebook className="h-4 w-4" /></SocialLink>}
            {company.instagram && <SocialLink href={company.instagram} label="Instagram"><Instagram className="h-4 w-4" /></SocialLink>}
            {company.linkedin && <SocialLink href={company.linkedin} label="LinkedIn"><Linkedin className="h-4 w-4" /></SocialLink>}
            {company.tiktok && (
              <SocialLink href={company.tiktok} label="TikTok">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M19.6 6.3a5.4 5.4 0 0 1-3.3-1.1V15a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.5a3.1 3.1 0 1 0 2.1 2.9V2h2.4a5.4 5.4 0 0 0 3.5 4.3z"/></svg>
              </SocialLink>
            )}
            {company.youtube && (
              <SocialLink href={company.youtube} label="YouTube">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.3-1C16.6 3.5 12 3.5 12 3.5s-4.6 0-7.8.4c-.5.1-1.5.1-2.3 1C1.2 5.6 1 7.2 1 7.2S.7 9 .7 10.9v1.7c0 1.8.3 3.7.3 3.7s.2 1.6.9 2.3c.9.9 2.1.9 2.6 1 1.9.2 8 .3 8 .3s4.6 0 7.8-.4c.5-.1 1.5-.1 2.3-1 .7-.7.9-2.3.9-2.3s.3-1.8.3-3.7v-1.7c0-1.8-.3-3.6-.3-3.6zM9.7 14.6V8.3l6 3.2-6 3.1z"/></svg>
              </SocialLink>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">{menuTitle}</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="/#ballina" className="text-muted-foreground hover:text-primary transition">{t("nav.home")}</a></li>
            <li><a href="/#rreth-nesh" className="text-muted-foreground hover:text-primary transition">{t("nav.about")}</a></li>
            <li><a href="/#sherbimet" className="text-muted-foreground hover:text-primary transition">{t("nav.services")}</a></li>
            <li><a href="/lajme" className="text-muted-foreground hover:text-primary transition">{t("nav.news")}</a></li>
            <li><a href="/#kontakti" className="text-muted-foreground hover:text-primary transition">{t("nav.contact")}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">{contactTitle}</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary" /><a href={`tel:${company.phone.replace(/\s/g,'')}`} className="hover:text-primary transition">{company.phone}</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary" /><a href={`mailto:${company.email}`} className="hover:text-primary transition">{company.email}</a></li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" /><span>{company.address}</span></li>
            {hours && <li className="flex gap-2"><Clock className="h-4 w-4 mt-0.5 text-primary shrink-0" /><span>{hours}</span></li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {year} {brand}. {rights}</span>
          <div className="flex items-center gap-4">
            {f?.privacyUrl && <a href={f.privacyUrl} className="hover:text-primary transition">{privacyLabel}</a>}
            {f?.termsUrl && <a href={f.termsUrl} className="hover:text-primary transition">{termsLabel}</a>}
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition">
      {children}
    </a>
  );
}
