import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Lang } from "@/lib/i18n";

export type Bilingual = string | { al?: string; en?: string } | null | undefined;

/** Pick the correct language from a bilingual value; falls back gracefully. */
export function pick(value: Bilingual, lang: Lang, fallback = ""): string {
  if (value == null) return fallback;
  if (typeof value === "string") return value || fallback;
  const key = lang === "en" ? "en" : "al";
  return value[key] || value.al || value.en || fallback;
}

export interface CompanyInfo {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapsQuery: string;
  workingHours?: Bilingual;
  facebook: string;
  instagram: string;
  linkedin: string;
  tiktok?: string;
  youtube?: string;
}

export interface HeroContent {
  title: Bilingual;
  subtitle: Bilingual;
  badge?: Bilingual;
  ctaContact?: Bilingual;
  ctaServices?: Bilingual;
  image?: string; // optional custom hero image URL
}

export interface AboutContent {
  intro: Bilingual;
  services: Bilingual;
  leader: Bilingual;
}

export interface SeoContent {
  title: string;
  description: string;
  keywords: string;
}

export interface TrustItem {
  type: "stars" | "icon";
  icon?: string;
  color?: string;
  title_al: string;
  title_en: string;
}
export interface TrustContent {
  items: TrustItem[];
}

export interface NewsHomeContent {
  badge: Bilingual;
  title: Bilingual;
  subtitle: Bilingual;
  viewAll: Bilingual;
}

export interface ServicesSectionContent {
  eyebrow: Bilingual;
  titleA: Bilingual;
  titleB: Bilingual;
  subtitle: Bilingual;
}

export interface ContactSectionContent {
  eyebrow: Bilingual;
  titleA: Bilingual;
  titleB: Bilingual;
  subtitle: Bilingual;
  followLabel: Bilingual;
}

export interface FooterContent {
  description: Bilingual;
  menuTitle: Bilingual;
  contactTitle: Bilingual;
  hoursTitle: Bilingual;
  hours: Bilingual;
  rights: Bilingual;
  copyrightName: string;
  privacyLabel: Bilingual;
  privacyUrl: string;
  termsLabel: Bilingual;
  termsUrl: string;
}



export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

const DEFAULTS = {
  company: {
    name: "KPT Consulting",
    phone: "+383 (0) 45 555 686",
    whatsapp: "38345555686",
    email: "info@kptconsulting.al",
    address: "Rr. e Llapit, L/1, Kati Përdhesë, Objekti A, Nr. 1 – Fushë Kosovë",
    mapsQuery: "KPT Consulting L.L.C., Rruga e Llapit, Fushë-Kosovë 12000",
    workingHours: { al: "Hën – Pre: 09:00 – 17:00", en: "Mon – Fri: 09:00 – 17:00" },
    facebook: "",
    instagram: "",
    linkedin: "",
    tiktok: "",
    youtube: "",
  } as CompanyInfo,
  hero: {
    title: { al: "Zgjidhje financiare për biznesin tuaj", en: "Financial solutions for your business" },
    subtitle: {
      al: "KPT Consulting ofron shërbime profesionale të kontabilitetit, deklarimeve tatimore, regjistrimit të bizneseve, programeve financiare dhe trajnimeve për biznese.",
      en: "KPT Consulting delivers professional accounting, tax filing, business registration, financial software and training services for businesses.",
    },
    badge: { al: "Kontabilitet • Program • Trajnime", en: "Accounting • Software • Training" },
    ctaContact: { al: "Na Kontaktoni", en: "Contact Us" },
    ctaServices: { al: "Shërbimet", en: "Services" },
  } as HeroContent,
  about: {
    intro: { al: "", en: "" },
    services: { al: "", en: "" },
    leader: { al: "", en: "" },
  } as AboutContent,
  seo: {
    title: "KPT Consulting",
    description: "Kontabilitet, tatime dhe konsulencë biznesi.",
    keywords: "",
  } as SeoContent,
  trust: { items: [] } as TrustContent,
  news_home: {
    badge: { al: "Përditësime & Njoftime", en: "Updates & Announcements" },
    title: { al: "Përditësime Ligjore dhe Tatimore", en: "Legal and Tax Updates" },
    subtitle: {
      al: "Informohu i pari për ndryshimet ligjore, tatimore dhe njoftimet më të rëndësishme për biznesin tuaj.",
      en: "Be the first to know about legal changes, tax updates and the most important announcements for your business.",
    },
    viewAll: { al: "Shiko të gjitha", en: "View all" },
  } as NewsHomeContent,
  services_section: {
    eyebrow: { al: "Shërbimet", en: "Services" },
    titleA: { al: "Gjithçka që biznesi juaj", en: "Everything your business" },
    titleB: { al: "ka nevojë", en: "needs" },
    subtitle: {
      al: "Nga themelimi i biznesit deri te menaxhimi financiar i përditshëm — mbulojmë çdo aspekt profesional.",
      en: "From company registration to day-to-day financial management — we cover every professional aspect.",
    },
  } as ServicesSectionContent,
  contact_section: {
    eyebrow: { al: "Kontakti", en: "Contact" },
    titleA: { al: "Le të", en: "Let's" },
    titleB: { al: "bisedojmë", en: "talk" },
    subtitle: {
      al: "Kontaktoni ekipin tonë për një konsultim ose plotësoni formularin dhe do t'ju përgjigjemi sa më shpejt.",
      en: "Reach out to our team for a consultation or fill in the form and we will get back to you shortly.",
    },
    followLabel: { al: "Na Ndiqni", en: "Follow Us" },
  } as ContactSectionContent,
  footer: {
    description: {
      al: "Zgjidhje profesionale të kontabilitetit, deklarimeve tatimore dhe konsulencës për biznese në Kosovë.",
      en: "Professional accounting, tax filing and consulting solutions for businesses in Kosovo.",
    },
    menuTitle: { al: "Menuja", en: "Menu" },
    contactTitle: { al: "Kontakti", en: "Contact" },
    hoursTitle: { al: "Orari i Punës", en: "Working Hours" },
    hours: {
      al: "E hënë: 09:00 - 17:00\nE martë: 09:00 - 17:00\nE mërkurë: 09:00 - 17:00\nE enjte: 09:00 - 17:00\nE premte: 09:00 - 17:00\nE shtunë: 09:00 - 17:00\nE diel: Pushim",
      en: "Monday: 09:00 - 17:00\nTuesday: 09:00 - 17:00\nWednesday: 09:00 - 17:00\nThursday: 09:00 - 17:00\nFriday: 09:00 - 17:00\nSaturday: 09:00 - 17:00\nSunday: Closed",
    },
    rights: { al: "Të gjitha të drejtat e rezervuara.", en: "All rights reserved." },
    copyrightName: "KPT Consulting",
    privacyLabel: { al: "Politika e Privatësisë", en: "Privacy Policy" },
    privacyUrl: "",
    termsLabel: { al: "Kushtet e Përdorimit", en: "Terms & Conditions" },
    termsUrl: "",
  } as FooterContent,
};


