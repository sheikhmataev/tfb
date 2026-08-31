import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getCourse, getCourses, settings } from "@/lib/content";
import { S } from "@/lib/strings";
import { formatPrice, isLocale } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getCourses().map((c) => ({ locale, slug: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const course = getCourse(slug);
  if (!course) return {};
  return { title: course.title[locale], description: course.summary[locale] };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const course = getCourse(slug);
  if (!course) notFound();
  const th = l === "th" ? "th" : undefined;
  const p = settings.courseProvider;

  const facts: Array<[string, string]> = [
    [S.courses.price[l], course.priceNok !== null ? formatPrice(course.priceNok, l) : ""],
    [S.courses.hours[l], course.format[l]],
    [S.courses.regulator[l], course.regulator ?? ""],
    [S.courses.nextDate[l], course.nextDateIso ?? S.courses.tbd[l]],
  ];

  return (
    <>
      <PageHeader
        eyebrow={S.nav.courses[l]}
        title={course.title[l]}
        lead={course.summary[l]}
        locale={l}
        backHref={`/${l}/courses`}
        backLabel={S.courses.label[l]}
      />

      <div className="mx-auto grid max-w-[1180px] gap-12 px-4 py-12 sm:px-7 md:grid-cols-12">
        <div className="md:col-span-7">
          <section aria-labelledby="who-for">
            <h2 id="who-for" lang={th} className="label-caps border-b border-rule pb-3 text-ink">
              {S.courses.whoFor[l]}
            </h2>
            <p lang={th} className="mt-4 text-lg text-ink-soft">
              {course.audience[l]}
            </p>
          </section>

          <section aria-labelledby="what-you-learn" className="mt-12">
            <h2
              id="what-you-learn"
              lang={th}
              className="label-caps border-b border-rule pb-3 text-ink"
            >
              {S.courses.whatYouLearn[l]}
            </h2>
            <ul className="mt-4">
              {course.outcomes.map((o) => (
                <li key={o.en} lang={th} className="border-b border-rule py-3.5 text-ink-soft">
                  {o[l]}
                </li>
              ))}
            </ul>
          </section>

          {/* Says what the certificate is, and stops there. It documents that
              the training was completed; it is not an agency accreditation. */}
          <p lang={th} className="mt-10 max-w-[62ch] text-sm text-ink-soft">
            {S.courses.certificateNote[l]}
          </p>
        </div>

        <aside className="md:col-span-5">
          <div className="border-2 border-ink p-6">
            <dl>
              {facts.filter(([, v]) => v !== "").map(([k, v]) => (
                <div
                  key={k}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule py-3 last:border-b-0"
                >
                  <dt lang={th} className="text-sm text-ink-soft">
                    {k}
                  </dt>
                  <dd lang={th} className="text-right font-medium">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>

            {course.capacity && (
              <p lang={th} className="mt-4 border-t border-rule pt-4 text-sm text-ink-soft">
                {S.courses.seats[l]} · {S.courses.noExam[l]} · {S.courses.certificatePosted[l]}
              </p>
            )}

            <a
              href={`mailto:${p.email}?subject=${encodeURIComponent(course.title[l])}`}
              className="mt-6 block rounded-[2px] border border-ink bg-ink px-6 py-3 text-center text-base font-semibold text-paper no-underline transition-colors duration-150 hover:bg-[#2c2523]"
            >
              {S.courses.register[l]}
            </a>

            {/* Payment goes to a different legal entity than the association.
                Never leave that to be worked out from context. */}
            <div className="mt-6 border-t border-rule pt-4 text-sm text-ink-soft">
              <p className="font-medium text-ink">{p.name}</p>
              <p>
                {S.contact.orgNumber[l]} {p.orgNumber}
              </p>
              <p>{p.bank}</p>
              <p className="mt-2">
                <a href={`mailto:${p.email}`} className="text-lotus-deep">
                  {p.email}
                </a>
              </p>
              <p>
                <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="text-lotus-deep">
                  {p.phone}
                </a>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
