import type { Metadata } from "next";
import { fontVars } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Thai Foreningen Bergen",
  robots: { index: false, follow: true },
  // The chooser is the site root, so it is where a crawler looks for the set
  // of language versions. Absolute, because SITE_URL already carries the /tfb
  // subpath and Next would otherwise resolve a relative alternate against
  // metadataBase and emit /tfb/tfb/en/. The keys are the language tags the
  // pages actually declare in <html lang>, so Norwegian is nb, not no.
  alternates: {
    languages: {
      en: `${SITE_URL}/en/`,
      nb: `${SITE_URL}/no/`,
      th: `${SITE_URL}/th/`,
      "x-default": `${SITE_URL}/en/`,
    },
  },
};

/** Root layout for the language chooser at /. The site itself has its own
 *  root layout per locale, so that <html lang> is always correct. */
export default function ChooserLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
