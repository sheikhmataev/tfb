"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "./Mark";
import { S } from "@/lib/strings";
import { LOCALE_LABELS } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";

const NAV = ["courses", "help", "activities", "about", "contact"] as const;

/**
 * The mobile menu is a <details> element, so navigation works with no JS at
 * all. Members open this on old phones over patchy data; the nav must never
 * depend on a bundle arriving.
 */
export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(en|no|th)/, "") || "/";
  const isActive = (href: string) => pathname.startsWith(`/${locale}/${href}`);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3.5 sm:px-7">
        <Link href={`/${locale}`} className="flex items-center gap-3 no-underline">
          <Mark className="w-[34px] shrink-0 text-lotus" />
          <span className="display text-sm uppercase tracking-[0.08em] text-ink">
            {S.siteName[locale]}
          </span>
        </Link>

        <nav className="hidden md:ml-3 md:flex md:gap-x-6">
          {NAV.map((key) => (
            <Link
              key={key}
              href={`/${locale}/${key}`}
              aria-current={isActive(key) ? "page" : undefined}
              className={`display -mb-[15px] border-b-2 pb-3.5 text-sm uppercase tracking-[0.06em] text-ink no-underline transition-colors duration-150 hover:border-rule ${
                isActive(key) ? "border-lotus" : "border-transparent"
              }`}
            >
              {S.nav[key][locale]}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <nav aria-label={S.language[locale]} className="flex items-center text-sm">
            {LOCALES.map((l, i) => (
              <Link
                key={l}
                href={`/${l}${rest}`}
                hrefLang={l}
                aria-current={l === locale ? "true" : undefined}
                lang={l === "th" ? "th" : undefined}
                className={`px-2.5 no-underline first:pl-0 last:pr-0 ${
                  i < LOCALES.length - 1 ? "border-r border-rule" : ""
                } ${l === locale ? "font-semibold text-ink" : "text-ink-soft"}`}
              >
                {LOCALE_LABELS[l]}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <details className="group border-t border-rule md:hidden">
        <summary className="mx-auto flex max-w-[1180px] cursor-pointer list-none items-center gap-2 px-4 py-3 text-base font-semibold sm:px-7 [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">{S.menu[locale]}</span>
          <span className="hidden group-open:inline">{S.close[locale]}</span>
          <span aria-hidden="true" className="ml-auto flex h-[9px] w-5 flex-col justify-between">
            <span className="block h-0.5 w-full bg-ink" />
            <span className="block h-0.5 w-full bg-ink" />
          </span>
        </summary>
        <nav className="mx-auto max-w-[1180px] px-4 pb-2 sm:px-7">
          {NAV.map((key) => (
            <Link
              key={key}
              href={`/${locale}/${key}`}
              aria-current={isActive(key) ? "page" : undefined}
              className="display block border-t border-rule py-4 text-base uppercase tracking-[0.06em] text-ink no-underline"
            >
              {S.nav[key][locale]}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}
