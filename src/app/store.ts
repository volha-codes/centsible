import { configureStore } from "@reduxjs/toolkit";

import accountsReducer from "../features/accounts/accountsSlice";
import authReducer from "../features/auth/authSlice";
import categoriesReducer from "../features/categories/categoriesSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import transactionsReducer from "../features/transactions/transactionsSlice";
import uiReducer from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    categories: categoriesReducer,
    dashboard: dashboardReducer,
    transactions: transactionsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
