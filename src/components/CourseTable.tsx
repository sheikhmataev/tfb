"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { S } from "@/lib/strings";
import { formatPrice } from "@/lib/i18n";
import type { Course, Locale } from "@/lib/types";

/**
 * A table, not cards. Every course is 800 kr, so price is not a differentiator
 * and the filter sorts by regulator instead: a kitchen worker searches by
 * whichever certificate the inspector asks for.
 */
export function CourseTable({ courses, locale }: { courses: Course[]; locale: Locale }) {
  const [filter, setFilter] = useState<string>("all");
  const th = locale === "th" ? "th" : undefined;

  const regulators = useMemo(
    () => [...new Set(courses.map((c) => c.regulator).filter((r): r is string => r !== null))],
    [courses],
  );

  const shown = filter === "all" ? courses : courses.filter((c) => c.regulator === filter);

  return (
    <div>
      <fieldset className="mb-7 border-0 p-0">
        <legend lang={th} className="mb-3 text-sm text-ink-soft">
          {S.courses.filterBy[locale]}
        </legend>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            <span lang={th}>{S.courses.allRegulators[locale]}</span>
          </FilterChip>
          {regulators.map((r) => (
            <FilterChip key={r} active={filter === r} onClick={() => setFilter(r)}>
              {r}
            </FilterChip>
          ))}
        </div>
      </fieldset>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="max-md:sr-only">
            <tr>
              <Th>{S.courses.course[locale]}</Th>
              <Th>{S.courses.regulator[locale]}</Th>
              <Th>{S.courses.nextDate[locale]}</Th>
              <Th>{S.courses.price[locale]}</Th>
              <Th>
                <span className="sr-only">{S.courses.register[locale]}</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {shown.map((c) => (
              <tr
                key={c.id}
                className="border-b border-rule last:border-b-0 max-md:block max-md:py-4 md:even:bg-petal"
              >
                <Td className="max-md:block max-md:pb-2 md:font-medium">
                  <Link
                    href={`/${locale}/courses/${c.slug}`}
                    lang={th}
                    className="text-ink no-underline hover:text-lotus-deep hover:underline max-md:text-lg max-md:font-semibold"
                  >
                    {c.title[locale]}
                  </Link>
                </Td>
                <Td label={S.courses.regulator[locale]}>{c.regulator ?? ""}</Td>
                <Td label={S.courses.nextDate[locale]}>
                  {c.nextDateIso ? (
                    c.nextDateIso
                  ) : (
                    // Never a fabricated date. The enquiry route is the answer.
                    <Link
                      href={`/${locale}/contact`}
                      lang={th}
                      className="text-ink-soft underline underline-offset-2 hover:text-lotus-deep"
                    >
                      {S.courses.tbd[locale]}
                    </Link>
                  )}
                </Td>
                <Td label={S.courses.price[locale]}>
                  {c.priceNok !== null ? formatPrice(c.priceNok, locale) : ""}
                </Td>
                <Td className="max-md:block max-md:pt-2">
                  <Link
                    href={`/${locale}/courses/${c.slug}`}
                    lang={th}
                    className="font-semibold text-lotus-deep underline-offset-4"
                  >
                    {S.courses.register[locale]}
                  </Link>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[2.25rem] rounded-[2px] border px-3.5 py-1.5 text-sm transition-colors duration-150 ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-rule text-ink-soft hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b border-ink pb-2.5 pr-3.5 text-left text-xs font-semibold uppercase tracking-[0.05em] text-ink-soft">
      {children}
    </th>
  );
}

/** On mobile the table becomes stacked definition blocks, never a
 *  horizontally scrolling table. The label comes from the header. */
function Td({
  children,
  label,
  className = "",
}: {
  children: React.ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <td
      className={`py-2.5 pr-3.5 align-top max-md:flex max-md:justify-between max-md:gap-4 max-md:py-1 max-md:pr-0 max-md:text-right ${className}`}
    >
      {label && (
        <span aria-hidden="true" className="text-xs uppercase tracking-[0.05em] text-ink-soft md:hidden">
          {label}
        </span>
      )}
      <span>{children}</span>
    </td>
  );
}
