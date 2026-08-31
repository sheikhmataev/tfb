import { settings } from "@/lib/content";
import { S } from "@/lib/strings";
import type { Locale } from "@/lib/types";

/**
 * The one element on the site that never moves. No animation, no collapse,
 * no dismiss.
 *
 * It is pinned, and that is load-bearing rather than decorative: a person who
 * reaches this site in trouble may be anywhere on any page when they decide to
 * call, and a number that has scrolled away is a number they have to go looking
 * for. Gate G08 asserts the bar's y is identical at 0, 50 and 100 per cent of
 * scroll on every route and viewport, because this comment claimed the bar never
 * moved for several rounds while the measurement said it left the screen at
 * y -3611 on the homepage.
 */
export function HelpBar({ locale }: { locale: Locale }) {
  const { emergency } = settings;
  const tel = `tel:+47${emergency.phone.replace(/\s/g, "")}`;

  return (
    <div className="sticky top-0 z-50 bg-ink text-paper">
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
