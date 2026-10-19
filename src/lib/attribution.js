// First/last-touch campaign attribution (UTMs, click ids, referrer, landing).
// Until the visitor consents it lives in sessionStorage only; on consent it is
// promoted to a first-party cookie (read by checkout/form routes so it can be
// saved on the order or lead). Never contains personal data.
import { hasConsent } from "./consent";

const isBrowser = () => typeof window !== "undefined";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"];
const SS = "rj_attr_session";
const LS = "rj_attr_first";

const read = (store, key) => { try { return JSON.parse(store.getItem(key) || "null"); } catch { return null; } };
const write = (store, key, v) => { try { store.setItem(key, JSON.stringify(v)); } catch {} };

function currentTouch() {
  const q = new URLSearchParams(location.search);
  const t = {};
  PARAMS.forEach((k) => q.get(k) && (t[k] = q.get(k)));
  const ref = document.referrer && !document.referrer.includes(location.hostname) ? document.referrer : "";
  if (ref) t.referrer = ref;
  if (!Object.keys(t).length) return null;
  t.landing = location.pathname;
  t.ts = Math.floor(Date.now() / 1000);
  return t;
}

function setCookie(name, value, days) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${days * 86400}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}

export function captureAttribution() {
  if (!isBrowser()) return;
  const touch = currentTouch();
  let last = read(sessionStorage, SS);
  if (touch) { last = touch; write(sessionStorage, SS, touch); }
  if (!hasConsent()) return;

  let first = read(localStorage, LS);
  if (!first && last) { first = last; write(localStorage, LS, first); }
  // (_fbc is created by the Meta Pixel itself from a real fbclid — we never build it.)
  const payload = JSON.stringify({ f: first || undefined, l: last || first || undefined });
  if (payload.length < 3000) setCookie("rj_attr", payload, 90);
}

export const newEventId = (prefix = "ev") =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

export function readCookie(name) {
  if (!isBrowser()) return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}
