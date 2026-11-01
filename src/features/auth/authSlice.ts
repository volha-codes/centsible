import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";

import type { RootState } from "../../app/store";
import { request } from "../../lib/api";
import type { User } from "../../types";

type AuthStatus = "unknown" | "authenticated" | "anonymous";

interface Credentials {
  email: string;
  password: string;
}

interface RegisterData extends Credentials {
  firstName: string;
}

const initialState = {
  user: null as User | null,
  status: "unknown" as AuthStatus,
};

export const fetchMe = createAsyncThunk("auth/fetchMe", () =>
  request<User>("/auth/me"),
);

export const login = createAsyncThunk(
  "auth/login",
  (credentials: Credentials) =>
    request<User>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
);

export const register = createAsyncThunk(
  "auth/register",
  (registerData: RegisterData) =>
    request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(registerData),
    }),
);

export const logout = createAsyncThunk("auth/logout", () =>
  request<void>("/auth/logout", {
    method: "POST",
  }),
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(fetchMe.fulfilled, login.fulfilled, register.fulfilled),
        (state, action) => {
          state.user = action.payload;
          state.status = "authenticated";
        },
      )
      .addMatcher(isAnyOf(fetchMe.rejected, logout.fulfilled), (state) => {
        state.user = null;
        state.status = "anonymous";
      });
  },
});

export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;

export default authSlice.reducer;
