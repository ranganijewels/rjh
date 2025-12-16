import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet } from "../services/api";

export const fetchFaqs = createAsyncThunk(
  "faq/fetchFaqs",
  async (_, thunkAPI) => {
    try {
      // const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;

      // build full path with tenantId
      const response = await apiGet(`/api/faq/faq-questions`);

      return response.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch data");
    }
  }
);

const faqSlice = createSlice({
  name: "faq",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        // capture rejectWithValue payload instead of generic error
        state.error = action.payload;
      });
  },
});

export default faqSlice.reducer;
