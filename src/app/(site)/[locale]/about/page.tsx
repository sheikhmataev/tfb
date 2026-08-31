import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { settings } from "@/lib/content";
import { S } from "@/lib/strings";
import { formatDate, isLocale } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: S.about.label[locale], description: S.about.lead[locale] };
}

const PURPOSE = [
  {
    en: "Help anyone of Thai origin who needs an interpreter, or who needs to reach a lawyer, the police, a hospital, the crisis centre or Barnevernet.",
    no: "Hjelpe individer med thailandsk opprinnelse som trenger tolk, eller som trenger å ta kontakt med advokat, politi, sykehus, krisesenter eller barnevernet.",
    th: "ช่วยเหลือผู้มีเชื้อสายไทยที่ต้องการล่าม หรือที่ต้องติดต่อทนาย ตำรวจ โรงพยาบาล ศูนย์ช่วยเหลือ หรือหน่วยงานคุ้มครองเด็ก",
  },
  {
    en: "Act as a point of contact between immigrants, the Norwegian authorities and the voluntary sector.",
    no: "Være et kontaktorgan mellom innvandrere, de norske myndighetene og de frivillige organisasjonene.",
    th: "เป็นตัวกลางระหว่างผู้ย้ายถิ่น หน่วยงานราชการนอร์เวย์ และองค์กรอาสาสมัคร",
  },
  {
    en: "Keep Thai traditions and culture going here, and pass them on.",
    no: "Bevare og videreføre thailandske tradisjoner og kultur.",
    th: "รักษาและสืบทอดประเพณีและวัฒนธรรมไทย",
  },
  {
    en: "Collect for disaster relief and for social aid in Thailand: schools, shelters, care homes.",
    no: "Samle inn til katastrofehjelp og til sosialt arbeid i Thailand: skoler, krisesentre, aldershjem.",
    th: "ระดมทุนเพื่อช่วยเหลือผู้ประสบภัยและงานสังคมสงเคราะห์ในประเทศไทย ทั้งโรงเรียน ที่พักพิง และบ้านพักคนชรา",
  },
  {
    en: "Build understanding between immigrants and Norwegian society, and work for fairness and equal treatment for families.",
    no: "Skape kulturell forståelse mellom innvandrere og det norske samfunnet, og arbeide for rettferdighet og likebehandling for familier.",
    th: "สร้างความเข้าใจระหว่างผู้ย้ายถิ่นกับสังคมนอร์เวย์ และทำงานเพื่อความเป็นธรรมและการปฏิบัติอย่างเท่าเทียมต่อครอบครัว",
  },
];

/**
 * In English and Norwegian the nav item and the page title are already
 * different words. In Thai they are the same string, so the Thai title is said
 * in full, with the association's own name, which the nav item cannot carry.
 */
const TITLE = { ...S.about.label, th: `เกี่ยวกับ${S.siteName.th}` };

const SUBPAGES = [
  { href: "board", key: "board" },
  { href: "bylaws", key: "bylaws" },
  { href: "finances", key: "finances" },
  { href: "membership", key: "membership" },
] as const;

const SUBLABEL = {
  board: { en: "The board", no: "Styret", th: "คณะกรรมการ" },
  bylaws: S.footer.bylaws,
  finances: S.footer.finances,
  membership: S.footer.membership,
};

export default async function AboutPage({
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
        lead={S.about.lead[l]}
        locale={l}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-7">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 lang={th} className="label-caps border-b border-rule pb-3 text-ink">
              § 5
            </h2>
            <ul className="mt-4">
              {PURPOSE.map((p) => (
                <li key={p.en} lang={th} className="border-b border-rule py-4 text-ink-soft">
                  {p[l]}
                </li>
              ))}
            </ul>
            <p lang={th} className="mt-6 text-sm text-ink-soft">
              {S.about.bylaws[l]}: {formatDate(settings.bylawsAmendedIso, l)}.{" "}
              <Link
                href={`/${l}/about/bylaws`}
                className="inline-flex min-h-11 items-center text-lotus-deep"
              >
                {S.footer.bylaws[l]}
              </Link>
            </p>
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <dl className="border-t border-rule">
              <Fact label={S.about.founded[l]} value={formatDate(settings.foundedIso, l)} lang={th} />
              <Fact label={S.about.registered[l]} value={formatDate(settings.registeredIso, l)} lang={th} />
              <Fact label={S.contact.orgNumber[l]} value={settings.association.orgNumber} lang={th} />
              {settings.memberCount && (
                <Fact
                  label={S.membership.members[l]}
                  value={`${settings.memberCount.value} (${S.membership.asOf[l]} ${formatDate(settings.memberCount.asOfIso, l)})`}
                  lang={th}
                />
              )}
            </dl>

            <nav className="mt-8">
              {SUBPAGES.map((s) => (
                <Link
                  key={s.key}
                  href={`/${l}/about/${s.href}`}
                  lang={th}
                  className="group flex min-h-11 items-center justify-between gap-3 border-b border-rule py-3 font-semibold text-ink no-underline transition-colors duration-150 hover:border-lotus"
                >
                  {SUBLABEL[s.key][l]}
                  <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">
                    &rsaquo;
                  </span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      </div>
    </>
  );
}

function Fact({ label, value, lang }: { label: string; value: string; lang?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule py-3">
      <dt lang={lang} className="text-sm text-ink-soft">
        {label}
      </dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
