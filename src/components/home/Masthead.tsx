"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "@/components/Mark";
import { S } from "@/lib/strings";
import { HTML_LANG } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";

/**
 * A nameplate, not a hero, and on the homepage not a navigation bar either.
 *
 * The homepage carries the mark, the name and the language control, and then
 * goes straight into dated content; a reader who landed here wants what is
 * happening, not a menu. Inner pages add one quiet line of section links under
 * the name, because a person arriving on /courses from a search result has to
 * be able to get anywhere else.
 *
 * The founding date, the frivilligsentral affiliation and the organisation
 * number used to be restated here on every page. They are facts about the
 * association, they live on /about, and repeating them above every article was
 * noise that also put a 20px prose link in the masthead of all 66 pages.
 */
export function Masthead({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const th = locale === "th" ? "th" : undefined;
  const home = isHome(pathname, locale);
  const Name = home ? "h1" : "p";

  return (
    // The hairline closes the masthead. On an inner page it belongs under the
    // section line instead, so the name and the sections read as one block.
    <div className={home ? "border-b border-rule" : ""}>
      <div className={`mx-auto max-w-[1180px] px-4 sm:px-7 ${home ? "py-7" : "pb-3 pt-7"}`}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href={`/${locale}`} className="flex min-h-11 items-center gap-3 no-underline">
            <Mark className="w-9 shrink-0 text-lotus" />
            <Name lang={th} className="display m-0 text-[clamp(1.5rem,3.2vw,2rem)] leading-none text-ink">
              {S.siteName[locale]}
            </Name>
          </Link>
          <LanguageSwitch locale={locale} />
        </div>
      </div>
    </div>
  );
}

function isHome(pathname: string, locale: Locale) {
  return pathname === `/${locale}` || pathname === `/${locale}/`;
}

/**
 * One control, three cells, all three always visible.
 *
 * A disclosure would be smaller, and it would be the wrong shape: the reader
 * who needs this most cannot read the page it is sitting on, so the way out
 * has to be legible at a glance rather than behind a control they must first
 * understand. Three cells in a hairline box read as one object, which three
 * bare links never did, and every cell clears 44 by 44 on its own padding.
 * Each is a plain anchor to the same page in another language, so it works
 * with scripting off. The current language is marked three ways that do not
 * depend on each other: aria-current for a screen reader, the petal ground for
 * anyone scanning, and the lens crop from the logo, the one curve the design
 * system allows, as the graphic that says you are here.
 */
function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(en|no|th)/, "") || "/";
  return (
    // Flush left under the name when the row wraps at 390, out to the right
    // edge once the two fit on one line.
    <nav aria-label={S.language[locale]} className="sm:ml-auto">
      <ul className="flex overflow-hidden rounded-[2px] border border-rule">
        {LOCALES.map((l) => {
          const current = l === locale;
          return (
            <li key={l} className="flex border-l border-rule first:border-l-0">
              <Link
                href={`/${l}${rest}`}
                hrefLang={l}
                lang={HTML_LANG[l]}
                aria-current={current ? "true" : undefined}
                className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-3 no-underline ${
                  current ? "bg-petal font-medium text-ink" : "text-ink-soft hover:bg-petal hover:text-ink"
                }`}
              >
                {current && <span aria-hidden="true" className="petal-mask block size-2 bg-lotus" />}
                {S.languageNames[l]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const NAV = ["help", "calendar", "articles", "about", "courses", "contact"] as const;

/**
 * The inner-page section line. Not on the homepage, and no longer a bordered
 * band with tab underlines: it sits under the name inside the same block of
 * the masthead, sharing that block's single hairline. The current page is a
 * petal ground rather than an underline, which is the same mark the language
 * control uses, so one visual idea covers both. Padding on the cells, not gaps
 * between them, is what gets every target past 44 by 44; the container pulls
 * that padding back so the first label still lines up with the column.
 */
export function MastheadNav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  if (isHome(pathname, locale)) return null;
  const th = locale === "th" ? "th" : undefined;

  return (
    <nav aria-label={S.sections[locale]} className="border-b border-rule">
      <div className="mx-auto max-w-[1180px] px-1 pb-5 sm:px-4">
        <ul className="flex flex-wrap">
          {NAV.map((k) => {
            const active = pathname.startsWith(`/${locale}/${k}`);
            return (
              <li key={k}>
                <Link
                  href={`/${locale}/${k}`}
                  lang={th}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-[2px] px-3 no-underline hover:text-lotus-deep ${
                    active ? "bg-petal font-medium text-ink" : "text-ink-soft"
                  }`}
                >
                  {S.nav[k][locale]}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
