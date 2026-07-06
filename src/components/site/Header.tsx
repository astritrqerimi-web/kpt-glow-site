import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import logoAsset from "@/assets/kpt-logo-symbol.png.asset.json";

const nav = [
  { to: "/", label: "Ballina" },
  { to: "/rreth-nesh", label: "Rreth Nesh" },
  { to: "/sherbimet", label: "Shërbimet" },
  { to: "/kontakti", label: "Kontakti" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/75 border-b border-border/60 shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <img
            src={logoAsset.url}
            alt="KPT Consulting"
            className="h-11 w-11 object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-display text-lg text-foreground tracking-tight">KPT Consulting</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Kontabilitet · Tatime · Konsulencë
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              className="relative px-4 py-2 text-sm font-medium text-foreground/75 hover:text-foreground transition-colors"
              activeProps={{ className: "!text-primary" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/kontakti"
            className="ml-4 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-all duration-300 hover:shadow-elegant hover:-translate-y-0.5"
            style={{ background: "var(--gradient-brand)" }}
          >
            Na Kontaktoni
          </Link>
        </nav>

        <button
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/70 backdrop-blur"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-up">
          <nav className="container-page py-4 flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-lg text-base font-medium text-foreground/85 hover:bg-muted transition"
                activeProps={{ className: "text-primary bg-muted" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/kontakti"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-white"
              style={{ background: "var(--gradient-brand)" }}
            >
              Na Kontaktoni
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
