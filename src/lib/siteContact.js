import { BUSINESS } from "@/config/business";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT = process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";

// Seeded/demo values that must never reach customers or structured data.
const PLACEHOLDER = /(\d)\1{4,}|therjhouse|rjhouse\.com|example\.(com|org)/i;

const clean = (v) => {
  const s = typeof v === "string" ? v.trim() : "";
  return s && !PLACEHOLDER.test(s) ? s : "";
};

export const phoneHref = (phone) => {
  const digits = String(phone || "").replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
};

// The Theme & Branding settings have been saved by two editors that use
// different key styles (contactPhone vs contact_phone). Prefer the camelCase
// value, fall back to snake_case, and drop anything that looks like a seed.
export function normalizeContact(theme = {}) {
  const t = theme || {};
  const phone = clean(t.contactPhone) || clean(t.contact_phone) || clean(BUSINESS.phone);
  const email = clean(t.contactEmail) || clean(t.contact_email) || BUSINESS.email;
  const social = {};
  for (const [k, v] of Object.entries({ ...BUSINESS.social, ...(t.social || {}) })) {
    if (clean(v)) social[k] = v.trim();
  }
  return {
    phone,
    phoneHref: phoneHref(phone),
    email,
    hours: BUSINESS.hours,
    social,
    sameAs: Object.values(social),
  };
}

export async function getSiteContact() {
  try {
    const res = await fetch(`${API}/api/v1/cms/theme`, {
      headers: { "x-tenant-id": TENANT },
      next: { revalidate: 300 },
    });
    if (!res.ok) return normalizeContact();
    const j = await res.json();
    return normalizeContact(j?.data ?? j);
  } catch {
    return normalizeContact();
  }
}
