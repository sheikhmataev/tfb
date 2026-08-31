import Link from "next/link";
import { QuietLotus, SectionOpener } from "@/components/Ornament";
import { S } from "@/lib/strings";
import type { Locale } from "@/lib/types";

/**
 * A statement of terms, not a call to action. No button, no form, no fee
 * table, no benefit list, no urgency. It answers what she is actually asking:
 * may I join, what does it cost, do I need Norwegian, is my husband welcome.
 *
 * The column that held a photograph now holds the mark, pale. The picture
 * there was a tinted harbour view captioned as a placeholder for photographs
 * the association has not supplied, which is stock photography doing a
 * brochure's job on the site of an organisation that sells nothing. The mark
 * says the same amount about the association, which is nothing, without
 * pretending to be a record of it. It is hidden below the two-column
 * breakpoint rather than stacked, so a reader on a phone pays no scroll for
 * an ornament.
 */
export function Join({ locale }: { locale: Locale }) {
  const th = locale === "th" ? "th" : undefined;

  return (
    <section className="scroll-mt-24">
      <div className="mx-auto max-w-[1180px] px-4 py-11 sm:px-7">
        <SectionOpener className="mb-6" />
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-12">
          <div className="hidden md:col-span-5 md:flex md:items-center md:justify-center">
            <QuietLotus className="w-full max-w-[300px]" />
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <h2 lang={th} className="display text-[clamp(1.625rem,3vw,1.875rem)] leading-tight">
              {S.join.heading[locale]}
            </h2>
            <p lang={th} className="mt-4 border-t border-rule pt-4 text-ink-soft">
              {S.join.terms[locale]}
            </p>
            <p lang={th} className="mt-4 border-t border-rule pt-4 text-ink-soft">
              {S.join.notSubscription[locale]}
            </p>
            <p lang={th} className="mt-4 border-t border-rule pt-4 text-ink-soft">
              {S.join.helping[locale]}
            </p>
            <p className="mt-5 flex flex-wrap gap-x-8">
              <Link
                href={`/${locale}/about/membership`}
                lang={th}
                className="inline-flex min-h-11 items-center font-semibold text-lotus-deep underline-offset-4"
              >
                {S.join.howToJoin[locale]}
              </Link>
              <Link
                href={`/${locale}/contact`}
                lang={th}
                className="inline-flex min-h-11 items-center font-semibold text-lotus-deep underline-offset-4"
              >
                {S.join.howToHelp[locale]}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
