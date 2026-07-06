import { useI18n, type Lang } from "@/lib/i18n";

const flags: Record<Lang, { emoji: string; label: string; short: string }> = {
  sq: { emoji: "🇽🇰", label: "Shqip (Kosovë)", short: "AL" },
  en: { emoji: "🇺🇸", label: "English", short: "EN" },
};


interface Props {
  variant?: "desktop" | "mobile";
}

export function LanguageSwitcher({ variant = "desktop" }: Props) {
  const { lang, setLang } = useI18n();

  if (variant === "mobile") {
    return (
      <div className="mt-3 flex items-center gap-2 px-3">
        {(Object.keys(flags) as Lang[]).map((code) => {
          const active = lang === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              aria-label={flags[code].label}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                active
                  ? "border-primary/50 bg-primary/5 text-primary shadow-soft"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              <span className="text-base leading-none">{flags[code].emoji}</span>
              <span>{flags[code].short}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="ml-3 flex items-center gap-1 rounded-full border border-border/60 bg-background/60 backdrop-blur px-1 py-1">
      {(Object.keys(flags) as Lang[]).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-label={flags[code].label}
            aria-pressed={active}
            title={flags[code].label}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-base transition-all duration-300 hover:scale-110 ${
              active
                ? "bg-primary/10 shadow-soft ring-1 ring-primary/30"
                : "opacity-55 hover:opacity-100"
            }`}
          >
            <span className="leading-none">{flags[code].emoji}</span>
          </button>
        );
      })}
    </div>
  );
}
