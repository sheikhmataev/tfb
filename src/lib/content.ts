import type {
  Activity, AgencyGroup, BoardFunction, Course, HelpService, Locale, L10n, Settings,
} from "./types";

import settingsJson from "@content/settings.json";
import servicesJson from "@content/help/services.json";
import agenciesJson from "@content/help/agencies.json";
import activitiesJson from "@content/activities/index.json";
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

export function getActivities(): Activity[] {
  return (activitiesJson as Activity[])
    .filter((a) => a.status === "published")
    .sort((a, b) => b.dateIso.localeCompare(a.dateIso));
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
  if (settings.association.vipps === null) gaps.push("settings: association vipps unset");
  if (settings.courseProvider.vipps === null) gaps.push("settings: courseProvider vipps unset");
  return gaps;
}
