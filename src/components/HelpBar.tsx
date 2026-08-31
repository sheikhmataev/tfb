import { settings } from "@/lib/content";
import { S } from "@/lib/strings";
import type { Locale } from "@/lib/types";

/**
 * The full emergency notice: who to call, the number, the hours, and the offer
 * of an interpreter. It sits once at the top of the document, in normal flow.
 *
 * It is deliberately NOT the pinned element. Pinning a black band to the top of
 * every page made it the topmost persistent thing on the site, which is the
 * position a reader reads as the navigation, and it was not navigation. The
 * requirement it exists to satisfy, that the number stays reachable at any
 * scroll position, is met by the sticky section line in MastheadNav, which
 * carries the same number in lotus-deep and is a bar a person can also navigate
 * from. One persistent bar, doing both jobs, instead of two competing for the
 * top of the viewport.
 */
export function HelpBar({ locale }: { locale: Locale }) {
  const { emergency } = settings;
  const tel = `tel:+47${emergency.phone.replace(/\s/g, "")}`;

  return (
    <div className="bg-ink text-paper">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 text-base sm:px-7 md:min-h-11 md:flex-nowrap md:py-0">
        {/* Public Sans, not the display serif: the tag only has to name the bar,
            and it must stay smaller than the number it introduces. It carries no
            tracking class because it carries no lang guard, and Thai has no
            inter-word spaces to survive being tracked. */}
        <span className="uppercase text-lotus-light">{S.helpBar.tag[locale]}</span>
        <span className="whitespace-nowrap">
          {emergency.name}{" "}
          <a href={tel} className="inline-flex min-h-11 items-center text-lg font-semibold underline underline-offset-4">
            {emergency.phone}
          </a>
        </span>
        <span className="text-[#b9b0ae]">{emergency.hours[locale]}</span>
        <span className="ml-auto hidden text-[#b9b0ae] lg:inline">
          {S.helpBar.interpreter[locale]}
        </span>
      </div>
    </div>
  );
}
