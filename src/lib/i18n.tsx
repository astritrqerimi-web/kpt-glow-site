import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "sq" | "en";

type Dict = Record<string, string>;

/** Translations for services keyed by database service ID. */
export const SERVICE_TRANSLATIONS: Record<Lang, Record<string, { title: string; description: string }>> = {
  sq: {
    "23a43269-f122-4574-bc4a-ac43c563fe07": { title: "Regjistrimi i Bizneseve", description: "Ndihmojmë në themelimin dhe regjistrimin e bizneseve tuaja sipas legjislacionit në fuqi, nga hapat e parë deri në aktivizimin e plotë." },
    "5c718b1a-ca30-4546-8d31-d2b8f478c09c": { title: "Kontabilitet dhe Mbajtje e Librave", description: "Mbajtje profesionale e librave kontabël, evidencave financiare dhe raportimeve mujore për biznesin tuaj." },
    "cdcca70a-8347-4379-8791-eb2b8ac9c1f4": { title: "Deklarime Tatimore dhe TVSH", description: "Përgatitje dhe dorëzim i të gjitha deklarimeve tatimore, TVSH-së dhe raporteve për ATK në kohë dhe me saktësi." },
    "f537375d-1d9a-44f2-98a7-ec419abcd7ba": { title: "Përgatitja e Pasqyrave Financiare", description: "Hartimi i pasqyrave financiare vjetore në përputhje me standardet ndërkombëtare të raportimit financiar." },
    "94151bbc-5441-4545-88f3-11cea2f5b04a": { title: "Menaxhimi i Pagave", description: "Administrim i pagave, kontributeve dhe të gjitha detyrimeve që lidhen me punonjësit tuaj." },
    "d026d0df-eafd-492b-8011-0b4ce924e80c": { title: "Konsulencë Tatimore dhe Financiare", description: "Këshillim strategjik për optimizim tatimor, planifikim financiar dhe zgjidhje të problemeve komplekse." },
    "807ac63e-1b0d-4994-a902-54228ac190f6": { title: "Program Financiar dhe Digjitalizim", description: "Implementim i programeve moderne financiare dhe digjitalizim i proceseve të biznesit tuaj." },
    "9db178d6-7e78-459a-9aad-c2cafc84fa10": { title: "Trajnime Profesionale", description: "Trajnime të specializuara në kontabilitet, tatime dhe menaxhim financiar për ekipin tuaj." },
    "1cc6b0f4-d526-4590-a6cc-9bd3c133543b": { title: "Aplikime për Grante dhe Subvencione", description: "Përgatitje profesionale e aplikimeve për grante dhe subvencione nga institucionet vendore dhe ndërkombëtare." },
    "29a67d92-472c-4c24-9215-d1cfdd5c17ae": { title: "Konsulencë për Zhvillim Biznesi", description: "Mbështetje strategjike për rritjen, zgjerimin dhe zhvillimin afatgjatë të biznesit tuaj." },
  },
  en: {
    "23a43269-f122-4574-bc4a-ac43c563fe07": { title: "Business Registration", description: "We help you establish and register your business in line with current legislation — from the first steps all the way to full activation." },
    "5c718b1a-ca30-4546-8d31-d2b8f478c09c": { title: "Accounting & Bookkeeping", description: "Professional bookkeeping, financial record-keeping and monthly reporting for your business." },
    "cdcca70a-8347-4379-8791-eb2b8ac9c1f4": { title: "Tax & VAT Filings", description: "Timely and accurate preparation and submission of all tax filings, VAT and reports to the Kosovo Tax Administration." },
    "f537375d-1d9a-44f2-98a7-ec419abcd7ba": { title: "Financial Statement Preparation", description: "Preparation of annual financial statements in accordance with international financial reporting standards." },
    "94151bbc-5441-4545-88f3-11cea2f5b04a": { title: "Payroll Management", description: "Administration of payroll, contributions and all obligations related to your employees." },
    "d026d0df-eafd-492b-8011-0b4ce924e80c": { title: "Tax & Financial Consulting", description: "Strategic advice for tax optimization, financial planning and solving complex issues." },
    "807ac63e-1b0d-4994-a902-54228ac190f6": { title: "Financial Software & Digitalization", description: "Implementation of modern financial software and digitalization of your business processes." },
    "9db178d6-7e78-459a-9aad-c2cafc84fa10": { title: "Professional Training", description: "Specialized training in accounting, taxation and financial management for your team." },
    "1cc6b0f4-d526-4590-a6cc-9bd3c133543b": { title: "Grant & Subsidy Applications", description: "Professional preparation of grant and subsidy applications for local and international institutions." },
    "29a67d92-472c-4c24-9215-d1cfdd5c17ae": { title: "Business Development Consulting", description: "Strategic support for the growth, expansion and long-term development of your business." },
  },
};

