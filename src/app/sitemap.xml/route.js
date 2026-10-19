// GET /sitemap.xml — static routes + every indexable URL the API knows about
// (live products, populated collections, published facet pages, blog posts).
import { SITE_URL } from "@/config/business";
import { rjApi } from "@/lib/apiHandler";

const STATIC_ROUTES = [
  "/",
  "/product",
  "/customize",
  "/about-us",
  "/craftsmanship",
  "/sustainability",
  "/customer-love",
  "/the-rj-house-standard",
  "/behind-the-brilliance",
  "/diamond-education",
  "/blog",
  "/contact-us",
  "/book-consultancy",
  "/faqs",
  "/shipping",
  "/easy-return",
  "/certification",
  "/lifetime-warranty",
  "/gift-concierge",
  "/ring-size-guide",
  "/jewelry-care",
  "/terms-of-service",
  "/privacy-policy",
];

function xmlEscape(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const toAbsolute = (loc) => {
  const raw = String(loc ?? "").trim();
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${SITE_URL}/${raw.replace(/^\/+/, "")}`;
};

export async function GET() {
  let entries = [];
  try {
    const result = await rjApi("GET", "/seo/sitemap");
    const data = result.raw?.data ?? result.raw;
    if (Array.isArray(data)) entries = data;
  } catch {
    entries = [];
  }

  const all = [
    ...STATIC_ROUTES.map((loc) => ({ loc, priority: loc === "/" ? 1 : 0.7 })),
    ...entries,
  ];
  const seen = new Set();
  const urls = all
    .filter((e) => {
      const key = toAbsolute(e?.loc);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((e) => {
      const loc = xmlEscape(toAbsolute(e?.loc));
      const lastmod = e?.lastmod
        ? `\n    <lastmod>${xmlEscape(new Date(e.lastmod).toISOString())}</lastmod>`
        : "";
      const priority =
        e?.priority != null ? `\n    <priority>${xmlEscape(e.priority)}</priority>` : "";
      return `  <url>\n    <loc>${loc}</loc>${lastmod}${priority}\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
