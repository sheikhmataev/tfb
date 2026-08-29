import Link from "next/link";
import { EntryLead, EntryRow } from "@/components/EntryRow";
import { archiveRange, getRecently, isArchive } from "@/lib/content";
import { S } from "@/lib/strings";
import type { Locale } from "@/lib/types";

/**
 * The largest band on the page: articles as first-class content, and the
 * twenty documented projects shown as work rather than as a claim.
 *
 * The heading is a rule reading the data, not an editorial decision. It flips
 * from "From the archive" to "Recently" on its own once the newest entry is
 * under eighteen months old. No code change, no redesign.
 */
export function Recently({ locale, today }: { locale: Locale; today: string }) {
  const th = locale === "th" ? "th" : undefined;
  const items = getRecently(today);
  const [lead, ...rest] = items;
  const archived = isArchive(today);
  const range = archiveRange();

  return (
    <section id="articles" className="scroll-mt-24 border-t border-rule">
      <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <h2 lang={th} className="display text-[clamp(1.625rem,3vw,1.875rem)] leading-tight">
            {archived
              ? `${S.entries.archive[locale]}, ${range.from} ${locale === "en" ? "to" : locale === "no" ? "til" : "ถึง"} ${range.to}`
              : S.entries.recently[locale]}
          </h2>
          <Link
            href={`/${locale}/articles`}
            lang={th}
            className="inline-flex min-h-11 items-center text-lotus-deep underline-offset-4"
          >
            {S.entries.all[locale]}
          </Link>
        </div>

        {!lead ? (
          <p lang={th} className="mt-6 border-t border-rule pt-6 text-ink-soft">
            {S.entries.empty[locale]}
          </p>
        ) : (
          <>
            <div className="mt-7">
              <EntryLead entry={lead} locale={locale} />
            </div>
            {rest.length > 0 && (
              <ul className="mt-8">
                {rest.map((e) => (
                  <EntryRow key={e.id} entry={e} locale={locale} />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}
