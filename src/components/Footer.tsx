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
              <span className="display text-lg uppercase tracking-[0.08em]">
                {S.siteName[locale]}
              </span>
            </div>
            {/* The founding date and the frivilligsentral affiliation are facts
                about the association, not footer furniture. They are on /about,
                stated once, and were repeated here on all 66 pages. */}
            <p className="mt-5 text-base text-[#d8d0ce]">
              {S.contact.orgNumber[locale]} {association.orgNumber}
            </p>
          </div>

          <div>
            <FooterHeading>{S.sections[locale]}</FooterHeading>
            <ul className="text-base">
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
            <address className="space-y-1 text-base not-italic text-[#d8d0ce]">
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
            <div className="space-y-1 text-base text-[#d8d0ce]">
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
        <div className="mt-10 border-t border-paper/20 pt-6 text-base text-[#a89f9d]">
          <p>
            {S.footer.separateEntity[locale]}: {courseProvider.name},{" "}
            {S.contact.orgNumber[locale]} {courseProvider.orgNumber},{" "}
            {courseProvider.address.join(", ")}
          </p>
        </div>

        {/* The name is on the wordmark at the head of this footer and the
            organisation number is in the column under it. A colophon repeating
            both is the sort of line a public body prints out of habit. */}
        <div className="mt-6 flex flex-wrap gap-x-6 border-t border-paper/20 pt-6 text-base text-[#a89f9d]">
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
    </footer>
  );
}

/**
 * Public Sans at the 17px body size, not Marcellus at 20px. Setting the column
 * heads in the display serif would make them the largest thing in the footer
 * and turn a legal and contact strip into a brochure masthead; at the body size
 * nothing down here outranks the text it introduces, and the caps alone carry
 * the head. No tracking class: these carry no lang guard, and tracking Thai
 * destroys word boundaries in a script that has no inter-word spaces.
 */
function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-base uppercase text-[#c9bfbd]">{children}</p>
  );
}
