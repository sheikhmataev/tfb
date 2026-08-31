import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getComingUp, getRecently } from "@/lib/content";
import { S } from "@/lib/strings";
import { BUILD_DATE } from "@/lib/site";
import { formatDate, formatMonth, isLocale } from "@/lib/i18n";
import { LOCALES, type Entry, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: S.nav.calendar[locale] } : {};
}

const LEAD = {
  en: "Thai and Norwegian occasions in one list. Dates the association has booked are exact; the rest carry the month and the reason.",
  no: "Thailandske og norske merkedager i én liste. Datoer foreningen har booket er eksakte; resten har måned og begrunnelse.",
  th: "วันสำคัญไทยและนอร์เวย์ในรายการเดียว วันที่สมาคมจองแล้วจะระบุชัดเจน ส่วนที่เหลือระบุเดือนพร้อมเหตุผล",
};
const PAST = { en: "Already held", no: "Allerede avholdt", th: "จัดไปแล้ว" };

/**
 * The same words the homepage uses for the link that lands here, so the label
 * a reader clicks is the title they arrive at, and neither is the bare nav
 * item sitting above it. The Thai link label opens with a verb, "view", which
 * a heading should not, so the heading keeps the noun alone.
 */
const TITLE = { ...S.comingUp.all, th: "ปฏิทินทั้งหมด" };

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const th = l === "th" ? "th" : undefined;
  const upcoming = getComingUp(BUILD_DATE, 50);
  const past = getRecently(BUILD_DATE, 50).filter((e) => e.eventStartsAt !== null);

  const Row = ({ e }: { e: Entry }) => (
    <li className="grid gap-x-8 gap-y-1 border-t border-rule py-5 md:grid-cols-[13rem_1fr]">
      <p className="text-sm text-ink-soft">
        {e.dateIsApproximate
          ? formatMonth(e.eventStartsAt as string, l)
          : formatDate(e.eventStartsAt as string, l)}
      </p>
      <div>
        <h3 lang={th} className="display text-xl leading-snug">
          {e.title[l]}
        </h3>
        <p lang={th} className="mt-1 max-w-[62ch] text-ink-soft">
          {e.summary[l]}
        </p>
        {e.dateIsApproximate && e.approximateReason && (
          <p lang={th} className="mt-1 text-sm text-ink-soft">
            {e.approximateReason[l]}
          </p>
        )}
      </div>
    </li>
  );

  return (
    <>
      <PageHeader title={TITLE[l]} lead={LEAD[l]} locale={l} />
      <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-7">
        <h2 lang={th} className="display text-2xl">
          {S.comingUp.heading[l]}
        </h2>
        {upcoming.length === 0 ? (
          <p lang={th} className="mt-5 border-t border-rule pt-6 text-ink-soft">
            {S.comingUp.empty[l]}
          </p>
        ) : (
          <ul className="mt-5">
            {upcoming.map((e) => (
              <Row key={e.id} e={e} />
            ))}
          </ul>
        )}

        {past.length > 0 && (
          <>
            <h2 lang={th} className="display mt-14 text-2xl">
              {PAST[l]}
            </h2>
            <ul className="mt-5">
              {past.map((e) => (
                <Row key={e.id} e={e} />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
