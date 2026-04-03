import { AppShell } from "@/components/layout/app-shell";
import { requireAuthenticatedUser } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAuthenticatedUser();

  return <AppShell profile={profile}>{children}</AppShell>;
}
