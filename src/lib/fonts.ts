import { Marcellus, Public_Sans, Sarabun } from "next/font/google";

export const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-marcellus",
  display: "swap",
});

// latin-ext carries æ ø å. A latin-only subset would silently break Norwegian.
export const publicSans = Public_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-public-sans",
  display: "swap",
});

export const sarabun = Sarabun({
  weight: ["400", "600"],
  subsets: ["latin", "thai"],
  variable: "--font-sarabun",
  display: "swap",
});

export const fontVars = `${marcellus.variable} ${publicSans.variable} ${sarabun.variable}`;
