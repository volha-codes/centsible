import { createElement } from "react";

import { cn } from "../../lib/cn";
import { getCategoryColor, getCategoryIcon } from "./categoryOptions";

const CategoryIcon = ({
  icon,
  color,
  className,
}: {
  icon: string;
  color: string;
  className?: string;
}) => {
  const { tint, text } = getCategoryColor(color);

  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
        tint,
        text,
        className,
      )}
    >
      {createElement(getCategoryIcon(icon), { size: 18 })}
    </div>
  );
};

export default CategoryIcon;
