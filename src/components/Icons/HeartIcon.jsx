// "use client";
// import React, { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { useCrudApi } from "@/hooks/useCrudApi";
// import { useSelector } from "react-redux";
// import { useRouter } from "next/navigation";

// const HeartIcon = ({
//   className,
//   productId,
//   productPrice,
//   wishlistStatus,
//   categoryId,
//   metalType,
//   metalColor,
//   diamondShape,
//   setWishlistStatus,
// }) => {
//   console.log("wishlistStatus in HeartIcon:", wishlistStatus);
//   // const [isWishlisted, setIsWishlisted] = useState(wishlistStatus);
//   const { create } = useCrudApi(`/api/wishlist`);
//   const { token, customer } = useSelector((state) => state.auth);
//   const router = useRouter();

//   // useEffect(() => {
//   //   if (wishlistStatus !== undefined) {
//   //     setWishlistStatus(wishlistStatus);
//   //   }
//   // }, [wishlistStatus]);

//   const handleWishlist = async () => {
//     if (!token || !customer) {
//       toast.error("Please login first");
//       router.push("/login");
//       return;
//     }

//     try {
//       const res = await create({
//         product_id: productId,
//         product_price: productPrice,
//         category_id: categoryId,
//         metal_type: metalType,
//         metal_color: metalColor,
//         diamond_shape: diamondShape,
//       });

//       if (res?.data?.wishlist !== undefined) {
//         setWishlistStatus(Boolean(res.data.wishlist));
//         toast.success(
//           res.data.wishlist ? "Added to wishlist" : "Removed from wishlist"
//         );
//       }
//     } catch {
//       toast.error("Something went wrong");
//     }
//   };

//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 97 96"
//       fill="none"
//       className={`${className} lg:w-[24px] lg:h-[24px] w-[12px] h-[12px] cursor-pointer`}
//       onClick={handleWishlist}
//     >
//       <path
//         d="M49.6777 21.4282C57.2594 7.54446 74.39 4.60296 83.2451 12.8364L83.6611 13.2368C94.1568 23.7329 94.3205 40.8117 84.1523 51.5132L83.6611 52.0171L52.2969 83.3813C50.2654 85.4129 47.0112 85.4764 44.9033 83.5718L44.7031 83.3813L13.3389 52.0171C2.8434 41.5211 2.67989 24.4432 12.8477 13.7417L13.3389 13.2368C22.0632 4.51227 39.6203 7.32411 47.3223 21.4282L48.5 23.5864L49.6777 21.4282Z"
//         stroke="#2F6F7A"
//         fill={wishlistStatus ? "#2F6F7A" : "none"}
//         strokeWidth="2.68481"
//       />
//     </svg>
//   );
// };

// export default HeartIcon;

"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useCrudApi } from "@/hooks/useCrudApi";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const HeartIcon = ({
  className,
  wishlistStatus,
  onClick,
  iconColor = "#2F6F7A",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 97 96"
      fill="none"
      className={`${className} lg:w-[24px] lg:h-[24px] w-[12px] h-[12px] cursor-pointer`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
    >
      <path
        d="M49.6777 21.4282C57.2594 7.54446 74.39 4.60296 83.2451 12.8364L83.6611 13.2368C94.1568 23.7329 94.3205 40.8117 84.1523 51.5132L83.6611 52.0171L52.2969 83.3813C50.2654 85.4129 47.0112 85.4764 44.9033 83.5718L44.7031 83.3813L13.3389 52.0171C2.8434 41.5211 2.67989 24.4432 12.8477 13.7417L13.3389 13.2368C22.0632 4.51227 39.6203 7.32411 47.3223 21.4282L48.5 23.5864L49.6777 21.4282Z"
        stroke={iconColor || "#2F6F7A"}
        fill={wishlistStatus ? "#2F6F7A" : "none"}
        strokeWidth="2.68481"
      />
    </svg>
  );
};

export default HeartIcon;
