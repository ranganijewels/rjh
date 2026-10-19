import { NextResponse } from "next/server";
import { rjApi, transformProduct, attachPrices, consolidateDesignGroups } from "@/lib/apiHandler";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const perPage = Number(body.limit) || 20;
    const page = Number(body.page) || 1;
    const params = new URLSearchParams();
    if (body.search) params.set("search", body.search);
    // Fetch a large window (not the display page) so design-group siblings are
    // gathered together before we collapse them into one card each; we then
    // paginate the CONSOLIDATED cards ourselves below. (NestJS caps limit at 100.)
    params.set("limit", "100");
    params.set("status", "active");

    // Metal color filter: URL param is e.g. "yellow", "white", "rose"
    if (body.metal_color) params.set("metalColor", body.metal_color);
    if (body.metal_type) params.set("metalType", body.metal_type);

    // Diamond shape filter: URL param is shape name e.g. "Round", "Oval"
    if (body.diamond_shape) params.set("diamondShape", body.diamond_shape);

    // Department (Engagement / Wedding / Jewellery menus) and collection
    if (body.department) params.set("department", body.department);
    if (body.collection) params.set("collection", body.collection);
    // Category filter
    if (body.category) params.set("category", body.category);
    // Style/sub-category is its own DB column — this used to overload the
    // same "category" param, silently sending style links (e.g. "Halo") in
    // as a category filter that could never match.
    if (body.sub_category) params.set("subCategory", body.sub_category);

    // Sort: only DB-sortable fields go to NestJS. The old `split("_")` produced
    // garbage (e.g. "price_high_to_low" → sortBy=price/sortDir=high → 400) which
    // silently emptied the grid. "price" is computed by the Pricing Engine (never
    // a DB column) so price sorts are done in-memory below, after attachPrices().
    const SORT_MAP = {
      new_arrival: { sortBy: "createdAt", sortDir: "desc" },
      createdAt_desc: { sortBy: "createdAt", sortDir: "desc" },
    };
    const sortSpec = body.sort_by ? SORT_MAP[body.sort_by] : undefined;
    if (sortSpec) {
      params.set("sortBy", sortSpec.sortBy);
      params.set("sortDir", sortSpec.sortDir);
    }

    const result = await rjApi("GET", `/products?${params}`);
    const raw = result.raw;
    const products = Array.isArray(raw?.data) ? raw.data : [];

    const mapped = await attachPrices(products.map(transformProduct));
    // Collapse design-group siblings into one card each, then paginate cards.
    const cards = consolidateDesignGroups(mapped);

    // Price sort (computed price → must sort here, not at the DB). Cards with no
    // sellable price ("Price on request") always sink to the end, both ways.
    if (body.sort_by === "price_low_to_high" || body.sort_by === "price_high_to_low") {
      const dir = body.sort_by === "price_low_to_high" ? 1 : -1;
      const priceOf = (c) => (c?.product_price > 0 ? c.product_price : null);
      cards.sort((a, b) => {
        const pa = priceOf(a);
        const pb = priceOf(b);
        if (pa == null && pb == null) return 0;
        if (pa == null) return 1;
        if (pb == null) return -1;
        return (pa - pb) * dir;
      });
    }

    const start = (page - 1) * perPage;
    const pageItems = cards.slice(start, start + perPage);

    return NextResponse.json({
      data: pageItems,
      meta: {
        current_page: page,
        last_page: Math.max(1, Math.ceil(cards.length / perPage)),
        total: cards.length,
        per_page: perPage,
      },
    });
  } catch (e) {
    console.error("product list error:", e);
    return NextResponse.json({ data: [], meta: { current_page: 1, last_page: 1, total: 0 } }, { status: 500 });
  }
}
