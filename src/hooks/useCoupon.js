"use client";

import { useDispatch } from "react-redux";
import { applyCoupon, fetchCart, clearCoupon } from "@/store/slices/cartSlice";
import { useCrudApi } from "@/hooks/useCrudApi";
import toast from "react-hot-toast";
import { useState } from "react";
import { usePreferences } from "@/context/PreferencesContext";

export const useCoupon = () => {
  const dispatch = useDispatch();
  const { create: removeCouponApi } = useCrudApi(`/api/cart/remove-coupon`);
  const { selectedCountry } = usePreferences();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");

  // ========= APPLY ==========
  const apply = async (code) => {
    setError("");

    if (!code?.trim()) {
      setError("Please enter a coupon code");
      return false;
    }

    try {
      setLoading(true);

      const res = await dispatch(applyCoupon(code)).unwrap();

      await dispatch(fetchCart());
      toast.success("Coupon applied");

      return res;
    } catch (err) {
      setError(typeof err === "string" ? err : "Invalid or expired coupon");
      toast.error("Coupon not valid");

      return false;
    } finally {
      setLoading(false);
    }
  };

  // ========= REMOVE ==========
  const remove = async () => {
    try {
      setLoading(true);
  
      const res = await removeCouponApi();
  
      if (res?.status) {
        dispatch(clearCoupon());
  
        await dispatch(
          fetchCart({
            currency: selectedCountry?.currency,
          })
        ).unwrap();
  
        toast.success("Coupon removed");
      }
    } catch (err) {
      toast.error("Failed to remove coupon");
    } finally {
      setLoading(false);
    }
  };
  
  return {
    apply,
    remove,
    loading,
    error,
    setError,
    couponCode,
    setCouponCode,
  };
};
