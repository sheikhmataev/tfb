import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { settings } from "@/lib/content";
import { S } from "@/lib/strings";
import { formatDate, formatPrice, isLocale } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const LEAD = {
  en: "Membership costs 50 kr once, for one person or one family. Members are helped first because there are only so many volunteers, but an emergency is answered whether you are a member or not.",
  no: "Medlemskap koster 50 kr én gang, for én person eller én familie. Medlemmer prioriteres fordi vi er få frivillige, men akutte henvendelser besvares uansett om du er medlem eller ikke.",
  th: "ค่าสมาชิก 50 โครนเนอร์ ชำระครั้งเดียว ต่อหนึ่งคนหรือหนึ่งครอบครัว สมาชิกได้รับความช่วยเหลือก่อนเพราะเรามีอาสาสมัครจำกัด แต่กรณีฉุกเฉินเราตอบทุกกรณีไม่ว่าคุณจะเป็นสมาชิกหรือไม่",
};

const STEPS = [
  {
    en: "Send us your name, address, national identity number, phone and email.",
    no: "Send oss navn, adresse, fødselsnummer, telefon og e-post.",
    th: "ส่งชื่อ ที่อยู่ เลขประจำตัวประชาชน เบอร์โทรศัพท์ และอีเมลมาให้เรา",
  },
  {
    en: "Transfer 50 kr to the association account.",
    no: "Overfør 50 kr til foreningens konto.",
    th: "โอนเงิน 50 โครนเนอร์เข้าบัญชีสมาคม",
  },
  {
    en: "We confirm by email. Anyone under 15 needs a guardian to sign.",
    no: "Vi bekrefter på e-post. Er du under 15 år må en foresatt signere.",
    th: "เราจะยืนยันทางอีเมล ผู้ที่อายุต่ำกว่า 15 ปีต้องมีผู้ปกครองลงนาม",
  },
];

const CATCHMENT = {
  en: "The bylaws limit membership to residents of 33 named Hordaland municipalities. Hordaland was merged into Vestland on 1 January 2020 and several of those municipalities no longer exist under those names, so the catchment is being reviewed. If you live in or near Bergen, write to us and we will sort it out.",
  no: "Vedtektene begrenser medlemskap til innbyggere i 33 navngitte Hordaland-kommuner. Hordaland ble slått sammen til Vestland 1. januar 2020, og flere av kommunene finnes ikke lenger under de navnene, så nedslagsfeltet er under revisjon. Bor du i eller nær Bergen, skriv til oss så ordner vi det.",
  th: "ข้อบังคับจำกัดสมาชิกเฉพาะผู้ที่อาศัยใน 33 เทศบาลของจังหวัด Hordaland ซึ่งถูกรวมเข้ากับ Vestland เมื่อ 1 มกราคม 2020 และหลายเทศบาลไม่มีอยู่ในชื่อเดิมแล้ว ขอบเขตพื้นที่จึงอยู่ระหว่างทบทวน หากคุณอาศัยในหรือใกล้เบอร์เกน กรุณาติดต่อเรา",
};

const HOW_TO_JOIN = { en: "How to join", no: "Slik blir du medlem", th: "วิธีสมัครสมาชิก" };
const WHERE_YOU_LIVE = { en: "Where you live", no: "Hvor du bor", th: "พื้นที่ที่อยู่อาศัย" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: S.footer.membership[locale] } : {};
}

export default async function MembershipPage({
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
        eyebrow={S.nav.about[l]}
        title={S.footer.membership[l]}
        lead={LEAD[l]}
        locale={l}
        backHref={`/${l}/about`}
        backLabel={S.about.label[l]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-7">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 lang={th} className="label-caps border-b border-rule pb-3 text-ink">
              {HOW_TO_JOIN[l]}
            </h2>
            <ol className="mt-4">
              {STEPS.map((s, i) => (
                <li key={s.en} className="grid gap-x-5 border-b border-rule py-4 md:grid-cols-[3rem_1fr]">
                  <span className="display text-lotus-deep">{String(i + 1).padStart(2, "0")}</span>
                  <span lang={th} className="text-ink-soft">
                    {s[l]}
                  </span>
                </li>
              ))}
            </ol>

            <h2 lang={th} className="label-caps mt-12 border-b border-rule pb-3 text-ink">
              {WHERE_YOU_LIVE[l]}
            </h2>
            <p lang={th} className="mt-4 max-w-[62ch] text-ink-soft">
              {CATCHMENT[l]}
            </p>
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <div className="border-2 border-ink p-6">
              <p lang={th} className="label-caps text-lotus-deep">
                {S.membership.fee[l]}
              </p>
              <p className="display mt-2 text-3xl leading-none">
                {settings.membershipFeeNok !== null
                  ? formatPrice(settings.membershipFeeNok, l)
                  : ""}
              </p>
              <p lang={th} className="mt-2 text-sm text-ink-soft">
                {S.membership.oneTime[l]}
              </p>

              <dl className="mt-6 border-t border-rule pt-4 text-sm">
                <dt lang={th} className="text-ink-soft">
                  {a.name}
                </dt>
                <dd className="font-medium">{a.bank}</dd>
              </dl>
              {/* Vipps genuinely does not exist. Saying so beats an empty row
                  that reads as an oversight, and beats inventing a number. */}
              <p lang={th} className="mt-3 text-sm text-ink-soft">
                {S.footer.vippsPending[l]}
              </p>

              <a
                href={`mailto:${a.email}?subject=${encodeURIComponent(S.footer.membership[l])}`}
                className="mt-6 block rounded-[2px] border border-ink bg-ink px-6 py-3 text-center text-base font-semibold text-paper no-underline transition-colors duration-150 hover:bg-[#2c2523]"
              >
                {a.email}
              </a>

              {settings.memberCount && (
                <p className="mt-6 border-t border-rule pt-4 text-sm text-ink-soft">
                  {settings.memberCount.value} {S.membership.members[l]},{" "}
                  {S.membership.asOf[l]} {formatDate(settings.memberCount.asOfIso, l)}
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
