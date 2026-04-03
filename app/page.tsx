import { redirect } from "next/navigation";

import { getCurrentUserAndProfile } from "@/lib/auth";

export default async function HomePage() {
  const { user } = await getCurrentUserAndProfile();

  redirect(user ? "/dashboard" : "/login");
}
