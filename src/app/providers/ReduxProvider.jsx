"use client";

import { persistor, store } from "@/store/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
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
      <PersistGate loading={null} persistor={persistor}>
        <InitFilters />
        {children}
      </PersistGate>
    </Provider>
  );
}
