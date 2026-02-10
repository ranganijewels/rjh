"use client";

import React, { useEffect, useState } from "react";
import MenuOptionsPanel from "./MenuOptionsPanel";
import { MENUS_OPTIONS, NAV_MENUS } from "./constant";
import MobileNav from "./MobileNav";
import Link from "next/link";
import SearchPanel from "./SearchPanel";
import SearchIcon from "@/components/Icons/SearchIcon";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import TopBar from "./TopBar";
import { useNavbarScroll } from "@/hooks/useNavbarScroll";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useCrudApi } from "@/hooks/useCrudApi";
import { mapApiMenuToOptions } from "@/utils/mapMenuData";
import { useSelector } from "react-redux";
import WishlistPopUp from "@/components/ui/PopUp/WishlistPopUp";
import { useWishlistPopup } from "@/context/WishlistPopupContext";
import useIsMobile from "@/utils/useIsMobile";
import { toTitleCase } from "@/utils/string";

const Navbar = () => {
  const router = useRouter();
  const cartCount = useSelector((state) => state.cart.cartCount);
  const [activeMenu, setActiveMenu] = useState(null);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const { isTopBarHidden, isNavbarHidden } = useNavbarScroll();
  const [menuOptions, setMenuOptions] = useState(MENUS_OPTIONS);
  const { fetchAll } = useCrudApi("/api/nav-menu");
  const wishlistCount = useSelector((s) => s.wishlist.count);
  const { open, close } = useWishlistPopup();
  const { isMobile } = useIsMobile(1024);
  const { isMobile: MobileSize } = useIsMobile(425);

  const customer = useSelector((state) => state.auth.customer);

  useEffect(() => {
    const loadMenus = async () => {
      const response = await fetchAll();
      if (response?.status && response.data) {
        const mergedMenus = mapApiMenuToOptions(response.data, MENUS_OPTIONS);
        setMenuOptions(mergedMenus);
      }
    };
    loadMenus();
  }, [fetchAll]);

  useEffect(() => {
    const handleScroll = () => {
      if (activeMenu) {
        setActiveMenu(null);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeMenu]);

  useEffect(() => {
    if (openMobileMenu) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [openMobileMenu]);

  return (
    <header className="z-[1000]">
      <TopBar isTopBarHidden={isTopBarHidden} />

      {/* Main Navbar */}
      <nav
        className={clsx(
          "bg-[var(--grey-0)] w-full transition-all duration-300 ease-in-out shadow-[0px_3px_4px_0px_rgba(0,0,0,0.08)]",

          isNavbarHidden
            ? "-translate-y-full"
            : "translate-y-0 shadow-[0px_3px_6px_rgba(0,0,0,0.1)]",
          isTopBarHidden ? "top-0 fixed" : "top-[32px]"
        )}
      >
        <div className="flex items-center justify-between p-[24px_30px] nav-padding relative z-50">
          {/* Mobile Left Icons */}
          <div className="flex items-center gap-[15px] lg:hidden w-[90px]">
            <img
              src="/icons/hamburger.svg"
              alt="menu"
              className="w-[20px] h-[20px] cursor-pointer shrink-0"
              onClick={() => setOpenMobileMenu(!openMobileMenu)}
            />
            <SearchIcon
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="shrink-0"
            />
          </div>

          {/* Centered Logo */}
          <div className="flex justify-center flex-1 lg:flex-none lg:order-1">
            <Link href="/">
              <img
                src="/logo/elova-jewel.png"
                alt="Elova Logo"
                className="md:w-[130px] w-[105px]"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex xl:gap-[60px] lg:gap-[30px] flex-1 justify-center lg:order-1 text-[14px] font-[400]">
            {NAV_MENUS.map((item) => {
              const isActive = activeMenu === item.label;
              return (
                <div
                  key={item.label}
                  onClick={() => {
                    router.push(item.link);
                    setActiveMenu(null);
                  }}
                  onMouseEnter={() => setActiveMenu(item.label)}
                  className={clsx(
                    "relative cursor-pointer transition-colors duration-300 uppercase",
                    "after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:bg-[var(--teal-1)] after:transition-all after:duration-300 after:ease-in-out after:w-0",
                    {
                      "text-[var(--teal-1)] after:w-full": isActive,
                      "text-[var(--grey-2)] hover:after:w-full": !isActive,
                    }
                  )}
                >
                  {item.label}
                </div>
              );
            })}
          </div>

          {/* Right Icons */}
          <div className="flex items-center lg:gap-[20px] gap-[15px] lg:order-3 lg:w-auto w-[90px] justify-end">
            <SearchIcon
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="hidden lg:block cursor-pointer"
              ariaLabel="Search products"
            />

            {/* User Profile */}
            <div className="flex items-center">
              {customer && !MobileSize && (
                <span className="text-[var(--teal-1)] text-[14px] font-[500] mr-2 whitespace-nowrap hidden sm:block">
                  Hi, {toTitleCase(customer.first_name)}
                </span>
              )}
              <div className="relative h-[20px] w-[20px]">
                <img
                  src="/icons/user.svg"
                  onClick={() => router.push("/account")}
                  className="w-full h-full cursor-pointer"
                  alt="User Account"
                />
                {customer && MobileSize && (
                  <span className="absolute -top-[8px] -right-[11px] min-w-[18px] h-[18px] px-[5px] bg-[#2F6F7A] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none border border-white">
                    {customer.first_name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Wishlist */}
            <div className="relative" onMouseEnter={open} onMouseLeave={close}>
              <div className="relative h-[20px] w-[20px]">
                <img
                  src="/icons/heart.svg"
                  onClick={() => router.push("/wishlist")}
                  className="w-full h-full cursor-pointer"
                  alt="Wishlist"
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-[8px] -right-[11px] min-w-[18px] h-[18px] px-[5px] bg-[#2F6F7A] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none border border-white">
                    {wishlistCount}
                  </span>
                )}
              </div>
              {!isMobile && (
                <WishlistPopUp onMouseEnter={open} onMouseLeave={close} />
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative block h-[20px] w-[20px]">
              <img
                src="/icons/basket-shopping.svg"
                alt="cart"
                className="w-full h-full cursor-pointer"
              />
              {cartCount > 0 && (
                <span className="absolute -top-[8px] -right-[11px] min-w-[18px] h-[18px] px-[5px] bg-[#2F6F7A] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none border border-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Dropdown Panels */}
        <div className="relative z-40">
          {activeMenu && (
            <MenuOptionsPanel
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              menus={menuOptions}
            />
          )}

          {showSearchBar && (
            <SearchPanel
              showSearchbar={showSearchBar}
              closeSearchBar={setShowSearchBar}
            />
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {openMobileMenu && (
        <MobileNav closeMobile={setOpenMobileMenu} menus={menuOptions} />
      )}
    </header>
  );
};

export default Navbar;
