/** @type {import('next').NextConfig} */
const nextConfig = {
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
      { protocol: "https", hostname: "therjhouse.com" },
      { protocol: "https", hostname: "dev.therjhouse.com" },
      { protocol: "https", hostname: "api.therjhouse.com" },
    ],
  },
  // trailingSlash: false, // Set true if using static export and want trailing slashes
  // output: 'standalone', // Useful for Docker / custom server setups
};

export default nextConfig;
