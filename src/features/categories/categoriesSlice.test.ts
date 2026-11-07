import type { Category } from "../../types";
import { logout } from "../auth/authSlice";
import categoriesReducer, {
  createCategory,
  deleteCategory,
  fetchCategories,
  findDuplicateCategoryNameAndType,
  updateCategory,
} from "./categoriesSlice";

const categories: Category[] = [
  {
    id: "1",
    name: "Food",
    type: "expense",
    icon: "shopping-cart",
    color: "red",
  },
  {
    id: "2",
    name: "Food",
    type: "income",
    icon: "shopping-cart",
    color: "amber",
  },
  {
    id: "3",
    name: "Alpha",
    type: "income",
    icon: "shopping-cart",
    color: "teal",
  },
];

describe("findDuplicateCategoryNameAndType", () => {
  it("returns true for an exact name and type match", () => {
    expect(
      findDuplicateCategoryNameAndType(categories, "Food", "expense"),
    ).toBe(true);
  });

  it("returns false for a non-matching name", () => {
    expect(
      findDuplicateCategoryNameAndType(categories, "Transport", "expense"),
    ).toBe(false);
  });

  it("returns true for a name that exists under another type too", () => {
    expect(findDuplicateCategoryNameAndType(categories, "Food", "income")).toBe(
      true,
    );
  });

  it("returns false for a non-matching type", () => {
    expect(
      findDuplicateCategoryNameAndType(categories, "Alpha", "expense"),
    ).toBe(false);
  });

  it("returns false when the only match is the excluded category", () => {
    expect(
      findDuplicateCategoryNameAndType(categories, "Food", "expense", "1"),
    ).toBe(false);
  });

  it("returns true for a case-insensitive name match", () => {
    expect(
      findDuplicateCategoryNameAndType(categories, "FOOD", "expense"),
    ).toBe(true);
  });

  it("returns true for a name with leading/trailing whitespace", () => {
    expect(
      findDuplicateCategoryNameAndType(categories, " Food ", "expense"),
    ).toBe(true);
  });

  it("returns false for an empty category list", () => {
    expect(findDuplicateCategoryNameAndType([], "Food", "expense")).toBe(false);
  });
});

