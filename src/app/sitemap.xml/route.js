// GET /sitemap.xml — real XML <urlset> built from the same-origin sitemap proxy.
const SITE = "https://rangani.example";

function xmlEscape(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Build an absolute loc from a sitemap entry's `loc` (slug or path or full URL).
function toAbsolute(loc) {
  const raw = String(loc ?? "").trim();
  if (!raw) return SITE + "/";
  if (/^https?:\/\//i.test(raw)) return raw;
  return SITE + "/" + raw.replace(/^\/+/, "");
}

export async function GET(req) {
  let entries = [];
  try {
    const origin = new URL(req.url).origin;
    const res = await fetch(`${origin}/api/seo/sitemap`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json)) entries = json;
    }
  } catch {
    entries = [];
  }

  const urls = entries
    .map((e) => {
      const loc = xmlEscape(toAbsolute(e?.loc));
      const lastmod = e?.lastmod ? `\n    <lastmod>${xmlEscape(e.lastmod)}</lastmod>` : "";
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
