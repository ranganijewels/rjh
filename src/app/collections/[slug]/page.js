import Link from "next/link";
import { headers } from "next/headers";
import HeroSection from "@/components/common/HeroSection";
import { heroFromCms, heroHasContent } from "@/lib/cmsHero";
import Typography from "@/components/ui/Typography/Typography";
import Button from "@/components/ui/Button/Button";

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

// Resolve a SeoPage for the slug. Prefer the same-origin proxy; fall back to NestJS.
async function resolvePage(slug) {
  // Try same-origin proxy first (so it works the same as the browser path).
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    const proto = h.get("x-forwarded-proto") || "http";
    if (host) {
      const res = await fetch(
        `${proto}://${host}/api/seo/resolve?slug=${encodeURIComponent(slug)}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const j = await res.json();
        if (j?.data) return j.data;
      }
    }
  } catch {
    /* fall through to direct NestJS */
  }

  // Direct NestJS fallback.
  try {
    const res = await fetch(
      `${NEST}/api/v1/seo/resolve?slug=${encodeURIComponent(slug)}`,
      { cache: "no-store", headers: { "x-tenant-id": TENANT } }
    );
    if (res.ok) {
      const j = await res.json();
      return j?.data ?? j ?? null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

// Parse simple shape / carat hints out of the slug for the product search.
function hintsFromSlug(slug) {
  const s = String(slug || "").toLowerCase();
  const shapes = ["round", "oval", "pear", "cushion", "emerald", "princess", "marquise", "radiant", "asscher", "heart"];
  const shape = shapes.find((sh) => s.includes(sh));
  const caratMatch = s.match(/(\d+(?:\.\d+)?)\s*-?\s*(?:ct|carat)/);
  return {
    shape: shape ? shape.charAt(0).toUpperCase() + shape.slice(1) : null,
    carat: caratMatch ? caratMatch[1] : null,
  };
}

// Fetch products for the grid via NestJS /search/products (with slug hints),
// falling back to recent active products.
async function fetchProducts(slug) {
  const { shape, carat } = hintsFromSlug(slug);
  const params = new URLSearchParams({ limit: "12", status: "active" });
  if (shape) params.set("diamondShape", shape);
  if (carat) params.set("carat", carat);

  const tryFetch = async (qs) => {
    try {
      const res = await fetch(`${NEST}/api/v1/search/products?${qs}`, {
        cache: "no-store",
        headers: { "x-tenant-id": TENANT },
      });
      if (!res.ok) return null;
      const j = await res.json();
      const data = j?.data ?? j;
      return Array.isArray(data) ? data : null;
    } catch {
      return null;
    }
  };

  // First with hints, then unfiltered fallback.
  let list = await tryFetch(params.toString());
  if (!list || list.length === 0) {
    list = await tryFetch(new URLSearchParams({ limit: "12", status: "active" }).toString());
  }
  return list || [];
}

function productCardFields(p) {
  const id = p?.id || p?.product_id || p?.productId;
  const title = p?.productName || p?.name || p?.title || "Jewelry";
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
  const page = await resolvePage(slug);
  if (!page) {
    return { title: "Collection not found", robots: { index: false } };
  }
  return {
    title: page.metaTitle || page.h1 || "Collection",
    description: page.metaDescription || undefined,
    alternates: page.canonicalTo ? { canonical: page.canonicalTo } : undefined,
    robots: page.indexable === false ? { index: false } : undefined,
  };
}

// ─── page ──────────────────────────────────────────────────────────────────

export default async function CollectionPage({ params }) {
  const { slug } = await params;
  const page = await resolvePage(slug);

  if (!page) {
    return (
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
        <Typography as="h1" variant="h2" textColor="teal" className="!text-center">
          Collection not found
        </Typography>
        <Typography as="p" variant="p" textColor="customGrey" className="!text-center block mt-4">
          We couldn&apos;t find the collection you were looking for. It may have moved or no longer exists.
        </Typography>
        <div className="mt-7 flex justify-center">
          <Button title="Browse all jewelry" url="/product" variant="outlineTeal" />
        </div>
      </main>
    );
  }

  const products = await fetchProducts(slug);
  const hero = await fetchCollectionHero();

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
      </header>

      {products.length === 0 ? (
        <Typography
          as="p"
          variant="p"
          textColor="customGrey"
          className="!text-center block py-12"
        >
          No products available in this collection right now.
        </Typography>
      ) : (
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
                      src={image}
                      alt={title}
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
      )}
      </main>
    </>
  );
}
