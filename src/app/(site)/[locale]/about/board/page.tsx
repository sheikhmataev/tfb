import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getBoardFunctions } from "@/lib/content";
import { S } from "@/lib/strings";
import { isLocale } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const TITLE = { en: "The board", no: "Styret", th: "คณะกรรมการ" };
const LEAD = {
  en: "The association runs eight functions. The bylaws describe only four roles, so what is published here is how the board actually works rather than how the 2016 text describes it.",
  no: "Foreningen driver åtte funksjoner. Vedtektene beskriver bare fire verv, så det som står her er hvordan styret faktisk arbeider, ikke hvordan teksten fra 2016 beskriver det.",
  th: "สมาคมดำเนินงานแปดฝ่าย ข้อบังคับระบุเพียงสี่ตำแหน่ง สิ่งที่แสดงที่นี่จึงเป็นโครงสร้างการทำงานจริง ไม่ใช่ตามตัวบทปี 2016",
};
const AUTHORITY = {
  final: { en: "Final decision authority", no: "Endelig beslutningsmyndighet", th: "อำนาจตัดสินใจสูงสุด" },
  core: { en: "Decides urgent matters", no: "Avgjør hastesaker", th: "ตัดสินเรื่องเร่งด่วน" },
  committee: { en: "Committee", no: "Komité", th: "คณะทำงาน" },
};
const ROSTER_NOTE = {
  en: "Names are held back until the board confirms the current roster. The published list dates from 2017.",
  no: "Navn holdes tilbake til styret bekrefter dagens sammensetning. Den publiserte listen er fra 2017.",
  th: "ยังไม่เผยแพร่รายชื่อจนกว่าคณะกรรมการจะยืนยันรายชื่อปัจจุบัน รายชื่อที่เผยแพร่ไว้เป็นของปี 2017",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: TITLE[locale] } : {};
}

export default async function BoardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const th = l === "th" ? "th" : undefined;

  return (
    <>
      <PageHeader
        eyebrow={S.nav.about[l]}
        title={TITLE[l]}
        lead={LEAD[l]}
        locale={l}
        backHref={`/${l}/about`}
        backLabel={S.about.label[l]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-7">
        <ul className="grid gap-x-12 md:grid-cols-2">
          {getBoardFunctions().map((f) => (
            <li key={f.id} className="border-t border-rule py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 lang={th} className="display text-xl">
                  {f.title[l]}
                </h2>
                <span className="text-xs uppercase tracking-[0.05em] text-lotus-deep">
                  {AUTHORITY[f.authority][l]}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-ink-soft">
                {f.norwegianTitle}
                {f.seats > 1 && ` · ${f.seats}`}
              </p>
              <p lang={th} className="mt-3 max-w-[56ch] text-ink-soft">
                {f.duties[l]}
              </p>
            </li>
          ))}
        </ul>

        <p lang={th} className="mt-10 max-w-[62ch] border-t border-rule pt-6 text-sm text-ink-soft">
          {ROSTER_NOTE[l]}
        </p>
      </div>
    </>
  );
}
