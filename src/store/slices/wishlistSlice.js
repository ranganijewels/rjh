import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "../services/api";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.token;

      const res = await apiGet("/api/wishlist/get-wishlist", token);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async (payload, thunkAPI) => {
    try {
      const res = await apiPost("/api/wishlist", payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const moveWishlistToCart = createAsyncThunk(
  "wishlist/moveToCart",
  async (wishlistItemId) => {
    const res = await apiPost(
      `/api/wishlist/move-wishlist-to-cart/${wishlistItemId}`
    );

    return {
      id: wishlistItemId,
      wishlist_count: res.data.wishlist_count,
      cart: res.data.cart,
    };
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    count: 0,
    loading: false,
  },
  reducers: {
    removeWishlistItem(state, action) {
      const removedId = action.payload;
      state.items = state.items.filter((item) => item.id !== removedId);
      state.count = state.items.length;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload.wishlist_items || [];
        state.count = action.payload.wishlist_count || 0;
        state.loading = false;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const product = action.payload.data;

        if (product.wishlist === false) {
          state.items = state.items.filter(
            (i) =>
              !(
                i.product_id === product.product_id &&
                i.metal_color === product.metal_color &&
                i.metal_type === product.metal_type &&
                i.diamond_shape === product.diamond_shape &&
                String(i.center_diamond_weight || "") ===
                  String(product.center_diamond_weight || "") &&
                String(i.ring_size || "") === String(product.ring_size || "") &&
                String(i.size || "") === String(product.size || "")
              )
          );
        } else {
          state.items.push(product);
        }

        state.count = state.items.length;
      })
      // .addCase(toggleWishlist.fulfilled, (state, action) => {
      //   const product = action.payload.data;
      //   const exists = state.items.find(
      //     (i) =>
      //       i.product_id === product.product_id &&
      //       i.metal_color === product.metal_color &&
      //       i.diamond_shape === product.diamond_shape
      //   );

      //   if (product.wishlist === false) {
      //     state.items = state.items.filter((i) => i.id !== product.id);
      //   } else {
      //     state.items.push(product);
      //   }

      //   state.count = state.items.length;
      // })
      .addCase(moveWishlistToCart.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
        state.count = action.payload.wishlist_count;
      });
    // .addCase(moveWishlistToCart.fulfilled, (state, action) => {
    //   state.items = state.items.filter((i) => i.id !== action.payload.id);
    //   state.count = state.items.length;
    // });
  },
});

export const { removeWishlistItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;
