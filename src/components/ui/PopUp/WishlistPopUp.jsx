"use client";
import React, { useEffect } from "react";
import Typography from "../Typography/Typography";
import Button from "../Button/Button";
import { CloseIcon } from "@/components/Icons/common/CloseIcon";
import { useDispatch, useSelector } from "react-redux";
import { toTitleCase } from "@/utils/string";
import { fetchWishlist } from "@/store/slices/wishlistSlice";
import { useWishlistLogic } from "@/hooks/useWishlistLogic";
import { useRouter } from "next/navigation";
import { getCurrencySymbol } from "@/utils/currencySymbol";
import { usePreferences } from "@/context/PreferencesContext";

const WishlistPopUp = ({ isOpen, onMouseEnter, onMouseLeave }) => {
  const dispatch = useDispatch();
  const { selectedCountry } = usePreferences();
  const router = useRouter();
  const { addToCart, removeFromWishlist } = useWishlistLogic();
  const wishlist = useSelector((s) => s.wishlist.items);
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  if (!isOpen) return null;
console.log('wishlist popup rendered',wishlist);
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full right-0 pt-3 z-[999] w-[502px] h-[668px] bg-[var(--grey-00)] shadow-lg border border-[var(--grey-1)]"
    >
      <div className="flex flex-col h-full">
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

        <div className="flex-1 overflow-y-auto space-y-[24px] px-[30px] my-[28px] custom-scroll">
          {wishlist?.map((item) => {
            debugger;
            return (
              <div key={item.id} className="flex gap-[22px]">
                <div className="p-[19px_20px] bg-[var(--product-bg)] shrink-0">
                  <img
                    src={item?.product?.image}
                    className="h-[100px] w-[100px] object-contain"
                  />
                </div>

                <div className="flex flex-col">
                  <Typography
                    variant="h5"
                    className="!font-[500] mb-[15px] cursor-pointer hover:text-[var(--teal-1)]"
                    onClick={() => {
                      debugger;
                      router.push(
                        `/product/${item?.product?.id}?categoryId=${item?.category_id}&selectedMetalColor=${item?.metal_color}&variantId=${item?.product_id}&shape=${item?.diamond_shape}`
                      );
                    }}
                  >
                    {toTitleCase(item?.product?.title)}
                  </Typography>

                  <Typography
                    variant="h5"
                    className="!font-[600]"
                    textColor="teal"
                  >
                    {getCurrencySymbol(selectedCountry?.currency) +
                      " " +
                      Math.floor(Number(item?.product_price))}
                  </Typography>

                  <div className="flex gap-[10px] mt-[20px]">
                    <Button
                      variant="primary"
                      title="add to bag"
                      className="!p-[10px_16px]"
                      onClick={() => addToCart(item.id)}
                    />
                    <Button
                      background="none"
                      textColor="var(--grey-2)"
                      title="remove"
                      className="border border-[var(--teal-3)] !p-[10px_16px]"
                      icon={<CloseIcon className="w-5 h-5" />}
                      onClick={() => removeFromWishlist(item.id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          <Button
            variant="primary"
            title="View Full Wishlist"
            className="w-full rounded-none !p-[15px_0] sticky bottom-0 cursor-pointer"
            onClick={() => {
              window.location.href = "/account/wishlist";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WishlistPopUp;
