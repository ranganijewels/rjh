// Promo "was/now" display — admin-controlled per product.
//
// The percent comes from the product form (metadata.displayDiscountPercent)
// and the optional end date from metadata.displayDiscountEndsAt. The CHARGED
// price is always the real engine price; the struck-through price is derived
// from it. Urgency wording is only shown when a real end date is set, and an
// offer past its end date is not shown at all.

export function offerIsLive(endsAt, now = Date.now()) {
  if (!endsAt) return true;
  const t = new Date(endsAt).getTime();
  return Number.isFinite(t) ? t > now : true;
}

export function getDiscount(price, percent, endsAt = null) {
  const p = Number(price);
  const pct = Number(percent);
  if (!p || p <= 0) return null;
  if (!Number.isFinite(pct) || pct <= 0 || pct >= 90) return null;
  if (!offerIsLive(endsAt)) return null;
  // current = original × (1 − pct/100)  →  original = current / (1 − pct/100)
  const originalPrice = Math.round(p / (1 - pct / 100));
  const end = endsAt ? new Date(endsAt) : null;
  const endsLabel =
    end && Number.isFinite(end.getTime())
      ? `Ends ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      : null;
  return { percent: Math.round(pct), originalPrice, endsLabel };
}
