import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

const isVideoUrl = (url) => /\.(mp4|webm|mov|avi)$/i.test(url || "");

// The legacy INR-scale `/pricing-config` fallback was removed: in a USD store it
// produced absurd cart totals whenever the Pricing Engine lacked rates. Items the
// engine can't price keep their stored add-to-cart price (or 0 → price on request).

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const result = await rjApi("GET", "/storefront/cart", { headers: { Authorization: `Bearer ${token}` } });
    const cart = result.raw?.data || { items: [], coupon: null };
    const items = cart.items || [];

    // 1. Batch price from engine for all items at once
    let enginePriceMap = {};
    try {
      const ids = items.map((i) => i.productId).filter(Boolean);
      if (ids.length) {
        const pr = await rjApi("POST", "/pricing/batch", { body: { productIds: ids } });
        enginePriceMap = pr.raw?.data?.map || pr.raw?.map || {};
      }
    } catch { /* engine unavailable */ }

    // 2. Enrich items concurrently — image, name, live price
    const enriched = await Promise.all(
      items.map(async (i) => {
        let productName = i.productName || "Jewelry";
        let mediaImage = i.metadata?.image || "";
        let price = i.price || 0;

        // Configured items (karat/carat chosen on the PDP) must be re-priced
        // WITH their configuration — the batch engine only knows the product's
        // default attributes and would overwrite the configured price.
        const hasConfig = !!(i.metadata?.metalType || i.metadata?.centerDiamondWeight);
        if (hasConfig) {
          try {
            const overrides = {};
            if (i.metadata?.metalType)
              overrides.metalPurity = String(i.metadata.metalType).replace("KT", "K");
            if (i.metadata?.metalColor) overrides.metalColor = i.metadata.metalColor;
            if (i.metadata?.centerDiamondWeight)
              overrides.diamondWeightCt =
                Number(String(i.metadata.centerDiamondWeight).replace(/[^0-9.]/g, "")) || undefined;
            const pv = await rjApi("POST", "/price-preview", { body: { productId: i.productId, ...overrides } });
            const live = Number((pv.raw?.data || pv.raw || {}).finalPrice) || 0;
            if (live > 0) price = live;
          } catch { /* keep stored price */ }
        } else {
          // Unconfigured items: default engine price takes priority
          const enginePrice = enginePriceMap[i.productId];
          if (enginePrice != null && enginePrice > 0) price = enginePrice;
        }

        try {
          const pRes = await rjApi("GET", `/products/${i.productId}`);
          const p = pRes.raw?.data || pRes.raw;
          if (p?.productName || p?.name) productName = p.productName || p.name;

          // Color-matched image
          if (p?.media?.length) {
            const sorted = [...p.media].sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
            const itemColor = (i.metadata?.metalColor || "YELLOW").toUpperCase();
            const colorMatch = sorted.find(
              (m) => (m.metalColor || "YELLOW").toUpperCase() === itemColor && !isVideoUrl(m.fileUrl || m.url)
            );
            const anyImage = sorted.find((m) => !isVideoUrl(m.fileUrl || m.url));
            const best = colorMatch || anyImage;
            if (best?.fileUrl || best?.url) mediaImage = best.fileUrl || best.url;
          }

        } catch { /* use defaults */ }

        const priceOnRequest = !(price > 0);
        const clean = (v) => (v && v !== "undefined") ? v : "";
        return {
          cart_item_id: i.productId,
          product_id: i.productId,
          title: productName,
          product_name: productName,
          media_image: mediaImage,
          product_image: mediaImage,
          product_price: price,
          price_on_request: priceOnRequest,
          quantity: i.quantity,
          line_total: price * i.quantity,
          subtotal: price * i.quantity,
          metal_type: i.metadata?.metalType || "",
          metal_color: i.metadata?.metalColor || "",
          diamond_shape: clean(i.metadata?.shape),
          center_diamond_weight: clean(i.metadata?.centerDiamondWeight),
          ring_size: clean(i.metadata?.ringSize),
          design_no: clean(i.metadata?.designNo),
          product_description: clean(i.metadata?.description),
          category: i.metadata?.category || "",
          category_id: i.metadata?.categoryId || null,
        };
      })
    );

    const subtotal = enriched.reduce((s, i) => s + i.subtotal, 0);
    let discount = 0;
    if (cart.coupon) {
      discount =
        cart.coupon.discountType === "fixed"
          ? Math.min(cart.coupon.discount, subtotal)
          : Math.round(subtotal * ((cart.coupon.discount || 0) / 100));
    }
    const grandTotal = subtotal - discount;

    return NextResponse.json({
      data: {
        cart_items: enriched,
        cart_summary: {
          number_of_cart_products: enriched.length,
          cart_total: subtotal,
          subtotal,
          discount,
          grand_total: grandTotal,
          total: grandTotal,
          item_count: enriched.length,
          coupon_code: cart.coupon?.code || null,
          coupon: cart.coupon ? { code: cart.coupon.code, discount: cart.coupon.discount } : null,
        },
      },
    });
  } catch (e) {
    return NextResponse.json({
      data: {
        cart_items: [],
        cart_summary: { number_of_cart_products: 0, cart_total: 0, grand_total: 0, subtotal: 0, total: 0 },
      },
    });
  }
}
