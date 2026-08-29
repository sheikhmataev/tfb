import type { Locale } from "@/lib/types";

/**
 * The page is ordered by date and nothing was showing it: dates rendered as
 * 15px grey metadata beside display-face headings. Here the date takes the
 * left rail in the display face, so scanning the column reads as a spine and
 * the organising principle becomes visible rather than merely true.
 *
 * An approximate date drops the day, because a lunar festival has a month and
 * not a number, and printing one would be a precision the data does not have.
 */
export function DateRail({
  iso,
  locale,
  approximate = false,
  large = false,
}: {
  iso: string;
  locale: Locale;
  approximate?: boolean;
  large?: boolean;
}) {
  const tag = locale === "no" ? "nb-NO" : locale === "th" ? "th-TH" : "en-GB";
  const d = new Date(`${iso}T00:00:00Z`);
  const day = new Intl.DateTimeFormat(tag, { day: "numeric" }).format(d);
  const month = new Intl.DateTimeFormat(tag, { month: "short" }).format(d);
  const year = new Intl.DateTimeFormat(tag, { year: "numeric" }).format(d);

  return (
    <time dateTime={approximate ? iso.slice(0, 7) : iso} className="block leading-none text-ink-soft">
      {approximate ? (
        <span className={`display block ${large ? "text-2xl" : "text-xl"} text-ink`}>{month}</span>
      ) : (
        <>
          <span className={`display block ${large ? "text-3xl" : "text-2xl"} text-ink`}>{day}</span>
          <span className="mt-1 block text-sm">{month}</span>
        </>
      )}
      <span className="mt-1 block text-sm">{year}</span>
    </time>
  );
}
