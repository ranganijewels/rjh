// Unified analytics / conversion-tracking layer.
// Pushes a normalized event to the GTM dataLayer AND mirrors it to GA4 (gtag)
// and Meta Pixel (fbq) when those are loaded. All calls are no-ops until the
// corresponding IDs are configured (NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_FB_PIXEL_ID),
// so the storefront is fully instrumented and ready for any tag the moment a
// performance marketer drops in an ID — nothing else to wire.

import { hasConsent, isProductionHost } from "./consent";
import { newEventId } from "./attribution";

const isBrowser = () => typeof window !== "undefined";

// GA4 ⇄ Meta Pixel standard-event name mapping
const FB_EVENT = {
  page_view: "PageView",
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  add_to_wishlist: "AddToWishlist",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
  search: "Search",
  generate_lead: "Lead",
  sign_up: "CompleteRegistration",
  add_payment_info: "AddPaymentInfo",
  click_whatsapp: "Contact",
  click_phone: "Contact",
  click_email: "Contact",
  book_consultation: "Schedule",
  product_customization: "CustomizeProduct",
};

// The same event for the same page/product within a few seconds is a
// re-render or an automatic URL update (e.g. ?carat= added on load), not a new
// user action. Purchases have their own once-per-order guard.
const recent = new Map();
function isRepeat(event, params) {
  const key =
    event === "page_view"
      ? `${event}|${String(params.page_path || "").split("?")[0]}`
      : `${event}|${params.item_id || params.transaction_id || params.search_term || ""}|${params.value ?? ""}`;
  const now = Date.now();
  const last = recent.get(key);
  recent.set(key, now);
  return last !== undefined && now - last < 3000 && event !== "add_to_cart";
}

// Events also sent server-side (Conversions API) with the same event_id.
const RELAY = new Set(["ViewContent", "AddToWishlist", "AddToCart", "InitiateCheckout", "AddPaymentInfo"]);

function fbData(params) {
  const ids = params.content_ids || (params.items ? params.items.map((i) => i.item_id) : params.item_id ? [params.item_id] : undefined);
  const contents = params.items
    ? params.items.map((i) => ({ id: i.item_id, quantity: i.quantity || 1, item_price: i.price }))
    : undefined;
  return {
    value: params.value ?? params.price,
    currency: params.currency || "USD",
    content_ids: ids,
    contents,
    content_name: params.item_name || params.items?.[0]?.item_name,
    content_type: "product",
    num_items: params.num_items ?? params.quantity ?? (params.items ? params.items.length : undefined),
    search_string: params.search_term,
  };
}

export function track(event, params = {}) {
  if (!isBrowser()) return;
  // No tracking before consent, and never from staging / local hosts.
  if (!hasConsent() || !isProductionHost()) return;
  if (isRepeat(event, params)) return;
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
        // eventID: order number for purchases (the server sends the matching
        // Purchase); a fresh id for relayed events so Pixel + CAPI de-duplicate.
        const eventID = params.transaction_id || params.event_id || (RELAY.has(fb) ? newEventId(fb.toLowerCase()) : undefined);
        const data = fbData(params);
        window.fbq("track", fb, data, eventID ? { eventID } : undefined);
        if (RELAY.has(fb) && eventID) {
          const payload = JSON.stringify({ event_name: fb, event_id: eventID, custom_data: data, source_url: location.href });
          try {
            if (navigator.sendBeacon) navigator.sendBeacon("/api/meta-event", new Blob([payload], { type: "application/json" }));
            else fetch("/api/meta-event", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true });
          } catch {}
        }
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

const gaItem = (p = {}) => ({
  item_id: p.id || p.sku,
  item_name: p.name || p.title,
  item_category: p.category,
  item_variant: p.variant || undefined,
  price: Number(p.price) || undefined,
  quantity: p.quantity || 1,
});

export const trackViewItem = (p = {}) =>
  track("view_item", {
    item_id: p.id || p.sku,
    item_name: p.name || p.title,
    item_category: p.category,
    price: Number(p.price) || undefined,
    value: Number(p.price) || undefined,
    currency: p.currency || "USD",
    items: [gaItem(p)],
  });

export const trackAddToCart = (p = {}) =>
  track("add_to_cart", {
    item_id: p.id || p.sku,
    item_name: p.name,
    price: Number(p.price) || undefined,
    value: (Number(p.price) || 0) * (p.quantity || 1) || undefined,
    quantity: p.quantity || 1,
    currency: p.currency || "USD",
    items: [gaItem(p)],
  });

export const trackAddToWishlist = (p = {}) =>
  track("add_to_wishlist", { item_id: p.id || p.sku, item_name: p.name, price: Number(p.price) || undefined, value: Number(p.price) || undefined, currency: "USD", items: [gaItem(p)] });

export const trackSearch = (term, results) =>
  track("search", { search_term: term, results_count: results });

export const trackBeginCheckout = (value, items = []) =>
  track("begin_checkout", {
    value: Number(value) || undefined,
    currency: "USD",
    num_items: items.length,
    items: items.map(gaItem),
  });

// Fires at most once per order number (refreshes / revisits of the
// confirmation page don't double-count revenue).
export const trackPurchase = (order = {}) => {
  if (!isBrowser()) return;
  // Without consent nothing is sent — and the once-per-order guard below must
  // not be spent on an event that was never sent.
  if (!hasConsent() || !isProductionHost()) return;
  const id = order.orderNumber || order.order_number || order.id;
  if (!id) return;
  const key = `rj_purchase_tracked_${id}`;
  try {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
  } catch {}
  track("purchase", {
    transaction_id: id,
    value: Number(order.total) || undefined,
    currency: "USD",
    items: (order.items || []).map(gaItem),
  });
};

export const trackLead = (source, extra = {}) => track("generate_lead", { source, ...extra });
export const trackPaymentInfo = (value, items = [], paymentType) =>
  track("add_payment_info", { value: Number(value) || undefined, currency: "USD", payment_type: paymentType, num_items: items.length, items: items.map(gaItem) });
export const trackContact = (kind = "whatsapp", extra = {}) => track(`click_${kind}`, { page_type: typeof window !== "undefined" ? window.location.pathname : undefined, ...extra });
export const trackConsultationBooked = (type) => track("book_consultation", { appointment_type: type });
export const trackCustomization = (p = {}) => track("product_customization", { item_id: p.id || p.sku, item_name: p.name, value: Number(p.price) || undefined, currency: "USD" });
