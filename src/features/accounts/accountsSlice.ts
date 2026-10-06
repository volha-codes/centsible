import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

import type { RootState } from "../../app/store";
import { request } from "../../lib/api";
import type { Account } from "../../types";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

const accountsAdapter = createEntityAdapter<Account>();

const initialState = accountsAdapter.getInitialState({
  status: "idle" as RequestStatus,
  error: null as string | null,
});

export const fetchAccounts = createAsyncThunk("accounts/fetchAll", () =>
  request<Account[]>("/accounts"),
);

export const createAccount = createAsyncThunk(
  "accounts/create",
  (account: Omit<Account, "id">) =>
    request<Account>("/accounts", {
      method: "POST",
      body: JSON.stringify(account),
    }),
);

export const updateAccount = createAsyncThunk(
  "accounts/update",
  ({ id, changes }: { id: string; changes: Partial<Omit<Account, "id">> }) =>
    request<Account>(`/accounts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(changes),
    }),
);

export const deleteAccount = createAsyncThunk(
  "accounts/delete",
  async (id: string) => {
    await request<Account>(`/accounts/${id}`, {
      method: "DELETE",
    });

    return id;
  },
);

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        accountsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchAccounts.rejected, (state) => {
        state.status = "failed";
        state.error =
          "Couldn't load accounts. Check your connection and try again.";
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        accountsAdapter.addOne(state, action.payload);
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        accountsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        accountsAdapter.removeOne(state, action.payload);
      });
  },
});

export function findDuplicateAccountName(
  accounts: Account[],
  name: string,
  excludeId?: string,
): boolean {
  const normalized = name.trim().toLowerCase();
  return accounts.some(
    (a) => a.id !== excludeId && a.name.trim().toLowerCase() === normalized,
  );
}

export const selectAccountsStatus = (state: RootState) => state.accounts.status;
export const selectAccountsError = (state: RootState) => state.accounts.error;

export const {
  selectAll: selectAllAccounts,
  selectById: selectAccountById,
  selectTotal: selectTotalAccounts,
} = accountsAdapter.getSelectors<RootState>((state) => state.accounts);

export default accountsSlice.reducer;
