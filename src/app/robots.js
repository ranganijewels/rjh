const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rangani.example";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/cart", "/api/", "/(auth)"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
