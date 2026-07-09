import ProductDetails from "@/commomPages/ProductDetails";

const NEST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT = process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";

// Fetch the product (server-side) for both <title>/meta and JSON-LD.
async function fetchProduct(id) {
  if (!id) return null;
  try {
    const res = await fetch(`${NEST}/api/v1/products/${encodeURIComponent(id)}`, {
      cache: "no-store",
      headers: { "x-tenant-id": TENANT },
    });
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
  if (!p) {
    return { title: "Product", robots: { index: false } };
  }
  const name = p.productName || p.name || "Fine Jewelry";
  // Admin overrides from the product form's "SEO & Google Shopping" section win.
  const title = p.seoTitle || name;
  const rawDesc =
    p.seoDescription || p.shortDescription || p.description || p.longDescription || "";
  const description = rawDesc
    ? rawDesc.replace(/\s+/g, " ").trim().slice(0, 160)
    : `${name} — certified lab grown diamond jewelry, ethically crafted by Rangani Jewelry House. Free insured shipping & lifetime warranty.`;
  const keywords = (p.shopifyTags || "")
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

export default async function ProductPage({ params }) {
  const { productId } = await params;
  const schema = await fetchProductSchema(productId);

  return (
    <>
      {schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ) : null}
      <ProductDetails />
    </>
  );
}
