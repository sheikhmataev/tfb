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

const LEAD = {
  en: "What we hold, why we hold it, and what we do not record at all.",
  no: "Hva vi har lagret, hvorfor vi har det, og hva vi ikke registrerer i det hele tatt.",
  th: "ข้อมูลที่เราเก็บ เหตุผลที่เก็บ และสิ่งที่เราไม่บันทึกเลย",
};

const SECTIONS = [
  {
    heading: { en: "Emergency contact is not logged", no: "Akutte henvendelser logges ikke", th: "การติดต่อฉุกเฉินไม่ถูกบันทึก" },
    body: {
      en: "Everyone who takes an emergency call is bound by taushetsplikt. Those calls are not reported to the board and no record of them is kept. This has been the rule since the association started.",
      no: "Alle som tar imot en akutthenvendelse har taushetsplikt. Slike henvendelser rapporteres ikke til styret, og det føres ingen logg over dem. Dette har vært regelen siden foreningen startet.",
      th: "ทุกคนที่รับเรื่องฉุกเฉินมีหน้าที่รักษาความลับตามกฎหมาย เรื่องเหล่านี้ไม่ถูกรายงานต่อคณะกรรมการและไม่มีการเก็บบันทึก กฎนี้มีมาตั้งแต่ก่อตั้งสมาคม",
    },
  },
  {
    heading: { en: "Membership records", no: "Medlemsopplysninger", th: "ข้อมูลสมาชิก" },
    body: {
      en: "For membership we hold your name, address, national identity number, phone and email. It is used to administer your membership and nothing else. Ask us and we will tell you what we hold, correct it, or delete it.",
      no: "For medlemskap lagrer vi navn, adresse, fødselsnummer, telefon og e-post. Det brukes til å administrere medlemskapet ditt og ingenting annet. Spør oss, så forteller vi hva vi har, retter det, eller sletter det.",
      th: "สำหรับการเป็นสมาชิก เราเก็บชื่อ ที่อยู่ เลขประจำตัวประชาชน เบอร์โทรศัพท์ และอีเมล ใช้เพื่อการบริหารสมาชิกภาพเท่านั้น หากสอบถาม เราจะแจ้งว่ามีข้อมูลใด แก้ไข หรือลบให้ได้",
    },
  },
  {
    heading: { en: "Course registration", no: "Kurspåmelding", th: "การลงทะเบียนอบรม" },
    body: {
      en: "Course registration is handled by Thai Restaurantvirksomhet Kurs, which is a separate company. What you send when you register goes to that company, not to the association.",
      no: "Kurspåmelding håndteres av Thai Restaurantvirksomhet Kurs, som er et eget foretak. Det du sender ved påmelding går til det foretaket, ikke til foreningen.",
      th: "การลงทะเบียนอบรมดำเนินการโดย Thai Restaurantvirksomhet Kurs ซึ่งเป็นบริษัทแยกต่างหาก ข้อมูลที่คุณส่งเมื่อลงทะเบียนจะไปยังบริษัทดังกล่าว ไม่ใช่สมาคม",
    },
  },
  {
    heading: { en: "This website", no: "Denne nettsiden", th: "เว็บไซต์นี้" },
    body: {
      en: "No cookies are set and no third party tracking runs on this site. Nothing you read here is tied back to you.",
      no: "Det settes ingen informasjonskapsler, og ingen tredjeparts sporing kjører på denne siden. Ingenting du leser her knyttes tilbake til deg.",
      th: "เว็บไซต์นี้ไม่ตั้งคุกกี้และไม่มีการติดตามจากบุคคลที่สาม สิ่งที่คุณอ่านที่นี่จะไม่ถูกเชื่อมโยงกลับมาที่ตัวคุณ",
    },
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: S.footer.privacy[locale] } : {};
}

export default async function PrivacyPage({
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
      <PageHeader title={S.footer.privacy[l]} lead={LEAD[l]} locale={l} />

      <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-7">
        <div className="max-w-[68ch]">
          {SECTIONS.map((s) => (
            <section key={s.heading.en} className="border-t border-rule py-6">
              <h2 lang={th} className="display text-xl leading-snug">
                {s.heading[l]}
              </h2>
              <p lang={th} className="mt-3 text-ink-soft">
                {s.body[l]}
              </p>
            </section>
          ))}
          <p className="border-t border-rule pt-6 text-sm text-ink-soft">
            {settings.association.name} · {S.contact.orgNumber[l]}{" "}
            {settings.association.orgNumber} ·{" "}
            <a href={`mailto:${settings.association.email}`} className="text-lotus-deep">
              {settings.association.email}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
