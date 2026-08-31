import Link from "next/link";
import { getFacts } from "@/lib/content";
import { SectionOpener } from "@/components/Ornament";
import { S } from "@/lib/strings";
import { formatDate } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

/**
 * Lets a caseworker, journalist or funder verify the organisation without
 * leaving the page. Every figure carries the date it was true, so a 2016
 * number reads as a dated fact rather than as evidence of dormancy.
 *
 * No prose arguing that the association is admirably transparent: a public
 * body posts the accounts, it does not explain why that is admirable. And no
 * hero-metric row, because 233 members is a table row with a year attached,
 * not a statistic to be proud of.
 */
export function OnPaper({ locale }: { locale: Locale }) {
  const th = locale === "th" ? "th" : undefined;

  return (
    <section className="border-y border-rule">
      <div className="mx-auto max-w-[1180px] px-4 py-11 sm:px-7">
        <SectionOpener className="mb-6" />

        <h2 lang={th} className="display text-[clamp(1.625rem,3vw,1.875rem)] leading-tight">
          {S.onPaper.heading[locale]}
        </h2>

        <dl className="mt-7">
          {getFacts().map((f) => {
            const external = f.href?.startsWith("http");
            return (
              <div
                key={f.id}
                className="grid gap-x-10 gap-y-1 border-t border-rule py-4 md:grid-cols-[16rem_1fr]"
              >
                <dt lang={th} className="text-sm text-ink-soft">
                  {f.label[locale]}
                </dt>
                <dd lang={th} className="max-w-[62ch]">
                  {f.value[locale]}
                  {f.asOf && (
                    <span className="ml-2 whitespace-nowrap text-sm text-ink-soft">
                      {S.onPaper.asOf[locale]} {formatDate(f.asOf, locale)}
                    </span>
                  )}
                  {f.href && f.linkLabel && (
                    <span className="block">
                      {external ? (
                        <a
                          href={f.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center text-sm text-lotus-deep underline-offset-4"
                        >
                          {f.linkLabel[locale]}
                        </a>
                      ) : (
                        <Link
                          href={`/${locale}${f.href}`}
                          className="inline-flex min-h-11 items-center text-sm text-lotus-deep underline-offset-4"
                        >
                          {f.linkLabel[locale]}
                        </Link>
                      )}
                    </span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
