import Link from "next/link";
import { S } from "@/lib/strings";
import { formatPrice } from "@/lib/i18n";
import type { Course, Locale } from "@/lib/types";

const FACTS = ["hours", "seats", "noExam", "certificatePosted"] as const;

/**
 * Rows, not a table.
 *
 * The price is flat across every course, so it is stated once at section level
 * instead of spending a whole column on a constant. The regulator leads each
 * row because nobody shops for a course: they arrive knowing an inspector
 * asked for something and need to find which one that was. Register is the
 * point of the section, so it is a real button and clears the 44px floor.
 */
export function CourseList({ courses, locale }: { courses: Course[]; locale: Locale }) {
  const th = locale === "th" ? "th" : undefined;

  // Show the price once when every course shares it, per row when they diverge.
  const prices = new Set(courses.map((c) => c.priceNok));
  const flatPrice = prices.size === 1 ? [...prices][0] : null;

  return (
    <section className="border-2 border-ink">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-b border-rule px-6 py-7 sm:px-8">
        <div>
          <h2 lang={th} className="display text-[clamp(1.75rem,3vw,2.125rem)] leading-tight">
            {S.courses.label[locale]}
          </h2>
          <p lang={th} className="mt-2 max-w-[46ch] text-ink-soft">
            {S.courses.lead[locale]}
          </p>
        </div>
        {flatPrice !== null && (
          <div className="text-left sm:text-right">
            <p className="display text-[clamp(2rem,4vw,2.75rem)] leading-none">
              {formatPrice(flatPrice, locale)}
            </p>
            <p lang={th} className="mt-1 max-w-[26ch] text-sm text-ink-soft">
              {S.courses.priceIncludes[locale]}
            </p>
          </div>
        )}
      </div>

      <ul className="flex flex-wrap gap-x-6 gap-y-2 border-b border-rule bg-petal px-6 py-3.5 text-sm text-ink-soft sm:px-8">
        <li lang={th}>{courses[0]?.format[locale]}</li>
        {FACTS.map((k) => (
          <li key={k} lang={th}>
            {S.courses[k][locale]}
          </li>
        ))}
      </ul>

      <div className="px-6 sm:px-8">
        {courses.map((c, i) => (
          <article
            key={c.id}
            className={`grid items-center gap-x-8 gap-y-5 py-6 md:grid-cols-[1fr_auto] ${
              i < courses.length - 1 ? "border-b border-rule" : ""
            }`}
          >
            <div>
              {c.regulator && (
                <p lang={th} className="text-xs uppercase tracking-[0.05em] text-lotus-deep">
                  {S.courses.asksFor[locale].replace("{regulator}", c.regulator)}
                </p>
              )}
              <h3 lang={th} className="display mt-1.5 text-xl leading-snug sm:text-2xl">
                <Link href={`/${locale}/courses/${c.slug}`} className="text-ink no-underline hover:underline">
                  {c.title[locale]}
                </Link>
              </h3>
              <p lang={th} className="mt-2 max-w-[62ch] text-sm text-ink-soft sm:text-base">
                {c.summary[locale]}
              </p>
            </div>

            <div className="md:min-w-[13rem] md:text-right">
              <Link
                href={`/${locale}/courses/${c.slug}`}
                lang={th}
                className="inline-flex min-h-12 items-center justify-center rounded-[2px] border border-ink bg-ink px-7 text-base font-semibold text-paper no-underline transition-colors duration-150 hover:bg-[#2c2523]"
              >
                {S.courses.register[locale]}
              </Link>
              <p className="mt-2 text-sm text-ink-soft">
                {c.nextDateIso ? (
                  c.nextDateIso
                ) : (
                  // Never a fabricated date. The enquiry route is the answer,
                  // and it is a 44px target rather than an 18px link.
                  <Link
                    href={`/${locale}/contact`}
                    lang={th}
                    className="inline-flex min-h-11 items-center text-ink-soft underline underline-offset-4 hover:text-lotus-deep"
                  >
                    {S.courses.tbd[locale]}
                  </Link>
                )}
              </p>
              {flatPrice === null && c.priceNok !== null && (
                <p className="mt-1 font-medium">{formatPrice(c.priceNok, locale)}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
