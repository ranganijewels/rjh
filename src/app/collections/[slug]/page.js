import Link from "next/link";
import { notFound } from "next/navigation";
import HeroSection from "@/components/common/HeroSection";
import { heroFromCms, heroHasContent } from "@/lib/cmsHero";
import Typography from "@/components/ui/Typography/Typography";
import { responsiveImg } from "@/lib/imageSizes";

const NEST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT = process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";

// CMS banner for the Collections pages (edited in CMS → Banners & Hero → Collections).
async function fetchCollectionHero() {
  try {
    const res = await fetch(`${NEST}/api/v1/cms/sections?pageSlug=collections`, {
      cache: "no-store",
      headers: { "x-tenant-id": TENANT },
    });
    if (!res.ok) return null;
    const j = await res.json();
    const sections = j?.data || [];
    const hero = sections.find((s) => s.sectionKey === "hero-banner" || s.sectionKey === "hero")?.content;
    if (!hero) return null;
    const h = heroFromCms(hero);
    return heroHasContent(h) ? h : null;
  } catch {
    return null;
  }
}

// ─── data ──────────────────────────────────────────────────────────────────

// Resolve a published SEO landing page (+ its matching products) for the slug.
async function resolvePage(slug) {
  try {
    const res = await fetch(
      `${NEST}/api/v1/seo/resolve?slug=${encodeURIComponent(slug)}`,
      { cache: "no-store", headers: { "x-tenant-id": TENANT } }
    );
    if (!res.ok) return null;
    const j = await res.json();
    const data = j?.data ?? j ?? null;
    return data?.kind === "page" ? data : null;
  } catch {
    return null;
  }
}

// Published, indexable engagement facet pages — used as "shop by shape" links.
async function fetchFacetLinks() {
  try {
    const res = await fetch(`${NEST}/api/v1/seo/pages?status=published`, {
      next: { revalidate: 300 },
      headers: { "x-tenant-id": TENANT },
    });
    if (!res.ok) return [];
    const j = await res.json();
    const rows = Array.isArray(j?.data) ? j.data : Array.isArray(j) ? j : [];
    return rows
      .filter((p) => p.indexable && p.type === "facet")
      .map((p) => ({ slug: p.urlSlug, label: p.h1 || p.metaTitle || p.urlSlug }))
      .sort((a, b) => a.label.localeCompare(b.label));
  } catch {
    return [];
  }
}

// Admin-managed Collection (Dashboard → Product Management → Collections):
// name/description/banner + explicitly assigned products, resolved by slug.
// Takes priority over the generic SEO-page flow below.
async function fetchCollection(slug) {
  try {
    const res = await fetch(
      `${NEST}/api/v1/collections/slug/${encodeURIComponent(slug)}`,
      { cache: "no-store", headers: { "x-tenant-id": TENANT } }
    );
    if (!res.ok) return null;
    const j = await res.json();
    return j?.data ?? j ?? null;
  } catch {
    return null;
  }
}

function productCardFields(p) {
  const id = p?.id || p?.product_id || p?.productId;
  const title = p?.productName || p?.name || p?.title || "";
  const media = Array.isArray(p?.media) ? p.media : [];
  const image =
    p?.mainImageUrl ||
    p?.product_image ||
    media[0]?.fileUrl ||
    media[0]?.url ||
    "";
  return { id, title, image };
}

// ─── metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const collection = await fetchCollection(slug);
  if (collection?.name) {
    return {
      title: collection.name,
      description: collection.description || undefined,
      alternates: { canonical: `/collections/${collection.slug || slug}` },
    };
  }
  const resolved = await resolvePage(slug);
  const page = resolved?.page;
  if (!page || !resolved.products?.length) {
    return { title: "Collection not found", robots: { index: false } };
  }
  return {
    // Facet meta titles already end with the brand — don't let the layout's
    // "%s | Rangani Jewelry House" template add it twice.
    title: /rangani/i.test(page.metaTitle || "")
      ? { absolute: page.metaTitle }
      : page.metaTitle || page.h1 || "Collection",
    description: page.metaDescription || undefined,
    alternates: { canonical: page.canonicalTo?.trim() || `/collections/${page.urlSlug}` },
    robots: page.indexable === false ? { index: false } : undefined,
  };
}

