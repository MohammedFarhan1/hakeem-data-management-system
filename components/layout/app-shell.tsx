"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileBarChart2, LayoutDashboard, ShieldCheck } from "lucide-react";

import { SignOutButton } from "@/components/layout/sign-out-button";
import { Role, UserProfile } from "@/lib/types";
import { formSections } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  profile: UserProfile | null;
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "faculty"] },
  { href: "/reports", label: "Reports", icon: FileBarChart2, roles: ["admin", "faculty"] },
  { href: "/admin", label: "Admin", icon: ShieldCheck, roles: ["admin"] }
];

export function AppShell({ children, profile }: AppShellProps) {
  const pathname = usePathname();
  const role = profile?.role ?? "faculty";
  const allowedItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(233,163,25,0.16),_transparent_28%),linear-gradient(180deg,_#f8f6f1,_#eef4f0)] text-ink">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px,1fr] lg:px-6">
        <aside className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-float backdrop-blur">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-forest/70">HDMS</p>
            <h1 className="mt-3 font-serif text-3xl text-ink">Hakeem Data Management System</h1>
            <p className="mt-3 text-sm text-slate-600">
              Secure departmental submissions, categorized evidence, and export-ready reporting.
            </p>
          </div>

          <div className="mb-8 rounded-[24px] bg-tide p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-forest/70">Signed in as</p>
            <p className="mt-2 text-lg font-semibold">{profile?.name ?? "Faculty User"}</p>
            <p className="text-sm text-slate-600">{profile?.email}</p>
            <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-forest">
              {role}
            </p>
          </div>

          <nav className="space-y-2">
            {allowedItems.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    active ? "bg-forest text-white" : "text-slate-700 hover:bg-linen"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">Sections</p>
            <div className="space-y-2">
              {formSections.map((section) => {
                const href = `/sections/${section.id}`;
                const active = pathname.startsWith(href);

                return (
                  <Link
                    key={section.id}
                    href={href}
                    className={cn(
                      "block rounded-2xl px-4 py-3 text-sm font-medium transition",
                      active ? "bg-forest text-white" : "bg-linen text-slate-700 hover:bg-mist"
                    )}
                  >
                    {section.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <SignOutButton />
          </div>
        </aside>

        <main className="rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-float backdrop-blur md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
