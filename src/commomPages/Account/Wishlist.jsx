"use client";
import React, { useEffect, useMemo } from "react";
import { AccountPageTitle, EmptyState } from "./ui";
import { resolveCartItemName } from "@/lib/resolveTokens";
import Button from "@/components/ui/Button/Button";
import ProductCard from "@/components/ui/Cards/ProductCard";
import ProductCardSkeleton from "@/components/ui/Cards/ProductCardSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "@/store/slices/wishlistSlice";
import { toTitleCase } from "@/utils/string";
import Typography from "@/components/ui/Typography/Typography";
import { useWishlistLogic } from "@/hooks/useWishlistLogic";
import { usePreferences } from "@/context/PreferencesContext";

const CATEGORY_ORDER = ["RING", "EARRING", "NECKLACE", "BRACELET", "PENDANT"];

const Wishlist = ({ hideTitle, gridCol }) => {
  const dispatch = useDispatch();
  const { wishlistItems, addToCart, removeFromWishlist } = useWishlistLogic();
  const { items, count, loading } = useSelector((state) => state.wishlist);

  const { selectedCountry } = usePreferences();

  useEffect(() => {
    if (selectedCountry?.currency) {
      dispatch(
        fetchWishlist({
          currency: selectedCountry.currency,
        })
      );
    }
  }, [dispatch, selectedCountry]);

  const groupedWishlist = useMemo(() => {
    if (!items?.length) return {};

    return items.reduce((acc, item) => {
      const rawName = item?.product?.category?.name || "Others";
      const key = rawName.toUpperCase(); // normalize

      if (!acc[key]) acc[key] = [];
      acc[key].push(item);

      return acc;
    }, {});
  }, [items]);

  const orderedCategories = useMemo(() => {
    return Object.keys(groupedWishlist).sort((a, b) => {
      const indexA = CATEGORY_ORDER.indexOf(a);
      const indexB = CATEGORY_ORDER.indexOf(b);

      // Categories not in list go to the end
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });
  }, [groupedWishlist]);

  return (
    <>
      {!hideTitle && (
        <AccountPageTitle
          title="Wishlist"
          description={count ? `${count} saved ${count === 1 ? "piece" : "pieces"}` : "Pieces you've saved for later."}
        />
      )}
      <div className="flex flex-col">
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))
        ) : Object.keys(groupedWishlist).length > 0 ? (
          orderedCategories.map((categoryKey) => {
            const categoryItems = groupedWishlist[categoryKey];

            return (
              <div key={categoryKey} className="mb-[40px]">
                {/* CATEGORY TITLE */}
                <h2 className="text-[13px] uppercase tracking-[0.1em] text-[var(--color-text-muted)] mb-[14px]">{toTitleCase(categoryKey)}</h2>

                {/* CATEGORY GRID */}
                <div
                  className={`md:gap-x-[30px] gap-x-[5px] md:gap-y-[49px] gap-y-[20px] ${gridCol}`}
                >
                  {categoryItems.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="flex flex-col justify-between lg:min-h-[400px]"
                      >
                        <ProductCard
                          categoryId={item?.product?.category_id}
                          productId={item?.product_id}
                          productName={resolveCartItemName(item?.product?.title, {
                            metalType: item?.metal_type,
                            metalColor: item?.metal_color,
                            shape: item?.diamond_shape,
                            centerDiamondWeight: item?.center_diamond_weight,
                          })}
                          price={item?.product_price}
                          productImg={item?.product?.image}
                          hoverImage={item?.product?.image_rollover}
                          designNo={item?.product?.design_no}
                          wishlistStatus={item?.product?.wishlist}
                          metalColor={item?.metal_color}
                          shape={item?.diamond_shape}
                          centerDiamondWeight={item?.center_diamond_weight}
                          size={item?.size}
                          metalType={item?.metal_type}
                          ringSize={item?.ring_size}
                          isWishlistCard
                          category={categoryKey}
                          disableWishlistPopup
                          id={item.id}
                        />

                        <div className="flex xl:flex-row lg:gap-[20px] gap-[4px] flex-col lg:mt-4 mt-[9px]">
                          <Button
                            title="Add to bag"
                            className="w-full"
                            onClick={() => addToCart(item.id)}
                          />
                          <Button
                            title="Remove"
                            variant="outlineBlack"
                            className="w-full"
                            onClick={() => removeFromWishlist(item.id)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState
            title="Your wishlist is empty"
            text="Tap the heart on any piece to save it here."
            actionLabel="Explore jewellery"
            actionHref="/product"
          />
        )}
      </div>
    </>
  );
};

export default Wishlist;
