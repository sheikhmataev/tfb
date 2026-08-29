import { settings } from "@/lib/content";
import { S } from "@/lib/strings";
import type { Locale } from "@/lib/types";

/**
 * The one element on the site that never moves. No animation, no collapse,
 * no dismiss: it is what makes leading the page with courses defensible,
 * because the emergency number stays one tap away at any scroll position.
 */
export function HelpBar({ locale }: { locale: Locale }) {
  const { emergency } = settings;
  const tel = `tel:+47${emergency.phone.replace(/\s/g, "")}`;

  return (
    <div className="bg-ink text-paper">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 text-sm sm:px-7 md:h-11 md:flex-nowrap md:py-0">
        <span className="label-caps text-xs text-lotus-light">{S.helpBar.tag[locale]}</span>
        <span className="whitespace-nowrap">
          {emergency.name}{" "}
          <a href={tel} className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
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
