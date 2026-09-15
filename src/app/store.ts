import { configureStore } from "@reduxjs/toolkit";

import accountsReducer from "../features/accounts/accountsSlice";
import uiReducer from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectToast = (state: RootState) => state.ui.toast;
