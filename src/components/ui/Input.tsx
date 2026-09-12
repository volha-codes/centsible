import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

const Input = ({ className, ...props }: ComponentProps<"input">) => {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-content placeholder:text-placeholder focus:outline-none focus-visible:ring focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
};

export default Input;
