"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

/* Facet groups: param key in the search URL → display label.
   Values come from /api/search/facets as [{ value, count }]. */
const FACET_GROUPS = [
  { key: "category", label: "Category" },
  { key: "shape", label: "Shape" },
  { key: "metalType", label: "Metal" },
  { key: "metalColor", label: "Color" },
];

/* Map a facet group key → the property name on the facets payload. */
const FACET_SOURCE = {
  category: "category",
  shape: "shape",
  metalType: "metal",
  metalColor: "color",
};

export default function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";

  const [queryInput, setQueryInput] = useState(q);
  const [facets, setFacets] = useState({ category: [], metal: [], color: [], shape: [] });
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 24, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Keep the search box in sync if q changes via back/forward navigation.
  useEffect(() => {
    setQueryInput(q);
  }, [q]);

  // Active filter values, keyed by facet param.
  const activeFilters = useMemo(() => {
    const f = {};
    for (const g of FACET_GROUPS) f[g.key] = searchParams.get(g.key) || "";
    return f;
  }, [searchParams]);

  // Build a new querystring with one facet toggled (or q replaced).
  const buildQuery = useCallback(
    (overrides) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      for (const g of FACET_GROUPS) {
        if (activeFilters[g.key]) params.set(g.key, activeFilters[g.key]);
      }
      for (const [k, v] of Object.entries(overrides)) {
        if (v === null || v === "") params.delete(k);
        else params.set(k, v);
      }
      return params.toString();
    },
    [q, activeFilters]
  );

  const navigate = useCallback(
    (overrides) => {
      const qs = buildQuery(overrides);
      router.push(`/search${qs ? `?${qs}` : ""}`);
    },
    [buildQuery, router]
  );

  // Toggle a facet on/off.
  const toggleFacet = useCallback(
    (key, value) => {
      const isActive = activeFilters[key] === String(value);
      navigate({ [key]: isActive ? null : value });
    },
    [activeFilters, navigate]
  );

  const submitSearch = useCallback(
    (e) => {
      e.preventDefault();
      navigate({ q: queryInput.trim() || null });
    },
    [navigate, queryInput]
  );

  const clearAll = useCallback(() => {
    router.push(`/search${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  }, [router, q]);

  // Load facets once.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/search/facets", { cache: "no-store" });
        const json = await res.json();
        if (alive) setFacets(json?.data || { category: [], metal: [], color: [], shape: [] });
      } catch {
        if (alive) setFacets({ category: [], metal: [], color: [], shape: [] });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Load products whenever q or filters change.
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(false);

    const params = new URLSearchParams();
    if (q) params.set("q", q);
    for (const g of FACET_GROUPS) {
      if (activeFilters[g.key]) params.set(g.key, activeFilters[g.key]);
    }
    params.set("page", "1");
    params.set("limit", "24");

    (async () => {
      try {
        const res = await fetch(`/api/search?${params}`, { cache: "no-store" });
        const json = await res.json();
        if (!alive) return;
        const items = Array.isArray(json?.data) ? json.data : [];
        setProducts(items);
        setMeta(json?.meta || { page: 1, limit: 24, total: 0, totalPages: 1 });
        if (q) import("@/lib/analytics").then((m) => m.trackSearch(q, json?.meta?.total ?? items.length)).catch(() => {});
      } catch {
        if (alive) {
          setProducts([]);
          setError(true);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [q, activeFilters]);

  const hasActiveFilters = FACET_GROUPS.some((g) => activeFilters[g.key]);
  const resultCount = meta?.total ?? products.length;

  return (
    <div
      style={{
        maxWidth: 1320,
        margin: "0 auto",
        padding: "32px 20px 64px",
        fontFamily: "var(--font-montserrat)",
      }}
    >
      {/* Header: search box + heading */}
      <header style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: 38,
            fontWeight: 600,
            color: "var(--teal-1)",
            margin: "0 0 14px",
            letterSpacing: "0.01em",
          }}
        >
          {q ? `Results for “${q}”` : "Search Our Collection"}
        </h1>

        <form onSubmit={submitSearch} style={{ display: "flex", gap: 10, maxWidth: 560 }}>
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Search rings, necklaces, diamonds…"
            aria-label="Search products by name, type, or material"
            style={{
              flex: 1,
              padding: "11px 16px",
              border: "1px solid var(--teal-3)",
              borderRadius: 4,
              fontSize: 14,
              color: "var(--grey-2)",
              background: "var(--background)",
            }}
          />
          <button
            type="submit"
            disabled={!queryInput.trim()}
            className="search-submit-btn"
            style={{
              padding: "11px 24px",
              background: "var(--teal-1)",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              opacity: queryInput.trim() ? 1 : 0.5,
              cursor: queryInput.trim() ? "pointer" : "not-allowed",
            }}
          >
            Search
          </button>
        </form>

        <p style={{ margin: "14px 0 0", fontSize: 13, color: "var(--placeholder)" }}>
          {loading
            ? "Searching…"
            : `${resultCount} ${resultCount === 1 ? "result" : "results"}${
                q ? "" : " found"
              }`}
        </p>
      </header>

      <div className="search-layout" style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* ── Facet sidebar ───────────────────────────────────────── */}
        <aside
          className="search-aside"
          style={{
            width: 240,
            flexShrink: 0,
            position: "sticky",
            top: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: 22,
                fontWeight: 600,
                color: "var(--teal-1)",
              }}
            >
              Filters
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                disabled={loading}
                className="clear-all-btn"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--teal-2)",
                  fontSize: 12,
                  textDecoration: "underline",
                  padding: 0,
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                Clear all
              </button>
            )}
          </div>

          {FACET_GROUPS.map((group) => {
            const items = facets[FACET_SOURCE[group.key]] || [];
            if (!items.length) return null;
            return (
              <section key={group.key} style={{ marginBottom: 24 }}>
                <h3
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--teal-1)",
                    margin: "0 0 10px",
                    paddingBottom: 8,
                    borderBottom: "1px solid var(--teal-3)",
                  }}
                >
                  {group.label}
                </h3>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {items.map((item) => {
                    const value = String(item?.value ?? "");
                    if (!value) return null;
                    const checked = activeFilters[group.key] === value;
                    return (
                      <li key={`${group.key}-${value}`} style={{ marginBottom: 6 }}>
                        <button
                          onClick={() => toggleFacet(group.key, value)}
                          role="checkbox"
                          aria-checked={checked}
                          className="facet-btn"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 9,
                            width: "100%",
                            background: "none",
                            border: "none",
                            padding: "3px 0",
                            textAlign: "left",
                            fontSize: 13,
                            color: checked ? "var(--teal-1)" : "var(--grey-2)",
                            fontWeight: checked ? 600 : 400,
                            borderRadius: 3,
                          }}
                        >
                          <span
                            aria-hidden
                            style={{
                              width: 15,
                              height: 15,
                              borderRadius: 3,
                              border: `1px solid ${checked ? "var(--teal-1)" : "var(--teal-3)"}`,
                              background: checked ? "var(--teal-1)" : "var(--background)",
                              flexShrink: 0,
                              display: "grid",
                              placeItems: "center",
                              color: "#fff",
                              fontSize: 10,
                              lineHeight: 1,
                            }}
                          >
                            {checked ? "✓" : ""}
                          </span>
                          <span style={{ flex: 1 }}>{value}</span>
                          {item?.count != null && (
                            <span style={{ color: "var(--placeholder)", fontSize: 12 }}>
                              {item.count}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}

          {!loading &&
            FACET_GROUPS.every((g) => !(facets[FACET_SOURCE[g.key]] || []).length) && (
              <p style={{ fontSize: 13, color: "var(--placeholder)" }}>No filters available.</p>
            )}
        </aside>

        {/* ── Product grid ────────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {!q && loading ? (
            <div style={{ padding: "48px 0", textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: 26,
                  color: "var(--teal-1)",
                  marginBottom: 8,
                }}
              >
                Start typing to search our collection
              </p>
              <p style={{ color: "var(--placeholder)", fontSize: 14, marginBottom: 20 }}>
                Or explore a popular starting point below.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  justifyContent: "center",
                }}
              >
                {[
                  { label: "Engagement Rings", href: "/product?collection=Engagement" },
                  { label: "Wedding Bands", href: "/product?collection=Wedding" },
                  { label: "All Jewelry", href: "/product" },
                  { label: "Round Diamonds", href: "/product?shape=Round" },
                  { label: "Design Your Own", href: "/customize" },
                ].map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="popular-link"
                    style={{
                      padding: "9px 18px",
                      border: "1px solid var(--teal-3)",
                      borderRadius: 999,
                      fontSize: 13,
                      color: "var(--teal-1)",
                      textDecoration: "none",
                      background: "var(--background)",
                    }}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 24,
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div
                    style={{
                      aspectRatio: "1 / 1",
                      background: "var(--grey-0)",
                      borderRadius: 6,
                      marginBottom: 10,
                    }}
                  />
                  <div
                    style={{
                      height: 12,
                      width: "75%",
                      background: "var(--grey-0)",
                      borderRadius: 3,
                    }}
                  />
                </div>
              ))}
            </div>
          ) : error ? (
            <div style={{ padding: "60px 0", textAlign: "center" }}>
              <p style={{ color: "var(--grey-2)", marginBottom: 6 }}>
                We&rsquo;re having trouble searching right now.
              </p>
              <p style={{ color: "var(--placeholder)", fontSize: 13, marginBottom: 16 }}>
                Please check your connection and try again.
              </p>
              <button
                onClick={() => navigate({})}
                className="search-submit-btn"
                style={{
                  padding: "10px 22px",
                  background: "var(--teal-1)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: "48px 0", textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: 26,
                  color: "var(--teal-1)",
                  marginBottom: 8,
                }}
              >
                No matching pieces{q ? ` for “${q}”` : ""}
              </p>
              <p style={{ color: "var(--placeholder)", fontSize: 14, marginBottom: 8 }}>
                Try a different search term{hasActiveFilters ? " or clear your filters" : ""}.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAll}
                  className="search-submit-btn"
                  style={{
                    marginTop: 8,
                    padding: "10px 22px",
                    background: "var(--teal-1)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Clear filters
                </button>
              )}

              {/* Popular starting points so the search never dead-ends */}
              <div style={{ marginTop: 40 }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--teal-1)",
                    marginBottom: 14,
                  }}
                >
                  Popular right now
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 10,
                    justifyContent: "center",
                  }}
                >
                  {[
                    { label: "Engagement Rings", href: "/product?collection=Engagement" },
                    { label: "Wedding Bands", href: "/product?collection=Wedding" },
                    { label: "All Jewelry", href: "/product" },
                    { label: "Round Diamonds", href: "/product?shape=Round" },
                    { label: "Design Your Own", href: "/customize" },
                  ].map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="popular-link"
                      style={{
                        padding: "9px 18px",
                        border: "1px solid var(--teal-3)",
                        borderRadius: 999,
                        fontSize: 13,
                        color: "var(--teal-1)",
                        textDecoration: "none",
                        background: "var(--background)",
                      }}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 24,
              }}
            >
              {products.map((p) => (
                <ProductCard key={p.id || p.product_id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .search-submit-btn:hover:not(:disabled) {
          opacity: 0.9;
        }
        .search-submit-btn:active:not(:disabled) {
          opacity: 0.85;
        }
        .clear-all-btn:hover:not(:disabled) {
          opacity: 0.75;
        }
        .facet-btn:hover {
          background-color: var(--grey-0);
        }
        .popular-link:hover {
          background-color: var(--grey-0);
        }
        @media (max-width: 768px) {
          .search-layout {
            flex-direction: column;
          }
          .search-aside {
            width: 100% !important;
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}

function ProductCard({ product }) {
  const id = product?.id || product?.product_id;
  const name = product?.title || product?.productName || product?.name || "Jewelry";
  const img =
    product?.product_image ||
    product?.mainImageUrl ||
    product?.media?.[0]?.fileUrl ||
    product?.media?.[0]?.url ||
    "";
  const price = product?.product_price || product?.selling_price || 0;

  return (
    <Link
      href={`/product/${id}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <div
        style={{
          aspectRatio: "1 / 1",
          background: "var(--product-bg)",
          borderRadius: 6,
          overflow: "hidden",
          marginBottom: 10,
          position: "relative",
          border: "1px solid var(--grey-0)",
        }}
      >
        {img ? (
          // Raw <img> intentional: product images are served from external/CMS
          // hosts not registered in next.config.js remotePatterns, matching the
          // established pattern in ui/Cards/ProductCard.jsx.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={name}
            loading="lazy"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              color: "var(--placeholder)",
              fontSize: 12,
            }}
          >
            No image
          </div>
        )}
      </div>
      <h3
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: 17,
          fontWeight: 600,
          color: "var(--teal-1)",
          margin: "0 0 4px",
          lineHeight: 1.3,
        }}
      >
        {name}
      </h3>
      <p style={{ margin: 0, fontSize: 13, color: "var(--grey-2)" }}>
        {price > 0 ? `$${Number(price).toLocaleString("en-US")}` : "Price on request"}
      </p>
    </Link>
  );
}
