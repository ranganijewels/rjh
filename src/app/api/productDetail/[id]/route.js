import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// NOTE: The legacy `/pricing-config` fallback (INR-scale defaults like Gold 6500/g)
// was removed here. In a USD store it produced absurd prices (e.g. a $5,000+ floor)
// whenever the Pricing Engine had no rates for a product. We now surface
// "Price on request" instead of a wrong number — see priceOnRequest below.

// Map variant_value (3-letter shape code or "YELLOW"/"WHITE"/"ROSE") to display info
const SHAPE_MAP = {
  RND: { code: "RND", title: "Round" },
  PRI: { code: "PRI", title: "Princess" },
  OVL: { code: "OVL", title: "Oval" },
  CUS: { code: "CUS", title: "Cushion" },
  ELC: { code: "ELC", title: "Elongated Cushion" },
  PEA: { code: "PEA", title: "Pear" },
  EME: { code: "EME", title: "Emerald" },
  HRT: { code: "HRT", title: "Heart" },
  MAR: { code: "MAR", title: "Marquise" },
  ASC: { code: "ASC", title: "Asscher" },
  RAD: { code: "RAD", title: "Radiant" },
};

// Fallback synthetic shapes when no real shape-variant products exist in NestJS
const SYNTHETIC_SHAPES = Object.values(SHAPE_MAP).map((s) => ({
  id: `shape-${s.code.toLowerCase()}`,
  shape: s.code,
  label: s.title,
  name: s.title,
  custom_shape_title: null,
  designno: null,
  media: [],
  variant_product_id: null,
  occasion: null,
}));

