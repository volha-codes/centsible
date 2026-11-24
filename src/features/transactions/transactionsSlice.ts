import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

import type { RootState } from "../../app/store";
import { request } from "../../lib/api";
import type { Transaction, TransactionInput } from "../../types";
import { deleteAccount, fetchAccounts } from "../accounts/accountsSlice";
import { logout } from "../auth/authSlice";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export interface TransactionRange {
  from?: string;
  to?: string;
}

const transactionsAdapter = createEntityAdapter<Transaction>({
  sortComparer: (a, b) =>
    b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
});

const initialState = transactionsAdapter.getInitialState({
  status: "idle" as RequestStatus,
  error: null as string | null,
});

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  (range: TransactionRange | undefined) => {
    const params = new URLSearchParams();
    if (range?.from) params.set("from", range.from);
    if (range?.to) params.set("to", range.to);
    const query = params.toString();

    return request<Transaction[]>(`/transactions${query ? `?${query}` : ""}`);
  },
);

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (transaction: TransactionInput, { dispatch }) => {
    const created = await request<Transaction>("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    });

    void dispatch(fetchAccounts());
    return created;
  },
);

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async (
    { id, changes }: { id: string; changes: Partial<TransactionInput> },
    { dispatch },
  ) => {
    const updated = await request<Transaction>(`/transactions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(changes),
    });

    void dispatch(fetchAccounts());
    return updated;
  },
);

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id: string, { dispatch }) => {
    await request<Transaction>(`/transactions/${id}`, { method: "DELETE" });

    void dispatch(fetchAccounts());
    return id;
  },
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        if (state.status !== "succeeded") state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        transactionsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.status = "failed";
        state.error =
          "Couldn't load transactions. Check your connection and try again.";
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        transactionsAdapter.addOne(state, action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        transactionsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        transactionsAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        const ids = transactionsAdapter
          .getSelectors()
          .selectAll(state)
          .filter((transaction) => transaction.accountId === action.payload)
          .map((transaction) => transaction.id);

        transactionsAdapter.removeMany(state, ids);
      })
      .addCase(logout.fulfilled, () => initialState);
  },
});

export const selectTransactionsStatus = (state: RootState) =>
  state.transactions.status;
export const selectTransactionsError = (state: RootState) =>
  state.transactions.error;

export const { selectAll: selectAllTransactions } =
  transactionsAdapter.getSelectors<RootState>((state) => state.transactions);

export default transactionsSlice.reducer;
