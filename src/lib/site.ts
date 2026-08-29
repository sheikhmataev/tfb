/**
 * Deployment-dependent values, kept out of the components.
 *
 * GitHub Pages serves this repo from a subpath (/tfb), so every absolute URL
 * written by hand needs the prefix. next/link, next/image and next/font apply
 * basePath themselves; raw href, meta and hreflang values do not.
 *
 * Set NEXT_PUBLIC_BASE_PATH="" for a custom domain or a root deployment.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sheikhmataev.github.io/tfb";

/** Prefix a site-absolute path with the base path. */
export function withBase(path: string): string {
  return `${BASE_PATH}${path}`;
}
