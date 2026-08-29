import { LOCALES, type Locale } from "./types";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  no: "NO",
  th: "ไทย",
};

export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  no: "nb",
  th: "th",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Long-form date in the reader's own language. */
export function formatDate(iso: string, locale: Locale): string {
  const tag = locale === "no" ? "nb-NO" : locale === "th" ? "th-TH" : "en-GB";
  return new Intl.DateTimeFormat(tag, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00Z`));
}

/** For an occasion whose exact day is not fixed yet. */
export function formatMonth(iso: string, locale: Locale): string {
  const tag = locale === "no" ? "nb-NO" : locale === "th" ? "th-TH" : "en-GB";
  return new Intl.DateTimeFormat(tag, { month: "long", year: "numeric" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}

export function formatPrice(nok: number, locale: Locale): string {
  const tag = locale === "no" ? "nb-NO" : locale === "th" ? "th-TH" : "en-GB";
  return `${new Intl.NumberFormat(tag).format(nok)} kr`;
}
