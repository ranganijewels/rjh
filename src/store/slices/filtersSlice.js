import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchFilters = createAsyncThunk(
  "filters/fetchFilters",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authTokenRJHouse");
      const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;

      const res = await axios.post(
        "/api/product/filters",
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "x-tenant-id": tenantId || "",
          },
        }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const filtersSlice = createSlice({
  name: "filters",
  initialState: {
    data: {},
    loading: false,
    error: null,
    loaded: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data || {};
        state.loaded = true;
      })
      .addCase(fetchFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.loaded = true;
      });
  },
});

export default filtersSlice.reducer;
