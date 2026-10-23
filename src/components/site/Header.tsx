import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { BrandLogo } from "@/components/site/BrandLogo";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { scrollToSection, scrollToTop } from "@/lib/scroll-to-section";

type NavItem =
  | { kind: "route"; to: string; key: string }
  | { kind: "section"; section: string; key: string };

const NAV: readonly NavItem[] = [
  { kind: "route", to: "/", key: "nav.home" },
  { kind: "section", section: "rreth-nesh", key: "nav.about" },
  { kind: "section", section: "sherbimet", key: "nav.services" },
  { kind: "route", to: "/lajme", key: "nav.news" },
  { kind: "route", to: "/llogarite-pagen", key: "nav.payroll" },
  { kind: "route", to: "/afatet-e-deklarimit", key: "nav.deadlines" },
  { kind: "section", section: "kontakt", key: "nav.contact" },
] as const;

export function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isRouteActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");

  const handleHomeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (pathname === "/") {
      // Keep the router's scroll reset from interrupting the smooth scroll.
      event.preventDefault();
      scrollToTop();
    }
    // From another page, Link resets scroll after the home route has rendered.
  };

  const handleSection = async (section: string) => {
    setOpen(false);
    if (pathname !== "/") {
      await navigate({ to: "/" });
      setTimeout(() => scrollToSection(section), 80);
    } else {
      scrollToSection(section);
    }
  };

  const renderItem = (item: NavItem, mobile: boolean) => {
    const isContact = item.key === "nav.contact";
    const desktopBase = isContact
      ? "inline-flex items-center rounded-full px-5 py-2.5 text-base lg:text-[17px] font-medium text-white shadow-soft whitespace-nowrap transition-all duration-300 hover:shadow-elegant hover:-translate-y-0.5"
      : "relative px-1 py-2 text-base lg:text-[17px] font-medium whitespace-nowrap transition-colors text-foreground/75 hover:text-foreground";
    const mobileBase = isContact
      ? "mx-3 mt-1 inline-flex items-center justify-center rounded-full px-5 py-3 text-base font-medium text-white transition-all duration-300"
      : "px-3 py-3 rounded-lg text-base font-medium transition text-foreground/85 hover:bg-muted text-left w-full";
    const cls = mobile ? mobileBase : desktopBase;
    const style = isContact ? { background: "var(--gradient-brand)" } : undefined;

    if (item.kind === "route") {
      const isActive = isRouteActive(item.to);
      const activeCls = !isContact && isActive
        ? mobile ? " text-primary bg-muted" : " text-primary"
        : "";
      return (
        <Link
          key={item.key}
          to={item.to}
          resetScroll
          onClick={item.to === "/" ? handleHomeClick : () => setOpen(false)}
          className={cls + activeCls}
          style={style}
        >
          {t(item.key)}
        </Link>
      );
    }

    return (
      <button
        key={item.key}
        type="button"
        onClick={() => handleSection(item.section)}
        className={cls}
        style={style}
      >
        {t(item.key)}
      </button>
    );
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 md:bg-background/75 md:backdrop-blur-xl border-b border-border/60 shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto grid min-h-24 w-full max-w-[1480px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-4 py-3 sm:flex sm:h-28 sm:gap-4 sm:px-6 sm:py-0 lg:px-8">
        <Link
          to="/"
          className="group flex min-w-0 shrink-0 items-center gap-2 sm:gap-3"
          resetScroll
          onClick={handleHomeClick}
          aria-label="KPT Consulting"
        >
          <span className="block h-12 w-12 shrink-0 sm:h-14 sm:w-14 md:h-16 md:w-16">
          <BrandLogo
            alt="KPT Consulting"
            sizes="(max-width: 768px) 56px, 64px"
            eager
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          </span>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="whitespace-nowrap text-lg sm:text-xl md:text-2xl text-foreground font-semibold" style={{ fontFamily: "'Manrope', sans-serif" }}>
              KPT Consulting
            </span>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.14em] text-muted-foreground whitespace-nowrap">
              {t("brand.tagline")}
            </span>
          </div>
        </Link>

        <nav className="min-[1440px]:ml-2 hidden min-[1440px]:flex items-center gap-3">
          {NAV.map((item) => renderItem(item, false))}
        </nav>

        <div className="col-span-2 row-start-2 flex shrink-0 justify-end sm:ml-auto">
          <LanguageSwitcher variant="desktop" />
        </div>

        <button
          className="col-start-2 row-start-1 min-[1440px]:hidden inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background/70 backdrop-blur"
          onClick={() => setOpen((v) => !v)}
          aria-label={t("nav.menu")}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="min-[1440px]:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-up">
          <nav className="container-page py-4 flex flex-col gap-1">
            {NAV.map((item) => renderItem(item, true))}
          </nav>
        </div>
      )}
    </header>
  );
}
