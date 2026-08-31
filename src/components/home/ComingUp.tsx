import Link from "next/link";
import { getComingUp } from "@/lib/content";
import { S } from "@/lib/strings";
import { DateRail } from "@/components/DateRail";
import { SectionOpener } from "@/components/Ornament";
import type { Locale } from "@/lib/types";

/**
 * The band that makes the page read as a living association. The annual
 * meeting sits on the same list as the festivals, which is what proves
 * constitutional life to an outsider.
 *
 * Rows are not individually linked: one calendar link carries the whole band,
 * which holds the link budget and keeps four near-identical targets out of a
 * screen reader's link list.
 */
export function ComingUp({ locale, today }: { locale: Locale; today: string }) {
  const th = locale === "th" ? "th" : undefined;
  const items = getComingUp(today);

  return (
    <section id="calendar" className="scroll-mt-24">
      <div className="mx-auto max-w-[1180px] px-4 py-11 sm:px-7">
        <SectionOpener className="mb-6" />

        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <h2 lang={th} className="display text-[clamp(1.625rem,3vw,1.875rem)] leading-tight">
            {S.comingUp.heading[locale]}
          </h2>
          <Link
            href={`/${locale}/calendar`}
            lang={th}
            className="inline-flex min-h-11 items-center text-lotus-deep underline-offset-4"
          >
            {S.comingUp.all[locale]}
          </Link>
        </div>

        {items.length === 0 ? (
          // Written by someone who knows the hall is not booked yet, so a
          // reader never has to interpret an absence as neglect.
          <p lang={th} className="mt-6 max-w-[62ch] border-t border-rule pt-6 text-ink-soft">
            {S.comingUp.empty[locale]}
          </p>
        ) : (
          <ul className="mt-6">
            {items.map((e) => (
              <li key={e.id} className="grid gap-x-8 gap-y-2 border-t border-rule py-5 md:grid-cols-[7rem_1fr]">
                <DateRail
                  iso={e.eventStartsAt as string}
                  locale={locale}
                  approximate={e.dateIsApproximate}
                />
                <div>
                  <h3 lang={th} className="display text-xl leading-snug">
                    {e.title[locale]}
                  </h3>
                  <p lang={th} className="mt-1 max-w-[62ch] text-ink-soft">
                    {e.summary[locale]}
                  </p>
                  {e.dateIsApproximate && e.approximateReason && (
                    <p lang={th} className="mt-1 text-sm text-ink-soft">
                      {e.approximateReason[locale]}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
