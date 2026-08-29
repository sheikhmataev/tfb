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

/**
 * The date the site was built, used to place entries in Coming up or Recently.
 * A static export has no request-time clock, so this is stamped at build. The
 * Cloudflare cron that rolls expired events into the past is what keeps it
 * accurate between deploys.
 */
export const BUILD_DATE: string =
  process.env.NEXT_PUBLIC_BUILD_DATE ?? new Date().toISOString().slice(0, 10);
