"use client";
import React, { useEffect, useState } from "react";
import { CouponIcon, MinusIcon } from "@/components/Icons/common";
import Button from "@/components/ui/Button/Button";
import RadioButton from "@/components/ui/Button/RadioButton";
import InputWithIconButton from "@/components/ui/Input/InputWithIconButton";
import Typography from "@/components/ui/Typography/Typography";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, setShipping } from "@/store/slices/cartSlice";
import { useCrudApi } from "@/hooks/useCrudApi";
import toast from "react-hot-toast";
import QuantitySelector from "./QuantitySelector";
import { toTitleCase } from "@/utils/string";
import { usePreferences } from "@/context/PreferencesContext";
import { getCurrencySymbol } from "@/utils/currencySymbol";
import { useCoupon } from "@/hooks/useCoupon";
import HeartIcon from "@/components/Icons/HeartIcon";
import { CloseIcon } from "@/components/Icons/common/CloseIcon";
import Link from "next/link";
import { fetchWishlist } from "@/store/slices/wishlistSlice";

const shippingOptions = [
  { id: "free", label: "Free", price: 0 },
  // { id: "express", label: "Express", price: 10 },
];

const Cart = () => {
  const [selectedShipping, setSelectedShipping] = useState(0);
  const dispatch = useDispatch();
  const { apply, remove, loading, error, setError, couponCode, setCouponCode } =
    useCoupon();

  const router = useRouter();
  const { token } = useSelector((state) => state.auth);
  const { cartItems, summary } = useSelector((state) => state.cart);
  const { selectedCountry } = usePreferences();
  const { create: updateQuantities } = useCrudApi(
    "/api/cart/update-quantities"
  );
  const { create: removeCartItem } = useCrudApi("/api/cart/remove-cart-item");
  const { create: moveToWishlist } = useCrudApi("/api/cart/cart-to-wishlist");

  useEffect(() => {
    if (token && selectedCountry?.currency) {
      dispatch(fetchCart({ currency: selectedCountry.currency }));
    }
  }, [dispatch, token, selectedCountry?.currency]);

  const handleCoupon = async () => {
    const success = await apply(couponCode);
    if (success) setCouponCode("");
  };

  const handleCheckout = () => {
    dispatch(setShipping(selectedShipping));
    router.push("/cart/checkout");
  };

  const handleUpdateQuantity = async (cart_item_id, quantity) => {
    const payload = { cart_items: [{ cart_item_id, quantity }] };
    const response = await updateQuantities(payload);
    if (response.status) {
      toast.success("Cart updated");
      dispatch(fetchCart({ currency: selectedCountry.currency }));
    } else {
      toast.error(response.message || "Failed to update cart");
    }
  };

  const handleClick = (id, categoryId, selectedColor, shape) => {
    router.push(
      `/product/${id}?categoryId=${categoryId}&selectedMetalColor=${selectedColor}&shape=${shape}`
    );
  };

  if (!cartItems?.length) {
    return (
      <section className="py-[40px] lg:py-[80px] text-center">
        <Typography variant="h5" className="font-[500]">
          Your cart is empty
        </Typography>
      </section>
    );
  }

  const handleRemoveCartItem = async (cart_item_id) => {
    try {
      const response = await removeCartItem(null, {}, cart_item_id);

      if (response?.status) {
        dispatch(fetchCart({ currency: selectedCountry.currency }));
      } else {
        toast.error(response?.message || "Failed to remove item");
      }
    } catch (error) {
      toast.error("An error occurred while removing the item");
    }
  };

  const handleMoveToWishlist = async (cart_item_id) => {
    try {
      const response = await moveToWishlist(null, {}, cart_item_id);

      if (response?.status) {
        dispatch(fetchCart({ currency: selectedCountry.currency }));
        dispatch(
          fetchWishlist({
            currency: selectedCountry.currency,
          })
        );
      } else {
        toast.error(response?.message || "Failed to remove item");
      }
    } catch (error) {
      toast.error("An error occurred while removing the item");
    }
  };

  return (
    <section>
      <div className="lg:flex-row flex-col flex 2xl:gap-[112px] gap-[50px] lg:py-[80px] py-[40px]">
        {/* Cart Items */}
        <div className="lg:w-[70%] w-full">
          <div className="grid 2xl:grid-cols-5 md:grid-cols-4 gap-[30px] border-b pb-[24px] border-[var(--teal-3)]">
            <Typography
              variant="h5"
              className="2xl:col-span-3 md:col-span-2 font-[500]"
            >
              Product
            </Typography>
            <Typography variant="h5" className="font-[500] md:block hidden">
              Quantity
            </Typography>
            <Typography variant="h5" className="font-[500] md:block hidden">
              Subtotal
            </Typography>
          </div>

          {cartItems?.map((item) => (
            <div
              className=" border-b border-b-[var(--teal-3)]"
              key={item?.cart_item_id}
            >
              {/* Desktop View */}
              <div className="hidden md:grid 2xl:grid-cols-5 md:grid-cols-4 gap-[30px] py-[24px] items-center">
                <div className="flex justify-center px-0 py-[12px] bg-[var(--product-bg)] !cursor-pointer">
                  <img
                    src={item?.media_image}
                    alt={item?.product_name}
                    className="h-[122px] w-[122px] object-fill cursor-pointer"
                    onClick={() =>
                      handleClick(
                        item?.product_id,
                        item?.category_id,
                        item?.metal_color,
                        item?.diamond_shape
                      )
                    }
                  />
                </div>

                <div className="flex flex-col gap-[10px] 2xl:col-span-2 md:col-span-1">
                  <Typography
                    variant="h5"
                    className="font-[500] cursor-pointer"
                  >
                    {toTitleCase(item?.title)}
                  </Typography>
                  <Typography variant="h6" className="md:block hidden">
                    {item?.product_description}
                  </Typography>

                  <div className="space-y-[10px]">
                    {item?.design_no && (
                      <Typography variant="h6">
                        Design No. :{" "}
                        <span className="font-[500] text-[#222223]">
                          {item?.design_no}
                        </span>
                      </Typography>
                    )}
                    {item?.diamond_shape && (
                      <Typography variant="h6">
                        Diamond Shape :{" "}
                        <span className="font-[500] text-[#222223]">
                          {item?.diamond_shape}
                        </span>
                      </Typography>
                    )}
                    {item?.metal_type && item?.metal_color && (
                      <Typography variant="h6">
                        Metal :{" "}
                        <span className="font-[500] text-[#222223]">
                          {item?.metal_type +
                            " " +
                            toTitleCase(item?.metal_color) +
                            " Gold"}
                        </span>
                      </Typography>
                    )}
                    {item?.center_diamond_weight ? (
                      <Typography variant="h6">
                        Center Diamond Weight :
                        <span className="font-[500] text-[#222223]">
                          {item?.center_diamond_weight}
                        </span>
                      </Typography>
                    ) : (
                      ""
                    )}
                  </div>

                  {item?.ring_size && (
                    <div className="inline-flex gap-2 items-center">
                      {" "}
                      <Typography variant="h6">
                        {toTitleCase(item?.category)} Size : {item?.ring_size}
                      </Typography>{" "}
                      <Link
                        className="flex gap-2 items-center"
                        href="/ring-size-guide"
                      >
                        <img
                          src="/icons/info.svg"
                          className="cursor-pointer w-[14px] h-[14px]"
                        />
                      </Link>
                    </div>
                  )}
                </div>

                <QuantitySelector
                  item={item}
                  handleQuantities={handleUpdateQuantity}
                />

                <Typography variant="p" className="font-[600]">
                  {getCurrencySymbol(selectedCountry?.currency) + " "}
                  {typeof item.subtotal === "number"
                    ? item?.subtotal.toLocaleString()
                    : "0.00"}
                </Typography>
              </div>

              {/* Mobile View */}
              <div className="md:hidden flex flex-col py-6 gap-5">
                <div className="flex gap-5">
                  {/* Image Left */}
                  <div className="w-[110px] h-[110px] bg-[var(--product-bg)] flex items-center justify-center p-2 rounded-lg flex-shrink-0">
                    <img
                      src={item?.media_image}
                      alt={item?.product_name || "Product"}
                      className="w-full h-full object-contain cursor-pointer"
                      onClick={() =>
                        handleClick(
                          item?.product_id,
                          item?.category_id,
                          item?.metal_color,
                          item?.diamond_shape
                        )
                      }
                    />
                  </div>

                  {/* Content Right */}
                  <div className="flex-1 flex flex-col gap-2 min-h-[110px]">
                    {/* Title */}
                    <Typography
                      variant="h5"
                      className="font-[500] leading-tight"
                    >
                      {toTitleCase(item?.title || item?.product_name || "")}
                    </Typography>

                    {/* All Content */}
                    <div className="space-y-1">
                      {item?.product_description && (
                        <Typography variant="h6" className="opacity-70 italic text-[11px]">
                          {item?.product_description}
                        </Typography>
                      )}
                      {item?.design_no && (
                        <Typography variant="h6">
                          Design No. :{" "}
                          <span className="font-[500] text-[#222223]">
                            {item?.design_no}
                          </span>
                        </Typography>
                      )}
                      {item?.diamond_shape && (
                        <Typography variant="h6">
                          Diamond Shape :{" "}
                          <span className="font-[500] text-[#222223]">
                            {item?.diamond_shape}
                          </span>
                        </Typography>
                      )}
                      {item?.metal_type && item?.metal_color && (
                        <Typography variant="h6">
                          Metal :{" "}
                          <span className="font-[500] text-[#222223]">
                            {item?.metal_type +
                              " " +
                              toTitleCase(item?.metal_color) +
                              " Gold"}
                          </span>
                        </Typography>
                      )}
                      {item?.center_diamond_weight ? (
                        <Typography variant="h6">
                          Center Diamond Weight :
                          <span className="font-[500] text-[#222223]">
                            {item?.center_diamond_weight}
                          </span>
                        </Typography>
                      ) : null}
                      {item?.ring_size && (
                        <div className="inline-flex gap-2 items-center">
                          <Typography variant="h6">
                            {toTitleCase(item?.category)} Size :{" "}
                            {item?.ring_size}
                          </Typography>
                          <Link href="/ring-size-guide">
                            <img
                              src="/icons/info.svg"
                              className="cursor-pointer w-[14px] h-[14px]"
                              alt="info"
                            />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Quantity & Price Row */}
                <div className="flex justify-between items-center bg-[#fbfbfb] p-3 rounded-lg border border-[#f0f0f0]">
                  <QuantitySelector
                    item={item}
                    handleQuantities={handleUpdateQuantity}
                  />
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-[var(--grey-2)] uppercase tracking-wider mb-0.5 font-medium">Subtotal</span>
                    <Typography variant="h6" className="font-[600] text-[var(--teal-1)]">
                      {getCurrencySymbol(selectedCountry?.currency) + " "}
                      {typeof item.subtotal === "number"
                        ? item?.subtotal.toLocaleString()
                        : "0.00"}
                    </Typography>
                  </div>
                </div>

                {/* Mobile Buttons */}
                <div className="flex gap-3">
                  <Button
                    title={"Move To Wishlist"}
                    background={"var(--grey-00)"}
                    textColor={"var(--grey-2)"}
                    className="flex-1 border border-[var(--teal-3)] h-[44px] !text-[12px]"
                    icon={<HeartIcon className="w-4 h-4" iconColor="#222223" />}
                    onClick={() => handleMoveToWishlist(item.cart_item_id)}
                  >
                    Move To Wishlist
                  </Button>
                  <Button
                    background={"none"}
                    textColor={"var(--grey-2)"}
                    title={"remove"}
                    className="flex-1 border border-[var(--teal-3)] h-[44px] !text-[12px]"
                    icon={<CloseIcon className="w-4 h-4" />}
                    onClick={() => handleRemoveCartItem(item.cart_item_id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {/* Shared Desktop Buttons (only visible on md+) */}
              <div className="hidden md:flex gap-4 items-center pb-[24px]">
                <Button
                  title={"Move To Wishlist"}
                  background={"var(--grey-00)"}
                  textColor={"var(--grey-2)"}
                  className="w-full border border-[var(--teal-3)]"
                  icon={<HeartIcon className="w-5 h-5" iconColor="#222223" />}
                  onClick={() => handleMoveToWishlist(item.cart_item_id)}
                >
                  Move To Wishlist
                </Button>
                <Button
                  background={"none"}
                  textColor={"var(--grey-2)"}
                  title={"remove"}
                  className="w-full border border-[var(--teal-3)]"
                  icon={<CloseIcon className="w-5 h-5" />}
                  onClick={() => handleRemoveCartItem(item.cart_item_id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:w-[30%] w-full 2xl:pl-[44px] lg:pl-[24px] lg:border-l lg:border-l-[var(--teal-3)] lg:sticky lg:top-[120px] h-fit">
          {/* Coupon Section */}
          <div>
            <Typography variant="h5" className="font-[500]">
              Have a coupon?
            </Typography>
            <Typography
              variant="h5"
              className="font-[500]"
              textColor="customGrey"
            >
              Add your code for an instant cart discount
            </Typography>
            <InputWithIconButton
              icon={<CouponIcon className="w-5 h-5" />}
              inputProps={{
                placeholder: "Coupon Code",
                value: couponCode,
                onChange: (e) => {
                  setCouponCode(e.target.value);
                },
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCoupon();
                  }
                },
              }}
              // buttonTitle="Apply"
              className=" w-full"
              onButtonClick={handleCoupon}
            />
            {error && (
              <Typography variant="h6" className="mt-2 text-red-500">
                {error}
              </Typography>
            )}

            {summary?.coupon_code && (
              <div className="inline-flex items-center justify-between gap-2 bg-[var(--product-bg)] border border-[var(--teal-3)] rounded-[5px] px-3 py-1 mt-3">
                <span className="flex items-center gap-1 text-sm font-medium">
                  <CouponIcon className="w-3 h-3" />
                  {summary?.coupon_code}
                </span>

                <button onClick={remove} className="text-sm font-semibold">
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Typography variant="h4" className="font-[500] mb-4">
              Cart summary
            </Typography>

            {/* SHIPPING */}
            {/* <div className="space-y-[12px] mb-6">
              {shippingOptions?.map((option) => (
                <RadioButton
                  key={option?.id}
                  name="shipping"
                  value={option.price}
                  checked={selectedShipping === option?.price}
                  onChange={() => setSelectedShipping(option?.price)}
                >
                  <div className="flex justify-between w-full">
                    <span>{option?.label} shipping</span>
                    <span>
                      {getCurrencySymbol(selectedCountry?.currency)}{" "}
                      {option?.price}
                    </span>
                  </div>
                </RadioButton>
              ))}
            </div> */}

            {/* TOTALS */}
            <div className="space-y-[16px]">
              <div className="flex justify-between">
                <Typography variant="h6" className="font-[500]">
                  No. of Products
                </Typography>
                <Typography variant="h6" className="font-[500]">
                  {Number(summary?.number_of_cart_products ?? 0)}
                </Typography>
              </div>

              {/* SUBTOTAL */}
              <div className="flex justify-between">
                <Typography variant="h6" className="font-[500]">
                  Subtotal
                </Typography>
                <Typography variant="h6" className="font-[500]">
                  {getCurrencySymbol(selectedCountry?.currency)}{" "}
                  {Number(summary?.cart_total ?? 0)}
                </Typography>
              </div>

              <div className="flex justify-between">
                <Typography variant="h6" className="font-[500]">
                  Taxes
                </Typography>
                <Typography variant="h6" className="font-[500]">
                  {getCurrencySymbol(selectedCountry?.currency)}{" "}
                  {Number(summary?.cart_total ?? 0)}
                </Typography>
              </div>

              {/* 
              <div className="flex justify-between">
                <Typography variant="h6" className="font-[500]">
                  Shipping Chargess
                </Typography>
                <Typography variant="h6" className="font-[500]">
                  {getCurrencySymbol(selectedCountry?.currency)}{" "}
                  {Number(summary?.selectedShipping ?? 0)}
                </Typography>
              </div> */}

              {/* DISCOUNT ROW */}
              {summary?.coupon_code && (
                <div className="flex justify-between items-center whitespace-nowrap gap-3">
                  <Typography
                    variant="h6"
                    className="font-[500] flex items-center gap-2 whitespace-nowrap)]"
                  >
                    Discount
                  </Typography>
                  <Typography
                    variant="h6"
                    className="font-[500] flex items-center gap-1 whitespace-nowrap "
                  >
                    <MinusIcon />
                    {getCurrencySymbol(selectedCountry?.currency)}{" "}
                    {Number(summary?.discount)}{" "}
                    <span
                      className="text-[var(--teal-1)] cursor-pointer"
                      onClick={remove}
                    >
                      [Remove]
                    </span>
                  </Typography>
                </div>
              )}
              {/* TOTAL */}
              <div className="flex justify-between border-t pt-[16px] mb-[16px] border-t-[var(--teal-3)]">
                <Typography variant="h5" className="font-[600]">
                  Total
                </Typography>
                <Typography variant="h5" className="font-[600]">
                  {getCurrencySymbol(selectedCountry?.currency)}{" "}
                  {Number(summary?.grand_total ?? 0)}
                </Typography>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              title="Secure Checkout"
              className="w-full mt-[16px]"
            />
          </div>
        </div>
      </div >
    </section >
  );
};

export default Cart;
