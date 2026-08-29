import type {
  AgencyGroup, BoardFunction, Course, Entry, FactRow, HelpService, Locale, L10n, Settings,
} from "./types";

import settingsJson from "@content/settings.json";
import servicesJson from "@content/help/services.json";
import agenciesJson from "@content/help/agencies.json";
import archiveJson from "@content/entries/archive.json";
import upcomingJson from "@content/entries/upcoming.json";
import factsJson from "@content/about/facts.json";
import boardJson from "@content/board/functions.json";
import foodHygiene from "@content/courses/food-hygiene.json";
import ikMatSystem from "@content/courses/ik-mat-system.json";
import foodAllergy from "@content/courses/food-allergy.json";
import hseLabourLaw from "@content/courses/hse-labour-law.json";

/**
 * The only module that knows where content comes from. When the admin panel
 * lands, this reads from D1 instead of JSON and nothing else in the app moves.
 */

export const settings = settingsJson as Settings;

const allCourses = [foodHygiene, ikMatSystem, foodAllergy, hseLabourLaw] as Course[];

export function getCourses(): Course[] {
  return allCourses.filter((c) => c.status === "published");
}

export function getCourse(slug: string): Course | undefined {
  return allCourses.find((c) => c.slug === slug && c.status === "published");
}

export function getHelpServices(): HelpService[] {
  return servicesJson as HelpService[];
}

export function getHelpService(slug: string): HelpService | undefined {
  return getHelpServices().find((s) => s.slug === slug);
}

export function getAgencyGroups(): AgencyGroup[] {
  return agenciesJson as AgencyGroup[];
}

const allEntries = [...(upcomingJson as Entry[]), ...(archiveJson as Entry[])].filter(
  (e) => e.status === "published",
);

/**
 * The sort key is the LATER of the publish date and the end of the occasion.
 * Sorting by publishedAt alone would drop a festival announced in January and
 * held in October eight months down the list the morning after it happens,
 * which is exactly when people go looking for the photographs.
 */
export function entrySortKey(e: Entry): string {
  return [e.publishedAt, e.eventEndsAt ?? e.eventStartsAt ?? ""].sort().at(-1) as string;
}

function isUpcoming(e: Entry, today: string): boolean {
  const ends = e.eventEndsAt ?? e.eventStartsAt;
  return ends !== null && ends >= today;
}

/** Occasions still ahead of us, nearest first. */
export function getComingUp(today: string, limit = 4): Entry[] {
  return allEntries
    .filter((e) => isUpcoming(e, today))
    .sort((a, b) => (a.eventStartsAt ?? "").localeCompare(b.eventStartsAt ?? ""))
    .slice(0, limit);
}

/** Everything else, most recent first. */
export function getRecently(today: string, limit = 4): Entry[] {
  return allEntries
    .filter((e) => !isUpcoming(e, today))
    .sort((a, b) => entrySortKey(b).localeCompare(entrySortKey(a)))
    .slice(0, limit);
}

export function getEntries(): Entry[] {
  return [...allEntries].sort((a, b) => entrySortKey(b).localeCompare(entrySortKey(a)));
}

export function getEntry(slug: string): Entry | undefined {
  return allEntries.find((e) => e.slug === slug);
}

/**
 * The archive heading is a rule reading the data, not an editorial decision.
 * It flips to "Recently" on its own once the newest entry is under 18 months
 * old, with no code change and no redesign.
 */
export function isArchive(today: string): boolean {
  const newest = getRecently(today, 1)[0];
  if (!newest) return false;
  const then = new Date(entrySortKey(newest));
  const now = new Date(today);
  const months = (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth());
  return months > 18;
}

export function archiveRange(): { from: string; to: string } {
  const years = allEntries.map((e) => entrySortKey(e).slice(0, 4)).sort();
  return { from: years[0], to: years[years.length - 1] };
}

export function getFacts(): FactRow[] {
  return factsJson as FactRow[];
}

export function getBoardFunctions(): BoardFunction[] {
  return boardJson as BoardFunction[];
}

/** Read one locale off a translatable field. */
export function t(field: L10n, locale: Locale): string {
  return field[locale];
}

/** Draft register, printed at build time so placeholder state is never invisible. */
export function draftReport(): string[] {
  const gaps: string[] = [];
  for (const c of allCourses) {
    if (c.status === "draft") gaps.push(`course ${c.slug}: draft`);
    if (c.nextDateIso === null) gaps.push(`course ${c.slug}: nextDateIso unset`);
  }
  for (const e of allEntries) {
    if (e.eventStartsAt && e.venue === null) gaps.push(`entry ${e.slug}: venue unset`);
    if (e.dateIsApproximate) gaps.push(`entry ${e.slug}: date approximate`);
  }
  if (settings.association.vipps === null) gaps.push("settings: association vipps unset");
  if (settings.courseProvider.vipps === null) gaps.push("settings: courseProvider vipps unset");
  return gaps;
}
