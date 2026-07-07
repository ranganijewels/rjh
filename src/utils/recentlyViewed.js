// Lightweight client-side "recently viewed" tracker backed by localStorage.
// Stores a compact snapshot per product so the carousel needs no extra API call.

const KEY = "rj_recently_viewed";
const MAX = 12;

export function getRecentlyViewed() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(product) {
  if (typeof window === "undefined" || !product?.id) return;
  try {
    const snapshot = {
      id: product.id,
      name: product.name || product.title || "Jewelry",
      image: product.product_image || product.media?.[0]?.image || "",
      price: product.price || product.selling_price || 0,
      slug: product.slug || product.id,
      category: product.category?.name || "",
      viewedAt: Date.now(),
    };
    const existing = getRecentlyViewed().filter((p) => p.id !== product.id);
    const next = [snapshot, ...existing].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — non-fatal */
  }
}
