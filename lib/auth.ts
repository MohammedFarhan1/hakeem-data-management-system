import { redirect } from "next/navigation";

import { UserProfile } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { getErrorMessage, isSupabaseConnectionError } from "@/lib/supabase/errors";

interface CurrentUserResult {
  user: any | null;
  profile: UserProfile | null;
  serviceUnavailable: boolean;
}

export async function getCurrentUserAndProfile(): Promise<CurrentUserResult> {
  try {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { user: null, profile: null, serviceUnavailable: false };
    }

    const { data: profile } = await supabase
      .from("users")
      .select("id, name, email, role, department_id, departments(name)")
      .eq("id", user.id)
      .maybeSingle();

    const department = Array.isArray(profile?.departments) ? profile.departments[0] : profile?.departments;

    return {
      user,
      profile: profile
        ? ({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            department_id: profile.department_id,
            department_name: department?.name ?? null
          } satisfies UserProfile)
        : null,
      serviceUnavailable: false
    };
  } catch (error) {
    if (isSupabaseConnectionError(error)) {
      console.warn("Supabase auth unavailable:", getErrorMessage(error));
      return { user: null, profile: null, serviceUnavailable: true };
    }

    throw error;
  }
}

export async function requireAuthenticatedUser() {
  const result = await getCurrentUserAndProfile();

  if (!result.user && !result.serviceUnavailable) {
    redirect("/login");
  }

  return result;
}

export async function requireAdminUser() {
  const result = await requireAuthenticatedUser();

  if (!result.serviceUnavailable && result.profile?.role !== "admin") {
    redirect("/unauthorized");
  }

  return result;
}
