import Image from "next/image";
import Link from "next/link";
import { S } from "@/lib/strings";
import { withBase } from "@/lib/site";
import { formatDate } from "@/lib/i18n";
import { entrySortKey } from "@/lib/content";
import { DateRail } from "./DateRail";
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
      <Link
        href={`/${locale}/articles/${entry.slug}`}
        className="group grid gap-x-8 gap-y-5 border-t-2 border-ink pt-6 no-underline md:grid-cols-[7rem_1fr_auto]"
      >
        <DateRail iso={entrySortKey(entry)} locale={locale} large />
        <div>
          <h3 lang={th} className="display text-[clamp(1.5rem,2.6vw,2rem)] leading-tight text-ink group-hover:underline">
            {entry.title[locale]}
          </h3>
          <p lang={th} className="mt-2 max-w-[54ch] text-ink-soft">
            {entry.summary[locale]}
          </p>
          <Provenance entry={entry} locale={locale} />
        </div>
        {/* The mask reads as a considered shape only on a square container. On
            a landscape crop the two rounded corners go wildly asymmetric and it
            looks like an accident, so wide images stay rectangular. */}
        {entry.leadImage && (
          <div className="petal-mask relative aspect-square w-full bg-petal md:w-64">
            <Image
              src={withBase(`/assets/${entry.leadImage}`)}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 16rem"
              className="object-cover transition-transform duration-[400ms] group-hover:scale-[1.02]"
            />
          </div>
        )}
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
        className="group grid min-h-11 items-baseline gap-x-8 gap-y-1 py-4 no-underline sm:grid-cols-[7rem_1fr]"
      >
        <DateRail iso={entrySortKey(entry)} locale={locale} />
        <span>
          <span lang={th} className="display block text-lg leading-snug text-ink group-hover:underline">
            {entry.title[locale]}
          </span>
          <Provenance entry={entry} locale={locale} />
        </span>
      </Link>
    </li>
  );
}
