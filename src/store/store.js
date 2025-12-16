import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "@/store/slices/authSlice";
import cartReducer from "@/store/slices/cartSlice";
import faqReducer from "@/store/slices/faqSlice";
import productListReducer from "@/store/slices/productListSlice";
import filtersReducer from "@/store/slices/filtersSlice";
import orderReducer from "@/store/slices/orderSlice";

const authPersistConfig = {
  key: "auth_Elova",
  storage,
};

const cartPersistConfig = {
  key: "cart_Elova",
  storage,
};

const productPersistConfig = {
  key: "product_Elova",
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedProductReducer = persistReducer(
  productPersistConfig,
  productListReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    cart: persistedCartReducer,
    faq: faqReducer,
    productList: persistedProductReducer,
    filters: filtersReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
        ],
      },
    }),
});

export const persistor = persistStore(store);
