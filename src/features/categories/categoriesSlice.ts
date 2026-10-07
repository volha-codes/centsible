import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

import type { RootState } from "../../app/store";
import { request } from "../../lib/api";
import type { Category, CategoryType } from "../../types";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

const categoriesAdapter = createEntityAdapter<Category>();

const initialState = categoriesAdapter.getInitialState({
  status: "idle" as RequestStatus,
  error: null as string | null,
});

export const fetchCategories = createAsyncThunk("categories/fetchAll", () =>
  request<Category[]>("/categories"),
);

export const createCategory = createAsyncThunk(
  "categories/create",
  (category: Omit<Category, "id">) =>
    request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(category),
    }),
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  ({ id, changes }: { id: string; changes: Partial<Omit<Category, "id">> }) =>
    request<Category>(`/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(changes),
    }),
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id: string) => {
    await request<Category>(`/categories/${id}`, {
      method: "DELETE",
    });

    return id;
  },
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        categoriesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.status = "failed";
        state.error =
          "Couldn't load categories. Check your connection and try again.";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        categoriesAdapter.addOne(state, action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        categoriesAdapter.upsertOne(state, action.payload);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        categoriesAdapter.removeOne(state, action.payload);
      });
  },
});

export function hasDuplicateCategory(
  categories: Category[],
  name: string,
  type: CategoryType,
  excludeId?: string,
): boolean {
  const normalized = name.trim().toLowerCase();
  return categories.some(
    (c) =>
      c.id !== excludeId &&
      c.name.trim().toLowerCase() === normalized &&
      c.type === type,
  );
}

export const selectCategoriesStatus = (state: RootState) =>
  state.categories.status;
export const selectCategoriesError = (state: RootState) =>
  state.categories.error;

export const {
  selectAll: selectAllCategories,
  selectById: selectCategoryById,
  selectTotal: selectTotalCategories,
} = categoriesAdapter.getSelectors<RootState>((state) => state.categories);

export default categoriesSlice.reducer;
