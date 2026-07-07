import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiPost } from "./services/api";

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await apiPost("/api/auth/login", { email, password });

      if (res.error) {
        return thunkAPI.rejectWithValue(res.error);
      }

      if (res.token) {
        localStorage.setItem("authTokenRJHouse", res.token);
      }

      return { customer: res.customer, token: res.token };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Login failed");
    }
  }
);

// Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, thunkAPI) => {
    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data);
      }

      return { customer: data.customer };
    } catch (err) {
      return thunkAPI.rejectWithValue({
        message: err.message || "Registration failed",
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("authTokenRJHouse");

      if (!token) {
        return thunkAPI.rejectWithValue("No token found, logout failed");
      }

      // Send POST request to logout endpoint with Authorization header
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Safely parse JSON response
      let data = {};
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: "Backend returned non-JSON response", raw: text };
      }

      // Only remove token if logout succeeded
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.error || "Logout failed");
      }

      localStorage.removeItem("authTokenRJHouse");

      return data.message || "Logout successful";
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Logout failed");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, thunkAPI) => {
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data);
      }

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue({
        message: err.message || "OTP verification failed",
      });
    }
  }
);
