// Unified analytics / conversion-tracking layer.
// Pushes a normalized event to the GTM dataLayer AND mirrors it to GA4 (gtag)
// and Meta Pixel (fbq) when those are loaded. All calls are no-ops until the
// corresponding IDs are configured (NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_FB_PIXEL_ID),
// so the storefront is fully instrumented and ready for any tag the moment a
// performance marketer drops in an ID — nothing else to wire.

const isBrowser = () => typeof window !== "undefined";

// GA4 ⇄ Meta Pixel standard-event name mapping
const FB_EVENT = {
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  add_to_wishlist: "AddToWishlist",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
  search: "Search",
  generate_lead: "Lead",
  sign_up: "CompleteRegistration",
};

export function track(event, params = {}) {
  if (!isBrowser()) return;
  try {
    // 1) GTM dataLayer (works for GTM + any tag manager)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });

    // 2) GA4
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
    }

    // 3) Meta Pixel
    if (typeof window.fbq === "function") {
      const fb = FB_EVENT[event];
      if (fb) {
        window.fbq("track", fb, {
          value: params.value ?? params.price,
          currency: params.currency || "USD",
          content_ids: params.content_ids || (params.item_id ? [params.item_id] : undefined),
          content_name: params.item_name,
          content_type: "product",
          num_items: params.quantity,
          search_string: params.search_term,
        });
      } else {
        window.fbq("trackCustom", event, params);
      }
    }
  } catch {
    /* never break the UI for analytics */
  }
}

// ── Named helpers for the key funnel events ────────────────────────────────
export const trackPageView = (path) => track("page_view", { page_path: path });

export const trackViewItem = (p = {}) =>
  track("view_item", {
    item_id: p.id || p.sku,
    item_name: p.name || p.title,
    item_category: p.category,
    price: Number(p.price) || undefined,
    currency: p.currency || "USD",
  });

export const trackAddToCart = (p = {}) =>
  track("add_to_cart", {
    item_id: p.id || p.sku,
    item_name: p.name,
    price: Number(p.price) || undefined,
    quantity: p.quantity || 1,
    currency: p.currency || "USD",
  });

export const trackAddToWishlist = (p = {}) =>
  track("add_to_wishlist", { item_id: p.id, item_name: p.name, price: Number(p.price) || undefined });

export const trackSearch = (term, results) =>
  track("search", { search_term: term, results_count: results });

export const trackBeginCheckout = (value, items) =>
  track("begin_checkout", { value: Number(value) || undefined, currency: "USD", num_items: items });

export const trackPurchase = (order = {}) =>
  track("purchase", {
    transaction_id: order.id || order.orderNumber,
    value: Number(order.total) || undefined,
    currency: order.currency || "USD",
  });

export const trackLead = (source) => track("generate_lead", { source });
