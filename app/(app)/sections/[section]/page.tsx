import Link from "next/link";
import { notFound } from "next/navigation";

import { ServiceStatusBanner } from "@/components/ui/service-status-banner";
import { requireAuthenticatedUser } from "@/lib/auth";
import { formSectionMap } from "@/lib/categories";
import { getReferenceData } from "@/lib/data";
import { getSupabaseUnavailableMessage } from "@/lib/supabase/errors";

interface SectionPageProps {
  params: {
    section: string;
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { serviceUnavailable } = await requireAuthenticatedUser();
  const section = formSectionMap[params.section as keyof typeof formSectionMap];

  if (!section) {
    notFound();
  }

  const referenceData = await getReferenceData();
  const showServiceWarning = serviceUnavailable || referenceData.serviceUnavailable;
  const availableCategoryNames = new Set(referenceData.categories.map((category) => category.name));
  const showResearchSeedStatus = section.id === "research-details";

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-[linear-gradient(135deg,_rgba(15,92,77,1),_rgba(24,24,27,0.92))] p-8 text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-white/70">Section</p>
        <h1 className="mt-3 font-serif text-4xl">{section.label}</h1>
        <p className="mt-3 max-w-3xl text-white/75">{section.description}</p>
      </section>

      {showServiceWarning ? <ServiceStatusBanner message={getSupabaseUnavailableMessage()} /> : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Forms in this section</h2>
          <p className="text-slate-600">
            Select a form below to start entering data for {section.label.toLowerCase()}.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {section.categories.map((category) => {
            const categorySeeded = availableCategoryNames.has(category.dbCategoryName);
            const showNeedsSeed = showResearchSeedStatus && !categorySeeded;

            return (
              <Link
                key={category.slug}
                href={`/forms/${category.slug}`}
                prefetch
                className="rounded-[24px] border border-slate-200 bg-linen p-5 transition hover:-translate-y-0.5 hover:border-forest/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-lg font-semibold text-ink">{category.label}</p>
                  {showNeedsSeed ? (
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                      Needs seed
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-slate-600">{category.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
