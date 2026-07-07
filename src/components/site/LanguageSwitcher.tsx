import { useI18n, type Lang } from "@/lib/i18n";
import { KosovoFlag, UsFlag } from "@/components/site/Flags";

const langs: Record<Lang, { label: string; code: string; flag: React.FC<{ className?: string }> }> = {
  sq: { label: "Shqip", code: "AL", flag: KosovoFlag },
  en: { label: "English", code: "EN", flag: UsFlag },
};

const order: Lang[] = ["sq", "en"];

interface Props {
  variant?: "desktop" | "mobile";
}

export function LanguageSwitcher({ variant = "desktop" }: Props) {
  const { lang, setLang } = useI18n();

  return (
    <div className={`flex items-center ${variant === "mobile" ? "mt-3 px-3" : "ml-4"}`}>
      <div className="inline-flex items-center rounded-full border border-border/50 bg-background/60 p-[2px] backdrop-blur-sm shadow-soft">
        {order.map((code) => {
          const active = lang === code;
          const config = langs[code];
          const Flag = config.flag;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              aria-label={config.label}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] font-semibold tracking-wide transition-all duration-300 ease-out ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Flag className="w-4 h-3 sm:w-[18px] sm:h-[13px] rounded-[1px] object-cover flex-shrink-0" />
              <span>{config.code}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
