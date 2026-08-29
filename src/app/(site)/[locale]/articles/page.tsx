import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryRow } from "@/components/EntryRow";
import { PageHeader } from "@/components/PageHeader";
import { getEntries } from "@/lib/content";
import { S } from "@/lib/strings";
import { isLocale } from "@/lib/i18n";
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
  return isLocale(locale) ? { title: S.nav.articles[locale] } : {};
}

const LEAD = {
  en: "Everything the association has published, newest first. The strands are a filter, not a separate place.",
  no: "Alt foreningen har publisert, nyeste først. Kategoriene er et filter, ikke et eget sted.",
  th: "ทุกสิ่งที่สมาคมเผยแพร่ เรียงจากใหม่ไปเก่า หมวดหมู่เป็นเพียงตัวกรอง ไม่ใช่ที่เก็บแยกต่างหาก",
};

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const entries = getEntries();
  const th = l === "th" ? "th" : undefined;

  return (
    <>
      <PageHeader title={S.nav.articles[l]} lead={LEAD[l]} locale={l} />
      <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-7">
        {entries.length === 0 ? (
          <p lang={th} className="border-t border-rule py-8 text-ink-soft">
            {S.entries.empty[l]}
          </p>
        ) : (
          <ul className="border-b border-rule">
            {entries.map((e) => (
              <EntryRow key={e.id} entry={e} locale={l} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
