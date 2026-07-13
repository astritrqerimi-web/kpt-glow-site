import { createFileRoute } from "@tanstack/react-router";
import {
  heroQuery,
  companyQuery,
  trustQuery,
  heroTrustQuery,
} from "@/lib/site-content";
import { HeroSection, TrustCards } from "@/components/sections/HomeSections";
import { LatestNewsSection } from "@/components/site/LatestNewsSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KPT Consulting — Kontabilitet, Program, Trajnime" },
      {
        name: "description",
        content:
          "Shërbime profesionale të kontabilitetit, deklarimeve tatimore, regjistrimit të bizneseve dhe konsulencës financiare në Kosovë.",
      },
      { property: "og:title", content: "KPT Consulting — Kontabilitet, Program, Trajnime" },
      { property: "og:description", content: "Shërbime profesionale të kontabilitetit, deklarimeve tatimore, regjistrimit të bizneseve dhe konsulencës financiare në Kosovë." },
      { property: "og:url", content: "https://www.kptconsulting.al/" },
    ],
    links: [{ rel: "canonical", href: "https://www.kptconsulting.al/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "KPT Consulting",
          image: "https://www.kptconsulting.al/kpt-icon-v2-512.png?v=2",
          url: "https://www.kptconsulting.al/",
          telephone: "+383 45 555 686",
          email: "info@kptconsulting.al",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Rr. e Llapit",
            addressLocality: "Fushë Kosovë",
            addressCountry: "XK",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "09:00",
              closes: "17:00",
            },
          ],
          areaServed: "Kosovo",
        }),
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(heroQuery());
    context.queryClient.ensureQueryData(companyQuery());
    context.queryClient.ensureQueryData(trustQuery());
    context.queryClient.ensureQueryData(heroTrustQuery());
  },
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustCards />
      <LatestNewsSection />
    </>
  );
}
