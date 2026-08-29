import Link from "next/link";
import { Mark } from "./Mark";
import { settings } from "@/lib/content";
import { S } from "@/lib/strings";
import type { Locale } from "@/lib/types";

export function Footer({ locale }: { locale: Locale }) {
  const { association, courseProvider } = settings;

  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-7">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[4fr_3fr_3fr_3fr]">
          <div>
            {/* The supplied lockup has a pure black wordmark, so on ink it is
                the reduced mark plus a text wordmark, not the lockup file. */}
            <div className="flex items-center gap-3">
              <Mark className="w-10 shrink-0 text-paper" />
              <span className="display text-sm uppercase tracking-[0.08em]">
                {S.siteName[locale]}
              </span>
            </div>
            <div className="mt-5 space-y-1 text-sm text-[#d8d0ce]">
              <p>{S.about.founded[locale]}, 8.1.2010</p>
              <p>
                {S.contact.orgNumber[locale]} {association.orgNumber}
              </p>
              {settings.frivilligsentral && <p>{S.footer.frivilligsentral[locale]}</p>}
            </div>
          </div>

          <div>
            <FooterHeading>{S.footer.sections[locale]}</FooterHeading>
            <ul className="text-sm">
              {(["help", "calendar", "articles", "about", "courses", "contact"] as const).map((k) => (
                <li key={k}>
                  <Link href={`/${locale}/${k}`} className="flex min-h-11 items-center text-[#d8d0ce] no-underline hover:text-paper hover:underline">
                    {S.nav[k][locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading>{S.footer.contact[locale]}</FooterHeading>
            <p className="mb-3 text-sm text-[#a89f9d]">{S.footer.rolesForward[locale]}</p>
            <address className="space-y-1 text-sm not-italic text-[#d8d0ce]">
              <p>
                <a href={`mailto:${association.email}`} className="inline-flex min-h-11 items-center text-[#d8d0ce] hover:text-paper">
                  {association.email}
                </a>
              </p>
              <p>
                <a href={`tel:${association.phone.replace(/\s/g, "")}`} className="inline-flex min-h-11 items-center text-[#d8d0ce] hover:text-paper">
                  {association.phone}
                </a>
              </p>
              <p className="pt-3">
                {association.address.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </p>
            </address>
          </div>

          <div>
            <FooterHeading>{S.footer.support[locale]}</FooterHeading>
            <div className="space-y-1 text-sm text-[#d8d0ce]">
              <p>{association.name}</p>
              <p>{association.bank}</p>
              {/* Vipps does not exist. The row simply does not render, and no
                  plausible-looking number is ever invented in its place. */}
              <p className="pt-2 text-[#a89f9d]">{S.footer.vippsPending[locale]}</p>
              <p className="pt-3">
                <Link href={`/${locale}/about/finances`} className="inline-flex min-h-11 items-center text-[#d8d0ce] hover:text-paper">
                  {S.footer.finances[locale]}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Two legal entities share this site. The one that takes course money
            is named here in its own right, never merged into the association. */}
        <div className="mt-10 border-t border-paper/20 pt-6 text-xs text-[#a89f9d]">
          <p>
            {S.footer.separateEntity[locale]}: {courseProvider.name},{" "}
            {S.contact.orgNumber[locale]} {courseProvider.orgNumber},{" "}
            {courseProvider.address.join(", ")}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-paper/20 pt-6 text-xs text-[#a89f9d]">
          <p>
            {S.siteName[locale]} · {S.contact.orgNumber[locale]} {association.orgNumber}
          </p>
          <div className="flex flex-wrap gap-x-6">
            <Link href={`/${locale}/about/bylaws`} className="inline-flex min-h-11 items-center text-[#a89f9d] hover:text-paper">
              {S.footer.bylaws[locale]}
            </Link>
            <Link href={`/${locale}/about/membership`} className="inline-flex min-h-11 items-center text-[#a89f9d] hover:text-paper">
              {S.footer.membership[locale]}
            </Link>
            <Link href={`/${locale}/privacy`} className="inline-flex min-h-11 items-center text-[#a89f9d] hover:text-paper">
              {S.footer.privacy[locale]}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="display mb-3 text-xs uppercase tracking-[0.07em] text-[#c9bfbd]">{children}</p>
  );
}
