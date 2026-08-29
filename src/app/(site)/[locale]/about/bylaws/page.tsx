import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import bylawsJson from "@content/about/bylaws.json";
import { BYLAWS_NO } from "@/lib/bylaws";
import { S } from "@/lib/strings";
import { formatDate, isLocale } from "@/lib/i18n";
import { LOCALES, type L10n, type Locale } from "@/lib/types";

const meta = bylawsJson as { amendedIso: string; note: L10n; defects: L10n[] };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const DEFECTS_HEADING = {
  en: "Recorded defects in the text",
  no: "Registrerte feil i teksten",
  th: "ข้อบกพร่องที่บันทึกไว้ในตัวบท",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: S.footer.bylaws[locale] } : {};
}

export default async function BylawsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const th = l === "th" ? "th" : undefined;

  return (
    <>
      <PageHeader
        eyebrow={S.nav.about[l]}
        title={S.footer.bylaws[l]}
        lead={`${S.about.bylaws[l]}: ${formatDate(meta.amendedIso, l)}`}
        locale={l}
        backHref={`/${l}/about`}
        backLabel={S.about.label[l]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-7">
        <p lang={th} className="mb-10 max-w-[62ch] border-l-0 border-t border-rule pt-5 text-ink-soft">
          {meta.note[l]}
        </p>

        {/* Reproduced exactly, defects and all. Correcting the text needs an
            årsmøte resolution, not a code change. */}
        <div className="grid gap-x-12 md:grid-cols-12">
          <div className="md:col-span-8 hyphens-auto break-words" lang="nb">
            {BYLAWS_NO.map((block) => (
              <section key={block.ref} className="border-t border-rule py-6">
                <div className="grid gap-x-6 md:grid-cols-[4rem_1fr]">
                  <p className="display text-lotus-deep">{block.ref}</p>
                  <div>
                    {block.heading && (
                      <h2 className="display mb-2 text-lg leading-snug">{block.heading}</h2>
                    )}
                    {block.paragraphs.map((para, i) => (
                      <p key={i} className="mb-3 max-w-[64ch] text-ink-soft last:mb-0">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <aside className="md:col-span-4">
            <div className="sticky top-24 border-2 border-ink p-6">
              <h2 lang={th} className="label-caps text-ink">
                {DEFECTS_HEADING[l]}
              </h2>
              <ol className="mt-4 space-y-4 text-sm text-ink-soft">
                {meta.defects.map((d, i) => (
                  <li key={i} lang={th} className="border-t border-rule pt-3 first:border-t-0 first:pt-0">
                    {d[l]}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
