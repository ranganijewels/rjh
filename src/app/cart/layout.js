"use client";
import PageHeading from "@/components/ui/Heading/PageHeading";
import Stepper from "@/components/ui/Stepper/Stepper";
import { usePreferences } from "@/context/PreferencesContext";
import { fetchCart } from "@/store/slices/cartSlice";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Typography from "@/components/ui/Typography/Typography";
import FeaturedCollections from "@/components/common/FeaturedCollections";
import { useHomepageData } from "@/commomPages/Home/useHomepageData";

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
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("authTokenElova")
        : null;
    if (!token) {
      router.replace(`/login?redirect=${pathname}`);
      return;
    }
    dispatch(fetchCart({ currency: selectedCountry?.currency }));
  }, [dispatch, selectedCountry?.currency]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("authTokenElova")
      : null;
  if (!token) return null;

  const currentIndex = steps.findIndex((s) => s.path === pathname);

  if (loading && (!cartItems || cartItems.length === 0)) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--teal-1)]"></div>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-[40px]">
        <PageHeading title="My Bag" />
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
              <Stepper currentPath={currentIndex} steps={steps} />
              {children}
            </>
          ) : (
            <div className="flex flex-col xl:gap-[130px] gap-[80px]">
              <div>
                <Typography
                  variant="h2"
                  className="!text-[40px] !font-[400] mb-[20px] text-[var(--grey-2)]"
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
