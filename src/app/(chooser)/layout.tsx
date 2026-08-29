import type { Metadata } from "next";
import { fontVars } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Thai Foreningen Bergen",
  robots: { index: false, follow: true },
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
