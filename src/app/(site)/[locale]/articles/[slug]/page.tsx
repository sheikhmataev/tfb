import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryRow } from "@/components/EntryRow";
import { PageHeader } from "@/components/PageHeader";
import { entrySortKey, getEntries, getEntry } from "@/lib/content";
import { S } from "@/lib/strings";
import { withBase } from "@/lib/site";
import { formatDate, isLocale } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => getEntries().map((e) => ({ locale, slug: e.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const e = getEntry(slug);
  return e ? { title: e.title[locale], description: e.summary[locale] } : {};
}

const SOURCES = { en: "Sources", no: "Kilder", th: "แหล่งที่มา" };
const RELATED = { en: "Related", no: "Relatert", th: "เนื้อหาที่เกี่ยวข้อง" };
const ORIGINAL = { en: "The original post", no: "Originalinnlegget", th: "โพสต์ต้นฉบับ" };

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const entry = getEntry(slug);
  if (!entry) notFound();
  const th = l === "th" ? "th" : undefined;

  const related = getEntries()
    .filter((e) => e.strand === entry.strand && e.slug !== entry.slug)
    .slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={`${formatDate(entrySortKey(entry), l)}${entry.venue ? ` · ${entry.venue[l]}` : ""}`}
        title={entry.title[l]}
        locale={l}
        backHref={`/${l}/articles`}
        backLabel={S.nav.articles[l]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-7">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-12">
          <div className="md:col-span-7">
            {entry.leadImage && (
              <div className="petal-mask relative mb-8 aspect-[3/2] bg-petal">
                <Image
                  src={withBase(`/assets/${entry.leadImage}`)}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 58vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <p lang={th} className="text-lg leading-relaxed text-ink-soft">
              {entry.summary[l]}
            </p>
            {entry.body && (
              <p lang={th} className="mt-4 leading-relaxed text-ink-soft">
                {entry.body[l]}
              </p>
            )}
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <h2 lang={th} className="label-caps border-b border-rule pb-3 text-ink">
              {SOURCES[l]}
            </h2>
            <dl className="mt-3 text-sm text-ink-soft">
              <div className="border-b border-rule py-2">
                <dt lang={th}>{S.entries.strands[entry.strand][l]}</dt>
              </div>
              {entry.sourcePlatform && entry.sourceFetchedAt && (
                <div className="border-b border-rule py-2">
                  <dt>
                    {entry.sourcePlatform === "facebook"
                      ? S.entries.fromFacebook[l]
                      : S.entries.fromInstagram[l]}
                    , {formatDate(entry.sourceFetchedAt, l)}
                  </dt>
                  {/* The outbound link lives here, never nested inside a row
                      that is itself a link. */}
                  {entry.sourceUrl && (
                    <dd className="mt-1">
                      <a
                        href={entry.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center text-lotus-deep underline-offset-4"
                      >
                        {ORIGINAL[l]}
                      </a>
                    </dd>
                  )}
                </div>
              )}
            </dl>

            {related.length > 0 && (
              <>
                <h2 lang={th} className="label-caps mt-10 border-b border-rule pb-3 text-ink">
                  {RELATED[l]}
                </h2>
                <ul>
                  {related.map((e) => (
                    <EntryRow key={e.id} entry={e} locale={l} />
                  ))}
                </ul>
              </>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
