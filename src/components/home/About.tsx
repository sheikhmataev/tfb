import { Section, SectionHead } from "@/components/Section";
import { ButtonText } from "@/components/Button";
import { settings } from "@/lib/content";
import { S } from "@/lib/strings";
import { formatDate } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function About({ locale }: { locale: Locale }) {
  const th = locale === "th" ? "th" : undefined;

  // "Founded" and "registered" are different events on different dates. The
  // site says which it means rather than blurring them into one.
  const facts = [
    { label: S.about.founded[locale], value: formatDate(settings.foundedIso, locale) },
    { label: S.about.registered[locale], value: formatDate(settings.registeredIso, locale) },
    { label: S.about.bylaws[locale], value: formatDate(settings.bylawsAmendedIso, locale) },
  ];

  return (
    <Section id="about">
      <div className="grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <SectionHead label={S.about.label[locale]} locale={locale} />
          <p lang={th} className="max-w-[46ch] text-lg text-ink-soft">
            {S.about.lead[locale]}
          </p>
          <div className="mt-7">
            <ButtonText href={`/${locale}/about`}>{S.about.readBackground[locale]}</ButtonText>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <dl>
            {facts.map((f) => (
              <div
                key={f.label}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule py-4 last:border-b"
              >
                <dt lang={th} className="text-ink-soft">
                  {f.label}
                </dt>
                <dd className="display text-lg">{f.value}</dd>
              </div>
            ))}
            {settings.memberCount && (
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule py-4">
                <dt lang={th} className="text-ink-soft">
                  {S.membership.members[locale]}
                </dt>
                {/* Nine years old, so it publishes with its date attached and
                    never as a bare current figure. */}
                <dd className="display text-lg">
                  {settings.memberCount.value}{" "}
                  <span className="font-[family-name:var(--font-text)] text-sm text-ink-soft">
                    {S.membership.asOf[locale]}{" "}
                    {formatDate(settings.memberCount.asOfIso, locale)}
                  </span>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </Section>
  );
}