export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const [productResult, variantsResult] = await Promise.all([
      rjApi("GET", `/products/${id}`),
      rjApi("GET", `/products/${id}/variants`).catch(() => null),
    ]);

    const p = productResult.raw?.data || productResult.raw;
    if (!p || !p.id) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Diamond-shape model: each shape is a SEPARATE product, linked to the same
    // design via metadata.designGroup. Fetch the sibling products so the shape
    // selector can switch between them (each option navigates to its product).
    const designGroup = p.metadata?.designGroup || p.metadata?.design_group || null;
    let designSiblings = [];
    if (designGroup) {
      const sibRes = await rjApi(
        "GET",
        `/products/design-group/${encodeURIComponent(designGroup)}`
      ).catch(() => null);
      const rows = sibRes?.raw?.data || sibRes?.raw || [];
      designSiblings = Array.isArray(rows) ? rows : [];
    }

    // Build color-tagged gallery from media records
    // Sort: cover image first, then by sortOrder, videos last
    const mediaItems = (p.media || []).sort((a, b) => {
      // Cover first
      if (a.isCover && !b.isCover) return -1;
      if (!a.isCover && b.isCover) return 1;
      // Images before videos
      const aIsVid = /\.(mp4|webm|mov|avi)$/i.test(a.fileUrl || a.url || "");
      const bIsVid = /\.(mp4|webm|mov|avi)$/i.test(b.fileUrl || b.url || "");
      if (!aIsVid && bIsVid) return -1;
      if (aIsVid && !bIsVid) return 1;
      // Then by sortOrder
      return (a.sortOrder ?? 99) - (b.sortOrder ?? 99);
    });

    const allMedia = mediaItems.map((m, i) => {
      const url = m.fileUrl || m.file_url || m.url;
      const color = (m.metalColor || "YELLOW").toUpperCase();
      const isVid = /\.(mp4|webm|mov|avi)$/i.test(url);
      return {
        id: m.id || `media-${i}`,
        image: url,
        url,
        fileUrl: url,
        type: isVid ? "video" : "image",
        color,
        sortOrder: m.sortOrder ?? 99,
      };
    });

    // Primary image: first YELLOW image (not video), fallback to any
    const yellowImages = allMedia.filter((m) => m.color === "YELLOW" && m.type !== "video");
    const primaryImage = yellowImages[0]?.image || allMedia.find((m) => m.type !== "video")?.image || "";
    const hoverImage = yellowImages[1]?.image || primaryImage;

    // Determine available metal colors from media tags
    const availableColors = [...new Set(allMedia.map((m) => m.color))];

    // Build quality options for MetalSelector
    const QUALITY_OPTIONS = [
      { id: 1, value: "14K", karat: "14K", label: "14K", name: "14K Gold" },
      { id: 2, value: "18K", karat: "18K", label: "18K", name: "18K Gold" },
      { id: 3, value: "22K", karat: "22K", label: "22K", name: "22K Gold" },
    ];

    // Build ring size options (US 3–10 in 0.5 increments)
    const RING_SIZES = [];
    for (let size = 3; size <= 10; size += 0.5) {
      RING_SIZES.push({ size: `${size} US`, size_value: size });
    }

    // Build shape variants: real variant products from NestJS, else synthetic fallback
    const rawVariants = Array.isArray(variantsResult?.raw)
      ? variantsResult.raw
      : Array.isArray(variantsResult?.raw?.data)
        ? variantsResult.raw.data
        : null;

    let shapeVariants;
    if (designSiblings.length >= 2) {
      // Preferred model: one product per diamond shape, linked by designGroup.
      // Each shape option carries the sibling's product id so the detail page
      // navigates to that product when its shape is chosen.
      shapeVariants = designSiblings.map((s) => {
        // Products store full shape names ("Princess"); the UI icon map is keyed
        // by 3-letter codes (PRI). Resolve by code OR by title.
        const raw = (s.diamondShape || "").trim();
        const info =
          SHAPE_MAP[raw.toUpperCase()] ||
          Object.values(SHAPE_MAP).find(
            (m) => m.title.toLowerCase() === raw.toLowerCase()
          ) || { code: raw, title: raw };
        const sibMedia = (s.media || []).map((m) => ({
          id: m.id,
          image: m.fileUrl || m.url,
          url: m.fileUrl || m.url,
          color: (m.metalColor || "YELLOW").toUpperCase(),
          type: "image",
        }));
        return {
          id: s.id,
          shape: info.code || s.diamondShape,
          label: info.title || s.diamondShape,
          name: info.title || s.diamondShape,
          custom_shape_title: s.diamondShape,
          designno: s.productCode || s.id,
          media: sibMedia,
          variant_product_id: s.id,
          // Navigate to this product when the shape is selected:
          product_id: s.id,
          is_design_sibling: true,
          occasion: null,
        };
      });
    } else if (rawVariants && rawVariants.length > 0) {
      shapeVariants = rawVariants
        .filter((v) => v.variantType === "shape")
        .map((v) => {
          const code = (v.variantValue || "").toUpperCase();
          const shapeInfo = SHAPE_MAP[code] || { code, title: code };
          const variantMedia = (v.media || []).map((m) => ({
            id: m.id,
            image: m.fileUrl || m.url,
            url: m.fileUrl || m.url,
            color: (m.metalColor || "YELLOW").toUpperCase(),
            type: "image",
          }));
          return {
            id: v.id,
            shape: shapeInfo.code,
            label: shapeInfo.title,
            name: shapeInfo.title,
            custom_shape_title: null,
            designno: v.productCode || v.id,
            media: variantMedia,
            variant_product_id: v.id,
            occasion: null,
          };
        });

      // For any shape NOT covered by a real variant, add a synthetic fallback
      const coveredCodes = new Set(shapeVariants.map((v) => v.shape));
      const syntheticFallbacks = SYNTHETIC_SHAPES.filter((s) => !coveredCodes.has(s.shape));
      shapeVariants = [...shapeVariants, ...syntheticFallbacks];
    } else {
      shapeVariants = SYNTHETIC_SHAPES;
    }

    // Initial price from the Pricing Engine (authoritative, USD base).
    // If the engine has no rates for this product it returns 0 — we then mark the
    // product "price on request" rather than inventing a wrong number.
    let initPrice = 0;
    try {
      const eng = await rjApi("GET", `/pricing/product/${id}`);
      initPrice = Number((eng.raw?.data || eng.raw)?.finalPrice) || 0;
    } catch { /* engine unavailable */ }
    const priceOnRequest = !(initPrice > 0);

    // Center stone carat configurator — standard carat weights for the selector.
    // When the shopper picks a different carat, the page calls /get-amount with
    // center_diamond_weight=<chosen> and the price recalculates from the engine.
    const CARAT_OPTIONS = ["0.50", "0.75", "1.00", "1.25", "1.50", "2.00", "2.50", "3.00"];
    const defaultCarat = String(
      Number(p.centerStoneWeightCt || p.diamondWeightCt || 1).toFixed(2)
    );
    // Snap defaultCarat to the nearest option, or use "1.00" as fallback
    const snapCarat = CARAT_OPTIONS.includes(defaultCarat) ? defaultCarat : "1.00";

    const caratVariants = CARAT_OPTIONS.map((ct) => ({
      id: `synth-carat-${ct.replace(".", "")}`,
      carat: ct,
      variant_product_id: null,
      designno: null,
      size: null,
    }));

    const centerDiamonds = [
      {
        wt: snapCarat,
        center: 1,
        cut: p.diamondCut || "Excellent",
        color: p.diamondColor || "",
        clarity: p.diamondClarity || "",
      },
    ];

    const data = {
      id: p.id,
      product_id: p.id,
      name: p.productName || p.name || "Jewelry",
      title: p.productName || p.name || "Jewelry",
      design_no: p.productCode || p.sku || p.id,
      description: p.longDescription || p.shortDescription || p.description || "",
      sku: p.productCode || p.sku || "",
      slug: p.slug || p.id,

      // Pricing
      price: initPrice,
      mrp: initPrice,
      selling_price: initPrice,
      product_price: initPrice,
      price_on_request: priceOnRequest,

      // Metal info
      metal_type: p.metalType || "Gold",
      metal_purity: p.metalPurity || "18K",
      meta_quality: p.metalPurity || "18K",
      product_color: p.metalColor ? `${p.metalColor} Gold` : "Yellow Gold",
      metal_color: [...new Set([p.metalColor || "Yellow Gold", "White Gold", "Rose Gold"])],
      metal_colors: availableColors.length > 1 ? availableColors : ["YELLOW", "WHITE", "ROSE"],

      // Physical specs
      grossWeightG: Number(p.grossWeightG) || 5,
      gross_weight_g: Number(p.grossWeightG) || 5,
      diamondWeightCt: Number(p.diamondWeightCt) || 0,
      diamond_weight_ct: Number(p.diamondWeightCt) || 0,
      diamond_type: p.diamondType || "Lab Grown Diamond",
      diamond_quality: p.diamondQuality || "F-VS2",

      // Diamond 4Cs + certification (powers the luxury Certification block)
      diamond_cut: p.diamondCut || "Excellent",
      diamond_color: p.diamondColor || "",
      diamond_clarity: p.diamondClarity || "",
      cert_lab: p.diamondCertLab || "",
      cert_number: p.diamondCertNumber || "",
      cert_url: p.diamondCertUrl || "",

      // Enterprise configurator data — multi-metal offering + carat→weight matrix
      // (from product.metadata). When present, the storefront renders the live
      // Configurator (metal type → purity → color, carat) and prices via the engine.
      // Buy-box additions (spec Jul 2026): eyebrow, short desc, admin promo %,
      // manual pairing, and accordion fields.
      collection_name: p.collectionName || null,
      short_description: p.shortDescription || null,
      display_discount_percent: Number(p.metadata?.displayDiscountPercent) || 0,
      pairs_with: Array.isArray(p.metadata?.pairsWith) ? p.metadata.pairsWith : [],
      gender: p.metadata?.gender || null,
      sku: p.productCode || null,
      setting: (Array.isArray(p.metadata?.materials)
        ? p.metadata.materials.find((m) => m?.setting)?.setting
        : null) || null,
      center_diamond_weight_ct: p.centerStoneWeightCt || null,
      metal_options: Array.isArray(p.metadata?.metalOptions) ? p.metadata.metalOptions : [],
      weight_matrix: Array.isArray(p.metadata?.weightMatrix) ? p.metadata.weightMatrix : [],
      is_configurable:
        Array.isArray(p.metadata?.metalOptions) && p.metadata.metalOptions.length > 0,

      // Quality array drives MetalSelector karat picker
      quality: QUALITY_OPTIONS,

      // Category
      category_id: p.categoryId || null,
      category: { id: p.categoryId || null, name: p.category || "Ring" },
      shape: p.diamondShape || "",

      // Gallery media with actual per-color tags from NestJS
      product_image: primaryImage,
      rollover_image: hoverImage,
      media: allMedia,

      // Ring sizes
      sizes: RING_SIZES,
      // Carat weight options for the center stone configurator
      productsizevariant: caratVariants,
      variants: shapeVariants,
      design_group: designGroup,
      has_shape_siblings: designSiblings.length >= 2,
      // center_diamonds drives showSizeSection on the detail page
      diamonds: centerDiamonds,
      center_diamonds: centerDiamonds,
      occasion: null,
      size: "",

      // Stock
      stock: p.currentStock || 999,
      is_available: true,
      is_wishlisted: false,
    };

    return NextResponse.json({ data });
  } catch (e) {
    console.error("productDetail error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
