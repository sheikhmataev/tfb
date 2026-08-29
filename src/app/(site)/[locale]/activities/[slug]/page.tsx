import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getActivities } from "@/lib/content";
import { S } from "@/lib/strings";
import { formatDate, isLocale } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getActivities().map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const a = getActivities().find((x) => x.slug === slug);
  return a ? { title: a.title[locale], description: a.summary[locale] } : {};
}

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const activity = getActivities().find((a) => a.slug === slug);
  if (!activity) notFound();
  const th = l === "th" ? "th" : undefined;

  return (
    <>
      <PageHeader
        eyebrow={`${formatDate(activity.dateIso, l)}${activity.place ? ` · ${activity.place}` : ""}`}
        title={activity.title[l]}
        locale={l}
        backHref={`/${l}/activities`}
        backLabel={S.activities.label[l]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-7">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p lang={th} className="text-lg leading-relaxed text-ink-soft">
              {activity.summary[l]}
            </p>
          </div>
          <aside className="md:col-span-4 md:col-start-9">
            <dl className="border-t border-rule pt-4 text-sm">
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-ink-soft">{formatDate(activity.dateIso, l)}</dt>
                <dd lang={th} className="text-right">
                  {S.activities.strands[activity.strand][l]}
                </dd>
              </div>
              {activity.place && (
                <div className="flex justify-between gap-4 border-t border-rule py-2">
                  <dt className="text-ink-soft">{activity.place}</dt>
                  <dd />
                </div>
              )}
            </dl>
          </aside>
        </div>
      </div>
    </>
  );
}
