// Resolves the {{token}} vocabulary the AI copy generator writes (and admins
// can hand-author) into text using whatever selection context is available —
// the shopper's LIVE metal/diamond pick on the client, or the product's
// default/first option when there's no interactive session (see the mirrored
// server-side resolver: rj-house-api/src/common/utils/resolve-tokens.util.ts —
// keep both in sync if the token vocabulary changes).
const FALLBACKS = {
  metal_type: "premium metal",
  karat: "",
  metal_color: "",
  diamond_shape: "diamond",
  diamond_weight: "",
  diamond_clarity: "",
  diamond_color: "",
};

const isBlank = (v) => !v || v === "undefined" || v === "null" || v === "NaN";

/**
 * Build a token context from the storefront's live selection state (PDP).
 */
export function buildTokenContext({
  metalType,
  karat,
  metalColor,
  diamondShape,
  diamondWeight,
  diamondClarity,
  diamondColor,
} = {}) {
  const cleanWeight = !isBlank(diamondWeight)
    ? String(diamondWeight).replace(/[^\d.]/g, "")
    : "";
  return {
    metal_type: !isBlank(metalType) ? metalType : null,
    karat: !isBlank(karat) ? karat : null,
    metal_color: !isBlank(metalColor) ? toTitleCaseSafe(metalColor) : null,
    diamond_shape: !isBlank(diamondShape) ? toTitleCaseSafe(diamondShape) : null,
    diamond_weight: cleanWeight ? `${cleanWeight} ct` : null,
    diamond_clarity: !isBlank(diamondClarity) ? diamondClarity : null,
    diamond_color: !isBlank(diamondColor) ? diamondColor : null,
  };
}

function toTitleCaseSafe(v) {
  if (typeof v !== "string") return v;
  return v.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase());
}

/**
 * Default context from a product's own data — used for the product-listing
 * grid (no interactive selector) and any server-rendered surface, mirroring
 * defaultTokenContext() on the backend.
 */
export function defaultTokenContext(product) {
  const firstMetal = Array.isArray(product?.metal_options) ? product.metal_options[0] : null;
  const weightCt = product?.diamond_wt || product?.center_diamond_weight_ct;
  return buildTokenContext({
    metalType: firstMetal?.type || product?.metal,
    karat: firstMetal?.purities?.[0] || product?.metal_purity,
    metalColor: firstMetal?.colors?.[0] || product?.metal_color,
    diamondShape: product?.shape,
    diamondWeight: weightCt,
    diamondClarity: product?.diamond_clarity || product?.diamond_quality,
    diamondColor: product?.diamond_color,
  });
}

/**
 * Replace every {{token}} in text with the matching context value, falling
 * back to a graceful generic phrase (never leaves raw "{{...}}" on the page).
 */
export function resolveTokens(text, ctx = {}) {
  if (!text) return "";
  return text
    .replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = ctx[key];
      if (value) return value;
      return key in FALLBACKS ? FALLBACKS[key] : match;
    })
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Token context from a cart line's metadata — the variant the shopper chose
 * (metalType "14KT", metalColor "WHITE", shape, centerDiamondWeight …).
 * Mirrors tokenContextFromCartMetadata() in the API's resolve-tokens.util.ts.
 */
export function tokenContextFromCartMeta(meta = {}) {
  const purity = isBlank(meta.metalType) ? "" : String(meta.metalType).replace(/KT\b/i, "K").toUpperCase();
  const karat = purity.match(/\d+K/i)?.[0] || purity;
  const metalType = !isBlank(meta.metalTypeName)
    ? meta.metalTypeName
    : /SILVER|925/i.test(purity)
      ? "Silver"
      : /PLATINUM|PT/i.test(purity)
        ? "Platinum"
        : /\d+K/i.test(purity)
          ? "Gold"
          : "";
  return buildTokenContext({
    metalType,
    karat,
    metalColor: meta.metalColor,
    diamondShape: meta.shape,
    diamondWeight: meta.centerDiamondWeight,
    diamondClarity: meta.clarity,
    diamondColor: meta.color,
  });
}

/** A cart line's name with its tokens filled in; never leaves "{{…}}". */
export function resolveCartItemName(name, meta = {}) {
  if (!name || !String(name).includes("{{")) return name || "";
  return resolveTokens(name, tokenContextFromCartMeta(meta))
    .replace(/\{\{\s*\w+\s*\}\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
