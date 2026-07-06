import { useI18n, type Lang } from "@/lib/i18n";
import { KosovoFlag, UsFlag } from "./Flags";

const flags: Record<Lang, { flag: React.ReactNode; label: string; short: string }> = {
  sq: { flag: <KosovoFlag className="h-5 w-[28px] rounded-[3px] shadow-sm" />, label: "Shqip", short: "SHQ" },
  en: { flag: <UsFlag className="h-5 w-[28px] rounded-[3px] shadow-sm" />, label: "English", short: "EN" },
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
            className={`inline-flex items-center gap-2.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold tracking-wide transition-all duration-300 ease-out ${
              active
                ? "border-primary/40 bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "border-border/80 bg-background/60 text-muted-foreground backdrop-blur-sm hover:border-primary/40 hover:text-foreground hover:bg-primary/5"
            }`}
          >
            {flags[code].flag}
            <span>{flags[code].short}</span>
          </button>
        );
      })}
    </div>
  );
}
