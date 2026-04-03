import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnv } from "@/lib/supabase/env";
import { getErrorMessage, isSupabaseConnectionError } from "@/lib/supabase/errors";

interface CookieMutation {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request
  });

  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieMutation[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request
        });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    return { response, supabase, user, serviceUnavailable: false };
  } catch (error) {
    if (isSupabaseConnectionError(error)) {
      console.warn("Supabase session refresh unavailable:", getErrorMessage(error));
      return { response, supabase, user: null, serviceUnavailable: true };
    }

    throw error;
  }
}
