import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { settings } from "@/lib/content";
import financesJson from "@content/about/finances.json";
import { S } from "@/lib/strings";
import { formatPrice, isLocale } from "@/lib/i18n";
import { LOCALES, type L10n, type Locale } from "@/lib/types";

type Line = { label: L10n; nok: number };
type Year = { year: number; status: string; income: Line[]; expenditure: Line[] };

const years = financesJson as Year[];

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const LEAD = {
  en: "The association publishes what came in and what went out, line by line. Two board signatures are required for every transaction, and the leader and treasurer authorise spending jointly.",
  no: "Foreningen publiserer hva som kom inn og hva som gikk ut, post for post. Hver transaksjon krever to signaturer fra styret, og leder og kasserer autoriserer utgifter sammen.",
  th: "สมาคมเปิดเผยรายรับและรายจ่ายเป็นรายการ ทุกธุรกรรมต้องมีลายเซ็นกรรมการสองท่าน และประธานกับเหรัญญิกอนุมัติค่าใช้จ่ายร่วมกัน",
};
const GAP = {
  en: "Accounts were published every year from 2011 to 2015. The years after that have not been entered yet.",
  no: "Regnskap ble publisert hvert år fra 2011 til 2015. Årene etter det er ikke lagt inn ennå.",
  th: "มีการเผยแพร่บัญชีทุกปีตั้งแต่ 2011 ถึง 2015 ส่วนปีหลังจากนั้นยังไม่ได้บันทึก",
};
const T = {
  income: { en: "Income", no: "Inntekter", th: "รายรับ" },
  expenditure: { en: "Expenditure", no: "Utgifter", th: "รายจ่าย" },
  total: { en: "Total", no: "Sum", th: "รวม" },
  balance: { en: "Balance", no: "Resultat", th: "ยอดคงเหลือ" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: S.footer.finances[locale] } : {};
}

export default async function FinancesPage({
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
        title={S.footer.finances[l]}
        lead={LEAD[l]}
        locale={l}
        backHref={`/${l}/about`}
        backLabel={S.about.label[l]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-7">
        {years.map((y) => {
          const inc = y.income.reduce((s, r) => s + r.nok, 0);
          const exp = y.expenditure.reduce((s, r) => s + r.nok, 0);
          return (
            <section key={y.year} className="mb-14">
              <h2 className="display border-b border-ink pb-3 text-2xl">{y.year}</h2>
              <div className="grid gap-10 md:grid-cols-2">
                <LineTable title={T.income[l]} rows={y.income} total={inc} locale={l} />
                <LineTable title={T.expenditure[l]} rows={y.expenditure} total={exp} locale={l} />
              </div>
              <p className="mt-6 flex flex-wrap justify-between gap-4 border-t-2 border-ink pt-4 text-lg">
                <span lang={th} className="font-medium">
                  {T.balance[l]}
                </span>
                <span className="display">{formatPrice(inc - exp, l)}</span>
              </p>
            </section>
          );
        })}

        <p lang={th} className="max-w-[62ch] border-t border-rule pt-6 text-sm text-ink-soft">
          {GAP[l]}
        </p>
        <p className="mt-4 text-sm text-ink-soft">
          {settings.association.name} · {S.contact.orgNumber[l]} {settings.association.orgNumber} ·{" "}
          {settings.association.bank}
        </p>
      </div>
    </>
  );
}

function LineTable({
  title,
  rows,
  total,
  locale,
}: {
  title: string;
  rows: Line[];
  total: number;
  locale: Locale;
}) {
  const th = locale === "th" ? "th" : undefined;
  return (
    <div className="mt-6">
      <h3 lang={th} className="label-caps mb-2 text-ink-soft">
        {title}
      </h3>
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label.en} className="border-b border-rule">
              <td lang={th} className="py-2.5 pr-4 align-top text-ink-soft">
                {r.label[locale]}
              </td>
              <td className="py-2.5 text-right align-top whitespace-nowrap">
                {formatPrice(r.nok, locale)}
              </td>
            </tr>
          ))}
          <tr>
            <td lang={th} className="py-2.5 pr-4 font-medium">
              {T.total[locale]}
            </td>
            <td className="py-2.5 text-right font-medium whitespace-nowrap">
              {formatPrice(total, locale)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
