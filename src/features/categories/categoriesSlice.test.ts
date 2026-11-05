import type { Category } from "../../types";
import categoriesReducer, {
  fetchCategories,
  findDuplicateCategoryNameAndType,
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
    name: "Salary",
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
      findDuplicateCategoryNameAndType(categories, "Salary", "expense"),
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
});
