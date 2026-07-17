"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import MenuOptionsPanel from "./MenuOptionsPanel";
import SimpleNavDropdown from "./SimpleNavDropdown";
import { MENUS_OPTIONS, NAV_MENUS } from "./constant";
import MobileNav from "./MobileNav";
import Link from "next/link";
import SearchPanel from "./SearchPanel";
import SearchIcon from "@/components/Icons/SearchIcon";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import TopBar from "./TopBar";
import { useNavbarScroll } from "@/hooks/useNavbarScroll";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useCrudApi } from "@/hooks/useCrudApi";
import { useSelector } from "react-redux";
import WishlistPopUp from "@/components/ui/PopUp/WishlistPopUp";
import { useWishlistPopup } from "@/context/WishlistPopupContext";
import useIsMobile from "@/utils/useIsMobile";
import { toTitleCase } from "@/utils/string";
import Badge from "@/components/ui/Badge/Badge";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const cartCount = useSelector((state) => state.cart.cartCount);
  const [activeMenu, setActiveMenu] = useState(null);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const { isNavbarHidden, isAtTop } = useNavbarScroll();

  // Hero pages (home + every page whose first element is a full-bleed hero
  // banner): the hero flows UNDER the nav (negative margin equal to the nav
  // height — constant per page, never scroll-dependent, so no layout jumps),
  // and while the shopper is at the very top the nav is transparent with
  // white text/logo/icons. Any open panel forces the solid style back.
  // Explicit allow-list so pages WITHOUT a hero (PDP /product/[id], cart,
  // account, blog-detail, /customize/form/*) keep the solid nav in normal flow
  // and never overlay page content with white-on-white text.
  const HERO_ROUTES = new Set([
    "/", "/about-us", "/blog", "/gallery", "/reviews", "/product", "/customize",
    "/craftsmanship", "/sustainability", "/customer-love",
  ]);
  const isHeroPage = HERO_ROUTES.has(pathname) || pathname.startsWith("/collections/");
  const headerRef = useRef(null);
  const [navHeight, setNavHeight] = useState(0);
  useLayoutEffect(() => {
    if (!isHeroPage || !headerRef.current) return;
    const el = headerRef.current;
    const measure = () => setNavHeight(el.offsetHeight);
    measure();
    // Re-measure whenever the header's height actually changes. The logo SVG and
    // web fonts finish loading AFTER the first layout pass and grow the nav from
    // ~69px to its final ~93px; a one-time measure leaves the overlay margin too
    // small, so the body background peeks through as a thin strip under the topbar.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isHeroPage]);
  const transparent =
    isHeroPage && isAtTop && !activeMenu && !showSearchBar && !openMobileMenu;
  // Admin-managed nav items (CMS > Navigation). Empty until the fetch below
  // resolves, so the hardcoded NAV_MENUS renders first-paint with no flash.
  const [adminNavItems, setAdminNavItems] = useState([]);
  const { fetchAll } = useCrudApi("/api/nav-menu");
  const wishlistCount = useSelector((s) => s.wishlist.count);
  const { open, close } = useWishlistPopup();
  const { isMobile } = useIsMobile(1024);
  const { isMobile: MobileSize } = useIsMobile(425);

  const customer = useSelector((state) => state.auth.customer);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const response = await fetchAll();
        if (response?.data?.length) {
          setAdminNavItems(response.data);
        }
      } catch {
        // Fall back to the hardcoded NAV_MENUS below — nothing to do here.
      }
    };
    loadMenus();
  }, [fetchAll]);

  // Top-level bar items: the 5 hardcoded NAV_MENUS ALWAYS render (this is
  // the "layer on top, don't replace" rule) plus any admin-added item whose
  // label doesn't already match one of them — so a from-launch, never-wired
  // CmsNavigation row (e.g. a generic "Home"/"Collections" set seeded before
  // this feature existed) can't silently blank out the rich mega-menu the
  // moment it becomes reachable. Only genuinely new admin items append.
  const topNavItems = useMemo(() => {
    const base = NAV_MENUS.map((item) => ({ ...item, children: [] }));
    const extra = adminNavItems
      .filter(
        (item) =>
          !NAV_MENUS.some((m) => m.label.toLowerCase() === item.title.toLowerCase())
      )
      .map((item) => ({
        label: item.title,
        link: item.link,
        children: item.children || [],
      }));
    return [...base, ...extra];
  }, [adminNavItems]);

  // Admin-added top-level items with no rich-menu match get folded into the
  // mobile menu too, as a single-category accordion of their child links —
  // reuses MobileNav's existing category rendering with no changes there.
  const menuOptions = useMemo(() => {
    const extra = topNavItems
      .filter(
        (item) =>
          !MENUS_OPTIONS.some(
            (m) => m.title.toLowerCase() === item.label.toLowerCase()
          )
      )
      .filter((item) => item.children.length)
      .map((item) => ({
        title: item.label,
        categories: [
          {
            title: item.label,
            items: item.children.map((c) => ({ label: c.title, link: c.link })),
          },
        ],
      }));
    return [...MENUS_OPTIONS, ...extra];
  }, [topNavItems]);

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
    <>
      {/* Top bar scrolls away naturally with the page — no transform, no jump */}
      <TopBar />

      {/* Main Navbar — sticky at the page level keeps it permanently in the
          document flow (space always reserved), so hiding/revealing is a pure
          GPU transform and the hero never shifts or flickers. */}
      <header
        ref={headerRef}
        className={clsx(
          "sticky top-0 z-[1000] w-full will-change-transform",
          "transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
          isNavbarHidden ? "-translate-y-[110%]" : "translate-y-0"
        )}
        style={isHeroPage && navHeight ? { marginBottom: -navHeight } : undefined}
      >
      <nav
        className={clsx(
          "w-full transition-colors duration-300",
          transparent
            ? "bg-transparent"
            : "bg-[var(--grey-0)]",
          !isNavbarHidden && !transparent && "shadow-[0px_3px_6px_rgba(0,0,0,0.08)]"
        )}
      >
        <div className="flex items-center justify-between p-[24px_30px] nav-padding relative z-50">
          {/* Mobile Left Icons */}
          <div className="flex items-center gap-[15px] lg:hidden w-[90px]">
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={openMobileMenu}
              onClick={() => setOpenMobileMenu(!openMobileMenu)}
              className="shrink-0"
            >
              <img
                src="/icons/hamburger.svg"
                alt=""
                aria-hidden="true"
                className={clsx(
                  "w-[20px] h-[20px] shrink-0",
                  transparent && "[filter:brightness(0)_invert(1)]"
                )}
              />
            </button>
            <SearchIcon
              onClick={() => setShowSearchBar(!showSearchBar)}
              className={clsx(
                "shrink-0",
                transparent && "[filter:brightness(0)_invert(1)]"
              )}
              ariaLabel="Search products"
            />
          </div>

          {/* Centered Logo — white wordmark while the nav overlays the hero */}
          <div className="flex justify-center flex-1 lg:flex-none lg:order-1">
            <Link href="/">
              <img
                src={transparent ? "/logo/rj-house-footer.svg" : "/logo/rj-house.svg"}
                alt="RJ House Logo"
                width={636}
                height={219}
                // Reserve the logo's height (636:219 aspect → 45px at 130w, 36px at
                // 105w) so the header is its final size on the FIRST layout pass. The
                // nav-overlay margin is measured from the header height; without this
                // the logo loads late, grows the nav, and a body-bg strip shows under
                // the topbar until re-measure.
                className="md:w-[130px] w-[105px] md:h-[45px] h-[36px] object-contain"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex xl:gap-[60px] lg:gap-[30px] flex-1 justify-center lg:order-1 text-[14px] font-[400]"
          >
            {topNavItems.map((item) => {
              const isActive = activeMenu === item.label;
              return (
                <button
                  type="button"
                  key={item.label}
                  aria-haspopup="true"
                  aria-expanded={isActive}
                  onClick={() => {
                    router.push(item.link);
                    setActiveMenu(null);
                  }}
                  onMouseEnter={() => setActiveMenu(item.label)}
                  onFocus={() => setActiveMenu(item.label)}
                  className={clsx(
                    "relative cursor-pointer transition-colors duration-300 uppercase bg-transparent",
                    "after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:transition-all after:duration-300 after:ease-in-out after:w-0",
                    "focus-visible:outline-2 focus-visible:outline-offset-2",
                    transparent ? "after:bg-white" : "after:bg-[var(--teal-1)]",
                    transparent ? "focus-visible:outline-white" : "focus-visible:outline-[var(--teal-1)]",
                    {
                      "after:w-full": isActive,
                      "hover:after:w-full focus-visible:after:w-full": !isActive,
                      "text-white": transparent,
                      "text-[var(--teal-1)]": isActive && !transparent,
                      "text-[var(--grey-2)]": !isActive && !transparent,
                    }
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center lg:gap-[20px] gap-[15px] lg:order-3 lg:w-auto w-[90px] justify-end">
            <SearchIcon
              onClick={() => setShowSearchBar(!showSearchBar)}
              className={clsx(
                "hidden lg:block cursor-pointer",
                transparent && "[filter:brightness(0)_invert(1)]"
              )}
              ariaLabel="Search products"
            />

            {/* User Profile */}
            <div className="flex items-center">
              {customer && !MobileSize && (
                <span
                  className={clsx(
                    "text-[14px] font-[500] mr-2 whitespace-nowrap hidden sm:block",
                    transparent ? "text-white" : "text-[var(--teal-1)]"
                  )}
                >
                  Hi, {toTitleCase(customer.first_name)}
                </span>
              )}
              <button
                type="button"
                aria-label="My account"
                onClick={() => router.push("/account")}
                className="relative h-[20px] w-[20px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal-1)] hover:opacity-70 transition-opacity"
              >
                <img
                  src="/icons/user.svg"
                  aria-hidden="true"
                  className={clsx(
                    "w-full h-full cursor-pointer",
                    transparent && "[filter:brightness(0)_invert(1)]"
                  )}
                  alt=""
                />
                {customer && MobileSize && (
                  <Badge count={customer.first_name?.charAt(0).toUpperCase()} />
                )}
              </button>
            </div>

            {/* Wishlist */}
            <div className="relative" onMouseEnter={open} onMouseLeave={close}>
              <button
                type="button"
                aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount} items)` : ""}`}
                onClick={() => router.push("/wishlist")}
                className="relative h-[20px] w-[20px] block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal-1)] hover:opacity-70 transition-opacity"
              >
                <img
                  src="/icons/heart.svg"
                  aria-hidden="true"
                  className={clsx(
                    "w-full h-full cursor-pointer",
                    transparent && "[filter:brightness(0)_invert(1)]"
                  )}
                  alt=""
                />
                {wishlistCount > 0 && <Badge count={wishlistCount} />}
              </button>
              {!isMobile && (
                <WishlistPopUp onMouseEnter={open} onMouseLeave={close} />
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label={`Shopping bag${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
              className="relative block h-[20px] w-[20px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal-1)] hover:opacity-70 transition-opacity"
            >
              <img
                src="/icons/basket-shopping.svg"
                alt=""
                aria-hidden="true"
                className={clsx(
                  "w-full h-full cursor-pointer",
                  transparent && "[filter:brightness(0)_invert(1)]"
                )}
              />
              {cartCount > 0 && <Badge count={cartCount} />}
            </Link>
          </div>
        </div>

        {/* Dropdown Panels */}
        <div className="relative z-40">
          {activeMenu && (
            <>
              {MENUS_OPTIONS.some(
                (m) => m.title.toLowerCase() === activeMenu.toLowerCase()
              ) ? (
                <MenuOptionsPanel
                  activeMenu={activeMenu}
                  setActiveMenu={setActiveMenu}
                  menus={MENUS_OPTIONS}
                />
              ) : (
                <SimpleNavDropdown
                  activeMenu={activeMenu}
                  setActiveMenu={setActiveMenu}
                  item={topNavItems.find((i) => i.label === activeMenu)}
                />
              )}
            </>
          )}

          {showSearchBar && (
            <SearchPanel
              showSearchbar={showSearchBar}
              closeSearchBar={setShowSearchBar}
            />
          )}
        </div>
      </nav>
      </header>

      {/* Mobile Menu (fixed overlay — outside the translated header) */}
      {openMobileMenu && (
        <MobileNav closeMobile={setOpenMobileMenu} menus={menuOptions} />
      )}
    </>
  );
};

export default Navbar;
