import type { Locale } from "@/lib/types";
import type { ReactNode } from "react";

/**
 * The section-label device: a heading sits on a 1px rule with its label
 * breaking through the rule on the left, the way a printed programme sets a
 * running head. This and the petal mask are the whole structural vocabulary.
 */
export function SectionHead({
  label,
  lead,
  id,
  locale,
}: {
  label: string;
  lead?: string;
  id?: string;
  locale: Locale;
}) {
  return (
    <div className="relative mb-9 border-t border-rule pt-7">
      <span
        id={id}
        lang={locale === "th" ? "th" : undefined}
        className="label-caps absolute -top-2.5 left-0 bg-paper pr-3.5 text-lotus-deep"
      >
        {label}
      </span>
      {lead && (
        <p lang={locale === "th" ? "th" : undefined} className="max-w-[60ch] text-lg text-ink-soft">
          {lead}
        </p>
      )}
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 py-16 md:py-20 ${className}`}>
      <div className="mx-auto max-w-[1180px] px-4 sm:px-7">{children}</div>
    </section>
  );
}
