import path from "node:path";
import type { NextConfig } from "next";

// GitHub Pages serves this repo from /tfb. Empty for a root deployment or a
// custom domain; the workflow sets it.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  turbopack: { root: path.dirname(new URL(import.meta.url).pathname) },
  trailingSlash: true,
  images: { unoptimized: true },
  // Static export ships plain HTML to Cloudflare Pages; there is no Node runtime
  // at request time, so every route must be statically known at build.
};

export default nextConfig;
