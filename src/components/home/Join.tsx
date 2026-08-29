import Image from "next/image";
import Link from "next/link";
import { withBase } from "@/lib/site";
import { S } from "@/lib/strings";
import type { Locale } from "@/lib/types";

/**
 * A statement of terms, not a call to action. No button, no form, no fee
 * table, no benefit list, no urgency. It answers what she is actually asking:
 * may I join, what does it cost, do I need Norwegian, is my husband welcome.
 */
export function Join({ locale }: { locale: Locale }) {
  const th = locale === "th" ? "th" : undefined;

  return (
    <section className="scroll-mt-24">
      <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-7">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-12">
          <figure className="m-0 md:col-span-5">
            <div className="petal-mask relative aspect-[3/2] bg-petal">
              <Image
                src={withBase("/assets/activities-lead.jpg")}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 text-sm text-ink-soft">
              {/* TODO(board): confirm what this photograph shows before launch. */}
              Bergen, from the association&apos;s own archive.
            </figcaption>
          </figure>

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
