import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ToastVariant = "info" | "success" | "error";

interface UiState {
  toast: { id: number; message: string; variant: ToastVariant } | null;
}

const initialState: UiState = {
  toast: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toastShown: {
      prepare: (message: string, variant: ToastVariant = "info") => ({
        payload: { id: Date.now(), message, variant },
      }),
      reducer: (
        state,
        action: PayloadAction<{
          id: number;
          message: string;
          variant: ToastVariant;
        }>,
      ) => {
        state.toast = action.payload;
      },
    },
    toastDismissed: (state) => {
      state.toast = null;
    },
  },
});

export const { toastShown, toastDismissed } = uiSlice.actions;
export default uiSlice.reducer;
