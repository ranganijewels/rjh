// Fallback business/contact details. The live values come from the CMS
// "Theme & Branding" settings (see lib/siteContact.js); these are only used
// when the API is unreachable. Never put placeholder phone numbers here — an
// empty phone hides the phone line everywhere instead of showing a fake one.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ranganijewelry.com"
).replace(/\/+$/, "");

export const BUSINESS = {
  name: "Rangani Jewelry House",
  legalName: "Rangani Jewelry House",
  url: SITE_URL,
  email: "info@ranganijewelry.com",
  phone: "",
  phoneHref: "",
  hours: "Mon–Fri, 9:00 AM – 6:00 PM ET",
  social: {
    instagram: "https://www.instagram.com/ranganijewelryhouse",
  },
};

export const SOCIAL_URLS = Object.values(BUSINESS.social).filter(Boolean);
