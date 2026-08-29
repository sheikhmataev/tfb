import Link from "next/link";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/types";
import { LOCALE_LABELS } from "@/lib/i18n";
import { S } from "@/lib/strings";
import { withBase } from "@/lib/site";

/**
 * A static export has no server at request time, so redirect() cannot run here.
 * Cloudflare Pages sends / to /en/ at the edge via public/_redirects; this is
 * the fallback when that rule is not in play, and it needs no JS.
 */
export default function RootIndex() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${withBase(`/${DEFAULT_LOCALE}/`)}`} />
      <main className="flex min-h-screen items-center justify-center p-8">
        <div>
          <p className="display mb-5 text-xl">{S.siteName.en}</p>
          <nav aria-label={S.language.en} className="flex gap-6">
            {LOCALES.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                hrefLang={l}
                lang={l === "th" ? "th" : undefined}
                className="text-lotus-deep underline-offset-4"
              >
                {LOCALE_LABELS[l]}
              </Link>
            ))}
          </nav>
        </div>
      </main>
    </>
  );
}
