import { cn } from "../../lib/cn";

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  activeClassName?: string;
}

function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-background p-1",
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-9 cursor-pointer rounded-lg px-3 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring focus-visible:ring-primary",
              isActive
                ? (option.activeClassName ?? "bg-primary text-background")
                : "text-muted hover:text-content",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
