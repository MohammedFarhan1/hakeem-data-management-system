import { notFound } from "next/navigation";

import { DynamicRecordForm } from "@/components/forms/dynamic-record-form";
import { ServiceStatusBanner } from "@/components/ui/service-status-banner";
import { requireAuthenticatedUser } from "@/lib/auth";
import { categoryConfigMap, categorySectionMap } from "@/lib/categories";
import { getReferenceData } from "@/lib/data";
import { getSupabaseUnavailableMessage } from "@/lib/supabase/errors";

interface FormPageProps {
  params: {
    category: string;
  };
}

export default async function FormPage({ params }: FormPageProps) {
  const config = categoryConfigMap[params.category as keyof typeof categoryConfigMap];
  const section = categorySectionMap[params.category as keyof typeof categorySectionMap];

  if (!config) {
    notFound();
  }

  const [{ profile, serviceUnavailable }, referenceData] = await Promise.all([
    requireAuthenticatedUser(),
    getReferenceData()
  ]);
  const { departments, academicYears, categories } = referenceData;
  const matchedCategory = categories.find((category) => category.name === config.dbCategoryName);
  const showServiceWarning = serviceUnavailable || referenceData.serviceUnavailable;

  if (showServiceWarning) {
    return (
      <div className="space-y-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-forest/70">
            {section?.label ?? "HDMS Form"}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ink">{config.label}</h1>
          <p className="mt-3 max-w-3xl text-slate-600">{config.description}</p>
        </section>

        <ServiceStatusBanner message={getSupabaseUnavailableMessage()} />
      </div>
    );
  }

  if (!matchedCategory) {
    return (
      <div className="rounded-[32px] border border-dashed border-slate-300 bg-linen p-10">
        <h1 className="font-serif text-3xl text-ink">Category seed required</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          The `{config.dbCategoryName}` category is not present in the database yet. Run the Supabase schema and seed
          scripts in `supabase/` before using this form.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-forest/70">
          {section?.label ?? "HDMS Form"}
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink">{config.label}</h1>
        <p className="mt-3 max-w-3xl text-slate-600">{config.description}</p>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-8">
        <DynamicRecordForm
          academicYears={academicYears}
          categoryId={matchedCategory.id}
          config={config}
          departments={departments}
          profile={profile}
        />
      </section>
    </div>
  );
}
