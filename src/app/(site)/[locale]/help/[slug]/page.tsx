import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getHelpService, getHelpServices } from "@/lib/content";
import { S } from "@/lib/strings";
import { isLocale } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getHelpServices().map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const s = getHelpService(slug);
  return s ? { title: s.title[locale], description: s.body[locale].slice(0, 155) } : {};
}

export default async function HelpDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const service = getHelpService(slug);
  if (!service) notFound();
  const th = l === "th" ? "th" : undefined;

  return (
    <>
      <PageHeader
        eyebrow={service.label[l]}
        title={service.title[l]}
        locale={l}
        backHref={`/${l}/help`}
        backLabel={S.help.label[l]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-7">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p lang={th} className="text-lg leading-relaxed text-ink-soft">
              {service.body[l]}
            </p>
          </div>

          {(service.phone || service.href) && (
            <aside className="md:col-span-4 md:col-start-9">
              <div className="border-2 border-ink p-6">
                {service.phone && (
                  <>
                    <p lang={th} className="label-caps text-lotus-deep">
                      {S.contact.phone[l]}
                    </p>
                    <a
                      href={`tel:+47${service.phone.replace(/\s/g, "")}`}
                      className="display mt-2 block text-3xl leading-none text-ink no-underline"
                    >
                      {service.phone}
                    </a>
                  </>
                )}
                {service.hours && (
                  <p lang={th} className="mt-3 text-sm text-ink-soft">
                    {service.hours[l]}
                  </p>
                )}
                {service.href && (
                  <a
                    href={service.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    lang={th}
                    className="mt-4 inline-block font-semibold text-lotus-deep underline-offset-4"
                  >
                    {S.help.visitSite[l]}
                  </a>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