describe("categoriesSlice reducer", () => {
  it("updates status to 'loading' when fetchCategories is pending", () => {
    const initialState = categoriesReducer(undefined, { type: "unknown" });

    const nextState = categoriesReducer(
      initialState,
      fetchCategories.pending("", undefined),
    );

    expect(nextState.status).toBe("loading");
  });

  it("clears any existing error when fetchCategories is pending", () => {
    const initialState = categoriesReducer(undefined, { type: "unknown" });

    const nextState = categoriesReducer(
      initialState,
      fetchCategories.rejected(
        new Error("Failed to fetch categories"),
        "",
        undefined,
      ),
    );

    expect(nextState.error).toBe(
      "Couldn't load categories. Check your connection and try again.",
    );

    const finalState = categoriesReducer(
      nextState,
      fetchCategories.pending("", undefined),
    );

    expect(finalState.error).toBeNull();
  });

  it("updates status to 'failed' when fetchCategories is rejected", () => {
    const initialState = categoriesReducer(undefined, { type: "unknown" });

    const nextState = categoriesReducer(
      initialState,
      fetchCategories.rejected(
        new Error("Failed to fetch categories"),
        "",
        undefined,
      ),
    );

    expect(nextState.status).toBe("failed");
    expect(nextState.error).toBe(
      "Couldn't load categories. Check your connection and try again.",
    );
  });

  it("stores the categories and marks the status as succeeded when fetchCategories is fulfilled", () => {
    const initialState = categoriesReducer(undefined, { type: "unknown" });

    const nextState = categoriesReducer(
      initialState,
      fetchCategories.fulfilled(categories, "", undefined),
    );

    expect(nextState.status).toBe("succeeded");
    expect(nextState.ids).toHaveLength(3);
    expect(nextState.entities["1"]).toEqual(categories[0]);
    expect(nextState.entities["2"]).toEqual(categories[1]);
    expect(nextState.entities["3"]).toEqual(categories[2]);
  });

  it("adds the new category and keeps the existing ones when createCategory is fulfilled", () => {
    const initialState = categoriesReducer(undefined, { type: "unknown" });

    const nextState = categoriesReducer(
      initialState,
      fetchCategories.fulfilled(categories, "", undefined),
    );

    expect(nextState.status).toBe("succeeded");
    expect(nextState.ids).toHaveLength(3);
    expect(nextState.entities["1"]).toEqual(categories[0]);
    expect(nextState.entities["2"]).toEqual(categories[1]);
    expect(nextState.entities["3"]).toEqual(categories[2]);

    const newCategoryData: Omit<Category, "id"> = {
      name: "Transport",
      type: "expense",
      icon: "car",
      color: "blue",
    };

    const newCategory: Category = { id: "4", ...newCategoryData };

    const finalState = categoriesReducer(
      nextState,
      createCategory.fulfilled(newCategory, "", newCategoryData),
    );

    expect(finalState.ids).toHaveLength(4);
    expect(finalState.entities["1"]).toEqual(categories[0]);
    expect(finalState.entities["2"]).toEqual(categories[1]);
    expect(finalState.entities["3"]).toEqual(categories[2]);
    expect(finalState.entities["4"]).toEqual(newCategory);
  });

  it("updates the category and keeps others when updateCategory is fulfilled", () => {
    const initialState = categoriesReducer(undefined, { type: "unknown" });

    const nextState = categoriesReducer(
      initialState,
      fetchCategories.fulfilled(categories, "", undefined),
    );

    expect(nextState.status).toBe("succeeded");
    expect(nextState.ids).toHaveLength(3);

    const updatedData: Omit<Category, "id"> = {
      name: "Transport",
      type: "expense",
      icon: "car",
      color: "blue",
    };

    const updatedCategory: Category = { id: "3", ...updatedData };

    const finalState = categoriesReducer(
      nextState,
      updateCategory.fulfilled(updatedCategory, "", {
        id: "3",
        changes: updatedData,
      }),
    );

    expect(finalState.ids).toHaveLength(3);
    expect(finalState.entities["1"]).toEqual(categories[0]);
    expect(finalState.entities["2"]).toEqual(categories[1]);
    expect(finalState.entities["3"]).toEqual(updatedCategory);
  });

  it("deletes the category and keeps others when deleteCategory is fulfilled", () => {
    const initialState = categoriesReducer(undefined, { type: "unknown" });

    const nextState = categoriesReducer(
      initialState,
      fetchCategories.fulfilled(categories, "", undefined),
    );

    expect(nextState.status).toBe("succeeded");
    expect(nextState.ids).toHaveLength(3);

    const finalState = categoriesReducer(
      nextState,
      deleteCategory.fulfilled("2", "", "2"),
    );

    expect(finalState.ids).toHaveLength(2);
    expect(finalState.entities["1"]).toEqual(categories[0]);
    expect(finalState.entities["2"]).toBeUndefined();
    expect(finalState.entities["3"]).toEqual(categories[2]);
  });

  it("resets the categories to the initial state when logout succeeds", () => {
    const initialState = categoriesReducer(undefined, { type: "unknown" });

    const nextState = categoriesReducer(
      initialState,
      fetchCategories.fulfilled(categories, "", undefined),
    );

    expect(nextState.status).toBe("succeeded");
    expect(nextState.ids).toHaveLength(3);

    const finalState = categoriesReducer(
      nextState,
      logout.fulfilled(undefined, "", undefined),
    );

    expect(finalState.status).toBe("idle");
    expect(finalState.ids).toHaveLength(0);
    expect(finalState.entities).toEqual({});
    expect(finalState.error).toBeNull();
  });

  it("keeps the categories sorted by name when they are loaded", () => {
    const initialState = categoriesReducer(undefined, { type: "unknown" });

    const nextState = categoriesReducer(
      initialState,
      fetchCategories.fulfilled(categories, "", undefined),
    );

    expect(nextState.status).toBe("succeeded");
    expect(nextState.ids).toHaveLength(3);
    expect(nextState.ids).toEqual(["3", "1", "2"]);
  });
});
