import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getActivities } from "@/lib/content";
import { S } from "@/lib/strings";
import { formatDate, isLocale } from "@/lib/i18n";
import { LOCALES, type Activity, type Locale } from "@/lib/types";

const STRANDS = ["charity", "culture", "food-festivals"] as const;
type Strand = (typeof STRANDS)[number];

function isStrand(v: string): v is Strand {
  return (STRANDS as readonly string[]).includes(v);
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => STRANDS.map((strand) => ({ locale, strand })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; strand: string }>;
}): Promise<Metadata> {
  const { locale, strand } = await params;
  if (!isLocale(locale) || !isStrand(strand)) return {};
  return { title: S.activities.strands[strand][locale] };
}

export default async function StrandPage({
  params,
}: {
  params: Promise<{ locale: string; strand: string }>;
}) {
  const { locale, strand } = await params;
  if (!isLocale(locale) || !isStrand(strand)) notFound();
  const l = locale as Locale;
  const items: Activity[] = getActivities().filter((a) => a.strand === strand);
  const th = l === "th" ? "th" : undefined;

  return (
    <>
      <PageHeader
        eyebrow={S.activities.label[l]}
        title={S.activities.strands[strand][l]}
        locale={l}
        backHref={`/${l}/activities`}
        backLabel={S.activities.label[l]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-7">
        {items.length === 0 ? (
          <p lang={th} className="border-t border-rule py-8 text-ink-soft">
            {S.activities.empty[l]}
          </p>
        ) : (
          <ul>
            {items.map((a) => (
              <li key={a.id} className="group border-t border-rule transition-colors duration-150 hover:border-lotus">
                <Link href={`/${l}/activities/${a.slug}`} className="grid gap-x-8 gap-y-1 py-6 no-underline md:grid-cols-12">
                  <p className="text-sm text-ink-soft md:col-span-3">{formatDate(a.dateIso, l)}</p>
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
