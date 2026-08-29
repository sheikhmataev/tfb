import type { Metadata } from "next";
import { fontVars } from "@/lib/fonts";
import "../../globals.css";
import { notFound } from "next/navigation";
import { HelpBar } from "@/components/HelpBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { S } from "@/lib/strings";
import { HTML_LANG, isLocale } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    metadataBase: new URL(SITE_URL),
    // Absolute, because SITE_URL already carries the subpath and Next would
    // otherwise resolve a relative alternate against it and double the prefix.
    alternates: {
      canonical: `${SITE_URL}/${locale}/`,
      languages: {
        en: `${SITE_URL}/en/`,
        nb: `${SITE_URL}/no/`,
        th: `${SITE_URL}/th/`,
        "x-default": `${SITE_URL}/en/`,
      },
    },
    openGraph: { locale: HTML_LANG[locale], siteName: S.siteName[locale] },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  return (
    // Each locale is its own root layout, so <html lang> is always the
    // language the page is actually written in.
    <html lang={HTML_LANG[l]} className={fontVars}>
      <head>
        {/* Marks that JS is running, before first paint. Anything that
            animates on scroll stays visible until this flag exists. */}
        <script
          dangerouslySetInnerHTML={{
            __html: 'document.documentElement.setAttribute("data-js","")',
          }}
        />
      </head>
      <body>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[2px] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        {S.skipToContent[l]}
      </a>
        <HelpBar locale={l} />
        <Header locale={l} />
        <main id="main">{children}</main>
        <Footer locale={l} />
      </body>
    </html>
  );
}
