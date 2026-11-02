import { cn } from "../../lib/cn";
import { CATEGORY_COLORS, COLOR_NAMES } from "./categoryOptions";

const ColorPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div role="group" aria-label="Color" className="flex flex-wrap gap-2.5">
      {COLOR_NAMES.map((name) => {
        const isSelected = name === value;

        return (
          <button
            key={name}
            type="button"
            aria-label={name}
            aria-pressed={isSelected}
            onClick={() => onChange(name)}
            className={cn(
              "h-7 w-7 cursor-pointer rounded-full transition-shadow duration-200 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
              CATEGORY_COLORS[name].swatch,
              isSelected &&
                "ring-2 ring-content ring-offset-2 ring-offset-surface",
            )}
          />
        );
      })}
    </div>
  );
};

export default ColorPicker;
