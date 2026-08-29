import { Section, SectionHead } from "@/components/Section";
import { settings } from "@/lib/content";
import { S } from "@/lib/strings";
import type { Entity, Locale } from "@/lib/types";

export function Contact({ locale }: { locale: Locale }) {
  const { association, courseProvider, emergency } = settings;
  const th = locale === "th" ? "th" : undefined;

  return (
    <Section id="contact">
      <SectionHead label={S.contact.label[locale]} lead={S.contact.lead[locale]} locale={locale} />

      <div className="grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="grid gap-8 sm:grid-cols-2 md:col-span-7">
          <EntityCard title={S.contact.association[locale]} entity={association} locale={locale} />
          <EntityCard
            title={S.contact.courseProvider[locale]}
            entity={courseProvider}
            locale={locale}
          />
        </div>

        {/* Someone who scrolled this far may have been looking for exactly
            this, so it repeats at full size rather than as a footnote. */}
        <div className="md:col-span-4 md:col-start-9">
          <div className="border-2 border-ink p-6">
            <p lang={th} className="label-caps text-lotus-deep">
              {S.contact.urgent[locale]}
            </p>
            <p className="mt-3 text-ink-soft">{emergency.name}</p>
            <a
              href={`tel:+47${emergency.phone.replace(/\s/g, "")}`}
              className="display mt-1 block text-3xl leading-none text-ink no-underline"
            >
              {emergency.phone}
            </a>
            <p lang={th} className="mt-3 text-sm text-ink-soft">
              {emergency.hours[locale]}
            </p>
            <p lang={th} className="mt-1 text-sm text-ink-soft">
              {S.helpBar.interpreter[locale]}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function EntityCard({
  title,
  entity,
  locale,
}: {
  title: string;
  entity: Entity;
  locale: Locale;
}) {
  const th = locale === "th" ? "th" : undefined;
  return (
    <div className="border-t border-rule pt-5">
      <p lang={th} className="label-caps text-xs text-ink-soft">
        {title}
      </p>
      <p className="display mt-1.5 text-lg leading-snug">{entity.name}</p>
      <dl className="mt-4 space-y-2 text-sm">
        <Row label={S.contact.email[locale]} lang={th}>
          <a href={`mailto:${entity.email}`} className="inline-flex min-h-11 items-center text-lotus-deep underline-offset-4">
            {entity.email}
          </a>
        </Row>
        <Row label={S.contact.phone[locale]} lang={th}>
          <a href={`tel:${entity.phone.replace(/\s/g, "")}`} className="inline-flex min-h-11 items-center text-lotus-deep underline-offset-4">
            {entity.phone}
          </a>
        </Row>
        <Row label={S.contact.orgNumber[locale]} lang={th}>
          {entity.orgNumber}
        </Row>
        <Row label={S.contact.postal[locale]} lang={th}>
          <span className="not-italic">{entity.address.join(", ")}</span>
        </Row>
      </dl>
    </div>
  );
}

function Row({
  label,
  children,
  lang,
}: {
  label: string;
  children: React.ReactNode;
  lang?: string;
}) {
  return (
    <div className="flex flex-wrap gap-x-3">
      <dt lang={lang} className="min-w-[7rem] text-ink-soft">
        {label}
      </dt>
      <dd className="flex-1">{children}</dd>
    </div>
  );
}
