import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

const Select = ({
  className,
  children,
  ...props
}: ComponentProps<"select">) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "w-full appearance-none rounded-lg border border-border bg-surface-elevated px-3 py-2 pr-9 text-content focus:outline-none focus-visible:ring focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>

      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted"
        size={16}
      />
    </div>
  );
};

export default Select;
