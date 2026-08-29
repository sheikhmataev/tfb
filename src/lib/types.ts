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

export type Strand = "culture" | "charity" | "festival" | "notice";

/**
 * ONE content type. There are no news items, activities or events as separate
 * things: there are entries, and a date decides where an entry appears. The
 * board never chooses a section, it sets a date and the page sorts itself.
 */
export interface Entry {
  id: string;
  slug: string;
  status: Status;
  strand: Strand;
  /** When the entry itself was published. */
  publishedAt: string;
  /** Set when the entry is an occasion rather than a report. */
  eventStartsAt: string | null;
  eventEndsAt: string | null;
  /** Lunar festivals have no fixed Gregorian date until the year is close. */
  dateIsApproximate: boolean;
  /** Shown inline when the date is approximate, so a reader never has to guess why. */
  approximateReason: L10n | null;
  venue: L10n | null;
  leadImage: string | null;
  /** Provenance when the entry came from a Facebook or Instagram post. */
  sourceUrl: string | null;
  sourcePlatform: "facebook" | "instagram" | null;
  sourceFetchedAt: string | null;
  sourceLocked: boolean;
  title: L10n;
  summary: L10n;
  body: L10n | null;
  updatedAt: string;
}

export interface FactRow {
  id: string;
  label: L10n;
  value: L10n;
  /** The year the figure was true. A dated fact, never a bare current claim. */
  asOf: string | null;
  href: string | null;
}

export interface BoardFunction {
  id: string;
  title: L10n;
  norwegianTitle: string;
  seats: number;
  duties: L10n;
  authority: "final" | "core" | "committee";
}
