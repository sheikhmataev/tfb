export const LOCALES = ["en", "no", "th"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** Every translatable field is an object, never a bare string. The admin panel
 *  built later writes this same shape into D1, so components never change. */
export type L10n = Record<Locale, string>;

export type Status = "draft" | "published";

export interface Entity {
  name: string;
  orgNumber: string;
  bank: string | null;
  vipps: string | null;
  address: string[];
  email: string;
  phone: string;
}

export interface Settings {
  association: Entity;
  courseProvider: Entity;
  foundedIso: string;
  registeredIso: string;
  bylawsAmendedIso: string;
  membershipFeeNok: number | null;
  memberCount: { value: number; asOfIso: string } | null;
  emergency: { name: string; phone: string; hours: L10n };
  frivilligsentral: boolean;
}

export interface Course {
  id: string;
  slug: string;
  status: Status;
  title: L10n;
  summary: L10n;
  regulator: string | null;
  audience: L10n;
  outcomes: L10n[];
  nextDateIso: string | null;
  priceNok: number | null;
  durationHours: number | null;
  capacity: [number, number] | null;
  format: L10n;
  updatedAt: string;
}

export interface HelpService {
  id: string;
  slug: string;
  label: L10n;
  title: L10n;
  body: L10n;
  phone: string | null;
  href: string | null;
  hours: L10n | null;
}

export interface Agency {
  name: string;
  href: string;
  note: L10n;
  phone?: string;
}

export interface AgencyGroup {
  heading: L10n;
  items: Agency[];
}

export interface Activity {
  id: string;
  slug: string;
  status: Status;
  strand: "charity" | "culture" | "food-festivals";
  title: L10n;
  summary: L10n;
  dateIso: string;
  place: string | null;
  updatedAt: string;
}

export interface BoardFunction {
  id: string;
  title: L10n;
  norwegianTitle: string;
  seats: number;
  duties: L10n;
  authority: "final" | "core" | "committee";
}
