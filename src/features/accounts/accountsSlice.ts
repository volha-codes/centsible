import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";

import type { RootState } from "../../app/store";
import type { Account } from "../../types";

const accountsAdapter = createEntityAdapter<Account>();

const initialState = accountsAdapter.getInitialState();

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    accountAdded: {
      prepare: (account: Omit<Account, "id">) => ({
        payload: { ...account, id: nanoid() },
      }),
      reducer: accountsAdapter.addOne,
    },
    accountUpdated: accountsAdapter.updateOne,
    accountRemoved: accountsAdapter.removeOne,
  },
});

export const { accountAdded, accountUpdated, accountRemoved } =
  accountsSlice.actions;

export const {
  selectAll: selectAllAccounts,
  selectById: selectAccountById,
  selectTotal: selectTotalAccounts,
} = accountsAdapter.getSelectors<RootState>((state) => state.accounts);

export default accountsSlice.reducer;
