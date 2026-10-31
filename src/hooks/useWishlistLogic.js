"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  moveWishlistToCart,
  removeWishlistItem,
  setWishlistCount,
} from "@/store/slices/wishlistSlice";
import toast from "react-hot-toast";
import { fetchCart } from "@/store/slices/cartSlice";
import { usePreferences } from "@/context/PreferencesContext";
import { useRouter } from "next/navigation";
import { useCrudApi } from "./useCrudApi";

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

  /* ------------------ HELPERS ------------------ */

  const ensureAuth = () => {
    const token = localStorage.getItem("authTokenRJHouse");

    if (!token || !customerId) {
      toast.error("Please login first");
      router.push("/login");
      return false;
    }
    return true;
  };

  // Only the product is required: price-on-request items (price 0) and
  // products without a category or diamond shape can still be saved.
  const validateWishlistPayload = (payload) => Boolean(payload?.product_id);

  /* ------------------ WISHLIST ADD / TOGGLE ------------------ */

  const toggleWishlist = useCallback(
    async (payload) => {
      if (!ensureAuth()) return false;
      if (!validateWishlistPayload(payload)) {
        toast.error("Couldn't add this item to your wishlist");
        return false;
      }

      try {
        const res = await createWishlistApi(payload);
        const wishlisted = Boolean(res?.data?.wishlist);

        // Update the header badge right away; the full list refreshes below.
        if (res?.data?.wishlist_count != null) {
          dispatch(setWishlistCount(res.data.wishlist_count));
        }
        toast.success(wishlisted ? "Added to wishlist" : "Removed from wishlist");

        dispatch(
          fetchWishlist({
            currency: selectedCountry.currency,
          })
        );

        if (wishlisted && onWishlisted && !disablePopup) {
          onWishlisted();
        }

        return wishlisted;
      } catch (err) {
        toast.error("Wishlist failed");
        return false;
      }
    },
    [createWishlistApi, dispatch, onWishlisted, disablePopup]
  );

  /* ------------------ CHECK IF WISHLISTED ------------------ */
  const checkIfWishlisted = useCallback(
    async (payload) => {
      if (!payload?.product_id) return false;

      try {
        const res = await checkWishlistApi({
          product_id: payload.product_id,
          metal_color: (payload.metal_color || "").toUpperCase(),
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
        toast.success("Moved to bag");
        return true;
      } catch (error) {
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
        toast.success("Removed from wishlist");
        return true;
      } catch (error) {
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
