import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { resolveCartItemName } from "@/lib/resolveTokens";

const FALLBACK_IMAGE = "/logo/rj-house.svg";

// One storefront item shape (also read by lib/invoice/orderInvoice.jsx).
const toItem = (o, l = {}) => {
  const quantity = Number(l.quantity ?? o.quantity) || 1;
  const lineTotal = Number(l.lineTotal ?? l.unitPrice * quantity) || 0;
  const price = Number(l.unitPrice) || (quantity ? lineTotal / quantity : lineTotal);
  const purity = l.metalPurity || o.metalPurity || "";
  const color = l.metalColor || o.metalColor || "";
  const shape = l.diamondShape || o.diamondShape || "";
  const weight = l.centerDiamondWeight ?? o.diamondWeightCt ?? "";
  const title = resolveCartItemName(l.productName || o.productName || "Jewelry", {
    metalType: purity,
    metalColor: color,
    shape,
    centerDiamondWeight: weight,
    clarity: l.diamondClarity,
    color: l.diamondColor,
  });
  return {
    product_id: l.productId || o.productId,
    product_code: o.productCode || "",
    price,
    line_total: lineTotal || price * quantity,
    quantity,
    ring_size: l.ringSize || l.size || o.productSize || "",
    center_diamond_weight: weight || 0,
    metal_type: purity || o.metalType || "",
    metal_color: color,
    diamond_shape: shape,
    engraving: l.engraving || "",
    product: {
      title,
      description: "",
      image: l.image || o.productImageUrl || FALLBACK_IMAGE,
      occasion: { custom_title: shape },
      quality: { value: purity },
    },
  };
};

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const result = await rjApi("GET", "/storefront/my-orders", { headers: { Authorization: `Bearer ${token}` } });
    const orders = Array.isArray(result.raw?.data) ? result.raw.data : [];
    return NextResponse.json({
      data: orders.map((o) => {
        const total = Number(o.totalAmount) || 0;
        // Orders keep every line in lineItems; older ones only the first product.
        const items = Array.isArray(o.lineItems) && o.lineItems.length ? o.lineItems.map((l) => toItem(o, l)) : [toItem(o)];
        return {
          id: o.id,
          order_id: o.orderNumber || o.id,
          order_number: o.orderNumber,
          status: o.orderStatus || o.status || "Pending",
          payment_status: o.paymentStatus || "Pending",
          payment_method: o.paymentMethod || "",
          total,
          total_amount: total,
          currency_code: o.currencyCode || "USD",
          charged_amount: o.chargedAmount != null ? Number(o.chargedAmount) : null,
          created_at: o.createdAt || o.orderDate,
          order_date: o.orderDate || o.createdAt,
          shipping_cost: 0,
          coupon: null,
          // Customer / delivery details (invoice and order detail)
          customer_name: o.customerName || "",
          customer_email: o.customerEmail || "",
          customer_phone: o.customerPhone || "",
          customer_address: o.customerAddress || "",
          metal_type: o.metalType || "",
          metal_color: o.metalColor || "",
          tracking_number: o.trackingNumber || "",
          courier_name: o.courierName || "",
          tracking_url: o.trackingUrl || "",
          shipped_at: o.shippedAt || null,
          delivered_at: o.deliveredAt || null,
          items,
        };
      }),
    });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
