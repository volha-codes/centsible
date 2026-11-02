import { cn } from "../../lib/cn";
import { CATEGORY_ICONS, ICON_NAMES } from "./categoryOptions";

const IconPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div role="group" aria-label="Icon" className="grid grid-cols-6 gap-2">
      {ICON_NAMES.map((name) => {
        const Icon = CATEGORY_ICONS[name];
        const isSelected = name === value;

        return (
          <button
            key={name}
            type="button"
            aria-label={name.replace("-", " ")}
            aria-pressed={isSelected}
            onClick={() => onChange(name)}
            className={cn(
              "flex h-10 cursor-pointer items-center justify-center rounded-xl border transition-colors duration-200 focus:outline-none focus-visible:ring focus-visible:ring-primary",
              isSelected
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-surface-elevated text-muted hover:text-content",
            )}
          >
            <Icon size={18} />
          </button>
        );
      })}
    </div>
  );
};

export default IconPicker;
