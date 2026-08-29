import Image from "next/image";
import { ButtonPrimary, ButtonText } from "@/components/Button";
import { S } from "@/lib/strings";
import { settings } from "@/lib/content";
import type { Locale } from "@/lib/types";

export function Hero({ locale }: { locale: Locale }) {
  const th = locale === "th" ? "th" : undefined;

  return (
    <section className="mx-auto max-w-[1180px] px-4 pb-4 pt-14 sm:px-7 md:pt-20">
      <div className="grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <p lang={th} className="label-caps text-lotus-deep">
            {S.hero.eyebrow[locale]}
          </p>
          <h1
            lang={th}
            className="display mt-5 text-[clamp(2.375rem,5vw,3.875rem)] leading-[1.05] tracking-[0.005em]"
          >
            {S.siteName[locale]}
          </h1>
          <p lang={th} className="mt-6 max-w-[52ch] text-lg text-ink-soft">
            {S.hero.lead[locale]}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonPrimary href={`/${locale}/courses`}>{S.hero.primary[locale]}</ButtonPrimary>
            <ButtonText href={`/${locale}/help`}>{S.hero.secondary[locale]}</ButtonText>
          </div>
          <p lang={th} className="mt-8 border-t border-rule pt-4 text-sm text-ink-soft">
            {S.hero.proof[locale]} · {S.contact.orgNumber[locale]}{" "}
            {settings.association.orgNumber}
          </p>
        </div>

        {/* The entire hero animation: the mask opens once on mount. The
            headline does not move. Pure CSS, so this stays a server component
            and the page ships no animation library. */}
        <div className="md:col-span-5">
          <div className="petal-mask petal-open relative aspect-square bg-petal min-[1240px]:-mr-10">
            <Image
              src="/assets/hero-bryggen.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
