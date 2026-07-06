import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import logoAsset from "@/assets/kpt-logo.png.asset.json";
import type { CompanyInfo } from "@/lib/site-content";

export function Footer({ company }: { company: CompanyInfo }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/60 backdrop-blur">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="KPT Consulting" className="h-11 w-11 object-contain" />
            <div>
              <div className="font-display text-lg text-foreground">KPT Consulting</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Kontabilitet · Tatime · Konsulencë
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
            Zgjidhje profesionale të kontabilitetit, deklarimeve tatimore dhe konsulencës për biznese në Kosovë.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {company.facebook && (
              <a href={company.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {company.instagram && (
              <a href={company.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {company.linkedin && (
              <a href={company.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Menuja</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="text-muted-foreground hover:text-primary transition">Ballina</Link></li>
            <li><Link to="/rreth-nesh" className="text-muted-foreground hover:text-primary transition">Rreth Nesh</Link></li>
            <li><Link to="/sherbimet" className="text-muted-foreground hover:text-primary transition">Shërbimet</Link></li>
            <li><Link to="/kontakti" className="text-muted-foreground hover:text-primary transition">Kontakti</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Kontakti</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary" /><a href={`tel:${company.phone.replace(/\s/g,'')}`} className="hover:text-primary transition">{company.phone}</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary" /><a href={`mailto:${company.email}`} className="hover:text-primary transition">{company.email}</a></li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" /><span>{company.address}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {year} KPT Consulting. Të gjitha të drejtat e rezervuara.</span>
          <span>kptconsulting.al</span>
        </div>
      </div>
    </footer>
  );
}
