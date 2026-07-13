import { createFileRoute } from "@tanstack/react-router";
import { aboutQuery } from "@/lib/site-content";
import { AboutSection } from "@/components/sections/HomeSections";

export const Route = createFileRoute("/rreth-nesh")({
  head: () => ({
    meta: [
      { title: "Rreth Nesh — KPT Consulting" },
      { name: "description", content: "Njihuni me KPT Consulting: ekspertizë në kontabilitet, tatime, konsulencë biznesi dhe trajnime profesionale në Kosovë." },
      { property: "og:title", content: "Rreth Nesh — KPT Consulting" },
      { property: "og:description", content: "Njihuni me KPT Consulting: ekspertizë në kontabilitet, tatime, konsulencë biznesi dhe trajnime profesionale në Kosovë." },
      { property: "og:url", content: "https://www.kptconsulting.al/rreth-nesh" },
    ],
    links: [{ rel: "canonical", href: "https://www.kptconsulting.al/rreth-nesh" }],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(aboutQuery());
  },
  component: () => (
    <div className="pt-12">
      <AboutSection />
    </div>
  ),
});