// ─── page ──────────────────────────────────────────────────────────────────

export default async function CollectionPage({ params }) {
  const { slug } = await params;
  // Real admin-managed collection first; generic SEO page as fallback.
  const collection = await fetchCollection(slug);
  const resolved = collection ? null : await resolvePage(slug);
  const page = collection
    ? { h1: collection.name, introMd: collection.description || "" }
    : resolved?.page;
  const products = collection ? collection.products || [] : resolved?.products || [];

  // Unknown slug, or a collection / facet with nothing a shopper can buy.
  if (!page || products.length === 0) notFound();

  const isEngagement = /engagement/i.test(`${slug} ${page.h1 || ""}`);
  const facetLinks = isEngagement
    ? (await fetchFacetLinks()).filter((f) => f.slug !== slug)
    : [];

  // The collection's own banner wins; the CMS "Collections" hero image is the
  // fallback, but its generic copy is replaced by this collection's own so an
  // engagement page never opens with earrings/necklaces copy.
  const cmsHero = collection?.heroImage ? null : await fetchCollectionHero();
  const hero = collection?.heroImage
    ? { title: collection.name, description: collection.description, file: collection.heroImage }
    : cmsHero
      ? { ...cmsHero, title: page.h1, description: "", buttons: [] }
      : null;

  return (
    <>
      {hero && (
        <HeroSection
          title={hero.title || page.h1 || "Collection"}
          description={hero.description}
          buttons={hero.buttons}
          backgroundUrl={hero.file}
          mobileFile={hero.mobileFile}
          containerClass="!h-[475px]"
          imageClass="!h-[475px]"
        />
      )}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 96px" }}>
      <header style={{ textAlign: "center", marginBottom: 48, borderBottom: "1px solid var(--teal-3)", paddingBottom: 32 }}>
        <Typography as="h1" variant="h1" textColor="teal" className="!text-center">
          {page.h1 || page.metaTitle || "Collection"}
        </Typography>
        {page.introMd ? (
          <Typography
            as="p"
            variant="p"
            textColor="grey"
            className="!text-center block max-w-[720px] mx-auto mt-5 !leading-[1.7]"
          >
            {page.introMd}
          </Typography>
        ) : null}
        {isEngagement && (
          <nav aria-label="Browse engagement rings" className="mt-6 flex flex-wrap justify-center gap-2">
            {facetLinks.slice(0, 12).map((f) => (
              <Link
                key={f.slug}
                href={`/collections/${f.slug}`}
                className="rounded-full border border-[var(--teal-3)] px-3 py-1 text-[13px] text-[var(--teal-1)] hover:bg-[var(--teal-1)] hover:text-white"
              >
                {f.label}
              </Link>
            ))}
            <Link
              href="/ring-size-guide"
              className="rounded-full border border-[var(--teal-3)] px-3 py-1 text-[13px] text-[var(--teal-1)] hover:bg-[var(--teal-1)] hover:text-white"
            >
              Ring size guide
            </Link>
          </nav>
        )}
      </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 28,
          }}
        >
          {products.map((p, i) => {
            const { id, title, image } = productCardFields(p);
            return (
              <Link
                key={id || i}
                href={`/product/${id}`}
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    aspectRatio: "1 / 1",
                    background: "var(--grey-0)",
                    overflow: "hidden",
                    marginBottom: 12,
                  }}
                >
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      {...responsiveImg(image, "(min-width: 1024px) 25vw, 50vw")}
                      src={image}
                      alt={title}
                      loading={i < 4 ? "eager" : "lazy"}
                      decoding="async"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : null}
                </div>
                <Typography as="h2" variant="h3" textColor="teal">
                  {title}
                </Typography>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
