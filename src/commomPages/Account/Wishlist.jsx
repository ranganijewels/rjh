"use client";
import React, { useEffect, useMemo } from "react";
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
  const { wishlistItems, addToCart } = useWishlistLogic();
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
        <div className="xl:mb-[50px] mb-[30px]">
          <p className="xl:text-[40px] text-[26px] font-[400] text-[var(--grey-2)]">
            Wish List
          </p>
        </div>
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
              <div key={categoryKey} className="mb-[60px]">
                {/* CATEGORY TITLE */}
                <Typography variant="h3">{toTitleCase(categoryKey)}</Typography>

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
                          productName={item?.product?.title}
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
                            onClick={() => addToCart(item.id)}
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
          <Typography
            variant="h3"
            className="mb-[20px] text-[var(--grey-2)] text-center"
          >
            Your wish list is empty.
          </Typography>
        )}
      </div>
    </>
  );
};

export default Wishlist;

// "use client";
// import React, { useEffect, useMemo } from "react";
// import Button from "@/components/ui/Button/Button";
// import ProductCard from "@/components/ui/Cards/ProductCard";
// import ProductCardSkeleton from "@/components/ui/Cards/ProductCardSkeleton";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchWishlist,
//   moveWishlistToCart,
// } from "@/store/slices/wishlistSlice";
// import { toTitleCase } from "@/utils/string";
// import Typography from "@/components/ui/Typography/Typography";
// import { fetchCart } from "@/store/slices/cartSlice";
// import { usePreferences } from "@/context/PreferencesContext";

// const CATEGORY_ORDER = ["RING", "EARRING", "NECKLACE", "BRACELET", "PENDANT"];

// const Wishlist = () => {
//   const dispatch = useDispatch();
//     const { selectedCountry } = usePreferences();
//   const { items, count, loading } = useSelector((state) => state.wishlist);

//   useEffect(() => {
//     dispatch(fetchWishlist());
//   }, []);

//   const handleAddToCart = async (id) => {
//     try {
//       await dispatch(moveWishlistToCart(id)).unwrap();

//       dispatch(fetchCart({ currency: selectedCountry.currency }));
//       dispatch(fetchWishlist());
//     } catch (error) {
//       toast.error("Failed to add item to cart");
//     }
//   };

//   const groupedWishlist = useMemo(() => {
//     if (!items?.length) return {};

//     return items.reduce((acc, item) => {
//       const rawName = item?.product?.category?.name || "Others";
//       const key = rawName.toUpperCase(); // normalize

//       if (!acc[key]) acc[key] = [];
//       acc[key].push(item);

//       return acc;
//     }, {});
//   }, [items]);

//   const orderedCategories = useMemo(() => {
//     return Object.keys(groupedWishlist).sort((a, b) => {
//       const indexA = CATEGORY_ORDER.indexOf(a);
//       const indexB = CATEGORY_ORDER.indexOf(b);

//       // Categories not in list go to the end
//       if (indexA === -1 && indexB === -1) return a.localeCompare(b);
//       if (indexA === -1) return 1;
//       if (indexB === -1) return -1;

//       return indexA - indexB;
//     });
//   }, [groupedWishlist]);

//   return (
//     <>
//       <div className="xl:mb-[50px] mb-[30px]">
//         <p className="xl:text-[40px] text-[26px] font-[400] text-[var(--grey-2)]">
//           Wishlist
//         </p>
//       </div>
//       <div className="flex flex-col">
//         {loading ? (
//           Array.from({ length: 5 }).map((_, idx) => (
//             <ProductCardSkeleton key={idx} />
//           ))
//         ) : Object.keys(groupedWishlist).length > 0 ? (
//           orderedCategories.map((categoryKey) => {
//             const categoryItems = groupedWishlist[categoryKey];

//             return (
//               <div key={categoryKey} className="mb-[60px]">
//                 {/* CATEGORY TITLE */}
//                 <Typography variant="h3">{toTitleCase(categoryKey)}</Typography>

//                 {/* CATEGORY GRID */}
//                 <div className="grid md:grid-cols-3 grid-cols-2 md:gap-x-[30px] gap-x-[5px] md:gap-y-[49px] gap-y-[20px] max-[320px]:grid-cols-1">
//                   {categoryItems.map((item) => (
//                     <div
//                       key={item.id}
//                       className="flex flex-col justify-between lg:min-h-[400px]"
//                     >
//                       <ProductCard
//                         categoryId={item?.product?.category_id}
//                         productId={item?.product_id}
//                         productName={item?.product?.title}
//                         price={item?.product_price}
//                         productImg={item?.product?.image}
//                         hoverImage={item?.product?.image_rollover}
//                         designNo={item?.product?.design_no}
//                         wishlistStatus={item?.product?.wishlist}
//                         metalColor={item?.metal_color}
//                         shape={item?.diamond_shape}
//                         centerDiamondWeight={item?.center_diamond_weight}
//                         size={item?.size}
//                         metalType={item?.metal_type}
//                         ringSize={item?.ring_size}
//                         isWishlistCard
//                         category={categoryKey}
//                       />

//                       <div className="flex xl:flex-row lg:gap-[20px] gap-[4px] flex-col lg:mt-4 mt-[9px]">
//                         <Button
//                           title="Add to bag"
//                           className="w-full"
//                           onClick={() => handleAddToCart(item.id)}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <p className="md:text-[24px] text-[20px] font-[400] text-[var(--grey-2)]">
//             Your wishlist is empty
//           </p>
//         )}
//       </div>
//     </>
//   );
// };

// export default Wishlist;
