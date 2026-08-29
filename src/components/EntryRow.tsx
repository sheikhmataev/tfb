import Image from "next/image";
import Link from "next/link";
import { S } from "@/lib/strings";
import { withBase } from "@/lib/site";
import { formatDate } from "@/lib/i18n";
import { entrySortKey } from "@/lib/content";
import type { Entry, Locale } from "@/lib/types";

/**
 * Provenance is plain unlinked text here, so the row stays a single link
 * target with nothing nested inside it. The outbound link to the original
 * post lives on the article page, in the sources block.
 */
function Provenance({ entry, locale }: { entry: Entry; locale: Locale }) {
  if (!entry.sourcePlatform || !entry.sourceFetchedAt) return null;
  const label =
    entry.sourcePlatform === "facebook"
      ? S.entries.fromFacebook[locale]
      : S.entries.fromInstagram[locale];
  return (
    <span className="mt-1 block text-sm text-ink-soft">
      {label}, {formatDate(entry.sourceFetchedAt, locale)}
    </span>
  );
}

export function EntryLead({ entry, locale }: { entry: Entry; locale: Locale }) {
  const th = locale === "th" ? "th" : undefined;
  return (
    <article>
      <Link href={`/${locale}/articles/${entry.slug}`} className="group grid gap-x-10 gap-y-5 no-underline md:grid-cols-12">
        {entry.leadImage && (
          <div className="petal-mask relative aspect-[3/2] bg-petal md:col-span-5">
            <Image
              src={withBase(`/assets/${entry.leadImage}`)}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition-transform duration-[400ms] group-hover:scale-[1.02]"
            />
          </div>
        )}
        <div className={entry.leadImage ? "md:col-span-6 md:col-start-7" : "md:col-span-8"}>
          <p className="text-sm text-ink-soft">{formatDate(entrySortKey(entry), locale)}</p>
          <h3 lang={th} className="display mt-1 text-2xl leading-tight text-ink group-hover:underline">
            {entry.title[locale]}
          </h3>
          <p lang={th} className="mt-2 max-w-[58ch] text-ink-soft">
            {entry.summary[locale]}
          </p>
          <Provenance entry={entry} locale={locale} />
        </div>
      </Link>
    </article>
  );
}

export function EntryRow({ entry, locale }: { entry: Entry; locale: Locale }) {
  const th = locale === "th" ? "th" : undefined;
  return (
    <li className="border-t border-rule">
      <Link
        href={`/${locale}/articles/${entry.slug}`}
        className="group grid min-h-11 items-start gap-x-5 gap-y-1 py-4 no-underline sm:grid-cols-[4rem_1fr]"
      >
        <span className="relative hidden aspect-square w-16 bg-petal sm:block">
          {entry.leadImage && (
            <Image
              src={withBase(`/assets/${entry.leadImage}`)}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          )}
        </span>
        <span>
          <span className="block text-sm text-ink-soft">
            {formatDate(entrySortKey(entry), locale)}
          </span>
          <span lang={th} className="display mt-0.5 block text-lg leading-snug text-ink group-hover:underline">
            {entry.title[locale]}
          </span>
          <Provenance entry={entry} locale={locale} />
        </span>
      </Link>
    </li>
  );
}
