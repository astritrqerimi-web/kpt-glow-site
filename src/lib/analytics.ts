export const GA_MEASUREMENT_ID = "G-VXQ4CBMGZ7";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loaded = false;
const pending: string[] = [];

/**
 * Loads GA4 lazily (off the critical path). The `gtag` queue stub is created
 * synchronously, so events pushed before the script arrives are not lost.
 */
export function loadGtag() {
  if (typeof window === "undefined" || loaded) return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  const gtag: (...args: unknown[]) => void = (...args) => {
    window.dataLayer!.push(args);
  };
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });

  const queued = pending.splice(0, pending.length);
  queued.forEach(sendPageView);

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
}

export function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  if (!loaded) {
    pending.push(path);
    return;
  }
  sendPageView(path);
}

function sendPageView(path: string) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}
