import Image from "next/image";
import { CourseTable } from "@/components/CourseTable";
import { Section, SectionHead } from "@/components/Section";
import { getCourses, settings } from "@/lib/content";
import { S } from "@/lib/strings";
import type { Locale } from "@/lib/types";

const FACTS = ["format", "hours", "seats", "noExam", "certificatePosted"] as const;

export function Courses({ locale }: { locale: Locale }) {
  const courses = getCourses();
  const th = locale === "th" ? "th" : undefined;

  return (
    <Section id="courses">
      {/* The courses arm carries its own mark. It heads this section and
          appears nowhere else on the site. */}
      <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-rule pb-6">
        <Image
          src="/assets/logo-courses.png"
          alt={settings.courseProvider.name}
          width={1915}
          height={1423}
          className="h-14 w-auto md:h-16"
          priority={false}
        />
        <p lang={th} className="max-w-[40ch] text-sm text-ink-soft">
          {S.courses.providerNote[locale]}
        </p>
      </div>

      <div className="border-2 border-ink p-5 sm:p-8">
        <SectionHead
          label={S.courses.label[locale]}
          lead={S.courses.lead[locale]}
          locale={locale}
        />
        <CourseTable courses={courses} locale={locale} />

        <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-2.5 border-t border-rule pt-5 text-sm text-ink-soft">
          {FACTS.map((k) => (
            <li key={k} lang={th}>
              {k === "format"
                ? courses[0]?.format[locale]
                : S.courses[k][locale]}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
