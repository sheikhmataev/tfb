import { notFound } from "next/navigation";
import { HelpToday } from "@/components/home/HelpToday";
import { ComingUp } from "@/components/home/ComingUp";
import { Recently } from "@/components/home/Recently";
import { isLocale } from "@/lib/i18n";
import { BUILD_DATE } from "@/lib/site";
import { LOCALES, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * Nearest first, and forward before back.
 *
 * The page opens on what is happening, then help, then what has happened, then
 * the standing facts that carry no date because they are always true. One rule
 * decides where every piece of dated content sits, its date relative to today,
 * so the board never chooses a section. It sets a date and the page sorts
 * itself.
 *
 * Help used to open the page, above the first date. It moved below because the
 * Krisesenteret number is now in the pinned section line at every scroll
 * position on every page, so it is never more than a glance away, and because a
 * reader arriving at an association's front page should be able to see what the
 * association is doing without scrolling past a screen of triage first.
 *
 * Two bands were removed rather than shortened. "The association on paper"
 * printed the fact table from /about, row for row, down to the same links out
 * to the board, the bylaws and the accounts. "Membership, giving and helping"
 * restated /about/membership. A front page that reprints the pages behind it
 * teaches a reader that the navigation leads nowhere new, which is the opposite
 * of easy to navigate. What is left here is what the homepage alone can say:
 * what is coming, where to get help right now, and what has happened.
 *
 * Courses are deliberately absent. They are a commercial service sold by a
 * separate legal entity and they keep their own nav item and pages.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  return (
    <>
      <ComingUp locale={l} today={BUILD_DATE} />
      <HelpToday locale={l} />
      <Recently locale={l} today={BUILD_DATE} />
    </>
  );
}
