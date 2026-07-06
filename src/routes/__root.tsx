import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ParticleBackground } from "@/components/site/ParticleBackground";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { companyQuery } from "@/lib/site-content";
import { useSuspenseQuery } from "@tanstack/react-query";
import { I18nProvider } from "@/lib/i18n";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Faqja nuk u gjet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Faqja që kërkuat nuk ekziston ose është zhvendosur.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium text-white" style={{ background: "var(--gradient-brand)" }}>
            Kthehu në Ballinë
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Kjo faqe nuk u ngarkua
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Diçka nuk shkoi si duhet. Provoni të rifreskoni ose kthehuni në ballinë.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-white"
            style={{ background: "var(--gradient-brand)" }}
          >
            Provo përsëri
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
            Ballina
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "KPT Consulting — Kontabilitet, Program dhe Trajnime" },
      { name: "description", content: "Shërbime profesionale të kontabilitetit, deklarimeve tatimore, regjistrimit të bizneseve dhe konsulencës financiare në Kosovë." },
      { name: "author", content: "KPT Consulting" },
      { name: "keywords", content: "kontabilitet, tatime, TVSH, konsulence biznesi, Kosove, Fushe Kosove, KPT Consulting" },
      { property: "og:title", content: "KPT Consulting — Kontabilitet, Program dhe Trajnime" },
      { property: "og:description", content: "Zgjidhje financiare profesionale për biznesin tuaj në Kosovë." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "sq_AL" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="sq">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <SiteChrome>
          <Outlet />
        </SiteChrome>
        <Toaster position="top-right" />
      </I18nProvider>
    </QueryClientProvider>

  );
}

function SiteChrome({ children }: { children: ReactNode }) {
  // Admin/auth routes hide the chrome
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const chromeless = pathname.startsWith("/auth") || pathname.startsWith("/admin");
  if (chromeless) {
    return (
      <>
        <ParticleBackground />
        <div className="relative min-h-screen">{children}</div>
      </>
    );
  }
  return <PublicChrome>{children}</PublicChrome>;
}

function PublicChrome({ children }: { children: ReactNode }) {
  const { data: company } = useSuspenseQuery(companyQuery());
  return (
    <>
      <ParticleBackground />
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer company={company} />
      </div>
      <WhatsAppButton phone={company.whatsapp} />
    </>
  );
}
