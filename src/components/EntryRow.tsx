import Image from "next/image";
import Link from "next/link";
import { S } from "@/lib/strings";
import { withBase } from "@/lib/site";
import { formatDate } from "@/lib/i18n";
import { entrySortKey } from "@/lib/content";
import { DateRail } from "./DateRail";
import type { Entry, Locale } from "@/lib/types";

/**
 * Provenance is plain unlinked text. The outbound link to the original post
 * lives on the article page, in the sources block.
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

/**
 * Only the title is the link. Wrapping the whole row meant a screen reader
 * announced one link target of "6 Sept 2014 Visit from the ambassador and
 * consul", and on the lead the summary was read into the link name too. The
 * date and the summary are now plain text beside the link, and the hit box
 * keeps its 44px height through symmetric padding that a matching negative
 * margin cancels, so the printed rhythm is unchanged.
 */
export function EntryLead({ entry, locale }: { entry: Entry; locale: Locale }) {
  const th = locale === "th" ? "th" : undefined;
  return (
    <article className="grid gap-x-8 gap-y-5 border-t-2 border-ink pt-6 md:grid-cols-[7rem_1fr_auto]">
      <DateRail iso={entrySortKey(entry)} locale={locale} large />
      <div>
        <h3 lang={th} className="display text-[clamp(1.5rem,2.6vw,2rem)] leading-tight text-ink">
          <Link
            href={`/${locale}/articles/${entry.slug}`}
            className="-my-2 inline-block py-2 text-ink no-underline hover:underline"
          >
            {entry.title[locale]}
          </Link>
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
            className="object-cover"
          />
        </div>
      )}
    </article>
  );
}

export function EntryRow({ entry, locale }: { entry: Entry; locale: Locale }) {
  const th = locale === "th" ? "th" : undefined;
  return (
    <li className="border-t border-rule">
      <div className="grid items-baseline gap-x-8 gap-y-1 py-4 sm:grid-cols-[7rem_1fr]">
        <DateRail iso={entrySortKey(entry)} locale={locale} />
        <div>
          <Link
            href={`/${locale}/articles/${entry.slug}`}
            lang={th}
            className="display -my-2.5 inline-block py-2.5 text-lg leading-snug text-ink no-underline hover:underline"
          >
            {entry.title[locale]}
          </Link>
          <Provenance entry={entry} locale={locale} />
        </div>
      </div>
    </li>
  );
}
