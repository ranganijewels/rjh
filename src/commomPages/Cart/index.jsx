"use client";
import React, { useEffect, useState } from "react";
import { CouponIcon } from "@/components/Icons/common";
import Button from "@/components/ui/Button/Button";
import RadioButton from "@/components/ui/Button/RadioButton";
import InputWithIconButton from "@/components/ui/Input/InputWithIconButton";
import Typography from "@/components/ui/Typography/Typography";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon, fetchCart, setShipping } from "@/store/slices/cartSlice";
import { useCrudApi } from "@/hooks/useCrudApi";
import toast from "react-hot-toast";
import QuantitySelector from "./QuantitySelector";
import { toTitleCase } from "@/utils/string";
import { usePreferences } from "@/context/PreferencesContext";
import { getCurrencySymbol } from "@/utils/currencySymbol";

const shippingOptions = [
  { id: "free", label: "Free", price: 0 },
  { id: "express", label: "Express", price: 10 },
];

const Cart = () => {
  const [selectedShipping, setSelectedShipping] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponDetails, setCouponDetails] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);
  const { cartItems, summary } = useSelector((state) => state.cart);
  const { selectedCountry } = usePreferences();
  const { create: updateQuantities } = useCrudApi(
    "/api/cart/update-quantities"
  );

  useEffect(() => {
    if (token && selectedCountry?.currency) {
      dispatch(fetchCart({ currency: selectedCountry.currency }));
    }
  }, [dispatch, token, selectedCountry?.currency]);

  const handleCoupon = async () => {
    try {
      await dispatch(applyCoupon(couponCode)).unwrap();
      toast.success("Coupon Applied");
    } catch (err) {
      toast.error(err || "Failed to apply coupon");
    }
  };

  // Checkout handler
  const handleCheckout = () => {
    dispatch(setShipping(selectedShipping));
    router.push("/cart/checkout");
  };

  // Update cart quantity
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

  if (!cartItems?.length) {
    return (
      <section className="py-[40px] lg:py-[80px] text-center">
        <Typography variant="h5" className="font-[500]">
          Your cart is empty
        </Typography>
      </section>
    );
  }

  return (
    <section>
      <div className="lg:flex-row flex-col flex 2xl:gap-[166px] gap-[50px] lg:py-[80px] py-[40px]">
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
              key={item?.product_id}
              className="grid 2xl:grid-cols-5 md:grid-cols-4 gap-[30px] py-[24px] items-center border-b border-b-[var(--teal-3)]"
            >
              <div className="px-[21px] py-[12px] bg-[var(--product-bg)]">
                <img
                  src={item?.image}
                  alt={item?.product_name}
                  className="h-[122px] w-[122px] object-cover"
                />
              </div>

              <div className="flex flex-col gap-[10px] 2xl:col-span-2 md:col-span-1">
                <Typography variant="h5" className="font-[500]">
                  {toTitleCase(item?.title)}
                </Typography>
                <Typography variant="h6" className="md:block hidden">
                  {item?.product_description}
                </Typography>
              </div>

              <QuantitySelector
                item={item}
                handleQuantities={handleUpdateQuantity}
              />

              <Typography variant="p" className="font-[600]">
                {getCurrencySymbol(selectedCountry?.currency)}
                {typeof item.subtotal === "number"
                  ? item?.subtotal.toFixed(2)
                  : "0.00"}
              </Typography>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:w-[30%] w-full 2xl:pl-[84px] lg:pl-[24px] lg:py-[24px] space-y-[16px] lg:border-l lg:border-l-[var(--teal-3)]">
          <div>
            {" "}
            <Typography variant="h4" className="font-[500]">
              Cart summary
            </Typography>
            <div className="space-y-[12px]">
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
                      {getCurrencySymbol(selectedCountry?.currency)}
                      {option?.price}
                    </span>
                  </div>
                </RadioButton>
              ))}
            </div>
            <div>
              <div className="flex justify-between py-[13px] border-b border-b-[var(--teal-3)]">
                <Typography variant="h5" className="font-[500]">
                  Cart total
                </Typography>
                <Typography variant="h5" className="font-[500]">
                  {getCurrencySymbol(selectedCountry?.currency)}
                  {Number(summary?.cart_total ?? 0).toFixed(2)}
                </Typography>
              </div>
              <div className="flex justify-between py-[13px]">
                <Typography variant="h5" className="font-[500]">
                  Total
                </Typography>
                <Typography variant="h5" className="font-[500]">
                  {getCurrencySymbol(selectedCountry?.currency)}
                  {Number(
                    couponDetails?.final_total ?? summary?.cart_total ?? 0
                  ).toFixed(2)}
                </Typography>
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              title="Checkout"
              className="w-full mt-[16px]"
            />
          </div>
        </div>
      </div>

      {/* Coupon Section */}
      <div>
        <Typography variant="h5" className="font-[500]">
          Have a coupon?
        </Typography>
        <Typography variant="h5" className="font-[500]" textColor="customGrey">
          Add your code for an instant cart discount
        </Typography>
        <InputWithIconButton
          icon={<CouponIcon className="w-5 h-5" />}
          inputProps={{
            placeholder: "Coupon Code",
            value: couponCode,
            onChange: (e) => setCouponCode(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCoupon();
              }
            },
          }}
          buttonTitle="Apply"
          className="lg:w-[442px] w-full mt-[16px]"
          onButtonClick={handleCoupon}
        />
        {couponError && (
          <Typography variant="h6" className="mt-2 text-red-500">
            {couponError}
          </Typography>
        )}
      </div>
    </section>
  );
};

export default Cart;
