"use client";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useWishlist = ({
  productId,
  categoryId,
  price,
  metalType,
  metalColor,
  diamondShape,
  centerDiamondWeight,
  ringSize,
  size,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const customerId = useSelector((s) => s.auth?.customer?.id);
  const wishlist = useSelector((s) => s.wishlist.items);

  const isWishlisted = wishlist.some(
    (i) =>
      i.product_id === productId &&
      i.metal_color === metalColor &&
      i.metal_type === metalType &&
      i.diamond_shape === diamondShape &&
      i.center_diamond_weight == centerDiamondWeight &&
      i.ring_size == ringSize &&
      i.size == size
  );

  const toggle = async () => {
    if (!customerId) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    await dispatch(
      toggleWishlist({
        product_id: productId,
        category_id: categoryId,
        product_price: price,
        metal_type: metalType,
        metal_color: metalColor,
        diamond_shape: diamondShape,
        center_diamond_weight: centerDiamondWeight,
        ring_size: ringSize.toString(),
        size: size.toString(),
      })
    ).unwrap();
  };

  return { isWishlisted, toggleWishlist: toggle };
};
