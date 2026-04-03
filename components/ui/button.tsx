import { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
  }
>;

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-forest text-white hover:bg-forest/90",
        variant === "secondary" && "bg-white text-ink shadow-sm ring-1 ring-ink/10 hover:bg-linen",
        variant === "ghost" && "bg-transparent text-ink hover:bg-white/60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
