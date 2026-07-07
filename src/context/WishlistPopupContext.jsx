"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useSelector } from "react-redux";

const WishlistPopupContext = createContext(null);

export const WishlistPopupProvider = ({ children }) => {
  const wishlistCount = useSelector((s) => s.wishlist.count);
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const open = useCallback(() => {
    if (wishlistCount === 0) return;
    clearTimer();
    setIsOpen(true);
  }, [wishlistCount]);

  const close = useCallback(() => {
    clearTimer();
    setIsOpen(false);
  }, []);

  const openFor = useCallback(
    (ms = 2000) => {
      if (wishlistCount === 0) return;

      clearTimer();
      setIsOpen(true);

      timerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, ms);
    },
    [wishlistCount]
  );

  useEffect(() => {
    if (wishlistCount === 0) {
      close();
    }
  }, [wishlistCount, close]);

  return (
    <WishlistPopupContext.Provider
      value={{
        isOpen,
        open,
        close,
        openFor,
      }}
    >
      {children}
    </WishlistPopupContext.Provider>
  );
};

export const useWishlistPopup = () => {
  const ctx = useContext(WishlistPopupContext);
  if (!ctx) {
    throw new Error(
      "useWishlistPopup must be used within WishlistPopupProvider"
    );
  }
  return ctx;
};
