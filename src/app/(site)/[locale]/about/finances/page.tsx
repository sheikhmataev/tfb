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

/**
 * The authorisation rule is quoted from the bylaws and nothing else. § 7 a says
 * the leader must authorise ordinary operating expenses together with the
 * treasurer, and that the two jointly dispose of the association's accounts. It
 * does not say two signatures are required for every transaction, and the page
 * may not say more than its source.
 */
const LEAD = {
  en: "The association publishes what came in and what went out, line by line. The leader and the treasurer authorise ordinary operating expenses together, and the two dispose of the association's accounts together.",
  no: "Foreningen publiserer hva som kom inn og hva som gikk ut, post for post. Leder og kasserer autoriserer ordinære driftsutgifter sammen, og de to disponerer foreningens kontoer sammen.",
  th: "สมาคมเปิดเผยรายรับและรายจ่ายเป็นรายการ ประธานและเหรัญญิกอนุมัติค่าใช้จ่ายในการดำเนินงานตามปกติร่วมกัน และทั้งสองดูแลบัญชีของสมาคมร่วมกัน",
};

/**
 * The gap note counts the years the page is actually rendering, so it can never
 * drift from the file again. It says nothing about what happened to the years
 * that are missing, because nothing in the repo knows.
 */
const GAP = {
  en: "Accounts are published here for {years}, in full and line by line. No other year has been entered.",
  no: "Regnskap er publisert her for {years}, i sin helhet og post for post. Ingen andre år er lagt inn.",
  th: "บัญชีที่เผยแพร่ที่นี่คือปี {years} ครบถ้วนเป็นรายการ ยังไม่มีการบันทึกปีอื่น",
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
            <section key={y.year} aria-labelledby={`year-${y.year}`} className="mb-14">
              <h2 id={`year-${y.year}`} className="display border-b border-ink pb-3 text-2xl">
                {y.year}
              </h2>
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
          {GAP[l].replace("{years}", years.map((y) => y.year).join(", "))}
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
