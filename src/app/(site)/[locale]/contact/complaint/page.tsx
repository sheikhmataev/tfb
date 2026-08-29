import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { settings } from "@/lib/content";
import { S } from "@/lib/strings";
import { isLocale } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const TITLE = { en: "Complaints", no: "Klage", th: "การร้องเรียน" };
const LEAD = {
  en: "You can call first and talk it through. A formal complaint has to be in writing so there is a record of it.",
  no: "Du kan ringe først og snakke om det. En formell klage må være skriftlig, slik at den er dokumentert.",
  th: "คุณสามารถโทรมาปรึกษาก่อนได้ การร้องเรียนอย่างเป็นทางการต้องทำเป็นลายลักษณ์อักษรเพื่อให้มีหลักฐาน",
};
const STEPS = [
  {
    en: "Email your name, the subject, what happened, and what you want to come of it.",
    no: "Send e-post med navn, hva saken gjelder, hva som skjedde, og hva du ønsker skal skje.",
    th: "ส่งอีเมลระบุชื่อ หัวข้อ เหตุการณ์ที่เกิดขึ้น และสิ่งที่คุณต้องการให้เกิดขึ้น",
  },
  {
    en: "The secretary passes it to the chair.",
    no: "Sekretæren sender den videre til lederen.",
    th: "เลขานุการส่งเรื่องต่อให้ประธาน",
  },
  {
    en: "The board meets, considers it and reaches a conclusion.",
    no: "Styret møtes, behandler saken og kommer til en konklusjon.",
    th: "คณะกรรมการประชุม พิจารณา และหาข้อสรุป",
  },
  {
    en: "You are told the outcome.",
    no: "Du får beskjed om resultatet.",
    th: "เราจะแจ้งผลให้คุณทราบ",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: TITLE[locale] } : {};
}

export default async function ComplaintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const th = l === "th" ? "th" : undefined;
  const a = settings.association;

  return (
    <>
      <PageHeader
        eyebrow={S.nav.contact[l]}
        title={TITLE[l]}
        lead={LEAD[l]}
        locale={l}
        backHref={`/${l}/contact`}
        backLabel={S.contact.label[l]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-7">
        <ol className="max-w-[62ch]">
          {STEPS.map((s, i) => (
            <li key={s.en} className="grid gap-x-5 border-b border-rule py-4 md:grid-cols-[3rem_1fr]">
              <span className="display text-lotus-deep">{String(i + 1).padStart(2, "0")}</span>
              <span lang={th} className="text-ink-soft">
                {s[l]}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-8">
          <a href={`mailto:${a.email}`} className="font-semibold text-lotus-deep underline-offset-4">
            {a.email}
          </a>
        </p>
      </div>
    </>
  );
}
