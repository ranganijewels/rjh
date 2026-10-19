/** @type {import('next').NextConfig} */
const nextConfig = {
  // Zero-downtime deploys: each build goes to its own release folder (set by
  // /root/deploy.sh); the live process keeps reading its previous folder.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: false,
  images: {
    // Product/CMS media is served from the NestJS API host (localhost:4000 in dev,
    // the API domain in prod). `unoptimized` renders <Image> as a plain <img>
    // (no optimizer, no host check) — product images were plain <img> before, so
    // nothing is lost — and the remotePatterns below are a belt-and-suspenders
    // allow-list so the host check passes even where optimization is forced on.
    unoptimized: true,
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "4000" },
      { protocol: "http", hostname: "localhost", port: "3000" },
      { protocol: "https", hostname: "api.ranganijewelry.com" },
      { protocol: "https", hostname: "www.ranganijewelry.com" },
    ],
  },
  // Retired / duplicate URLs → their single canonical route.
  async redirects() {
    return [
      { source: "/static-page/30-day-return-policy", destination: "/easy-return", permanent: true },
      { source: "/static-page/returns-policy", destination: "/easy-return", permanent: true },
      { source: "/30-day-return-policy", destination: "/easy-return", permanent: true },
      { source: "/returns", destination: "/easy-return", permanent: true },
      { source: "/static-page/free-shipping", destination: "/shipping", permanent: true },
      { source: "/static-page/lifetime-warranty", destination: "/lifetime-warranty", permanent: true },
      { source: "/static-page/certification", destination: "/certification", permanent: true },
      { source: "/static-page/gift-concierge", destination: "/gift-concierge", permanent: true },
      { source: "/blogs", destination: "/blog", permanent: true },
      { source: "/blog-detail", destination: "/blog", permanent: true },
      { source: "/blog-detail-style", destination: "/blog", permanent: true },
      { source: "/blog/jewelry-care", destination: "/jewelry-care", permanent: true },
      { source: "/blog/diamond-selection-guide", destination: "/diamond-education", permanent: true },
      { source: "/blog/lab-grown-diamonds-info", destination: "/diamond-education", permanent: true },
      { source: "/blog/metal-setting-options", destination: "/diamond-education", permanent: true },
      { source: "/blog/behind-the-craft", destination: "/craftsmanship", permanent: true },
      { source: "/blogs/:slug", destination: "/blog/:slug", permanent: true },
      { source: "/free-resizing", destination: "/lifetime-warranty", permanent: true },
      { source: "/faq", destination: "/faqs", permanent: true },
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/terms", destination: "/terms-of-service", permanent: true },
      { source: "/collection/:slug", destination: "/collections/:slug", permanent: true },
    ];
  },
  // trailingSlash: false, // Set true if using static export and want trailing slashes
  // output: 'standalone', // Useful for Docker / custom server setups
};

export default nextConfig;
