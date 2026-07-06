import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "sq" | "en";

type Dict = Record<string, string>;

const translations: Record<Lang, Dict> = {
  sq: {
    // Nav
    "nav.home": "Ballina",
    "nav.about": "Rreth Nesh",
    "nav.services": "Shërbimet",
    "nav.contact": "Kontakti",
    "nav.contactUs": "Na Kontaktoni",
    "nav.menu": "Menu",
    "nav.language": "Gjuha",

    // Header logo
    "brand.tagline": "Kontabilitet | Program | Trajnime",
    "brand.taglineDot": "Kontabilitet • Program • Trajnime",

    // Hero
    "hero.badge": "Kontabilitet • Program • Trajnime",
    "hero.ctaContact": "Na Kontaktoni",
    "hero.ctaServices": "Shërbimet",
    "hero.happyClients": "Klientë të kënaqur",
    "hero.compliance": "Në përputhje me legjislacionin",
    "hero.certified": "Kontabilist i Certifikuar",
    "hero.stat.growth": "Rritje mesatare",
    "hero.stat.compliance": "Përputhshmëri",

    // Trust cards
    "trust.1.title": "Ekspertizë Profesionale",
    "trust.1.desc": "Shërbime kontabiliteti, tatimore dhe financiare të ofruara me profesionalizëm dhe përkushtim.",
    "trust.2.title": "Rritje dhe Zhvillim",
    "trust.2.desc": "Zgjidhje financiare që mbështesin rritjen dhe suksesin afatgjatë të biznesit tuaj.",
    "trust.3.title": "Besim dhe Transparencë",
    "trust.3.desc": "Marrëdhënie të ndërtuara mbi korrektësi, integritet dhe besueshmëri.",
    "trust.4.title": "Partneritet Afatgjatë",
    "trust.4.desc": "Partneri juaj i besueshëm në çdo fazë të zhvillimit të biznesit.",

    // About
    "about.eyebrow": "Rreth Nesh",
    "about.title.a": "Partneri juaj për",
    "about.title.b": "zgjidhje financiare",
    "about.leadership": "Udhëheqja",
    "about.value.1.title": "Besueshmëri",
    "about.value.1.desc": "Punojmë me integritet dhe transparencë të plotë.",
    "about.value.2.title": "Saktësi",
    "about.value.2.desc": "Standarde të larta profesionale në çdo detyrë.",
    "about.value.3.title": "Partneritet",
    "about.value.3.desc": "Marrëdhënie afatgjata të bazuara në rezultate.",
    "about.value.4.title": "Përputhshmëri",
    "about.value.4.desc": "Në përputhje të plotë me legjislacionin.",

    // Services
    "services.eyebrow": "Shërbimet",
    "services.title.a": "Gjithçka që biznesi juaj",
    "services.title.b": "ka nevojë",
    "services.subtitle": "Nga themelimi i biznesit deri te menaxhimi financiar i përditshëm — mbulojmë çdo aspekt profesional.",

    // Contact
    "contact.eyebrow": "Kontakti",
    "contact.title.a": "Le të",
    "contact.title.b": "bisedojmë",
    "contact.subtitle": "Kontaktoni ekipin tonë për një konsultim ose plotësoni formularin dhe do t'ju përgjigjemi sa më shpejt.",
    "contact.phone": "Telefoni",
    "contact.email": "Email",
    "contact.address": "Adresa",
    "contact.follow": "Na Ndiqni",

    // Form
    "form.name": "Emri i plotë *",
    "form.email": "Email *",
    "form.phone": "Telefoni",
    "form.service": "Shërbimi që ju intereson *",
    "form.servicePlaceholder": "Zgjidhni një shërbim",
    "form.serviceOther": "Përshkruani kërkesën tuaj *",
    "form.serviceOtherPlaceholder": "Shkruani shërbimin që ju intereson",
    "form.message": "Mesazhi *",
    "form.submit": "Dërgo mesazhin",
    "form.submitting": "Duke dërguar...",
    "form.success": "Mesazhi u dërgua me sukses. Do t'ju kontaktojmë së shpejti.",
    "form.error": "Dërgimi dështoi. Ju lutemi provoni përsëri.",
    "form.err.name": "Emri është i detyrueshëm",
    "form.err.email": "Email-i nuk është valid",
    "form.err.service": "Ju lutem zgjidhni një shërbim",
    "form.err.serviceOther": "Ju lutem përshkruani kërkesën tuaj",
    "form.err.message": "Mesazhi është shumë i shkurtër",

    // Service options
    "svc.registration": "Regjistrimi i Biznesit",
    "svc.bookkeeping": "Kontabiliteti dhe Mbajtja e Librave",
    "svc.financial": "Përgatitja e Pasqyrave Financiare",
    "svc.tax": "Konsulencë Tatimore dhe Financiare",
    "svc.grants": "Aplikim për Grante dhe Subvencione",
    "svc.other": "Tjetër",

    // Footer
    "footer.desc": "Zgjidhje profesionale të kontabilitetit, deklarimeve tatimore dhe konsulencës për biznese në Kosovë.",
    "footer.menu": "Menuja",
    "footer.contact": "Kontakti",
    "footer.rights": "Të gjitha të drejtat e rezervuara.",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.services": "Services",
    "nav.contact": "Contact",
    "nav.contactUs": "Contact Us",
    "nav.menu": "Menu",
    "nav.language": "Language",

    "brand.tagline": "Accounting | Software | Training",
    "brand.taglineDot": "Accounting • Software • Training",

    "hero.badge": "Accounting • Software • Training",
    "hero.ctaContact": "Contact Us",
    "hero.ctaServices": "Services",
    "hero.happyClients": "Satisfied clients",
    "hero.compliance": "Fully legally compliant",
    "hero.certified": "Certified Accountant",
    "hero.stat.growth": "Average growth",
    "hero.stat.compliance": "Compliance",

    "trust.1.title": "Professional Expertise",
    "trust.1.desc": "Accounting, tax and financial services delivered with professionalism and dedication.",
    "trust.2.title": "Growth & Development",
    "trust.2.desc": "Financial solutions that support the long-term growth and success of your business.",
    "trust.3.title": "Trust & Transparency",
    "trust.3.desc": "Relationships built on integrity, fairness and reliability.",
    "trust.4.title": "Long-Term Partnership",
    "trust.4.desc": "Your trusted partner at every stage of your business journey.",

    "about.eyebrow": "About Us",
    "about.title.a": "Your partner for",
    "about.title.b": "financial solutions",
    "about.leadership": "Leadership",
    "about.value.1.title": "Reliability",
    "about.value.1.desc": "We work with full integrity and transparency.",
    "about.value.2.title": "Accuracy",
    "about.value.2.desc": "High professional standards on every task.",
    "about.value.3.title": "Partnership",
    "about.value.3.desc": "Long-term relationships built on results.",
    "about.value.4.title": "Compliance",
    "about.value.4.desc": "Full compliance with legislation.",

    "services.eyebrow": "Services",
    "services.title.a": "Everything your business",
    "services.title.b": "needs",
    "services.subtitle": "From company registration to day-to-day financial management — we cover every professional aspect.",

    "contact.eyebrow": "Contact",
    "contact.title.a": "Let's",
    "contact.title.b": "talk",
    "contact.subtitle": "Reach out to our team for a consultation or fill in the form and we will get back to you shortly.",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.address": "Address",
    "contact.follow": "Follow Us",

    "form.name": "Full name *",
    "form.email": "Email *",
    "form.phone": "Phone",
    "form.service": "Service you're interested in *",
    "form.servicePlaceholder": "Choose a service",
    "form.serviceOther": "Describe your request *",
    "form.serviceOtherPlaceholder": "Write the service you're interested in",
    "form.message": "Message *",
    "form.submit": "Send message",
    "form.submitting": "Sending...",
    "form.success": "Your message was sent successfully. We will contact you soon.",
    "form.error": "Sending failed. Please try again.",
    "form.err.name": "Name is required",
    "form.err.email": "Email is not valid",
    "form.err.service": "Please choose a service",
    "form.err.serviceOther": "Please describe your request",
    "form.err.message": "Message is too short",

    "svc.registration": "Business Registration",
    "svc.bookkeeping": "Accounting & Bookkeeping",
    "svc.financial": "Financial Statement Preparation",
    "svc.tax": "Tax & Financial Consulting",
    "svc.grants": "Grant & Subsidy Applications",
    "svc.other": "Other",

    "footer.desc": "Professional accounting, tax filing and consulting solutions for businesses in Kosovo.",
    "footer.menu": "Menu",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
  },
};

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "kpt.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sq");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "sq" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  const t = (key: string) => translations[lang][key] ?? translations.sq[key] ?? key;

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