const translations: Record<Lang, Dict> = {

  sq: {
    // Nav
    "nav.home": "Ballina",
    "nav.about": "Rreth Nesh",
    "nav.services": "Shërbimet",
    "nav.news": "Blog",
    "nav.contact": "Kontakti",
    "nav.contactUs": "Na Kontaktoni",
    "nav.menu": "Menu",
    "nav.language": "Gjuha",

    // Header logo
    "brand.tagline": "Kontabilitet | Program | Trajnime",
    "brand.taglineDot": "Kontabilitet • Program • Trajnime",

    // Hero
    "hero.badge": "Kontabilitet • Program • Trajnime",
    "hero.title": "Zgjidhje financiare për biznesin tuaj",
    "hero.subtitle": "KPT Consulting ofron shërbime profesionale të kontabilitetit, deklarimeve tatimore, regjistrimit të bizneseve, programeve financiare dhe trajnimeve për biznese.",
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
    "about.intro": "KPT Consulting është një kompani e specializuar në kontabilitet, shërbime tatimore dhe konsulencë për biznese. Misioni ynë është të ofrojmë zgjidhje profesionale që ndihmojnë bizneset të menaxhojnë financat me saktësi, transparencë dhe efikasitet.",
    "about.services.text": "Ne ofrojmë shërbime në fushën e kontabilitetit, deklarimeve tatimore, regjistrimit të bizneseve, administrimit të pagave, përgatitjes së pasqyrave financiare dhe konsulencës financiare, duke ndërtuar partneritete afatgjata me klientët tanë.",
    "about.leader": "KPT Consulting udhëhiqet nga Mr. Sc Astrit Qerimi, Kontabilist i Certifikuar dhe Këshilltar Tatimor i Certifikuar, me përvojë në ofrimin e zgjidhjeve profesionale financiare dhe tatimore për biznese. Përkushtimi ynë është të ofrojmë shërbime të sakta, të besueshme dhe në përputhje me legjislacionin në fuqi.",
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

    // News
    "news.eyebrow": "Përditësime & Njoftime",
    "news.homeTitle": "Përditësime Ligjore dhe Tatimore",
    "news.homeSubtitle": "Informohu i pari për ndryshimet ligjore, tatimore dhe njoftimet më të rëndësishme për biznesin tuaj.",
    "news.viewAll": "Shiko të gjitha",
    "news.pageTitle": "Lajme & Njoftime",
    "news.pageSubtitle": "Përditësime nga ATK, ministritë dhe legjislacioni që prek biznesin në Kosovë.",
    "news.readMore": "Lexo më shumë",
    "news.minRead": "min lexim",
    "news.filter.all": "Të gjitha",
    "news.sort": "Rendit",
    "news.sort.newest": "Më të rejat",
    "news.sort.oldest": "Më të vjetrat",
    "news.searchPlaceholder": "Kërko lajme...",
    "news.searchBtn": "Kërko",
    "news.prev": "E mëparshme",
    "news.next": "Vijuese",
    "news.previous": "Artikulli i mëparshëm",
    "news.related": "Lexo edhe",
    "news.share": "Shpërnda:",
    "news.gallery": "Galeria",
    "news.attachments": "Dokumente të bashkangjitura",
    "news.backToAll": "Kthehu te të gjitha lajmet",
    "news.empty.title": "S'ka artikuj për t'u shfaqur",
    "news.empty.desc": "Provoni një kategori ose fjalë kyçe tjetër.",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.services": "Services",
    "nav.news": "News & Announcements",
    "nav.contact": "Contact",
    "nav.contactUs": "Contact Us",
    "nav.menu": "Menu",
    "nav.language": "Language",

    "brand.tagline": "Accounting | Software | Training",
    "brand.taglineDot": "Accounting • Software • Training",

    "hero.badge": "Accounting • Software • Training",
    "hero.title": "Financial solutions for your business",
    "hero.subtitle": "KPT Consulting delivers professional accounting, tax filing, business registration, financial software and training services for businesses.",
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
    "about.intro": "KPT Consulting is a company specialized in accounting, tax services and business consulting. Our mission is to deliver professional solutions that help businesses manage their finances with accuracy, transparency and efficiency.",
    "about.services.text": "We offer services in accounting, tax filings, business registration, payroll administration, financial statement preparation and financial consulting, building long-term partnerships with our clients.",
    "about.leader": "KPT Consulting is led by Mr. Sc Astrit Qerimi — Certified Accountant and Certified Tax Advisor — with extensive experience delivering professional financial and tax solutions for businesses. Our commitment is to provide accurate, reliable services that are fully compliant with current legislation.",
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

    // News
    "news.eyebrow": "Updates & Announcements",
    "news.homeTitle": "Legal and Tax Updates",
    "news.homeSubtitle": "Be the first to know about legal changes, tax updates and the most important announcements for your business.",
    "news.viewAll": "View all",
    "news.pageTitle": "News & Announcements",
    "news.pageSubtitle": "Updates from ATK, ministries and legislation affecting business in Kosovo.",
    "news.readMore": "Read more",
    "news.minRead": "min read",
    "news.filter.all": "All",
    "news.sort": "Sort",
    "news.sort.newest": "Newest",
    "news.sort.oldest": "Oldest",
    "news.searchPlaceholder": "Search news...",
    "news.searchBtn": "Search",
    "news.prev": "Previous",
    "news.next": "Next",
    "news.previous": "Previous article",
    "news.related": "Related articles",
    "news.share": "Share:",
    "news.gallery": "Gallery",
    "news.attachments": "Attached documents",
    "news.backToAll": "Back to all news",
    "news.empty.title": "No articles to show",
    "news.empty.desc": "Try a different category or search term.",
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
