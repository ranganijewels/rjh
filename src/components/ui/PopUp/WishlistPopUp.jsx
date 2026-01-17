"use client";
import React, { useEffect } from "react";
import Typography from "../Typography/Typography";
import Button from "../Button/Button";
import { CloseIcon } from "@/components/Icons/common/CloseIcon";
import { useDispatch, useSelector } from "react-redux";
import { toTitleCase } from "@/utils/string";
import {
  fetchWishlist,
  moveWishlistToCart,
} from "@/store/slices/wishlistSlice";
import { fetchCart } from "@/store/slices/cartSlice";
import { useCrudApi } from "@/hooks/useCrudApi";
import toast from "react-hot-toast";

const WishlistPopUp = ({ isOpen, onMouseEnter, onMouseLeave }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((s) => s.wishlist.items);
  const { create: removeWishlistItems } = useCrudApi(
    "/api/wishlist/remove-wishlist"
  );

  const handleAddToCart = (id) => {
    dispatch(moveWishlistToCart(id));
  };

  useEffect(() => {
    dispatch(fetchWishlist());
  }, []);

  const handleRemoveWishlistItem = async (id) => {
    try {
      const response = await removeWishlistItems(null, {}, id);

      if (response?.status) {
        toast.success("Item removed from wishlist");

        dispatch(fetchWishlist({ currency: selectedCountry.currency }));
      } else {
        toast.error(response?.message || "Failed to remove item");
      }
    } catch (error) {
      console.error("Remove wishlist item failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full right-0 pt-3 z-[999] w-[502px] h-[668px] bg-[var(--grey-00)] shadow-lg border border-[var(--grey-1)]"
    >
      {/* IMPORTANT: flex column */}
      <div className="flex flex-col h-full">
        {/* Header (fixed height) */}
        <div className="p-[25px_30px] flex justify-between items-center shrink-0">
          <Typography variant="p" className="font-[500] capitalize">
            Your Wishlist
          </Typography>
          <img
            src="/icons/close.svg"
            className="w-[12px] h-[12px] cursor-pointer"
            alt="close icon"
          />
        </div>

        <hr className="hr-teal-3 shrink-0" />

        <div className="flex-1 overflow-y-auto space-y-[24px] mt-[28px] custom-scroll">
          {wishlist?.map((item) => {
            return (
              <div key={item.id} className="flex gap-[22px] px-[30px]">
                <div className="p-[19px_20px] bg-[var(--product-bg)] shrink-0">
                  <img
                    src={item?.product?.image}
                    className="h-[100px] w-[100px] object-contain"
                  />
                </div>

                <div className="flex flex-col">
                  <Typography variant="h5" className="!font-[500] mb-[15px]">
                    {toTitleCase(item?.product?.title)}
                  </Typography>

                  <Typography
                    variant="h5"
                    className="!font-[600]"
                    textColor="teal"
                  >
                    {item?.product?.product_price}
                  </Typography>

                  <div className="flex gap-[10px] mt-[20px]">
                    <Button
                      variant="primary"
                      title="add to bag"
                      className="!p-[10px_16px]"
                      onClick={() => handleAddToCart(item.id)}
                    />
                    <Button
                      background="none"
                      textColor="var(--grey-2)"
                      title="remove"
                      className="border border-[var(--teal-3)] !p-[10px_16px]"
                      icon={<CloseIcon className="w-5 h-5" />}
                      onClick={() => handleRemoveWishlistItem(item.id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPopUp;
