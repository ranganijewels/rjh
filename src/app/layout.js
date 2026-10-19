import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import {
  Montserrat,
  Source_Serif_4,
  Cormorant_Garamond,
} from "next/font/google";
import "./globals.css";
import "rc-slider/assets/index.css";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import { PreferencesProvider } from "@/context/PreferencesContext";
import { ReduxProvider } from "./providers/ReduxProvider";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import { WishlistPopupProvider } from "@/context/WishlistPopupContext";
import LiveChat from "@/components/chat/LiveChat";
import Analytics from "@/components/analytics/Analytics";
import ConsentBanner from "@/components/analytics/ConsentBanner";
import { headers } from "next/headers";
import { BUSINESS, SITE_URL } from "@/config/business";
import { getSiteContact } from "@/lib/siteContact";
import { SiteContactProvider } from "@/context/SiteContactContext";

// Rangani brand typography: Montserrat for UI/body, Source Serif for
// editorial copy, Cormorant Garamond for display headings.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Every page reads request data (canonical path, search params), so render
// per request — this lets client components using useSearchParams render
// their real content on the server instead of bailing out to client-only.
export const dynamic = "force-dynamic";

const SITE_DESCRIPTION =
  "Lab-grown diamond engagement rings, wedding bands & fine jewelry in 10K, 14K & 18K gold and 925 sterling silver, made by a family with more than 50 years in diamonds. Free insured shipping.";

// Pages that set their own canonical (product, collections, …) override this;
// everything else gets a self-referencing canonical on the primary domain
// instead of inheriting the homepage's.
export async function generateMetadata() {
  const path = (await headers()).get("x-pathname") || "/";
  return { ...metadata, alternates: { canonical: path } };
}

const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rangani Jewelry House — Lab Grown Diamond Engagement Rings & Fine Jewelry",
    template: "%s | Rangani Jewelry House",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "lab grown diamond engagement rings",
    "diamond jewelry",
    "engagement rings",
    "wedding bands",
    "certified diamonds",
    "Rangani Jewelry House",
  ],
  applicationName: "Rangani Jewelry House",
  // Favicons are declared as explicit <link> tags in <head> below —
  // metadata.icons would emit an un-scoped link that overrides the
  // prefers-color-scheme variants.
  openGraph: {
    type: "website",
    siteName: "Rangani Jewelry House",
    title: "Rangani Jewelry House — Lab Grown Diamond Fine Jewelry",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [{ url: "/logo/rj-house.svg", width: 636, height: 219, alt: "Rangani Jewelry House" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rangani Jewelry House — Lab Grown Diamond Fine Jewelry",
    description: "Ethically crafted, certified lab-grown diamond engagement rings & fine jewelry.",
    images: ["/logo/rj-house.svg"],
  },
  robots: { index: true, follow: true },
};

// Site-wide Organization + WebSite structured data (brand entity + sitelinks
// search). Contact details come from CMS Theme & Branding so the schema always
// matches what the footer/contact page show.
const orgJsonLd = (contact) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BUSINESS.name,
      url: SITE_URL,
      logo: `${SITE_URL}/logo/rj-house.svg`,
      email: contact.email,
      ...(contact.phone ? { telephone: contact.phone } : {}),
      description:
        "Lab-grown diamond engagement rings & fine jewelry — refined luxury, timeless designs.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: contact.email,
        ...(contact.phone ? { telephone: contact.phone } : {}),
      },
      ...(contact.sameAs.length ? { sameAs: contact.sameAs } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Rangani Jewelry House",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
});

export default async function RootLayout({ children }) {
  const contact = await getSiteContact();
  return (
    <html lang="en">
      <head>
        {/* Fallback favicon (browsers without media-query support) */}
        <link rel="icon" href="/rj-house-fav.svg" />
        {/* Light theme favicon — navy RJ mark */}
        <link
          rel="icon"
          href="/rj-house-fav.svg"
          media="(prefers-color-scheme: light)"
        />
        {/* Dark theme favicon — white RJ mark, visible on dark tab bars */}
        <link
          rel="icon"
          href="/rj-house-fav-white.svg"
          media="(prefers-color-scheme: dark)"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd(contact)) }}
        />
      </head>
      <body
        className={`${montserrat.variable} ${sourceSerif.variable} ${cormorant.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Keyboard skip link — first focusable element, hidden until focused */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100000] focus:rounded-md focus:bg-[var(--teal-1)] focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <ConsentBanner />
        <SiteContactProvider value={contact}>
        <ReduxProvider>
          <PreferencesProvider>
            <WishlistPopupProvider>
              <ReactQueryProvider>
                <Navbar />
                <Toaster
                  position="top-right"
                  containerStyle={{
                    marginTop: "68px",
                    marginRight: "16px",
                    zIndex: 9999999,
                  }}
                  toastOptions={{
                    error: {
                      style: {
                        background: "var(--color-error)",
                        color: "#fff",
                      },
                    },
                  }}
                />
                <main id="main" className="flex-1 flex flex-col">{children}</main>
                <Footer contact={contact} />
                <LiveChat />
              </ReactQueryProvider>
            </WishlistPopupProvider>
          </PreferencesProvider>
        </ReduxProvider>
        </SiteContactProvider>
      </body>
    </html>
  );
}
