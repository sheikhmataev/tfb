import Link from "next/link";
import { getComingUp } from "@/lib/content";
import { S } from "@/lib/strings";
import { SectionOpener } from "@/components/Ornament";
import type { Locale } from "@/lib/types";

/**
 * The band that makes the page read as a living association. The annual
 * meeting sits on the same list as the festivals, which is what proves
 * constitutional life to an outsider.
 *
 * Cards are not individually linked: one calendar link carries the whole band,
 * which holds the link budget and keeps four near-identical targets out of a
 * screen reader's link list.
 *
 * The rail scrolls horizontally inside its own container, never the page. Gate
 * G17 fails the build if scrollWidth exceeds innerWidth at 390, so a rail that
 * pushed the document sideways would break rather than ship.
 */
/**
 * An approximate date drops the day, because a lunar festival has a month and
 * not a number, and printing one would be a precision the data does not have.
 */
function cardDate(iso: string, locale: Locale, approximate: boolean) {
  const tag = locale === "no" ? "nb-NO" : locale === "th" ? "th-TH" : "en-GB";
  const d = new Date(`${iso}T00:00:00Z`);
  const month = new Intl.DateTimeFormat(tag, { month: "short" }).format(d);
  const day = new Intl.DateTimeFormat(tag, { day: "numeric" }).format(d);
  const year = new Intl.DateTimeFormat(tag, { year: "numeric" }).format(d);
  return approximate ? { main: month, sub: year } : { main: day, sub: `${month} ${year}` };
}

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
          // A rail read left to right, not a stack read downward. The cards
          // carry no photograph, and that is a fact about the archive rather
          // than a layout choice: all thirteen entries have leadImage null,
          // and neither photograph in public/assets depicts any of them.
          // qa/images.json records both as general photography that may not
          // illustrate any dated event. A harbour crop under "Thai Food
          // Festival 2016" is a lie the card would tell silently, and this
          // project has already shipped that one.
          //
          // The date does the work a photograph would: a square carrying the
          // petal mask, which is the only curve in this system and is legible
          // only on a 1:1 box. It is the association's own geometry rather
          // than a picture of nothing.
          <ul className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
            {items.map((e) => (
              <li
                key={e.id}
                className="flex w-[17rem] shrink-0 snap-start flex-col border-t-2 border-ink pt-5"
              >
                <span
                  aria-hidden="true"
                  className="mb-5 flex size-32 shrink-0 flex-col items-center justify-center bg-petal px-2 text-center"
                  style={{ borderRadius: "0 62% 0 62%" }}
                >
                  {/* Two lines, not three. DateRail sets a day, a month and a
                      year at three sizes, which is right in a left rail with a
                      whole column to breathe in and cramped inside a 96px mask.
                      The mask crops its own corners, so the date has to sit
                      well inside them. */}
                  <span className="display text-2xl leading-none text-ink">
                    {cardDate(e.eventStartsAt as string, locale, e.dateIsApproximate).main}
                  </span>
                  <span className="mt-1.5 leading-none text-ink-soft">
                    {cardDate(e.eventStartsAt as string, locale, e.dateIsApproximate).sub}
                  </span>
                </span>
                <time
                  dateTime={e.dateIsApproximate ? (e.eventStartsAt as string).slice(0, 7) : (e.eventStartsAt as string)}
                  className="sr-only"
                >
                  {cardDate(e.eventStartsAt as string, locale, e.dateIsApproximate).main}{" "}
                  {cardDate(e.eventStartsAt as string, locale, e.dateIsApproximate).sub}
                </time>
                <h3 lang={th} className="display text-xl leading-snug">
                  {e.title[locale]}
                </h3>
                <p lang={th} className="mt-2 text-ink-soft">
                  {e.summary[locale]}
                </p>
                {e.dateIsApproximate && e.approximateReason && (
                  <p lang={th} className="mt-2 text-ink-soft">
                    {e.approximateReason[locale]}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
