import { createFileRoute } from "@tanstack/react-router";
import {
  heroQuery,
  companyQuery,
  trustQuery,
  heroTrustQuery,
  aboutQuery,
  servicesQuery,
  servicesSectionQuery,
  contactSectionQuery,
  newsHomeQuery,
  footerQuery,
} from "@/lib/site-content";
import {
  HeroSection,
  TrustCards,
  AboutSection,
  ServicesSection,
  ContactSection,
} from "@/components/sections/HomeSections";
import { latestArticlesQuery, categoriesQuery } from "@/lib/articles";
import { LatestNewsSection } from "@/components/site/LatestNewsSection";
import { HERO_PRELOAD_HREF, HERO_AVIF_SRCSET, HERO_SIZES } from "@/lib/hero-image";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KPT Consulting — Kontabilitet, Tatime & Paga në Kosovë" },
      {
        name: "description",
        content:
          "Shërbime kontabiliteti, konsulencë tatimore, paga, TVSH, regjistrim biznesi dhe konsulencë financiare në Fushë Kosovë e mbarë Kosovën.",
      },
      { name: "keywords", content: "kontabilitet Kosove, sherbime kontabiliteti, konsulence tatimore, paga, TVSH, regjistrim biznesi, konsulence financiare, Fushe Kosove, Prishtine" },
      { property: "og:title", content: "KPT Consulting — Kontabilitet, Tatime & Paga në Kosovë" },
      { property: "og:description", content: "Shërbime kontabiliteti, konsulencë tatimore, paga, TVSH, regjistrim biznesi dhe konsulencë financiare në Kosovë." },
      { property: "og:url", content: "https://www.kptconsulting.al/" },
    ],
    links: [
      { rel: "canonical", href: "https://www.kptconsulting.al/" },
      { rel: "preload", as: "image", href: HERO_PRELOAD_HREF, type: "image/avif", imageSrcSet: HERO_AVIF_SRCSET, imageSizes: HERO_SIZES, fetchPriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AccountingService",
          "@id": "https://www.kptconsulting.al/#business",
          name: "KPT Consulting",
          description:
            "Zyrë kontabiliteti dhe konsulence në Kosovë: kontabilitet, deklarime tatimore, TVSH, paga, regjistrim biznesi dhe konsulencë financiare.",
          image: "https://www.kptconsulting.al/kpt-favicon-v3-512.png?v=3",
          logo: "https://www.kptconsulting.al/kpt-favicon-v7-512.png?v=7",
          url: "https://www.kptconsulting.al/",
          telephone: "+383 45 555 686",
          email: "info@kptconsulting.al",
          priceRange: "€€",
          currenciesAccepted: "EUR",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Rr. e Llapit",
            addressLocality: "Fushë Kosovë",
            addressRegion: "Prishtinë",
            postalCode: "12000",
            addressCountry: "XK",
          },
          geo: { "@type": "GeoCoordinates", latitude: 42.6383, longitude: 21.0967 },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "09:00",
              closes: "17:00",
            },
          ],
          areaServed: [
            { "@type": "Country", name: "Kosovo" },
            { "@type": "City", name: "Prishtinë" },
            { "@type": "City", name: "Fushë Kosovë" },
            { "@type": "City", name: "Ferizaj" },
            { "@type": "City", name: "Prizren" },
            { "@type": "City", name: "Pejë" },
            { "@type": "City", name: "Gjakovë" },
            { "@type": "City", name: "Mitrovicë" },
            { "@type": "City", name: "Gjilan" },
          ],
          knowsLanguage: ["sq", "en"],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Shërbimet e KPT Consulting",
            itemListElement: [
              "Shërbime kontabiliteti",
              "Konsulencë tatimore",
              "Përgatitje dhe administrim i pagave",
              "Regjistrim biznesi",
              "Shërbime TVSH",
              "Konsulencë financiare",
              "Trajnime profesionale",
            ].map((name) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name, areaServed: "Kosovo", provider: { "@id": "https://www.kptconsulting.al/#business" } },
            })),
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "KPT Consulting",
          url: "https://www.kptconsulting.al/",
          inLanguage: ["sq", "en"],
        }),
      },
    ],
  }),

  loader: async ({ context }) => {
    // Awaited so the data is dehydrated into the SSR HTML — the first client
    // render then matches the server exactly (no post-hydration layout shift).
    await Promise.all([
      context.queryClient.ensureQueryData(heroQuery()),
      context.queryClient.ensureQueryData(companyQuery()),
      context.queryClient.ensureQueryData(trustQuery()),
      context.queryClient.ensureQueryData(heroTrustQuery()),
      context.queryClient.ensureQueryData(aboutQuery()),
      context.queryClient.ensureQueryData(servicesQuery()),
      context.queryClient.ensureQueryData(servicesSectionQuery()),
      context.queryClient.ensureQueryData(contactSectionQuery()),
      context.queryClient.ensureQueryData(newsHomeQuery()),
      context.queryClient.ensureQueryData(latestArticlesQuery(4)),
      context.queryClient.ensureQueryData(categoriesQuery()),
    ]);
  },
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustCards />
      <section id="rreth-nesh" className="scroll-mt-24">
        <AboutSection />
      </section>
      <section id="sherbimet" className="scroll-mt-24">
        <ServicesSection />
      </section>
      <LatestNewsSection />
      <section id="kontakt" className="scroll-mt-24">
        <ContactSection />
      </section>
    </>
  );
}

