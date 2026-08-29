import Image from "next/image";
import { withBase } from "@/lib/site";
import Link from "next/link";
import { Section, SectionHead } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { getActivities } from "@/lib/content";
import { S } from "@/lib/strings";
import { formatDate } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const STRANDS = ["charity", "culture", "food-festivals"] as const;

export function Activities({ locale }: { locale: Locale }) {
  const all = getActivities();
  const [lead, ...rest] = all;
  const secondary = rest.slice(0, 3);
  const th = locale === "th" ? "th" : undefined;

  return (
    <Section id="activities" className="bg-petal">
      <SectionHead
        label={S.activities.label[locale]}
        lead={S.activities.lead[locale]}
        locale={locale}
      />

      {!lead ? (
        <p lang={th} className="border-t border-rule py-8 text-ink-soft">
          {S.activities.empty[locale]}
        </p>
      ) : (
        <div className="grid gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-8">
            <article>
              <Link href={`/${locale}/activities/${lead.slug}`} className="group block no-underline">
                <div className="petal-mask relative aspect-[4/3] bg-ink/10">
                  <Image
                    src={withBase("/assets/activities-lead.jpg")}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 62vw"
                    className="object-cover transition-transform duration-[400ms] group-hover:scale-[1.02]"
                  />
                </div>
                <p className="mt-5 text-sm text-ink-soft">{formatDate(lead.dateIso, locale)}</p>
                <h3 lang={th} className="display mt-1 text-2xl leading-tight text-ink">
                  {lead.title[locale]}
                </h3>
                <p lang={th} className="mt-3 max-w-[62ch] text-ink-soft">
                  {lead.summary[locale]}
                </p>
              </Link>
            </article>
          </Reveal>

          <div className="md:col-span-4">
            {secondary.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.06}>
                <article className="group border-t border-rule py-4 transition-colors duration-150 hover:border-lotus">
                  <Link href={`/${locale}/activities/${a.slug}`} className="no-underline">
                    <p className="text-sm text-ink-soft">{formatDate(a.dateIso, locale)}</p>
                    <h3 lang={th} className="display mt-1 text-lg leading-snug text-ink">
                      {a.title[locale]}
                    </h3>
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 grid gap-x-8 gap-y-4 border-t border-rule pt-6 sm:grid-cols-3">
        {STRANDS.map((s) => (
          <Link
            key={s}
            href={`/${locale}/activities/strand/${s}`}
            lang={th}
            className="group flex items-baseline justify-between gap-3 py-1 font-semibold text-ink no-underline"
          >
            {S.activities.strands[s][locale]}
            <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">
              &rsaquo;
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
