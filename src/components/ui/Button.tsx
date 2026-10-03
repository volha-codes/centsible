import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn";

type ButtonVariant = "primary" | "secondary" | "danger";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-background enabled:hover:bg-primary/90 active:bg-primary/80 focus-visible:ring-primary",
  secondary:
    "bg-surface-elevated text-content enabled:hover:bg-surface active:bg-surface/80 focus-visible:ring-primary",
  danger:
    "bg-expense text-background enabled:hover:bg-expense/90 active:bg-expense/80 focus-visible:ring-expense",
};

function Button({
  className,
  variant = "primary",
  type = "button",
  loading = false,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; loading?: boolean }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5.5 py-3 font-medium text-background transition-colors duration-200 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:bg-primary/80 enabled:hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
      disabled={loading || props.disabled}
      aria-busy={loading}
    >
      {loading && <LoaderCircle className="animate-spin" size={16} />}
      {children}
    </button>
  );
}

export default Button;
