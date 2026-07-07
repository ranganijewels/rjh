import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payload: {
    category_id: null,
    sub_category_id: null,
    occassion_id: null,
    quality_id: null,
    metal_color: null,
  },
  products: [],
  selectedMetalColor: null,
  loading: false,
  error: null,
};

const productListSlice = createSlice({
  name: "productList",
  initialState,
  reducers: {
    setPayload(state, action) {
      state.payload = { ...state.payload, ...action.payload };
    },
    setProducts(state, action) {
      state.products = action.payload;
    },
    setSelectedMetalColor(state, action) {
      state.selectedMetalColor = action.payload;
    },
  },
});

export const { setPayload, setProducts, setSelectedMetalColor } =
  productListSlice.actions;
export default productListSlice.reducer;
