import { NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

const publicPaths = ["/login", "/unauthorized"];

export async function middleware(request: NextRequest) {
  const { response, supabase, user, serviceUnavailable } = await updateSession(request);
  const pathname = request.nextUrl.pathname;
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (serviceUnavailable) {
    return response;
  }

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (user && pathname.startsWith("/admin")) {
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).maybeSingle();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
