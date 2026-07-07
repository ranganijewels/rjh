// Marketing/"promo" discount for display only.
//
// There is no real compare-at / MRP price anywhere in the data pipeline (the
// Pricing Engine returns a single computed price), so we synthesize a STABLE,
// per-product varied discount from the product id. The same product always
// shows the same numbers (deterministic — no Math.random, so SSR/CSR match and
// the price doesn't flicker on re-render).
//
// To turn the whole promo treatment off store-wide, set DISCOUNT_ENABLED=false.

const DISCOUNT_ENABLED = true;
const MIN_PCT = 30; // lowest discount shown
const MAX_PCT = 55; // highest discount shown
const STEP = 5; // vary in 5% increments → 30/35/40/45/50/55
const SHOW_ENDS_SOON = true;

function hashString(str) {
  let h = 0;
  const s = String(str ?? "");
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Given a product id + its (sale) price, return the promo display data, or null
// when no discount should be shown (disabled, or no sellable price).
//   { percent, originalPrice, endsSoon }
export function getDiscount(id, price) {
  if (!DISCOUNT_ENABLED) return null;
  const p = Number(price);
  if (!p || p <= 0) return null;
  const buckets = Math.floor((MAX_PCT - MIN_PCT) / STEP) + 1; // 6
  const percent = MIN_PCT + (hashString(id) % buckets) * STEP;
  // current = original * (1 - percent/100)  →  original = current / (1 - pct/100)
  const originalPrice = Math.round(p / (1 - percent / 100));
  return { percent, originalPrice, endsSoon: SHOW_ENDS_SOON };
}
