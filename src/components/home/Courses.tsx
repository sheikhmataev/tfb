import Image from "next/image";
import { withBase } from "@/lib/site";
import { CourseList } from "@/components/CourseList";
import { Section } from "@/components/Section";
import { getCourses, settings } from "@/lib/content";
import { S } from "@/lib/strings";
import type { Locale } from "@/lib/types";

export function Courses({ locale }: { locale: Locale }) {
  const courses = getCourses();
  const th = locale === "th" ? "th" : undefined;

  return (
    <Section id="courses">
      {/* The courses arm carries its own mark. It heads this section and
          appears nowhere else on the site. */}
      <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-rule pb-6">
        <Image
          src={withBase("/assets/logo-courses.png")}
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

      <CourseList courses={courses} locale={locale} />
    </Section>
  );
}
