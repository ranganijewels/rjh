import { NextResponse } from "next/server";
import { buildTokenContext, resolveTokens } from "./resolveTokens";
import { displayProductName } from "./productName";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";
const API_V1 = `${BASE_URL}/api/v1`;

/** Call our NestJS API directly and return parsed JSON */
export async function rjApi(method, path, { headers = {}, body } = {}) {
  const url = `${API_V1}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": TENANT_ID,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { error: text }; }
  return { ok: res.ok, status: res.status, raw: data };
}

/**
 * Apply live pricing to an array of transformed products.
 * 1. Tries the NestJS pricing engine batch endpoint (fast, master-data driven).
 * 2. Falls back to the config-based formula when the engine returns 0
 *    (same formula the product detail page uses, with sensible defaults).
 * Mutates prices in-place and returns the array.
 */
export async function attachPrices(products) {
  if (!products || products.length === 0) return products;

  // Step 1 — pricing engine batch
  try {
    const ids = products.map((p) => p.id || p.product_id).filter(Boolean);
    if (ids.length) {
      const priceRes = await rjApi("POST", "/pricing/batch", { body: { productIds: ids } });
      const priceMap = priceRes.raw?.data?.map || priceRes.raw?.map || {};
      products.forEach((p) => {
        const live = priceMap[p.id || p.product_id];
        if (live != null && live > 0) {
          p.product_price = live;
          p.selling_price = live;
        }
      });
    }
  } catch { /* engine unavailable, fall through */ }

  // Products the engine can't price stay at 0 → the card renders "Price on
  // request". The old INR-scale `/pricing-config` fallback was removed (it printed
  // absurd $ numbers in a USD store when rate masters were missing).
  products.forEach((p) => {
    p.price_on_request = !(p.product_price > 0);
  });

  return products;
}

/** Unwrap NestJS { success, data, meta } envelope */
export function unwrap(result) {
  const d = result.raw;
  if (d && d.success !== undefined) return { data: d.data, meta: d.meta };
  return { data: d, meta: null };
}

/** Transform our NestJS product to Jewel Label product format */
export function transformProduct(p) {
  if (!p) return null;

  // Sort media by sortOrder and derive color-specific images
  const sortedMedia = (p.media || []).sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
  const isVideo = (url) => /\.(mp4|webm|mov|avi)$/i.test(url || "");

  // Primary/hover: use the admin's explicit Main/Rollover tag (media.altText
  // is repurposed as a "main" | "rollover" | "gallery" role marker — see
  // ProductMedia entity). Falls back to sort position only for older media
  // that predates the tagging feature, so nothing regresses for those rows.
  const roleOf = (m) => (m.altText || "").toLowerCase();
  const byRole = (pool, role) => pool.find((m) => roleOf(m) === role);

  const cardColor = (p.metalColor || "YELLOW").toUpperCase();
  const colorImages = sortedMedia.filter(
    (m) => (m.metalColor || "YELLOW").toUpperCase() === cardColor && !isVideo(m.fileUrl || m.url)
  );
  const anyImages = sortedMedia.filter((m) => !isVideo(m.fileUrl || m.url));
  const primaryMedia = byRole(colorImages, "main") || byRole(anyImages, "main") || colorImages[0] || anyImages[0];
  const hoverMedia = byRole(colorImages, "rollover") || byRole(anyImages, "rollover") || colorImages[1] || anyImages[1] || primaryMedia;

  const primaryImage = primaryMedia?.fileUrl || primaryMedia?.url || p.mainImageUrl || "";
  const hoverImage = hoverMedia?.fileUrl || hoverMedia?.url || primaryImage;

  // Derive available metal colors from media tags (unique, uppercase)
  const colorSet = new Set(sortedMedia.map((m) => (m.metalColor || "YELLOW").toUpperCase()));
  const availableColors = [...colorSet];
  // Always offer all 3 for the swatches; listing card color-change will show same image if no specific color images
  const metalColorSwatches = ["YELLOW", "WHITE", "ROSE"];

  // Per-color image lists for the card — ONLY the Main + Rollover pair per
  // color (not the whole gallery), so hovering a metal swatch previews that
  // color's main shot and hovering the card image swaps to its rollover,
  // with no multi-image carousel. Falls back to sort position per-color
  // when a color has no explicit role tags.
  const imagesByColor = {};
  for (const c of colorSet) {
    const pool = anyImages.filter((m) => (m.metalColor || "YELLOW").toUpperCase() === c);
    const main = byRole(pool, "main") || pool[0];
    const roll = byRole(pool, "rollover") || pool[1] || main;
    const urls = [main, roll].map((m) => m?.fileUrl || m?.url).filter(Boolean);
    if (urls.length) imagesByColor[c] = [...new Set(urls)];
  }
  const allImages = [primaryImage, hoverImage].filter(Boolean);

  // Listing cards have no per-card metal/diamond selector, so any {{token}}
  // in the (AI-generated) title/description resolves against the product's
  // default/first metal option — same default-variant rule the SEO meta tags
  // use, kept live-reactive only on the PDP where a selector actually exists.
  const firstMetal = Array.isArray(p.metadata?.metalOptions) ? p.metadata.metalOptions[0] : null;
  const cardTokenCtx = buildTokenContext({
    metalType: firstMetal?.type || p.metalType,
    karat: firstMetal?.purities?.[0] || p.metalPurity,
    metalColor: firstMetal?.colors?.[0] || p.metalColor,
    diamondShape: p.diamondShape || p.centerStoneShape,
    diamondWeight: p.diamondWeightCt || p.centerStoneWeightCt,
    diamondClarity: p.diamondClarity || p.diamondQuality,
    diamondColor: p.diamondColor,
  });

  return {
    product_id: p.id,
    id: p.id,
    title: resolveTokens(p.productName || p.name, cardTokenCtx) || displayProductName(p),
    // No stored price — the listing route overrides these with live engine
    // prices (POST /pricing/batch). Default 0 until that resolves.
    product_price: 0,
    selling_price: 0,
    price_on_request: true, // until POST /pricing/batch resolves a live price
    product_image: primaryImage,
    rollover_image: hoverImage,
    images_by_color: imagesByColor,
    all_images: allImages,
    category_id: p.categoryId || p.category || null,
    metal_type: p.metalType || "Gold",
    meta_quality: p.metalPurity || p.metalQuality || "18K",
    product_color: p.metalColor || "Yellow Gold",
    metal_color: metalColorSwatches,
    available_colors: availableColors,
    shape: p.diamondShape || "",
    design_group: p.metadata?.designGroup || p.designGroup || null,
    display_discount_percent: Number(p.metadata?.displayDiscountPercent) || 0,
    display_discount_ends_at: p.metadata?.displayDiscountEndsAt || null,
    badges: Array.isArray(p.metadata?.badges) ? p.metadata.badges : [],
    description: resolveTokens(p.description, cardTokenCtx),
    sku: p.productCode || p.sku || "",
    slug: p.slug || p.id,
    is_wishlisted: false,
    // Raw attrs kept for downstream use (engine batch pricing keys off these)
    grossWeightG: Number(p.grossWeightG) || Number(p.netWeightG) || 0,
    metalType: p.metalType || "Gold",
    metalPurity: p.metalPurity || p.metalQuality || "18K",
    metalColor: p.metalColor || "Yellow",
    diamondWeightCt: Number(p.diamondWeightCt) || 0,
    diamondType: p.diamondType || "Lab Grown Diamond",
  };
}

/**
 * Collapse design-group siblings (one product per diamond shape, linked by
 * metadata.designGroup) into a SINGLE card carrying the available shapes as
 * `shape_variants` — so the listing shows one card per design with shape
 * swatches (like Ecksand), instead of a separate card per shape.
 * Products without a designGroup pass through unchanged. Original order is
 * preserved (a group is emitted at its first member's position).
 */
export function consolidateDesignGroups(items) {
  const byGroup = new Map();
  for (const it of items || []) {
    const g = it?.design_group;
    if (!g) continue;
    if (!byGroup.has(g)) byGroup.set(g, []);
    byGroup.get(g).push(it);
  }
  const emitted = new Set();
  const out = [];
  for (const it of items || []) {
    const g = it?.design_group;
    if (!g) { out.push(it); continue; }
    if (emitted.has(g)) continue;
    emitted.add(g);
    const members = byGroup.get(g) || [it];
    if (members.length <= 1) { out.push(it); continue; }
    // One variant per distinct shape (dedupe; keep first).
    const seen = new Set();
    const shape_variants = [];
    for (const m of members) {
      const sh = (m.shape || "").trim();
      const key = sh.toUpperCase();
      if (!sh || seen.has(key)) continue;
      seen.add(key);
      shape_variants.push({
        display_discount_percent: m.display_discount_percent || 0,
        display_discount_ends_at: m.display_discount_ends_at || null,
        shape: sh,
        product_id: m.product_id,
        product_image: m.product_image,
        rollover_image: m.rollover_image,
        images_by_color: m.images_by_color,
        all_images: m.all_images,
        metal_color: m.metal_color,
        product_price: m.product_price,
        price_on_request: m.price_on_request,
      });
    }
    const primary = members.find((m) => m.product_id === it.product_id) || members[0];
    // "From" price = cheapest resolved variant.
    const prices = shape_variants.map((v) => v.product_price).filter((n) => n > 0);
    out.push({
      ...primary,
      is_design_group_card: true,
      design_group: g,
      shape_variants,
      product_price: prices.length ? Math.min(...prices) : primary.product_price,
    });
  }
  return out;
}

// ─── Legacy proxy helpers ─────────────────────────────────────────────────────

export async function handleGET(apiPath, headers = {}, queryParams = {}) {
  try {
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${BASE_URL}${apiPath}${queryString ? `?${queryString}` : ""}`;
    const res = await fetch(url, { method: "GET", headers, cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Failed" }));
      return NextResponse.json(err, { status: res.status });
    }
    const ct = res.headers.get("content-type");
    if (ct?.includes("application/json")) return NextResponse.json(await res.json());
    const buf = await res.arrayBuffer();
    return new Response(buf, { status: 200, headers: { "Content-Type": ct || "application/octet-stream" } });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function handlePOST(req, apiPath, customHeaders = {}, options = {}) {
  try {
    let body;
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const b = await req.json().catch(() => ({}));
      customHeaders["Content-Type"] = "application/json";
      body = JSON.stringify(b);
    }
    const res = await fetch(`${BASE_URL}${apiPath}`, { method: "POST", headers: customHeaders, body });
    const text = await res.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { error: text }; }
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function handlePUT(apiPath, body, customHeaders = {}) {
  try {
    const res = await fetch(`${BASE_URL}${apiPath}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...customHeaders },
      body: JSON.stringify(body),
    });
    if (!res.ok) return NextResponse.json({ error: "Failed" }, { status: res.status });
    return NextResponse.json(await res.json());
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function handleDELETE(apiPath, customHeaders = {}) {
  try {
    const res = await fetch(`${BASE_URL}${apiPath}`, { method: "DELETE", headers: customHeaders });
    if (!res.ok) return NextResponse.json({ error: "Failed" }, { status: res.status });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function handlePATCH(req, apiPath, customHeaders = {}) {
  try {
    const body = await req.json().catch(() => ({}));
    const res = await fetch(`${BASE_URL}${apiPath}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...customHeaders },
      body: JSON.stringify(body),
    });
    if (!res.ok) return NextResponse.json({ error: "Failed" }, { status: res.status });
    return NextResponse.json(await res.json());
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function handleGETFile(apiPath, headers = {}, queryParams = {}) {
  return handleGET(apiPath, headers, queryParams);
}
