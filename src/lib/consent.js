// Visitor consent for marketing / analytics tags (Meta Pixel + Conversions API,
// GA4, GTM). Nothing marketing-related loads or fires until "granted".
// Applies to every visitor; flip CONSENT_REQUIRED to false only if a region
// policy decision is made to allow tags by default.
export const CONSENT_REQUIRED = true;

const KEY = "rj_consent";
const isBrowser = () => typeof window !== "undefined";

export function getConsent() {
  if (!isBrowser()) return null;
  try {
    return localStorage.getItem(KEY); // "granted" | "denied" | null
  } catch {
    return null;
  }
}

export const hasConsent = () => (CONSENT_REQUIRED ? getConsent() === "granted" : getConsent() !== "denied");

export function setConsent(value) {
  if (!isBrowser()) return;
  try { localStorage.setItem(KEY, value); } catch {}
  // Mirrored in a first-party cookie so server routes (checkout, forms) can
  // honour the choice when attaching attribution / sending server events.
  document.cookie = `${KEY}=${value}; path=/; max-age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  window.dispatchEvent(new Event("rj-consent"));
}

export const onConsentChange = (fn) => {
  if (!isBrowser()) return () => {};
  window.addEventListener("rj-consent", fn);
  return () => window.removeEventListener("rj-consent", fn);
};

// Production hostnames only — staging / localhost / preview traffic never
// reaches the production Pixel, GA4 or Conversions API.
export const isProductionHost = () =>
  isBrowser() && /(^|\.)ranganijewelry\.com$/i.test(location.hostname);
