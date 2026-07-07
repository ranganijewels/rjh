import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: { order: null },
  reducers: {
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    clearOrder: (state) => {
      state.order = null;
    },
  },
});

export const { setOrder, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
