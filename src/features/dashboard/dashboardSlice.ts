import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../../app/store";
import { request } from "../../lib/api";
import type { Overview } from "../../types";
import { logout } from "../auth/authSlice";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export interface OverviewParams {
  month: string;
  currency: string;
}

const initialState = {
  status: "idle" as RequestStatus,
  error: null as string | null,
  data: null as Overview | null,
  requestId: null as string | null,
};

export const fetchOverview = createAsyncThunk(
  "dashboard/fetchOverview",
  ({ month, currency }: OverviewParams) => {
    const params = new URLSearchParams({ month, currency });

    return request<Overview>(`/stats/overview?${params.toString()}`);
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverview.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;

        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;

        state.status = "failed";
        state.error =
          "Couldn't load the dashboard. Check your connection and try again.";
      })
      .addCase(logout.fulfilled, () => initialState);
  },
});

export const selectOverview = (state: RootState) => state.dashboard.data;
export const selectDashboardStatus = (state: RootState) =>
  state.dashboard.status;
export const selectDashboardError = (state: RootState) => state.dashboard.error;

export default dashboardSlice.reducer;
