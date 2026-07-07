import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const result = await rjApi("GET", "/storefront/my-orders", { headers: { Authorization: `Bearer ${token}` } });
    const orders = result.raw?.data || [];
    return NextResponse.json({
      data: orders.map((o) => {
        const qty = Number(o.quantity) || 1;
        const total = Number(o.totalAmount) || 0;
        return {
          id: o.id,
          order_id: o.orderNumber || o.id,
          order_number: o.orderNumber,
          status: o.orderStatus || o.status || "confirmed",
          payment_status: o.paymentStatus || "Pending",
          total,
          total_amount: total,
          created_at: o.createdAt || o.orderDate,
          order_date: o.orderDate || o.createdAt,
          shipping_cost: 0,
          coupon: null,
          // Customer / billing details for the invoice
          customer_name: o.customerName || o.customer?.name || "",
          customer_email: o.customerEmail || o.customer?.email || "",
          customer_phone: o.customerPhone || o.customer?.phone || "",
          customer_address: o.customerAddress || "",
          metal_type: o.metalType || "",
          metal_color: o.metalColor || "",
          // backend stores one product per flat order row → synthesize an items[]
          items: [
            {
              product_id: o.productId,
              product_code: o.productCode || "",
              // unit price so line total (price × qty) equals the order total
              price: qty > 0 ? total / qty : total,
              quantity: qty,
              ring_size: o.productSize || "-",
              center_diamond_weight: o.diamondWeightCt || 0,
              metal_type: o.metalType || "",
              metal_color: o.metalColor || "",
              diamond_shape: o.diamondShape || "",
              product: {
                title: o.productName || "Jewelry",
                description: "",
                image: o.productImageUrl || "/images/products/ring-product-1.png",
                occasion: { custom_title: o.diamondShape || "" },
                quality: { value: o.metalPurity || "" },
              },
            },
          ],
        };
      }),
    });
  } catch { return NextResponse.json({ data: [] }); }
}
