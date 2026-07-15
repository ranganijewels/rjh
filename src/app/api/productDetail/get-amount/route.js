import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// Live product price from the centralized Pricing Engine (master-data driven).
// Returns a BASE (USD) price; the storefront converts to the visitor's
// currency client-side via the currency rate.
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const productId = body.product_id;

    // Map storefront selections → engine attribute overrides.
    const overrides = {};
    if (body.quality) overrides.metalPurity = String(body.quality).replace("KT", "K");
    // Metal TYPE must travel with purity — the engine resolves rates by
    // (metalType, purity), so a Silver selection priced as Gold+"925" would
    // silently return a wrong price (missing rate → metal value 0).
    if (body.metal_type) overrides.metalType = body.metal_type;
    if (body.metal_color) overrides.metalColor = body.metal_color;
    // The chosen carat is the CENTRE stone weight — it re-prices only the
    // centre diamond line (side stones keep their own weight) and drives the
    // metal-weight matrix. Sent as centerCaratCt, not the total diamondWeightCt.
    if (body.center_diamond_weight) {
      const ct =
        Number(String(body.center_diamond_weight).replace(/[^0-9.]/g, "")) || undefined;
      if (ct) overrides.centerCaratCt = ct;
    }
    if (body.diamond_quality) overrides.diamondQuality = body.diamond_quality;

    // Ask the engine for the live price (loads product attributes + overrides).
    const result = await rjApi("POST", "/price-preview", { body: { productId, ...overrides } });
    const r = result.raw?.data || result.raw || {};

    const total = Number(r.finalPrice) || 0;
    const bd = r.priceBreakdown || {};

    return NextResponse.json({
      status: true,
      data: {
        total_price: total,
        metal_amount: Number(r.metalValue) || 0,
        diamond_amount: Number(r.diamondValue) || 0,
        // labour shown to the customer bundles making + additional charges
        labour_amount: (Number(r.laborCharge) || 0) + (Number(r.additionalCharges) || 0),
        gst_amount: Number(r.taxAmount) || 0,
        diamonds_details:
          bd.diamond && bd.diamond.caratWeight > 0
            ? [
                {
                  weight_ct: bd.diamond.caratWeight,
                  price_per_ct: bd.diamond.ratePerCarat,
                  type: "Lab Grown Diamond",
                },
              ]
            : [],
        pricing: {
          data: [
            {
              nwt: bd.metal?.weightG ? `${bd.metal.weightG}g` : "-",
              metal: overrides.metalPurity || "",
              making: bd.labor?.value != null ? `$${bd.labor.value}` : "-",
              gst: r.taxAmount ? `$${r.taxAmount}` : "-",
            },
          ],
        },
        breakdown: r.priceBreakdown || null,
      },
    });
  } catch (e) {
    console.error("get-amount (engine) error:", e);
    return NextResponse.json({ status: false, data: { total_price: 0 } });
  }
}
