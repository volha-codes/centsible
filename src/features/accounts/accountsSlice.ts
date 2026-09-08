import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import type { Account } from "../../types";

const accountsAdapter = createEntityAdapter<Account>();

const initialState = accountsAdapter.getInitialState();

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    accountAdded: accountsAdapter.addOne,
    accountUpdated: accountsAdapter.updateOne,
    accountRemoved: accountsAdapter.removeOne,
  },
});

export const { accountAdded, accountUpdated, accountRemoved } =
  accountsSlice.actions;
export default accountsSlice.reducer;
