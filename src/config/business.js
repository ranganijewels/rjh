// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for storefront business/contact details.
// Everything user-visible (footer, contact page, appointment page, JSON-LD,
// meta) reads from here so values never drift between pages.
//
// ⚠️  REPLACE THE PLACEHOLDERS BELOW WITH REAL BUSINESS DETAILS BEFORE LAUNCH.
//     Phone, email and social URLs are best-guess placeholders.
//     Also set these env vars in production:
//       NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_GA_ID,
//       NEXT_PUBLIC_FB_PIXEL_ID, NEXT_PUBLIC_GTM_ID
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.therjhouse.com";

export const BUSINESS = {
  name: "Rangani Jewelry House",
  legalName: "Rangani Jewelry House",
  url: SITE_URL,

  // Contact — replace with real values
  email: "support@therjhouse.com",
  phone: "+91 40 6711 51631",
  phoneHref: "tel:+914067115163",
  hours: "Mon–Sat, 9:00 AM – 7:00 PM",

  // Social — replace handles with the brand's real profiles
  social: {
    instagram: "https://www.instagram.com/ranganijewelryhouse",
    facebook: "https://www.facebook.com/ranganijewelryhouse",
    youtube: "https://www.youtube.com/@ranganijewelryhouse",
    pinterest: "https://www.pinterest.com/ranganijewelryhouse",
    twitter: "https://twitter.com/ranganijewelry",
  },
};

// Convenience array for structured data (schema.org sameAs).
export const SOCIAL_URLS = Object.values(BUSINESS.social);
