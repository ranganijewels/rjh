"use client";
import Stepper, { CART_STEPS } from "@/components/ui/Stepper/Stepper";
import { usePreferences } from "@/context/PreferencesContext";
import { fetchCart } from "@/store/slices/cartSlice";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Typography from "@/components/ui/Typography/Typography";
import FeaturedCollections from "@/components/common/FeaturedCollections";
import { useHomepageData } from "@/commomPages/Home/useHomepageData";

const steps = CART_STEPS;

const CartLayout = ({ children }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { selectedCountry } = usePreferences();
  const { cartItems, loading } = useSelector((state) => state.cart);
  const { customer } = useSelector((state) => state.auth);
  const { homeData } = useHomepageData();

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
    // Guest checkout: the cart works without a login — fetchCart falls back
    // to the x-guest-id header when there's no auth token.
    dispatch(fetchCart({ currency: selectedCountry?.currency }));
  }, [dispatch, selectedCountry?.currency]);

  const currentIndex = steps.findIndex((s) => s.path === pathname);

  // The cart comes from the browser (saved state + fetch), so the server can't
  // render it; wait for the first client render to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || (loading && (!cartItems || cartItems.length === 0))) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--teal-1)]"></div>
      </div>
    );
  }

  return (
    // Full width on white: no "My Bag" banner and no card on a grey page, so
    // the bag and checkout fit on screen with less scrolling.
    <section className="w-full bg-white">
      <div>
        <div className="2xl:px-[120px] xl:px-[80px] lg:px-[40px] px-[16px] lg:py-[40px] py-[24px]">
          {pathname === "/cart/order-complete" || pathname === "/cart/payment-status" ? (
            children
          ) : cartItems && cartItems.length > 0 ? (
            <>
              <Stepper currentPath={currentIndex} steps={steps} />
              {children}
            </>
          ) : (
            <div className="flex flex-col xl:gap-[130px] gap-[80px]">
              <div>
                <Typography
                  variant="h2"
                  textColor="grey"
                  className="text-[40px] font-[400] mb-[20px]"
                >
                  Your Shopping Bag Is Empty
                </Typography>
                {!customer && (
                  <Typography
                    variant="p"
                    className="text-[18px] text-[var(--grey-2)]"
                  >
                    <Link href="/login" className="underline hover:text-black">
                      Sign in
                    </Link>{" "}
                    to save your shopping bag across devices.
                  </Typography>
                )}
              </div>

              <div>
                <FeaturedCollections
                  collections={
                    homeData?.collection_section?.[0]?.items.slice(0, 4) ?? []
                  }
                  title="Continue Shopping"
                  imageStyle="2xl:h-[350px] xl:h-[300px] lg:h-[250px] !w-full h-[200px]"
                  onClick={(product) => {
                    router.push(`/product?category_id=${product.category_id}`);
                  }}
                  isGrid
                  className="!px-0"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CartLayout;