async function fetchContent<T>(key: string, fallback: T): Promise<T> {
  const { data } = await supabase.from("site_content").select("value").eq("key", key).maybeSingle();
  return ((data?.value as T) ?? fallback);
}

export const companyQuery = () =>
  queryOptions({
    queryKey: ["site_content", "company"],
    queryFn: () => fetchContent<CompanyInfo>("company", DEFAULTS.company),
    staleTime: 60_000,
  });

export const heroQuery = () =>
  queryOptions({
    queryKey: ["site_content", "hero"],
    queryFn: () => fetchContent<HeroContent>("hero", DEFAULTS.hero),
    staleTime: 60_000,
  });

export const aboutQuery = () =>
  queryOptions({
    queryKey: ["site_content", "about"],
    queryFn: () => fetchContent<AboutContent>("about", DEFAULTS.about),
    staleTime: 60_000,
  });

export const seoQuery = () =>
  queryOptions({
    queryKey: ["site_content", "seo"],
    queryFn: () => fetchContent<SeoContent>("seo", DEFAULTS.seo),
    staleTime: 60_000,
  });

export const trustQuery = () =>
  queryOptions({
    queryKey: ["site_content", "trust"],
    queryFn: () => fetchContent<TrustContent>("trust", DEFAULTS.trust),
    staleTime: 60_000,
  });

export const newsHomeQuery = () =>
  queryOptions({
    queryKey: ["site_content", "news_home"],
    queryFn: () => fetchContent<NewsHomeContent>("news_home", DEFAULTS.news_home),
    staleTime: 60_000,
  });

export const servicesSectionQuery = () =>
  queryOptions({
    queryKey: ["site_content", "services_section"],
    queryFn: () => fetchContent<ServicesSectionContent>("services_section", DEFAULTS.services_section),
    staleTime: 60_000,
  });

export const contactSectionQuery = () =>
  queryOptions({
    queryKey: ["site_content", "contact_section"],
    queryFn: () => fetchContent<ContactSectionContent>("contact_section", DEFAULTS.contact_section),
    staleTime: 60_000,
  });

export const footerQuery = () =>
  queryOptions({
    queryKey: ["site_content", "footer"],
    queryFn: () => fetchContent<FooterContent>("footer", DEFAULTS.footer),
    staleTime: 60_000,
  });





export const servicesQuery = (includeInactive = false) =>
  queryOptions({
    queryKey: ["services", includeInactive],
    queryFn: async (): Promise<Service[]> => {
      let q = supabase.from("services").select("*").order("sort_order", { ascending: true });
      if (!includeInactive) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Service[];
    },
    staleTime: 30_000,
  });
