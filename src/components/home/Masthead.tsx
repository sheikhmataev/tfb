"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "@/components/Mark";
import { settings } from "@/lib/content";
import { S } from "@/lib/strings";
import { LOCALE_LABELS } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";

/**
 * A nameplate, not a hero.
 *
 * Everything the old hero was trying to say (who we are, that we are real,
 * that we are old enough to trust) is stated here as fact in one sentence with
 * a registry link attached, which is more convincing than a headline. The
 * organisation name is said exactly once on the page.
 */
export function Masthead({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const th = locale === "th" ? "th" : undefined;
  const orgNr = settings.association.orgNumber;
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const Name = isHome ? "h1" : "p";

  return (
    <div className="border-b border-rule">
      <div className="mx-auto max-w-[1180px] px-4 py-7 sm:px-7">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href={`/${locale}`} className="flex min-h-11 items-center gap-3 no-underline">
            <Mark className="w-9 shrink-0 text-lotus" />
            <Name lang={th} className="display m-0 text-[clamp(1.5rem,3.2vw,2rem)] leading-none text-ink">
              {S.siteName[locale]}
            </Name>
          </Link>
          <LanguageSwitch locale={locale} />
        </div>
        <p lang={th} className="mt-3 max-w-[76ch] text-ink-soft">
          {S.masthead.identity[locale]}{" "}
          {S.masthead.orgNumber[locale]}{" "}
          <a
            href={`https://virksomhet.brreg.no/nb/oppslag/enheter/${orgNr.replace(/\s/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap text-lotus-deep underline-offset-4"
          >
            {orgNr}
            <span className="sr-only"> ({S.masthead.registryLink[locale]})</span>
          </a>
          .
        </p>
      </div>
    </div>
  );
}

function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(en|no|th)/, "") || "/";
  return (
    <nav aria-label={S.language[locale]} className="ml-auto flex items-center text-sm">
      {LOCALES.map((l, i) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          aria-current={l === locale ? "true" : undefined}
          lang={l === "th" ? "th" : undefined}
          className={`inline-flex min-h-11 items-center px-2.5 no-underline last:pr-0 ${
            i < LOCALES.length - 1 ? "border-r border-rule" : ""
          } ${l === locale ? "font-semibold text-ink" : "text-ink-soft"}`}
        >
          {LOCALE_LABELS[l]}
        </Link>
      ))}
    </nav>
  );
}

const NAV = ["help", "calendar", "articles", "about", "courses", "contact"] as const;

export function MastheadNav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const th = locale === "th" ? "th" : undefined;
  return (
    <nav className="border-b border-rule">
      <div className="mx-auto flex max-w-[1180px] flex-wrap gap-x-7 px-4 sm:px-7">
        {NAV.map((k) => {
          const active = pathname.startsWith(`/${locale}/${k}`);
          return (
            <Link
              key={k}
              href={`/${locale}/${k}`}
              lang={th}
              aria-current={active ? "page" : undefined}
              className={`-mb-px inline-flex min-h-11 items-center border-b-2 text-base no-underline hover:text-lotus-deep ${
                active ? "border-lotus font-medium text-ink" : "border-transparent text-ink"
              }`}
            >
              {S.nav[k][locale]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
