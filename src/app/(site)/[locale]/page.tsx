import { notFound } from "next/navigation";
import { HelpToday } from "@/components/home/HelpToday";
import { ComingUp } from "@/components/home/ComingUp";
import { Recently } from "@/components/home/Recently";
import { OnPaper } from "@/components/home/OnPaper";
import { Join } from "@/components/home/Join";
import { isLocale } from "@/lib/i18n";
import { BUILD_DATE } from "@/lib/site";
import { LOCALES, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * Nearest first, and forward before back.
 *
 * The page is read outward from today: what you can do today, then what is
 * coming, then what has happened, then the standing facts that carry no date
 * because they are always true. One rule decides where every piece of content
 * sits, its date relative to today, so the board never chooses a section. It
 * sets a date and the page sorts itself.
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
      <HelpToday locale={l} />
      <ComingUp locale={l} today={BUILD_DATE} />
      <Recently locale={l} today={BUILD_DATE} />
      <OnPaper locale={l} />
      <Join locale={l} />
    </>
  );
}
