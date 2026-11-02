import { Pencil } from "lucide-react";
import { useState, type FormEvent } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import type { Category, CategoryType } from "../../types";
import { toastShown } from "../ui/uiSlice";
import {
  findDuplicateCategoryNameAndType,
  selectAllCategories,
  updateCategory,
} from "./categoriesSlice";
import CategoryFields from "./CategoryFields";

const EditCategoryDialog = ({
  category,
  onClose,
  onUpdated,
}: {
  category: Category;
  onClose: () => void;
  onUpdated?: (type: CategoryType) => void;
}) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectAllCategories);

  const [name, setName] = useState(category.name);
  const [type, setType] = useState(category.type);
  const [icon, setIcon] = useState(category.icon);
  const [color, setColor] = useState(category.color);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (
      findDuplicateCategoryNameAndType(
        categories,
        name.trim(),
        type,
        category.id,
      )
    ) {
      setNameError("A category with this name and type already exists");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        updateCategory({
          id: category.id,
          changes: { name: name.trim(), type, icon, color },
        }),
      ).unwrap();

      dispatch(toastShown(`Category "${name.trim()}" updated`, "success"));
      onUpdated?.(type);
      onClose();
    } catch {
      dispatch(
        toastShown(`Failed to update "${name.trim()}" category`, "error"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setNameError(null);
  };

  return (
    <Modal open onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Pencil className="text-primary" size={22} />
        </div>
        <h2 className="text-lg font-semibold text-content">
          Edit &quot;{category.name}&quot; category
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <CategoryFields
            name={name}
            setName={handleNameChange}
            nameError={nameError}
            type={type}
            setType={setType}
            icon={icon}
            setIcon={setIcon}
            color={color}
            setColor={setColor}
          />
          <div className="flex justify-end gap-2.5">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditCategoryDialog;
