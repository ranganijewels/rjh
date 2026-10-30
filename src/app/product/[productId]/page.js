import { preload } from "react-dom";
import { notFound } from "next/navigation";
import { uploadSrcSet } from "@/lib/imageSizes";
import ProductDetails from "@/commomPages/ProductDetails";
import { buildProductDetail } from "@/app/api/productDetail/[id]/route";
import { buildTokenContext, resolveTokens } from "@/lib/resolveTokens";
import { displayProductName } from "@/lib/productName";

const NEST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT = process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";

// Returned when the API says the product doesn't exist (deleted or never
// existed), as distinct from a fetch failure, so the page can 404.
const NOT_FOUND = Symbol("product-not-found");

// Fetch the product (server-side) for both <title>/meta and JSON-LD.
async function fetchProduct(id) {
  if (!id) return null;
  try {
    const res = await fetch(`${NEST}/api/v1/products/${encodeURIComponent(id)}`, {
      cache: "no-store",
      headers: { "x-tenant-id": TENANT },
    });
    if (res.status === 404) return NOT_FOUND;
    if (!res.ok) return null;
    const j = await res.json();
    return j?.data ?? j ?? null;
  } catch {
    return null;
  }
}

// schema.org Product+Offer JSON-LD from NestJS for this product.
async function fetchProductSchema(id) {
  if (!id) return null;
  try {
    const res = await fetch(`${NEST}/api/v1/seo/schema/product/${encodeURIComponent(id)}`, {
      cache: "no-store",
      headers: { "x-tenant-id": TENANT },
    });
    if (!res.ok) return null;
    const j = await res.json();
    const schema = j?.data ?? j;
    return schema && typeof schema === "object" ? schema : null;
  } catch {
    return null;
  }
}

// Per-product SEO: unique title, description, canonical and OpenGraph image.
export async function generateMetadata({ params }) {
  const { productId } = await params;
  const p = await fetchProduct(productId);
  if (p === NOT_FOUND) notFound();
  if (!p) {
    return { title: "Product", robots: { index: false } };
  }
  // These tags are rendered once server-side per page load for crawlers —
  // there's no live shopper selection here, so any {{token}} in admin/AI
  // authored copy resolves against the product's default/first metal option
  // (mirrors defaultTokenContext() on the backend's seo.service.ts).
  const firstMetal = Array.isArray(p.metadata?.metalOptions) ? p.metadata.metalOptions[0] : null;
  const tokenCtx = buildTokenContext({
    metalType: firstMetal?.type || p.metalType,
    karat: firstMetal?.purities?.[0] || p.metalPurity,
    metalColor: firstMetal?.colors?.[0] || p.metalColor,
    diamondShape: p.diamondShape || p.centerStoneShape,
    diamondWeight: p.diamondWeightCt || p.centerStoneWeightCt,
    diamondClarity: p.diamondClarity || p.diamondQuality,
    diamondColor: p.diamondColor,
  });
  const name = resolveTokens(p.productName || p.name, tokenCtx)?.trim() || displayProductName(p);
  // Admin overrides from the product form's "SEO & Google Shopping" section win.
  const title = resolveTokens(p.seoTitle, tokenCtx) || name;
  const rawDesc = resolveTokens(
    p.seoDescription || p.shortDescription || p.description || p.longDescription || "",
    tokenCtx,
  );
  const description = rawDesc
    ? rawDesc.replace(/\s+/g, " ").trim().slice(0, 160)
    : `${name} by Rangani Jewelry House, set with lab-grown diamonds. Free insured shipping.`;
  // Defensive: keywords should never contain a token (the AI prompt forbids
  // it), but resolve anyway in case one slips through or an admin typed one.
  const keywords = resolveTokens(p.shopifyTags || "", tokenCtx)
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  const image =
    p.metadata?.seo?.ogImage ||
    p.mainImageUrl ||
    p.media?.[0]?.fileUrl ||
    "/logo/rj-house.svg";
  const canonical = `/product/${productId}`;

  return {
    title,
    description,
    ...(keywords.length ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

// The gallery opens on the first yellow-gold still (its default colour), else
// the first still — preload it so the browser fetches the LCP image from the
// server HTML instead of waiting for the client to load product data.
function heroImageUrl(p) {
  const media = (Array.isArray(p?.media) ? p.media : [])
    .filter((m) => m?.fileUrl && !/\.(mp4|webm|mov|m4v)(\?|$)/i.test(m.fileUrl))
    .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
  const yellow = media.find((m) => String(m.metalColor || "").toUpperCase() === "YELLOW");
  return (yellow || media[0])?.fileUrl || p?.mainImageUrl || null;
}

export default async function ProductPage({ params }) {
  const { productId } = await params;
  const [schema, product, detail] = await Promise.all([
    fetchProductSchema(productId),
    fetchProduct(productId),
    buildProductDetail(productId).catch(() => null),
  ]);
  if (product === NOT_FOUND) notFound();
  const hero = heroImageUrl(product);
  // Same candidates + sizes as the gallery <img> (mobile main image and desktop
  // grid), so the browser downloads exactly one copy of the LCP image.
  const heroSrcSet = uploadSrcSet(hero);
  if (hero)
    preload(hero, {
      as: "image",
      fetchPriority: "high",
      ...(heroSrcSet
        ? { imageSrcSet: heroSrcSet, imageSizes: "(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" }
        : {}),
    });

  return (
    <>
      {schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ) : null}
      <ProductDetails initialDetail={detail} />
    </>
  );
}
