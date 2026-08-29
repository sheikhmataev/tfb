import Link from "next/link";
import { Section, SectionHead } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { getAgencyGroups, getHelpServices } from "@/lib/content";
import { S } from "@/lib/strings";
import type { Locale } from "@/lib/types";

export function Help({ locale }: { locale: Locale }) {
  const services = getHelpServices();
  const groups = getAgencyGroups();
  const th = locale === "th" ? "th" : undefined;

  return (
    <Section id="help" className="bg-paper">
      <SectionHead label={S.help.label[locale]} lead={S.help.lead[locale]} locale={locale} />

      {/* Deliberately uneven: 7/5 then 5/7, so the reading rhythm alternates
          and copy length can follow the situation rather than a grid. */}
      <div className="grid gap-x-12 md:grid-cols-12">
        {services.map((s, i) => (
          <Reveal
            key={s.id}
            delay={i * 0.06}
            className={
              i % 2 === 0
                ? "md:col-span-7"
                : "md:col-span-5 md:col-start-8"
            }
          >
            <article className="group border-t border-rule py-5 transition-colors duration-150 hover:border-lotus">
              <p lang={th} className="label-caps text-xs text-lotus-deep">
                {s.label[locale]}
              </p>
              <h3 lang={th} className="display mt-1.5 text-lg leading-snug">
                {s.title[locale]}
              </h3>
              <p lang={th} className="mt-2 max-w-[58ch] text-ink-soft">
                {s.body[locale]}
              </p>
              {s.phone ? (
                <a
                  href={`tel:+47${s.phone.replace(/\s/g, "")}`}
                  className="mt-3 inline-block py-1 font-semibold text-ink no-underline"
                >
                  {s.phone}{" "}
                  <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">
                    &rsaquo;
                  </span>
                </a>
              ) : (
                <Link
                  href={`/${locale}/help/${s.slug}`}
                  lang={th}
                  className="mt-3 inline-block py-1 font-semibold text-ink no-underline"
                >
                  {S.help.readMore[locale]}{" "}
                  <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">
                    &rsaquo;
                  </span>
                </Link>
              )}
              {s.hours && (
                <p lang={th} className="mt-1 text-sm text-ink-soft">
                  {s.hours[locale]}
                </p>
              )}
            </article>
          </Reveal>
        ))}
      </div>

      {/* The embassy's banner rail, rebuilt as typography. No logos. */}
      <div className="mt-16">
        <h3 lang={th} className="label-caps border-b border-rule pb-3 text-ink">
          {S.help.directory[locale]}
        </h3>
        <div className="mt-7 grid gap-x-10 gap-y-10 md:grid-cols-3">
          {groups.map((g) => (
            <div key={g.heading.en}>
              <p lang={th} className="mb-3 border-b border-rule pb-2 text-sm font-semibold">
                {g.heading[locale]}
              </p>
              <ul className="space-y-3.5">
                {g.items.map((a) => (
                  <li key={a.name} className="text-sm">
                    <a
                      href={a.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-lotus-deep underline-offset-4"
                    >
                      {a.name}
                      <span className="sr-only"> ({S.common.externalLink[locale]})</span>
                    </a>
                    {a.phone && (
                      <a
                        href={`tel:+47${a.phone.replace(/\s/g, "")}`}
                        className="ml-2 whitespace-nowrap font-semibold text-ink"
                      >
                        {a.phone}
                      </a>
                    )}
                    <span lang={th} className="mt-0.5 block text-ink-soft">
                      {a.note[locale]}
                    </span>
                    <span className="block text-xs text-ink-soft">
                      {new URL(a.href).host.replace(/^www\./, "")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
