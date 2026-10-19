"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { track, trackPageView, trackContact } from "@/lib/analytics";
import { hasConsent, isProductionHost, onConsentChange } from "@/lib/consent";
import { captureAttribution, newEventId } from "@/lib/attribution";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;       // e.g. G-XXXXXXX
const FB_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;  // Meta Pixel id
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;      // GTM-XXXX (optional)

// Public forms: the browser event and the server (Conversions API) event share
// one event_id, sent to the route as the x-event-id header, and the browser
// event fires only after the API confirms the submission succeeded.
const FORMS = [
  { re: /\/api\/contact-us$/, event: "generate_lead", params: { lead_type: "contact" } },
  { re: /\/api\/customize$/, event: "generate_lead", params: { lead_type: "custom_design" } },
  { re: /\/api\/appointments\/book$/, event: "book_consultation", params: { appointment_type: "expert_consultation" } },
];

function useFormTracking(active) {
  useEffect(() => {
    if (!active || window.__rjFormTracking) return;
    window.__rjFormTracking = true;
    const orig = window.fetch.bind(window);
    window.fetch = async (input, init = {}) => {
      const url = typeof input === "string" ? input : input?.url || "";
      const form = (init.method || "GET").toUpperCase() === "POST" && typeof input === "string" && FORMS.find((f) => f.re.test(url.split("?")[0]));
      if (!form) return orig(input, init);
      const eventId = newEventId("form");
      const headers = new Headers(init.headers || {});
      headers.set("x-event-id", eventId);
      const res = await orig(input, { ...init, headers });
      try {
        if (res.ok) {
          const j = await res.clone().json().catch(() => ({}));
          if (j?.status !== false) track(form.event, { event_id: eventId, ...form.params });
        }
      } catch {}
      return res;
    };
  }, [active]);
}

// Tags + events run only for consenting visitors on the production domain.
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      captureAttribution();
      setReady(hasConsent() && isProductionHost());
    };
    sync();
    return onConsentChange(sync);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const qs = searchParams?.toString();
    trackPageView(pathname + (qs ? `?${qs}` : ""));
  }, [ready, pathname, searchParams]);

  useFormTracking(ready);

  // One delegated listener: WhatsApp / phone / email links, once per click.
  useEffect(() => {
    if (!ready) return;
    const onClick = (e) => {
      const a = e.target?.closest?.("a[href]");
      const href = a?.getAttribute("href") || "";
      if (/^tel:/i.test(href)) trackContact("phone");
      else if (/^mailto:/i.test(href)) trackContact("email");
      else if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\/(?!\?text)/i.test(href) || /whatsapp\.com\/send/i.test(href)) trackContact("whatsapp");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      {GTM_ID && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}

      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false});`}
          </Script>
        </>
      )}

      {/* Meta Pixel — base code + the first PageView. Later route changes and
          every other event go through lib/analytics (with de-dup event ids). */}
      {FB_ID && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${FB_ID}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
