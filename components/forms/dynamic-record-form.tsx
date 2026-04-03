"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { AcademicYearOption, CategoryConfig, ReferenceOption, UserProfile } from "@/lib/types";

interface DynamicRecordFormProps {
  config: CategoryConfig;
  categoryId: string;
  profile: UserProfile | null;
  departments: ReferenceOption[];
  academicYears: AcademicYearOption[];
}

type ErrorState = Record<string, string>;

const acceptedFileTypes = "application/pdf,image/png,image/jpeg,image/jpg,image/webp";

export function DynamicRecordForm({
  config,
  categoryId,
  profile,
  departments,
  academicYears
}: DynamicRecordFormProps) {
  const router = useRouter();
  const [statusMode, setStatusMode] = useState<"draft" | "submitted">("submitted");
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<ErrorState>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const defaultDepartmentId = useMemo(() => profile?.department_id ?? "", [profile?.department_id]);

  function onFilesChange(event: ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(event.target.files ?? []));
  }

  function validate(formData: FormData) {
    const nextErrors: ErrorState = {};

    if (!String(formData.get("title") ?? "").trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!String(formData.get("academicYearId") ?? "").trim()) {
      nextErrors.academicYearId = "Academic year is required.";
    }

    if (!String(formData.get("departmentId") ?? "").trim()) {
      nextErrors.departmentId = "Department is required.";
    }

    config.fields.forEach((field) => {
      const value = String(formData.get(field.id) ?? "").trim();
      if (field.required && !value) {
        nextErrors[field.id] = `${field.label} is required.`;
      }

      if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        nextErrors[field.id] = "Enter a valid email address.";
      }

      if (field.type === "url" && value) {
        try {
          new URL(value);
        } catch {
          nextErrors[field.id] = "Enter a valid URL.";
        }
      }
    });

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Your session has expired. Please sign in again.");
      setLoading(false);
      return;
    }

    const payload = Object.fromEntries(
      config.fields.map((field) => [field.id, String(formData.get(field.id) ?? "").trim()])
    );

    const departmentId = String(formData.get("departmentId") ?? "").trim();
    const academicYearId = String(formData.get("academicYearId") ?? "").trim();

    const { data: record, error: insertError } = await supabase
      .from("records")
      .insert({
        title: String(formData.get("title") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        category_id: categoryId,
        department_id: departmentId,
        academic_year_id: academicYearId,
        created_by: user.id,
        status: statusMode,
        form_data: payload
      })
      .select("id")
      .single();

    if (insertError || !record) {
      setMessage(insertError?.message ?? "Unable to save the record.");
      setLoading(false);
      return;
    }

    if (files.length) {
      for (const file of files) {
        const extension = file.name.split(".").pop() ?? "bin";
        const filePath = `${user.id}/${record.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

        const { error: uploadError } = await supabase.storage.from("record-files").upload(filePath, file, {
          upsert: false
        });

        if (uploadError) {
          setMessage(`Record saved, but one file failed to upload: ${uploadError.message}`);
          continue;
        }

        await supabase.from("files").insert({
          record_id: record.id,
          file_url: filePath,
          file_type: file.type,
          file_name: file.name
        });
      }
    }

    setMessage(`Record ${statusMode === "draft" ? "saved as draft" : "submitted"} successfully.`);
    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            name="title"
            required
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-forest"
            placeholder={`Enter ${config.label.toLowerCase()} title`}
          />
          {errors.title ? <p className="text-sm text-coral">{errors.title}</p> : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            name="description"
            rows={4}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-forest"
            placeholder="Brief context, summary, or outcome"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Department</label>
          <select
            name="departmentId"
            defaultValue={defaultDepartmentId}
            disabled={profile?.role === "faculty" && Boolean(defaultDepartmentId)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-forest disabled:bg-slate-50"
          >
            <option value="">Select department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          {profile?.role === "faculty" && defaultDepartmentId ? (
            <input type="hidden" name="departmentId" value={defaultDepartmentId} />
          ) : null}
          {errors.departmentId ? <p className="text-sm text-coral">{errors.departmentId}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Academic year</label>
          <select
            name="academicYearId"
            defaultValue=""
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-forest"
          >
            <option value="">Select academic year</option>
            {academicYears.map((academicYear) => (
              <option key={academicYear.id} value={academicYear.id}>
                {academicYear.year}
              </option>
            ))}
          </select>
          {errors.academicYearId ? <p className="text-sm text-coral">{errors.academicYearId}</p> : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {config.fields.map((field) => (
          <div key={field.id} className={field.type === "textarea" ? "space-y-2 md:col-span-2" : "space-y-2"}>
            <label className="text-sm font-medium text-slate-700">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                name={field.id}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-forest"
                placeholder={field.placeholder ?? field.label}
              />
            ) : (
              <input
                name={field.id}
                type={field.type}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-forest"
                placeholder={field.placeholder ?? field.label}
              />
            )}
            {field.helperText ? <p className="text-xs text-slate-500">{field.helperText}</p> : null}
            {errors[field.id] ? <p className="text-sm text-coral">{errors[field.id]}</p> : null}
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-[24px] border border-dashed border-slate-300 bg-linen p-5">
        <div>
          <h3 className="text-lg font-semibold text-ink">Supporting files</h3>
          <p className="text-sm text-slate-600">Upload PDF or image evidence. Files are stored in a private Supabase bucket.</p>
        </div>
        <input
          accept={acceptedFileTypes}
          multiple
          onChange={onFilesChange}
          type="file"
          className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
        />
        {files.length ? (
          <ul className="space-y-2 text-sm text-slate-600">
            {files.map((file) => (
              <li key={`${file.name}-${file.size}`}>{file.name}</li>
            ))}
          </ul>
        ) : null}
      </div>

      {message ? <p className="rounded-2xl bg-tide px-4 py-3 text-sm text-forest">{message}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button
          disabled={loading}
          type="submit"
          variant="secondary"
          onClick={() => setStatusMode("draft")}
        >
          {loading && statusMode === "draft" ? "Saving..." : "Save as draft"}
        </Button>
        <Button disabled={loading} type="submit" onClick={() => setStatusMode("submitted")}>
          {loading && statusMode === "submitted" ? "Submitting..." : "Submit record"}
        </Button>
      </div>
    </form>
  );
}
