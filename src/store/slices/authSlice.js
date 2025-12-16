import { createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser, registerUser } from "../authThunks";

const initialState = {
  customer: null,
  loading: false,
  error: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.customer = null;
      state.token = null;
    },
    updateCustomer: (state, action) => {
      state.customer = { ...state.customer, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload.customer;
        state.token = action.payload?.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.fulfilled, (state, action) => {
        state.customer = action.payload.customer;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.customer = null;
        state.token = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout, updateCustomer } = authSlice.actions;
export default authSlice.reducer;
