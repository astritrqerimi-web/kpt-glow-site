import { createFileRoute } from "@tanstack/react-router";
import { companyQuery, contactSectionQuery } from "@/lib/site-content";
import { ContactSection } from "@/components/sections/HomeSections";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakti — KPT Consulting" },
      { name: "description", content: "Na kontaktoni për shërbime kontabiliteti, tatime, regjistrim biznesi dhe konsulencë financiare. Fushë Kosovë." },
      { property: "og:title", content: "Kontakti — KPT Consulting" },
      { property: "og:description", content: "Na kontaktoni për shërbime kontabiliteti, tatime, regjistrim biznesi dhe konsulencë financiare. Fushë Kosovë." },
      { property: "og:url", content: "https://www.kptconsulting.al/kontakt" },
    ],
    links: [{ rel: "canonical", href: "https://www.kptconsulting.al/kontakt" }],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(companyQuery());
    context.queryClient.ensureQueryData(contactSectionQuery());
  },
  component: () => (
    <div className="pt-12">
      <ContactSection />
    </div>
  ),
});
