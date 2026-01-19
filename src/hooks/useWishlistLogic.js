"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  moveWishlistToCart,
  removeWishlistItem,
} from "@/store/slices/wishlistSlice";
import toast from "react-hot-toast";
import { fetchCart } from "@/store/slices/cartSlice";
import { usePreferences } from "@/context/PreferencesContext";
import { useRouter } from "next/navigation";
import { useCrudApi } from "./useCrudApi";

/**
 * Centralized wishlist business logic
 * ALL wishlist behavior lives here
 */
export const useWishlistLogic = ({
  createWishlistApi,
  onWishlisted,
  disablePopup = false,
} = {}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { selectedCountry } = usePreferences();
  const { create: checkWishlistApi } = useCrudApi(
    "/api/wishlist/check-wishlist"
  );
  const { create: removeWishlistApi } = useCrudApi(
    "/api/wishlist/remove-wishlist"
  );

  /* ------------------ STATE ------------------ */
  const { items, loading, count } = useSelector((state) => state.wishlist);
  const customerId = useSelector((state) => state.auth?.customer?.id);

  /* ------------------ INIT ------------------ */
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  /* ------------------ HELPERS ------------------ */

  const ensureAuth = () => {
    const token = localStorage.getItem("authTokenElova");

    if (!token || !customerId) {
      toast.error("Please login first");
      router.push("/login");
      return false;
    }
    return true;
  };

  const validateWishlistPayload = (payload) => {
    if (
      !payload?.product_id ||
      !payload?.product_price ||
      !payload?.category_id ||
      !payload?.metal_type ||
      !payload?.metal_color ||
      !payload?.diamond_shape
    ) {
      console.warn("Wishlist blocked: incomplete data", payload);
      return false;
    }
    return true;
  };

  /* ------------------ WISHLIST ADD / TOGGLE ------------------ */

  const toggleWishlist = useCallback(
    async (payload) => {
      if (!ensureAuth()) return false;
      if (!validateWishlistPayload(payload)) return false;

      try {
        const res = await createWishlistApi(payload);
        const wishlisted = Boolean(res?.data?.wishlist);

        dispatch(fetchWishlist());

        if (wishlisted && onWishlisted && !disablePopup) {
          onWishlisted();
        }

        return wishlisted;
      } catch (err) {
        console.error("Wishlist toggle failed:", err);
        toast.error("Wishlist failed");
        return false;
      }
    },
    [createWishlistApi, dispatch, onWishlisted, disablePopup]
  );

  /* ------------------ CHECK IF WISHLISTED ------------------ */
  const checkIfWishlisted = useCallback(
    async (payload) => {
      if (
        !payload?.product_id ||
        !payload?.metal_color ||
        !payload?.metal_type ||
        !payload?.diamond_shape
      ) {
        return false;
      }

      try {
        const res = await checkWishlistApi({
          product_id: payload.product_id,
          metal_color: payload.metal_color.toUpperCase(),
          metal_type: payload.metal_type,
          diamond_shape: payload.diamond_shape,
          center_diamond_weight:
            payload.center_diamond_weight != null
              ? String(payload.center_diamond_weight)
              : "",
          ring_size: payload.ring_size ? String(payload.ring_size) : "",
          size: payload.size ? String(payload.size) : "",
        });

        return Boolean(res?.data?.wishlist);
      } catch (err) {
        console.error("checkIfWishlisted failed:", err);
        return false;
      }
    },
    [checkWishlistApi]
  );

  /* ------------------ MOVE TO CART ------------------ */

  const addToCart = useCallback(
    async (wishlistItemId) => {
      try {
        await dispatch(moveWishlistToCart(wishlistItemId)).unwrap();
        dispatch(fetchCart({ currency: selectedCountry?.currency }));
        return true;
      } catch (error) {
        console.error("Move wishlist → cart failed:", error);
        toast.error("Failed to add item to cart");
        return false;
      }
    },
    [dispatch, selectedCountry?.currency]
  );

  /* ------------------ REMOVE ------------------ */

  const removeFromWishlist = useCallback(
    async (wishlistItemId) => {
      try {
        const res = await removeWishlistApi(null, {}, wishlistItemId);

        if (!res?.status) {
          toast.error(res?.message || "Failed to remove item");
          return false;
        }

        dispatch(removeWishlistItem(wishlistItemId));
        return true;
      } catch (error) {
        console.error("Remove wishlist item failed:", error);
        toast.error("Failed to remove item");
        return false;
      }
    },
    [dispatch]
  );

  /* ------------------ API ------------------ */

  return {
    wishlistItems: items,
    wishlistCount: count,
    loading,
    checkIfWishlisted,
    toggleWishlist,
    addToCart,
    removeFromWishlist,
  };
};
