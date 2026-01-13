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

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const router = useRouter();
  const cartCount = useSelector((state) => state.cart.cartCount);
  const { isTopBarHidden, isNavbarHidden } = useNavbarScroll();
  const [menuOptions, setMenuOptions] = useState(MENUS_OPTIONS);
  const { fetchAll } = useCrudApi("/api/nav-menu");
  const wishlistCount = useSelector((s) => s.wishlist.count);
  console.log("wishlistCount", wishlistCount);
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
          {/* Mobile Left */}
          <div className="flex items-center gap-[18px] lg:hidden w-[96px] icon-width icon-gap">
            <img
              src="/icons/hamburger.svg"
              alt="menu"
              className="w-[20px] h-[20px] cursor-pointer"
              onClick={() => setOpenMobileMenu(!openMobileMenu)}
            />
            <SearchIcon onClick={() => setShowSearchBar(!showSearchBar)} />
          </div>

          {/* Logo */}
          <div className="flex justify-center flex-1 lg:flex-none lg:order-1">
            <Link href="/">
              <img
                src="/logo/elova-jewel.png"
                alt="Elova Logo"
                className="md:w-[125px] w-[100px]"
                // className="md:w-auto w-[100px] h-[28px]"
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
          <div className="flex items-center lg:gap-[20px] gap-[18px] lg:order-3 icon-gap">
            <SearchIcon
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="hidden lg:block cursor-pointer"
            />
            <div className="relative">
              <img
                src="/icons/heart.svg"
                onClick={() => {
                  // if (activeUser) {
                  router.push("/account/wishlist");
                  // }
                  // else {
                  //   alert("Please log in to access your wishlist.");
                  //   router.push("/login");
                  // }
                }}
                className="w-[20px] h-[20px] cursor-pointer"
              />
              {wishlistCount > 0 && (
                <span className=" absolute -top-[8px] -right-[11px] min-w-[18px] h-[18px] px-[5px] bg-[#2F6F7A] text-white text-[11px] font-[600] rounded-full flex items-center justify-center leading-none">
                  {wishlistCount}
                </span>
              )}
            </div>
            <img
              src="/icons/user.svg"
              onClick={() => router.push("/account")}
              className="w-[20px] h-[20px] cursor-pointer"
              alt="User Account"
            />
            <Link href="/cart" className="cursor-pointer">
              <img
                src="/icons/basket-shopping.svg"
                alt="cart"
                className="w-[20px] h-[20px] cursor-pointer"
              />
              {cartCount > 0 && (
                <span className=" absolute top-[27px] right-[20px] min-w-[18px] h-[18px] px-[5px] bg-[#2F6F7A] text-white text-[11px] font-[600] rounded-full flex items-center justify-center leading-none">
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
      {openMobileMenu && <MobileNav closeMobile={setOpenMobileMenu} />}
    </header>
  );
};

export default Navbar;
