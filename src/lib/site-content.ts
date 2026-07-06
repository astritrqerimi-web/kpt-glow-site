import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  title: string;
  subtitle: string;
}

export interface AboutContent {
  intro: string;
  services: string;
  leader: string;
}

export interface SeoContent {
  title: string;
  description: string;
  keywords: string;
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
    title: "Zgjidhje financiare për biznesin tuaj",
    subtitle:
      "KPT Consulting ofron shërbime profesionale të kontabilitetit, deklarimeve tatimore, regjistrimit të bizneseve, programeve financiare dhe trajnimeve për biznese.",
  } as HeroContent,
  about: {
    intro: "",
    services: "",
    leader: "",
  } as AboutContent,
  seo: {
    title: "KPT Consulting",
    description: "Kontabilitet, tatime dhe konsulencë biznesi.",
    keywords: "",
  } as SeoContent,
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
