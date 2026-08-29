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
        <Link
          href={backHref}
          lang={th}
          className="mb-6 inline-block text-sm text-lotus-deep underline-offset-4"
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
