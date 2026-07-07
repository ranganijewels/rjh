import { getCurrencySymbol } from "./currencySymbol";

// Prices are stored in the base currency (USD). A selected country carries a
// `rate` = "1 USD in that currency". Converting = basePrice * rate.

export function getRate(country) {
  const r = Number(country?.rate);
  return Number.isFinite(r) && r > 0 ? r : 1;
}

export function getSymbol(country) {
  return (
    country?.symbol ||
    getCurrencySymbol(
      typeof country?.currency === "string"
        ? country.currency
        : country?.currency?.code
    ) ||
    "$"
  );
}

export function convertPrice(basePrice, country) {
  return Number(basePrice || 0) * getRate(country);
}

// Format a base (USD) price into the selected country's currency for display.
export function formatMoney(basePrice, country, { decimals = 2 } = {}) {
  const value = convertPrice(basePrice, country);
  const symbol = getSymbol(country);
  return (
    symbol +
    " " +
    value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    })
  );
}

// Product-price display: when the Pricing Engine has no rates for a product it
// returns 0. Rather than render "$0" (or, historically, a wrong INR-scale
// fallback), we show "Price on request". Use this for product/PDP/cart prices;
// use formatMoney directly for totals where 0 legitimately means zero.
export const PRICE_ON_REQUEST_LABEL = "Price on request";

export function formatProductPrice(basePrice, country, opts) {
  return Number(basePrice) > 0
    ? formatMoney(basePrice, country, opts)
    : PRICE_ON_REQUEST_LABEL;
}
