"use client";

import { store } from "@/store/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchFilters } from "@/store/slices/filtersSlice";

function InitFilters() {
  const dispatch = useDispatch();
  const { loaded, loading } = useSelector((state) => state.filters);

  useEffect(() => {
    let mounted = true;
    if (mounted && !loaded && !loading) {
      dispatch(fetchFilters());
    }
    return () => {
      mounted = false;
    };
  }, [dispatch, loaded, loading]);
}

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      {/* One render tree, always. PersistGate swapped its `loading` tree for its
          children after rehydration, which unmounted and remounted the whole
          page — every client effect (and API call) ran twice on each load.
          persistStore() (store.js) still rehydrates auth/bag into the store;
          subscribed components simply update when it lands. */}
      <InitFilters />
      {children}
    </Provider>
  );
}
