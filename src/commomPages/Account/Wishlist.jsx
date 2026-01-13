"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button/Button";
import ProductCard from "@/components/ui/Cards/ProductCard";
import { useCrudApi } from "@/hooks/useCrudApi";
import ProductCardSkeleton from "@/components/ui/Cards/ProductCardSkeleton";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  moveWishlistToCart,
} from "@/store/slices/wishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, count } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, []);
  console.log("items", items, count);
  // const [wishlistdata, setWishlistdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchAll } = useCrudApi(`/api/wishlist`);
  // const { create } = useCrudApi(`/api/wishlist/move-wishlist-to-cart`);
  // console.log("wishlistData", wishlistdata);
  // const handleAddToCart = async (wishlistItemId) => {
  //   try {
  //     await create(null, {}, wishlistItemId);
  //     toast.success("Item moved to cart successfully!");
  //     // setWishlistdata((prev) =>
  //     //   prev.filter((item) => item.id !== wishlistItemId)
  //     // );
  //   } catch (error) {
  //     console.error("Error moving to cart:", error.message);
  //   }
  // };

  const handleAddToCart = (id) => {
    dispatch(moveWishlistToCart(id));
  };

  // useEffect(() => {
  //   setLoading(true);
  //   fetchAll()
  //     .then((res) => {
  //       setWishlistdata(res?.data || []);
  //       setLoading(false);
  //     })
  //     .catch((err) => console.error("Error fetching filters", err));
  // }, []);

  return (
    <>
      <div className="xl:mb-[50px] mb-[30px]">
        <p className="xl:text-[40px] text-[26px] font-[400] text-[var(--grey-2)]">
          Wishlist
        </p>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-2 md:gap-x-[30px] gap-x-[5px] md:gap-y-[49px] gap-y-[20px] max-[320px]:grid-cols-1">
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))
        ) : items?.length > 0 ? (
          items?.map((item) => {
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
                  designNo={item?.designNo || item?.product?.design_no}
                  wishlistStatus={item?.product?.wishlist}
                  metalColor={item?.metal_color}
                  shape={item?.diamond_shape}
                  centerDiamondWeight={item?.center_diamond_weight}
                  size={item?.size}
                  metalType={item?.metal_type}
                  ringSize={item?.ring_size}
                  onWishlistRemoved={() => {
                    setWishlistdata((prev) =>
                      prev.filter((x) => x.id !== item.id)
                    );
                  }}
                  isWishlistCard
                />
                <div className="flex xl:flex-row lg:gap-[20px] gap-[4px] flex-col lg:mt-4 mt-[9px]">
                  <Button
                    title="Add to bag"
                    className="w-full"
                    onClick={() => handleAddToCart(item.id)}
                  />
                  {/* <Button
                    title="View similar"
                    variant="outlineTeal"
                    className="w-full"
                  /> */}
                </div>
              </div>
            );
          })
        ) : (
          <p className="md:text-[24px] text-[20px] font-[400] text-[var(--grey-2)]">
            Your wishlist is empty
          </p>
        )}
      </div>
    </>
  );
};

export default Wishlist;
