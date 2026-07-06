import { useI18n, type Lang } from "@/lib/i18n";

const flags: Record<Lang, { emoji: string; label: string; short: string }> = {
  sq: { emoji: "🇽🇰", label: "Shqip", short: "SHQ" },
  en: { emoji: "🇺🇸", label: "English", short: "EN" },
};


interface Props {
  variant?: "desktop" | "mobile";
}

export function LanguageSwitcher({ variant = "desktop" }: Props) {
  const { lang, setLang } = useI18n();

  return (
    <div className={`flex items-center gap-2 ${variant === "mobile" ? "mt-3 px-3" : "ml-3"}`}>
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
