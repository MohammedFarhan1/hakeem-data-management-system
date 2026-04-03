"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    router.prefetch("/login");
  }, [router]);

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      startTransition(() => {
        router.replace("/login");
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to sign out right now.");
      setIsSigningOut(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        className="w-full gap-2"
        disabled={isSigningOut || pending}
        variant="secondary"
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4" />
        {isSigningOut || pending ? "Signing out..." : "Sign out"}
      </Button>
      {error ? <p className="text-xs text-coral">{error}</p> : null}
    </div>
  );
}
