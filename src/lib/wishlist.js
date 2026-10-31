import { rjApi, transformProduct, attachPrices } from "@/lib/apiHandler";

// The NestJS wishlist stores one entry per product: { productId, ...whatever
// the storefront sent when it was added }. These helpers adapt it to the
// legacy shape the wishlist page, popup and product cards still read.

const SELLABLE = ["active", "Published", "Approved"];

export const bearer = (req) => req.headers.get("authorization")?.replace("Bearer ", "") || "";

export async function readWishlist(token) {
  if (!token) return { ok: false, status: 401, entries: [] };
  const res = await rjApi("GET", "/storefront/wishlist", { headers: { Authorization: `Bearer ${token}` } });
  const d = res.raw?.data;
  return { ok: res.ok, status: res.status, entries: Array.isArray(d) ? d : d?.items || [] };
}

export async function toggleEntry(token, productId, productData = {}) {
  const res = await rjApi("POST", "/storefront/wishlist", {
    headers: { Authorization: `Bearer ${token}` },
    body: { productId, productData },
  });
  const d = res.raw?.data || {};
  return { ok: res.ok, status: res.status, added: Boolean(d.added), count: d.wishlist?.length ?? 0 };
}

/** Entries → wishlist items with product title/image/live price. Drops products that are gone or unpublished. */
export async function hydrateWishlist(entries) {
  const products = await Promise.all(
    entries.map((e) =>
      rjApi("GET", `/products/${e.productId}`)
        .then((r) => (r.ok ? r.raw?.data || null : null))
        .catch(() => null)
    )
  );

  const items = entries
    .map((e, i) => {
      const p = products[i];
      if (!p || p.isDeleted || (p.status && !SELLABLE.includes(p.status))) return null;
      const t = transformProduct(p);
      return {
        id: e.productId, // entries are keyed by product; remove / move-to-cart use this
        product_id: e.productId,
        product_price: Number(e.product_price) || 0,
        category_id: e.category_id || t.category_id || "",
        metal_type: e.metal_type || t.metal_type,
        metal_color: e.metal_color || (t.metalColor || "").toUpperCase(),
        diamond_shape: e.diamond_shape || t.shape || "",
        center_diamond_weight: e.center_diamond_weight || "",
        ring_size: e.ring_size || "",
        size: e.size || "",
        product: {
          id: t.id,
          title: t.title,
          image: t.product_image,
          image_rollover: t.rollover_image,
          category: { name: p.category || "Others" },
          category_id: t.category_id,
          design_no: t.sku,
          wishlist: true,
        },
      };
    })
    .filter(Boolean);

  await attachPrices(items);
  return items;
}
