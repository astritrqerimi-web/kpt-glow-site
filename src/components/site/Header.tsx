import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import logoAsset from "@/assets/kpt-logo-symbol.png.asset.json";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";

type NavItem =
  | { kind: "hash"; hash: string; key: string }
  | { kind: "route"; to: string; key: string };

const NAV: readonly NavItem[] = [
  { kind: "hash", hash: "#ballina", key: "nav.home" },
  { kind: "hash", hash: "#rreth-nesh", key: "nav.about" },
  { kind: "hash", hash: "#sherbimet", key: "nav.services" },
  { kind: "route", to: "/lajme", key: "nav.news" },
  { kind: "hash", hash: "#kontakti", key: "nav.contact" },
] as const;

function scrollToHash(hash: string) {
  const id = hash.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", hash);
  }
}

export function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("#ballina");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV.map((n) => n.hash.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNav = (e: React.MouseEvent, hash: string) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      scrollToHash(hash);
      setOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/75 border-b border-border/60 shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-24 items-center justify-between md:h-28">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              history.replaceState(null, "", "/");
            }
            setOpen(false);
          }}
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

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
            <a
              key={item.hash}
              href={`/${item.hash}`}
              onClick={(e) => handleNav(e, item.hash)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                active === item.hash ? "text-primary" : "text-foreground/75 hover:text-foreground"
              }`}
            >
              {t(item.key)}
            </a>
          ))}
          <a
            href="/#kontakti"
            onClick={(e) => handleNav(e, "#kontakti")}
            className="ml-4 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-all duration-300 hover:shadow-elegant hover:-translate-y-0.5"
            style={{ background: "var(--gradient-brand)" }}
          >
            {t("nav.contactUs")}
          </a>
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
            {NAV.map((item) => (
              <a
                key={item.hash}
                href={`/${item.hash}`}
                onClick={(e) => handleNav(e, item.hash)}
                className={`px-3 py-3 rounded-lg text-base font-medium transition ${
                  active === item.hash ? "text-primary bg-muted" : "text-foreground/85 hover:bg-muted"
                }`}
              >
                {t(item.key)}
              </a>
            ))}
            <a
              href="/#kontakti"
              onClick={(e) => handleNav(e, "#kontakti")}
              className="mt-2 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-white"
              style={{ background: "var(--gradient-brand)" }}
            >
              {t("nav.contactUs")}
            </a>
            <LanguageSwitcher variant="mobile" />
          </nav>
        </div>
      )}
    </header>
  );
}
