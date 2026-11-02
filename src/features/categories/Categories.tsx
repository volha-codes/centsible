import { Plus } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import SegmentedControl from "../../components/ui/SegmentedControl";
import type { CategoryType } from "../../types";
import { toastShown } from "../ui/uiSlice";
import {
  createCategory,
  fetchCategories,
  findDuplicateCategoryNameAndType,
  selectAllCategories,
  selectCategoriesError,
  selectCategoriesStatus,
} from "./categoriesSlice";
import CategoryFields from "./CategoryFields";
import { DEFAULT_COLOR, DEFAULT_ICON } from "./categoryOptions";
import CategoryRow from "./CategoryRow";

const Categories = () => {
  const dispatch = useAppDispatch();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const status = useAppSelector(selectCategoriesStatus);
  const categories = useAppSelector(selectAllCategories);
  const error = useAppSelector(selectCategoriesError);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [type, setType] = useState<CategoryType>("expense");
  const [icon, setIcon] = useState<string>(DEFAULT_ICON);
  const [color, setColor] = useState<string>(DEFAULT_COLOR);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<CategoryType>("expense");

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");
  const visibleCategories =
    activeType === "expense" ? expenseCategories : incomeCategories;

  const tabOptions: { value: CategoryType; label: string }[] = [
    { value: "expense", label: `Expense (${expenseCategories.length})` },
    { value: "income", label: `Income (${incomeCategories.length})` },
  ];

  useEffect(() => {
    if (status === "idle") void dispatch(fetchCategories());
  }, [status, dispatch]);

  useEffect(() => {
    if (!justAddedId) return;

    document
      .getElementById(`category-${justAddedId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [justAddedId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (findDuplicateCategoryNameAndType(categories, name.trim(), type)) {
      setNameError("A category with this name and type already exists");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await dispatch(
        createCategory({ name: name.trim(), type, icon, color }),
      ).unwrap();

      dispatch(
        toastShown(
          `Category "${created.name}" created successfully.`,
          "success",
        ),
      );

      setName("");
      setIcon(DEFAULT_ICON);
      setColor(DEFAULT_COLOR);
      setNameError(null);
      setActiveType(type);

      if (window.matchMedia("(pointer: coarse)").matches) {
        nameInputRef.current?.blur();
        setJustAddedId(created.id);
      } else {
        nameInputRef.current?.focus();
      }
    } catch {
      dispatch(
        toastShown("Couldn't create the category. Please try again.", "error"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setNameError(null);
  };

  const content = () => {
    if (status === "idle" || status === "loading") {
      return (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded-lg bg-surface-elevated"
            />
          ))}
        </>
      );
    } else if (status === "failed") {
      return (
        <div className="flex flex-col items-start gap-3">
          <span className="text-sm text-expense">
            {error ?? "Failed to load categories"}
          </span>

          <Button
            variant="secondary"
            onClick={() => void dispatch(fetchCategories())}
          >
            Retry
          </Button>
        </div>
      );
    } else if (status === "succeeded" && categories.length === 0) {
      return <div className="text-sm text-muted">No categories yet.</div>;
    } else {
      return visibleCategories.length === 0 ? (
        <div className="text-sm text-muted">
          No {activeType.toLowerCase()} categories yet.
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {visibleCategories.map((category) => (
            <CategoryRow
              key={category.id}
              id={`category-${category.id}`}
              category={category}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </ul>
      );
    }
  };

  return (
    <div className="flex flex-col items-start gap-5 md:flex-row">
      <Card header="Add Category" className="w-full md:w-auto md:min-w-95">
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
            nameInputRef={nameInputRef}
          />

          <Button type="submit" className="w-full" loading={isSubmitting}>
            <Plus size={16} />
            Add Category
          </Button>
        </form>
      </Card>

      <Card
        header={
          <div className="flex items-center justify-between">
            <span>Your Categories</span>

            {status === "succeeded" && (
              <span className="text-sm font-normal text-muted">
                {categories.length}{" "}
                {categories.length === 1 ? "category" : "categories"}
              </span>
            )}
          </div>
        }
        className="w-full md:flex-1"
      >
        <div className="flex flex-col gap-2">
          {status === "succeeded" && categories.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <SegmentedControl
                label="Category type"
                options={tabOptions}
                value={activeType}
                onChange={setActiveType}
              />
            </div>
          )}

          {content()}
        </div>
      </Card>
    </div>
  );
};

export default Categories;
