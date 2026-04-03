import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-lg rounded-[32px] border border-white/70 bg-white/85 p-10 text-center shadow-float backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-coral/80">Access restricted</p>
        <h1 className="mt-4 font-serif text-4xl text-ink">You do not have permission to view this page.</h1>
        <p className="mt-4 text-slate-600">
          Admin-only routes are protected by middleware and row-level security. Return to your dashboard to continue.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/dashboard">
            <Button>Back to dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
