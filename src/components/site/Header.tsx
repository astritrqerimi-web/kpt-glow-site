import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import logoAsset from "@/assets/kpt-logo-symbol.png.asset.json";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";

type NavItem = { to: string; key: string };

const NAV: readonly NavItem[] = [
  { to: "/", key: "nav.home" },
  { to: "/rreth-nesh", key: "nav.about" },
  { to: "/sherbimet", key: "nav.services" },
  { to: "/lajme", key: "nav.news" },
  { to: "/kontakt", key: "nav.contact" },
] as const;

export function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isItemActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 md:bg-background/75 md:backdrop-blur-xl border-b border-border/60 shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-24 items-center justify-between md:h-28">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          onClick={() => setOpen(false)}
          aria-label="KPT Consulting"
        >
          <img
            src={logoAsset.url}
            alt="KPT Consulting"
            className="h-14 w-14 md:h-16 md:w-16 object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-xl md:text-2xl text-foreground tracking-tight font-semibold" style={{ fontFamily: "'Manrope', sans-serif" }}>
              KPT Consulting
            </span>
            <span className="text-[9px] md:text-[11px] uppercase tracking-[0.14em] md:tracking-[0.18em] text-muted-foreground whitespace-nowrap">
              {t("brand.tagline")}
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV.map((item) => {
            const isContact = item.key === "nav.contact";
            const isActive = isItemActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={
                  isContact
                    ? "inline-flex items-center rounded-full px-5 py-2.5 text-base lg:text-[17px] font-medium text-white shadow-soft whitespace-nowrap transition-all duration-300 hover:shadow-elegant hover:-translate-y-0.5"
                    : `relative px-1 py-2 text-base lg:text-[17px] font-medium whitespace-nowrap transition-colors ${
                        isActive ? "text-primary" : "text-foreground/75 hover:text-foreground"
                      }`
                }
                style={isContact ? { background: "var(--gradient-brand)" } : undefined}
              >
                {t(item.key)}
              </Link>
            );
          })}
          <LanguageSwitcher variant="desktop" />
        </nav>

        <button
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/70 backdrop-blur"
          onClick={() => setOpen((v) => !v)}
          aria-label={t("nav.menu")}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-up">
          <nav className="container-page py-4 flex flex-col gap-1">
            {NAV.map((item) => {
              const isContact = item.key === "nav.contact";
              const isActive = isItemActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={
                    isContact
                      ? "mx-3 mt-1 inline-flex items-center justify-center rounded-full px-5 py-3 text-base font-medium text-white transition-all duration-300"
                      : `px-3 py-3 rounded-lg text-base font-medium transition ${
                          isActive ? "text-primary bg-muted" : "text-foreground/85 hover:bg-muted"
                        }`
                  }
                  style={isContact ? { background: "var(--gradient-brand)" } : undefined}
                >
                  {t(item.key)}
                </Link>
              );
            })}
            <LanguageSwitcher variant="mobile" />
          </nav>
        </div>
      )}
    </header>
  );
}
