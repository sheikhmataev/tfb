import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { settings } from "@/lib/content";
import { S } from "@/lib/strings";
import { isLocale } from "@/lib/i18n";
import { LOCALES, type Entity, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const COMPLAINT = { en: "Complaints procedure", no: "Klageordning", th: "ขั้นตอนการร้องเรียน" };

/**
 * The nav item above already says "Contact". This heading says what is on the
 * page instead: the addresses, numbers and registration numbers of the two
 * entities, which is what a person scanning for one of them is looking for.
 */
const TITLE = {
  en: "Contact details",
  no: "Kontaktinformasjon",
  th: "ข้อมูลติดต่อ",
};

/** Verbs taken from the page lead, which already says "Write or call". */
const WRITE = { en: "Write", no: "Skriv", th: "เขียน" };
const CALL = { en: "Call", no: "Ring", th: "โทร" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: S.contact.label[locale], description: S.contact.lead[locale] } : {};
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const th = l === "th" ? "th" : undefined;
  const { association, courseProvider, emergency } = settings;

  return (
    <>
      <PageHeader
        eyebrow={S.nav.contact[l]}
        title={TITLE[l]}
        lead={S.contact.lead[l]}
        locale={l}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-7">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="grid gap-10 sm:grid-cols-2 md:col-span-7">
            <EntityBlock title={S.contact.association[l]} entity={association} locale={l} />
            <EntityBlock title={S.contact.courseProvider[l]} entity={courseProvider} locale={l} />
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <div className="border-2 border-ink p-6">
              <p lang={th} className="label-caps text-lotus-deep">
                {S.contact.urgent[l]}
              </p>
              <p className="mt-3 text-ink-soft">{emergency.name}</p>
              <a
                href={`tel:+47${emergency.phone.replace(/\s/g, "")}`}
                className="display mt-1 block text-3xl leading-none text-ink no-underline"
              >
                {emergency.phone}
              </a>
              <p lang={th} className="mt-3 text-sm text-ink-soft">
                {emergency.hours[l]}
              </p>
            </div>

            <Link
              href={`/${l}/contact/complaint`}
              lang={th}
              className="group mt-6 flex min-h-11 items-center justify-between gap-3 border-b border-rule py-3 font-semibold text-ink no-underline transition-colors duration-150 hover:border-lotus"
            >
              {COMPLAINT[l]}
              <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">
                &rsaquo;
              </span>
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}

function EntityBlock({ title, entity, locale }: { title: string; entity: Entity; locale: Locale }) {
  const th = locale === "th" ? "th" : undefined;
  return (
    <div className="border-t border-rule pt-5">
      <p lang={th} className="label-caps text-ink-soft">
        {title}
      </p>
      <p className="display mt-1.5 text-xl leading-snug">{entity.name}</p>
      {/* The address itself is plain, selectable, copyable text and the link is
          a short named action beside it. A value cell that is entirely a link
          reads as a row of buttons rather than as a register, and it made a
          third of the block's glyphs lotus. */}
      <dl className="mt-4 space-y-2.5">
        <div>
          <dt lang={th} className="text-ink-soft">
            {S.contact.email[locale]}
          </dt>
          <dd className="flex flex-wrap items-center gap-x-4">
            <span className="break-words">{entity.email}</span>
            <a
              href={`mailto:${entity.email}`}
              aria-label={`${WRITE[locale]} ${entity.name}`}
              className="inline-flex min-h-11 items-center text-lotus-deep underline underline-offset-4"
            >
              {WRITE[locale]}
            </a>
          </dd>
        </div>
        <div>
          <dt lang={th} className="text-ink-soft">
            {S.contact.phone[locale]}
          </dt>
          <dd className="flex flex-wrap items-center gap-x-4">
            <span>{entity.phone}</span>
            <a
              href={`tel:${entity.phone.replace(/\s/g, "")}`}
              aria-label={`${CALL[locale]} ${entity.name}`}
              className="inline-flex min-h-11 items-center text-lotus-deep underline underline-offset-4"
            >
              {CALL[locale]}
            </a>
          </dd>
        </div>
        <div>
          <dt lang={th} className="text-ink-soft">
            {S.contact.postal[locale]}
          </dt>
          <dd className="not-italic">
            {entity.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt lang={th} className="text-ink-soft">
            {S.contact.orgNumber[locale]}
          </dt>
          <dd>{entity.orgNumber}</dd>
        </div>
      </dl>
    </div>
  );
}
