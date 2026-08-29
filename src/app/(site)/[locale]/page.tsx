import { notFound } from "next/navigation";
import { Hero } from "@/components/home/Hero";
import { Courses } from "@/components/home/Courses";
import { Help } from "@/components/home/Help";
import { Activities } from "@/components/home/Activities";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { isLocale } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * Section order follows the board's stated priorities: courses first, then
 * public help, activities, background, contact. The persistent help bar is
 * what makes leading with courses safe, since the emergency number stays one
 * tap away at any scroll position.
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
      <Hero locale={l} />
      <Courses locale={l} />
      <Help locale={l} />
      <Activities locale={l} />
      <About locale={l} />
      <Contact locale={l} />
    </>
  );
}
