import { useI18n, type Lang } from "@/lib/i18n";

const langs: Record<Lang, { label: string; short: string }> = {
  sq: { label: "Shqip", short: "AL" },
  en: { label: "English", short: "EN" },
};

const order: Lang[] = ["sq", "en"];

interface Props {
  variant?: "desktop" | "mobile";
}

export function LanguageSwitcher({ variant = "desktop" }: Props) {
  const { lang, setLang } = useI18n();

  return (
    <div className={`flex items-center ${variant === "mobile" ? "mt-3 px-3" : "ml-3"}`}>
      <div className="inline-flex items-center rounded-full border border-border/60 bg-background/50 p-[3px] backdrop-blur-sm">
        {order.map((code, i) => {
          const active = lang === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              aria-label={langs[code].label}
              aria-pressed={active}
              className={`relative px-3 py-[5px] text-[12px] font-semibold tracking-wider uppercase transition-all duration-300 ease-out ${
                active
                  ? "rounded-full bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              } ${i === 0 ? "mr-[1px]" : ""}`}
            >
              {langs[code].short}
            </button>
          );
        })}
      </div>
    </div>
  );
}
