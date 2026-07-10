// Promo "was/now" display — ADMIN-CONTROLLED per product.
//
// The percent comes from the product form (SEO & Pricing → Display Discount %,
// stored as metadata.displayDiscountPercent). The CHARGED price is always the
// real engine price; the strikethrough "original" price is synthesized from it
// so the badge math reads true. Products without a percent show NO promo.
const SHOW_ENDS_SOON = true;

export function getDiscount(price, percent) {
  const p = Number(price);
  const pct = Number(percent);
  if (!p || p <= 0) return null;
  if (!Number.isFinite(pct) || pct <= 0 || pct >= 90) return null;
  // current = original × (1 − pct/100)  →  original = current / (1 − pct/100)
  const originalPrice = Math.round(p / (1 - pct / 100));
  return { percent: Math.round(pct), originalPrice, endsSoon: SHOW_ENDS_SOON };
}
