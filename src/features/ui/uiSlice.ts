import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  toast: { id: number; message: string; variant: "info" | "success" } | null;
}

const initialState: UiState = {
  toast: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toastShown: {
      prepare: (message: string, variant: "info" | "success" = "info") => ({
        payload: { id: Date.now(), message, variant },
      }),
      reducer: (
        state,
        action: PayloadAction<{
          id: number;
          message: string;
          variant: "info" | "success";
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
