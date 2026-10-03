import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ship the seeded demo SQLite database inside every traced lambda so the
  // db.ts shim can copy it to /tmp (Vercel FS is read-only outside /tmp).
  outputFileTracingIncludes: {
    "/**": ["./db/custom.db"],
  },
  reactStrictMode: false,
  // Audit P0: live-site nav pointed to /calendar while /events 404'd —
  // keep legacy URLs and bookmarks working.
  async redirects() {
    return [
      { source: "/events", destination: "/calendar", permanent: true },
    ];
  },
  // OCR engines must load from real node_modules so their bundled
  // workers (pdfjs-dist / tesseract) resolve correctly at runtime.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "tesseract.js"],
};

export default nextConfig;
