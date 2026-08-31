import Link from "next/link";
import { settings } from "@/lib/content";
import { SectionOpener } from "@/components/Ornament";
import { S } from "@/lib/strings";
import type { Locale } from "@/lib/types";

/**
 * Two numbers, not one, each with its purpose stated in a single line.
 *
 * Krisesenteret is a domestic-violence shelter. Routing a UDI deadline or a
 * Barnevernet letter toward it would be a wrong referral this page authored,
 * so the triage is done for the reader rather than handed to her.
 *
 * This is the only band on the homepage that survives from a page that has its
 * own, and it survives as triage rather than as a copy: who to ring, and which
 * of the two. The hours, the confidentiality note, the agency list and every
 * service in detail are on /help, one link away. A number is worth repeating
 * where a page of prose about the number is not.
 */
export function HelpToday({ locale }: { locale: Locale }) {
  const th = locale === "th" ? "th" : undefined;
  const { emergency, association } = settings;

  const lines = [
    {
      id: "krisesenteret",
      name: emergency.name,
      phone: emergency.phone,
      tel: `tel:+47${emergency.phone.replace(/\s/g, "")}`,
      forWhat: S.helpToday.krisesenterFor[locale],
      note: S.helpToday.krisesenterNote[locale],
    },
    {
      id: "association",
      name: S.siteName[locale],
      phone: association.phone,
      tel: `tel:${association.phone.replace(/\s/g, "")}`,
      forWhat: S.helpToday.associationFor[locale],
      note: S.helpToday.associationNote[locale],
    },
  ];

  return (
    <section id="help" className="scroll-mt-24 border-y border-rule bg-petal">
      <div className="mx-auto max-w-[1180px] px-4 py-11 sm:px-7">
        <SectionOpener className="mb-6" />

        <h2 lang={th} className="display text-[clamp(1.625rem,3vw,1.875rem)] leading-tight">
          {S.helpToday.heading[locale]}
        </h2>
        <p lang={th} className="mt-3 max-w-[62ch] text-ink-soft">
          {S.helpToday.lead[locale]}
        </p>

        <dl className="mt-8">
          {lines.map((l) => (
            <div key={l.id} className="grid gap-x-10 gap-y-1 border-t border-rule py-5 md:grid-cols-[1fr_auto]">
              <div>
                <dt lang={th} className="font-medium">
                  {l.forWhat}
                </dt>
              </div>
              <dd className="md:text-right">
                <p className="text-sm text-ink-soft">{l.name}</p>
                <a
                  href={l.tel}
                  className="inline-flex min-h-11 items-center text-xl font-semibold text-lotus-deep underline-offset-4 hover:underline"
                >
                  {l.phone}
                </a>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 border-t border-rule pt-5">
          <Link
            href={`/${locale}/help`}
            lang={th}
            className="inline-flex min-h-11 items-center font-semibold text-lotus-deep underline-offset-4"
          >
            {S.helpToday.allServices[locale]}
          </Link>
        </p>
      </div>
    </section>
  );
}
