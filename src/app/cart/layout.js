"use client";
import PageHeading from "@/components/ui/Heading/PageHeading";
import Stepper from "@/components/ui/Stepper/Stepper";
import { usePreferences } from "@/context/PreferencesContext";
import { fetchCart } from "@/store/slices/cartSlice";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const steps = [
  { title: "Shopping cart", path: "/cart" },
  { title: "Checkout details", path: "/cart/checkout" },
  { title: "Order complete", path: "/cart/order-complete" },
];

const CartLayout = ({ children }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { selectedCountry } = usePreferences();
  const { cartItems, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    const disableRightClick = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authTokenElova");
    if (!token) {
      router.replace(`/login?redirect=${pathname}`);
      return;
    }
    dispatch(fetchCart({ currency: selectedCountry?.currency }));
  }, [dispatch, router, pathname]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("authTokenElova")
      : null;
  if (!token) return null;

  return (
    <section>
      <div className="mb-[40px]">
        <PageHeading title="My Cart" />
      </div>

      <div
        className={`xl:mt-[60px] md:mt-[40px] mt-[30px] 2xl:mx-[210px] xl:mx-[100px] md:mx-[40px] mx-[0px] ${
          cartItems && cartItems.length > 0 ? "bg-white" : ""
        }`}
      >
        <div className="lg:py-[80px] py-[40px] xl:px-[80px] lg:px-[37px] px-[18px]">
          {pathname === "/cart/order-complete" ? (
            children
          ) : cartItems && cartItems.length > 0 ? (
            <>
              <Stepper currentPath={pathname} steps={steps} />
              {children}
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No items found
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CartLayout;
