import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getActivities } from "@/lib/content";
import { S } from "@/lib/strings";
import { formatDate, isLocale } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";

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
  return { title: S.activities.label[locale], description: S.activities.lead[locale] };
}

const STRANDS = ["charity", "culture", "food-festivals"] as const;

export default async function ActivitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const activities = getActivities();
  const th = l === "th" ? "th" : undefined;

  return (
    <>
      <PageHeader
        eyebrow={S.nav.activities[l]}
        title={S.activities.label[l]}
        lead={S.activities.lead[l]}
        locale={l}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-7">
        <nav className="mb-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-rule pb-4">
          {STRANDS.map((s) => (
            <Link
              key={s}
              href={`/${l}/activities/strand/${s}`}
              lang={th}
              className="text-sm font-semibold text-lotus-deep underline-offset-4"
            >
              {S.activities.strands[s][l]}
            </Link>
          ))}
        </nav>

        {activities.length === 0 ? (
          <p lang={th} className="border-t border-rule py-8 text-ink-soft">
            {S.activities.empty[l]}
          </p>
        ) : (
          <ul>
            {activities.map((a) => (
              <li key={a.id} className="group border-t border-rule transition-colors duration-150 hover:border-lotus">
                <Link href={`/${l}/activities/${a.slug}`} className="grid gap-x-8 gap-y-1 py-6 no-underline md:grid-cols-12">
                  <div className="md:col-span-3">
                    <p className="text-sm text-ink-soft">{formatDate(a.dateIso, l)}</p>
                    <p lang={th} className="text-xs uppercase tracking-[0.05em] text-lotus-deep">
                      {S.activities.strands[a.strand][l]}
                    </p>
                  </div>
                  <div className="md:col-span-9">
                    <h2 lang={th} className="display text-xl leading-snug text-ink">
                      {a.title[l]}
                    </h2>
                    <p lang={th} className="mt-2 max-w-[64ch] text-ink-soft">
                      {a.summary[l]}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
