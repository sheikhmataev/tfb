import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseTable } from "@/components/CourseTable";
import { PageHeader } from "@/components/PageHeader";
import { getCourses, settings } from "@/lib/content";
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
  if (!isLocale(locale)) return {};
  return { title: S.courses.label[locale], description: S.courses.lead[locale] };
}

const FACTS = ["hours", "seats", "noExam", "certificatePosted"] as const;

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const courses = getCourses();
  const th = l === "th" ? "th" : undefined;

  return (
    <>
      <PageHeader
        eyebrow={S.nav.courses[l]}
        title={S.courses.label[l]}
        lead={S.courses.lead[l]}
        locale={l}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-7">
        <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-rule pb-6">
          <Image
            src="/assets/logo-courses.png"
            alt={settings.courseProvider.name}
            width={1915}
            height={1423}
            className="h-14 w-auto md:h-16"
          />
          <p lang={th} className="max-w-[46ch] text-sm text-ink-soft">
            {S.courses.providerNote[l]}
          </p>
        </div>

        <div className="border-2 border-ink p-5 sm:p-8">
          <CourseTable courses={courses} locale={l} />
          <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-2.5 border-t border-rule pt-5 text-sm text-ink-soft">
            <li lang={th}>{courses[0]?.format[l]}</li>
            {FACTS.map((k) => (
              <li key={k} lang={th}>
                {S.courses[k][l]}
              </li>
            ))}
          </ul>
        </div>

        <p lang={th} className="mt-8 max-w-[62ch] text-sm text-ink-soft">
          {S.courses.certificateNote[l]}
        </p>
      </div>
    </>
  );
}
