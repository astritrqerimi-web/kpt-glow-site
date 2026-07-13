import { createFileRoute } from "@tanstack/react-router";
import { servicesQuery, servicesSectionQuery } from "@/lib/site-content";
import { ServicesSection } from "@/components/sections/HomeSections";

export const Route = createFileRoute("/sherbimet")({
  head: () => ({
    meta: [
      { title: "Shërbimet — KPT Consulting" },
      { name: "description", content: "Shërbime profesionale: regjistrim biznesi, kontabilitet, deklarime tatimore, konsulencë financiare dhe aplikime për grante në Kosovë." },
      { property: "og:title", content: "Shërbimet — KPT Consulting" },
      { property: "og:description", content: "Shërbime profesionale: regjistrim biznesi, kontabilitet, deklarime tatimore, konsulencë financiare dhe aplikime për grante në Kosovë." },
      { property: "og:url", content: "https://www.kptconsulting.al/sherbimet" },
    ],
    links: [{ rel: "canonical", href: "https://www.kptconsulting.al/sherbimet" }],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(servicesQuery());
    context.queryClient.ensureQueryData(servicesSectionQuery());
  },
  component: () => (
    <div className="pt-12">
      <ServicesSection />
    </div>
  ),
});
