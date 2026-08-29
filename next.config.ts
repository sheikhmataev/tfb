import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  turbopack: { root: path.dirname(new URL(import.meta.url).pathname) },
  trailingSlash: true,
  images: { unoptimized: true },
  // Static export ships plain HTML to Cloudflare Pages; there is no Node runtime
  // at request time, so every route must be statically known at build.
};

export default nextConfig;
