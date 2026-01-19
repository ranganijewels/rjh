import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "../services/api";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ currency }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.token;

      const response = await apiGet("/api/cart/cart-details", token, {
        Currency: currency,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (payload, thunkAPI) => {
    try {
      const response = await apiPost("/api/cart/add", payload);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const applyCoupon = createAsyncThunk(
  "cart/applyCoupon",
  async (code, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.token;

      const response = await apiPost("/api/cart/apply-coupon", { code }, token);

      if (!response.status) {
        return thunkAPI.rejectWithValue(response.message || "Invalid coupon");
      }

      const cartResponse = await apiGet("/api/cart/cart-details", token);

      return {
        coupon: response.data,
        cart_summary: cartResponse.data.cart_summary,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const removeCoupon = createAsyncThunk(
  "cart/removeCoupon",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.token;

      const response = await apiPost("/api/cart/remove-coupon", {}, token);

      if (!response.status) {
        return thunkAPI.rejectWithValue(
          response.message || "Failed to remove coupon"
        );
      }

      // fetch updated cart
      const cartResponse = await apiGet("/api/cart/cart-details", token);

      return cartResponse.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    summary: {},
    cartCount: 0,
    loading: false,
    error: null,
    shipping: 0,
    coupon: null,
  },
  reducers: {
    setShipping: (state, action) => {
      state.shipping = action.payload;
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.summary = {};
      state.coupon = null;
      state.cartCount = 0;
    },
    clearCoupon: (state) => {
      state.coupon = null;
      if (state.summary) {
        state.summary.coupon_code = null;
        state.summary.discount = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.cart_items || [];
        state.summary = action.payload.cart_summary || {};
        state.coupon = action.payload.coupon || null;

        state.cartCount = state.cartItems.length;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cart_items;
        state.summary = action.payload.cart_summary;

        state.cartCount = state.cartItems.length;
      })
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload;
        state.summary = action.payload.cart_summary;

        state.cartTotal = state.summary.cart_total || 0;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCoupon.fulfilled, (state, action) => {
        state.loading = false;

        state.cartItems = action.payload.cart_items || [];
        state.summary = action.payload.cart_summary || {};
        state.coupon = null;

        state.cartCount = state.cartItems.length;
      })
      .addCase(removeCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setShipping, clearCart, clearCoupon } = cartSlice.actions;
export default cartSlice.reducer;
