import Link from "next/link";
import type { Locale } from "@/lib/types";

export function PageHeader({
  eyebrow,
  title,
  lead,
  locale,
  backHref,
  backLabel,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  locale: Locale;
  backHref?: string;
  backLabel?: string;
}) {
  const th = locale === "th" ? "th" : undefined;
  return (
    <div className="mx-auto max-w-[1180px] px-4 pb-2 pt-12 sm:px-7 md:pt-16">
      {backHref && backLabel && (
        // A standalone control, not an inline prose anchor, so it carries the
        // 44px floor. The height comes from min-h-11 with the text centred in
        // it, and a negative top margin gives back the 10px that added above
        // the text, so the printed rhythm under the page title is unchanged.
        <Link
          href={backHref}
          lang={th}
          className="-mt-2.5 mb-3.5 inline-flex min-h-11 items-center text-sm text-lotus-deep underline-offset-4"
        >
          &lsaquo; {backLabel}
        </Link>
      )}
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          {eyebrow && (
            <p lang={th} className="label-caps text-lotus-deep">
              {eyebrow}
            </p>
          )}
          <h1
            lang={th}
            className="display mt-4 text-[clamp(2.125rem,4vw,2.875rem)] leading-[1.1]"
          >
            {title}
          </h1>
          {lead && (
            <p lang={th} className="mt-5 max-w-[58ch] text-lg text-ink-soft">
              {lead}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
