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
  facebook: string;
  instagram: string;
  linkedin: string;
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
    facebook: "",
    instagram: "",
    linkedin: "",
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
