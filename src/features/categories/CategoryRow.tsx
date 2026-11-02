import { Pencil, Trash2 } from "lucide-react";

import type { Category } from "../../types";
import CategoryIcon from "./CategoryIcon";

const ACTION_CLASSES =
  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-surface-elevated text-muted transition-colors duration-200 focus:outline-none focus-visible:ring focus-visible:ring-primary";

const CategoryRow = ({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <CategoryIcon icon={category.icon} color={category.color} />
      <div className="min-w-0 flex-1 truncate font-medium">{category.name}</div>

      <button
        type="button"
        aria-label={`Edit ${category.name}`}
        onClick={onEdit}
        className={`${ACTION_CLASSES} hover:text-content`}
      >
        <Pencil size={14} />
      </button>
      <button
        type="button"
        aria-label={`Delete ${category.name}`}
        onClick={onDelete}
        className={`${ACTION_CLASSES} hover:text-expense`}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default CategoryRow;
