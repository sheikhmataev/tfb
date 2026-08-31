import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { settings, getAgencyGroups, getHelpServices } from "@/lib/content";
import { S } from "@/lib/strings";
import { isLocale } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: S.help.label[locale], description: S.help.lead[locale] };
}

export default async function HelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const th = l === "th" ? "th" : undefined;
  const { emergency } = settings;

  return (
    <>
      <PageHeader
        eyebrow={S.nav.help[l]}
        title={S.help.label[l]}
        lead={S.help.lead[l]}
        locale={l}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-7">
        {/* The help bar repeated in the page, because someone who came here
            directly should not have to look up for it. */}
        <div className="mb-12 border-2 border-ink p-6">
          <p lang={th} className="label-caps text-lotus-deep">
            {S.helpBar.tag[l]}
          </p>
          <p className="mt-3 text-ink-soft">{emergency.name}</p>
          <a
            href={`tel:+47${emergency.phone.replace(/\s/g, "")}`}
            className="display mt-1 block text-[clamp(2rem,5vw,2.875rem)] leading-none text-ink no-underline"
          >
            {emergency.phone}
          </a>
          <p lang={th} className="mt-3 text-ink-soft">
            {emergency.hours[l]} · {S.helpBar.interpreter[l]}
          </p>
        </div>

        <div className="grid gap-x-12 md:grid-cols-2">
          {getHelpServices().map((s) => (
            <article key={s.id} className="group border-t border-rule py-6">
              <p lang={th} className="label-caps text-xs text-lotus-deep">
                {s.label[l]}
              </p>
              <h2 lang={th} className="display mt-1.5 text-xl leading-snug">
                {s.title[l]}
              </h2>
              <p lang={th} className="mt-3 max-w-[56ch] text-ink-soft">
                {s.body[l]}
              </p>
              <Link
                href={`/${l}/help/${s.slug}`}
                lang={th}
                className="mt-2 inline-flex min-h-11 items-center font-semibold text-ink no-underline"
              >
                {S.help.readMore[l]}{" "}
                <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">
                  &rsaquo;
                </span>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-16">
          <h2 lang={th} className="label-caps border-b border-rule pb-3 text-ink">
            {S.help.directory[l]}
          </h2>
          <div className="mt-7 grid gap-x-10 gap-y-10 md:grid-cols-3">
            {getAgencyGroups().map((g) => (
              <div key={g.heading.en}>
                <p lang={th} className="mb-3 border-b border-rule pb-2 text-sm font-semibold">
                  {g.heading[l]}
                </p>
                <ul>
                  {g.items.map((a) => (
                    <li key={a.name} className="border-b border-rule text-sm last:border-b-0">
                      <a
                        href={a.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-11 items-center py-2 font-semibold text-lotus-deep underline-offset-4"
                      >
                        {a.name}
                        <span className="sr-only"> ({S.common.externalLink[l]})</span>
                      </a>
                      {a.phone && (
                        <a
                          href={`tel:+47${a.phone.replace(/\s/g, "")}`}
                          className="inline-flex min-h-11 items-center whitespace-nowrap font-semibold text-lotus-deep"
                        >
                          {a.phone}
                        </a>
                      )}
                      <span lang={th} className="mt-0.5 block text-ink-soft">
                        {a.note[l]}
                      </span>
                      <span className="block text-xs text-ink-soft">
                        {new URL(a.href).host.replace(/^www\./, "")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
