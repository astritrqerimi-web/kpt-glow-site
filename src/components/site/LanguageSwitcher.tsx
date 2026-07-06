import { useI18n, type Lang } from "@/lib/i18n";
import { KosovoFlag, UsFlag } from "@/components/site/Flags";

const langs: Record<Lang, { label: string; flag: React.FC<{ className?: string }> }> = {
  sq: { label: "Shqip", flag: KosovoFlag },
  en: { label: "English", flag: UsFlag },
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
          const Flag = langs[code].flag;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              aria-label={langs[code].label}
              aria-pressed={active}
              className={`relative px-3 py-[5px] transition-all duration-300 ease-out ${
                active
                  ? "rounded-full bg-primary shadow-sm"
                  : "opacity-60 hover:opacity-100"
              } ${i === 0 ? "mr-[1px]" : ""}`}
            >
              <Flag className="w-6 h-4 rounded-[2px] object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
