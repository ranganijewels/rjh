"use client";
import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import Typography from "../Typography/Typography";
import HeartIcon from "@/components/Icons/HeartIcon";
import { useRouter } from "next/navigation";
import { useProductCardLayout } from "./useProductCardLayout";
import { toTitleCase } from "@/utils/string";
import { useCrudApi } from "@/hooks/useCrudApi";
import { store } from "@/store/store";
import { usePreferences } from "@/context/PreferencesContext";
import { getCurrencySymbol } from "@/utils/currencySymbol";
import toast from "react-hot-toast";

const ProductCard = ({
  productName,
  price,
  colorsPalettes,
  productImg,
  gridLayout,
  className,
  cardClass = "",
  imgClass = "",
  hoverImage: initialHoverImage,
  customWidth,
  productId,
  metalColor,
  wishlistStatus,
  categoryId,
  shape,
  metalType,
  centerDiamondWeight,
  ringSize,
  size,
  isWishlistCard,
}) => {
  console.log("shapeisWishlistCard", isWishlistCard);
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(productImg);
  const [hoverImage, setHoverImage] = useState(initialHoverImage);
  const [selectedColor, setSelectedColor] = useState(metalColor || null);
  const state = store.getState();
  const customerId = state.auth?.customer?.id;
  const { create } = useCrudApi(`/api/product/change-color`);
  const { selectedCountry } = usePreferences();
  const [isWishlisted, setIsWishlisted] = useState(wishlistStatus);
  const { create: checkWishlist } = useCrudApi(`/api/wishlist/check-wishlist`);
  const { create: createWishlist } = useCrudApi(`/api/wishlist`);

  const checkIfWishlisted = async (color) => {
    debugger;
    // if (!customerId || !productId || !color || !shape) return;

    try {
      const res = await checkWishlist({
        product_id: productId,
        metal_color: color.toUpperCase(),
        metal_type: metalType,
        diamond_shape: shape,
        center_diamond_weight: centerDiamondWeight,
        ring_size: size.toString(),
        size: "small",
      });

      setIsWishlisted(Boolean(res?.data?.wishlist));
    } catch (err) {
      console.error("checkWishlist failed", err);
    }
  };

  // useEffect(() => {
  //   if (!metalColor) return;

  //   setSelectedColor(metalColor); // sync initial color
  //   checkIfWishlisted(metalColor); // call API once on load
  // }, [metalColor, productId, shape]);

  // useEffect(() => {
  //   setIsWishlisted(wishlistStatus);
  // }, [wishlistStatus]);

  useEffect(() => {
    if (wishlistStatus !== undefined) {
      setIsWishlisted(wishlistStatus);
    }
  }, []);

  const { containerClass: container, imageClass: img } = useProductCardLayout(
    gridLayout,
    customWidth
  );
  const [isHovered, setIsHovered] = useState(false);

  const colorMap = {
    WHITE: "var(--white-gold)",
    YELLOW: "var(--yellow-gold)",
    ROSE: "var(--rose-gold)",
    "WHITE/YELLOW": "linear-gradient(135deg, #ffffff 50%, #FFD700 50%)",
    "WHITE/ROSE": "linear-gradient(135deg, #ffffff 50%, #E75480 50%)",
  };

  const getBackground = (value) =>
    value.includes("/")
      ? `linear-gradient(135deg, ${colorMap[value.split("/")[0]]} 50%, ${
          colorMap[value.split("/")[1]]
        } 50%)`
      : colorMap[value] || "#ccc";

  const handleClick = (id) => {
    router.push(
      `/product/${id}?categoryId=${categoryId}&selectedMetalColor=${selectedColor}&variantId=${productId}&shape=${shape}`
    );
  };
  console.log("selectedColor", selectedColor);

  const handleChangeMetalColor = async (palette) => {
    try {
      const response = await create(
        { product_id: productId, color: palette },
        { headers: { "x-customer-id": customerId } }
      );

      setSelectedColor(palette);
      setCurrentImage(response.product_image);
      setHoverImage(response.rollover_image);

      await checkIfWishlisted(palette);
    } catch (error) {
      console.error("Error changing metal color:", error);
    }
  };

  // const handleWishlist = async () => {
  //   const token = localStorage.getItem("authTokenElova");

  //   if (!token || !customerId) {
  //     toast.error("Please login first");
  //     router.push("/login");
  //     return;
  //   }

  //   if (
  //     !productId ||
  //     !price ||
  //     !categoryId ||
  //     !selectedMetal?.karat?.value ||
  //     !activeColor ||
  //     !selectedShape
  //   ) {
  //     console.warn("Wishlist blocked: incomplete data");
  //     return;
  //   }

  //   try {
  //     const res = await createWishlist({
  //       product_id: productId,
  //       product_price: price,
  //       category_id: categoryId,
  //       metal_type: selectedMetal.karat.value,
  //       metal_color: activeColor.toUpperCase(),
  //       diamond_shape: selectedShape,
  //     });

  //     setIsWishlisted(Boolean(res?.data?.wishlist));
  //   } catch (err) {
  //     console.error("Wishlist error:", err);
  //     toast.error("Wishlist failed");
  //   }
  // };

  const handleWishlistToggle = async () => {
    debugger;
    const token = localStorage.getItem("authTokenElova");

    if (!token || !customerId) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    try {
      const res = await createWishlist({
        product_id: productId,
        product_price: price,
        category_id: categoryId,
        metal_type: metalType,
        metal_color: selectedColor.toUpperCase(),
        diamond_shape: shape,
        center_diamond_weight: centerDiamondWeight,
        ring_size: ringSize.toString() || "6",
        size: "small",
      });

      // backend is source of truth
      setIsWishlisted(Boolean(res?.data?.wishlist));
    } catch (err) {
      console.error("Wishlist toggle failed", err);
      toast.error("Wishlist failed");
    }
  };

  return (
    <div className={`${className} cursor-pointer`}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`bg-[#F5F5F5] relative mb-[14px] ${
          customWidth ? cardClass : container
        }`}
      >
        <img
          src={isHovered && hoverImage ? hoverImage : currentImage}
          alt={productName}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          style={{
            userSelect: "none",
            pointerEvents: "auto",
          }}
          className={`object-contain transition-transform duration-300 ease-in-out  hover:scale-105 ${
            customWidth ? imgClass : img
          }`}
          onClick={() => handleClick(productId)}
        />

        <div className="absolute top-0 right-0 m-[19px]">
          <HeartIcon
            wishlistStatus={isWishlisted}
            onClick={handleWishlistToggle}
          />
        </div>
      </div>

      <div className="space-y-[12px]">
        <div onClick={() => handleClick(productId)}>
          <Typography variant="p" className="!capitalize">
            {toTitleCase(productName)}
          </Typography>

          {/* <Typography variant="p" textColor="customGrey" className="text-[10px]">{descri}</Typography> */}
          <Typography variant="h4" textColor="teal">
            {getCurrencySymbol(selectedCountry?.currency) + " " + price}
          </Typography>
        </div>
        {colorsPalettes && (
          <div className="flex gap-[5px]">
            {colorsPalettes?.map((palette, i) => {
              return (
                <Button
                  background={getBackground(palette)}
                  variant="colorPalette"
                  key={palette}
                  onClick={(e) => {
                    handleChangeMetalColor(palette);
                    // checkIfWishlisted(palette);
                    e.stopPropagation();
                  }}
                  className={
                    selectedColor === palette
                      ? "border-[1px] border-[var(--teal-1)]"
                      : "border-[1px] border-transparent"
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

// "use client";
// import React, { useEffect, useState } from "react";
// import Button from "../Button/Button";
// import Typography from "../Typography/Typography";
// import HeartIcon from "@/components/Icons/HeartIcon";
// import { useRouter } from "next/navigation";
// import { useProductCardLayout } from "./useProductCardLayout";
// import { toTitleCase } from "@/utils/string";
// import { useCrudApi } from "@/hooks/useCrudApi";
// import { store } from "@/store/store";
// import { usePreferences } from "@/context/PreferencesContext";
// import { getCurrencySymbol } from "@/utils/currencySymbol";
// import toast from "react-hot-toast";
// import { useWishlist } from "@/hooks/useWishlist";
// import RingSizeSelector from "@/commomPages/ProductDetails/RingSizeSelector";

// const ProductCard = ({
//   productName,
//   price,
//   colorsPalettes,
//   productImg,
//   gridLayout,
//   className,
//   cardClass = "",
//   imgClass = "",
//   hoverImage: initialHoverImage,
//   customWidth,
//   productId,
//   metalColor,
//   wishlistStatus,
//   categoryId,
//   shape,
//   metalType,
//   centerDiamondWeight,
//   ringSize,
//   size,
//   onWishlistRemoved,
//   isWishlistCard,
//   designNo,
// }) => {
//   console.log("shape", shape);
//   const router = useRouter();
//   const [currentImage, setCurrentImage] = useState(productImg);
//   const [hoverImage, setHoverImage] = useState(initialHoverImage);
//   const [selectedColor, setSelectedColor] = useState(metalColor || null);
//   const state = store.getState();
//   const customerId = state.auth?.customer?.id;
//   const { create } = useCrudApi(`/api/product/change-color`);
//   const { selectedCountry } = usePreferences();
//   // const { isWishlisted, setIsWishlisted, checkWishlist, toggleWishlist } =
//   //   useWishlist(wishlistStatus);
//   const { isWishlisted, toggleWishlist } = useWishlist({
//     productId,
//     categoryId,
//     price,
//     metalType,
//     metalColor,
//     diamondShape: shape,
//     centerDiamondWeight,
//     ringSize,
//     size,
//   });

//   const checkIfWishlisted = async (color) => {
//     const payload = {
//       product_id: productId,
//       metal_color: color.toUpperCase(),
//       metal_type: metalType,
//       diamond_shape: shape,
//       size: size || "small",
//     };

//     if (centerDiamondWeight != null) {
//       payload.center_diamond_weight = String(centerDiamondWeight);
//     }

//     if (ringSize != null) {
//       payload.ring_size = String(ringSize);
//     }

//     await checkWishlist(payload);
//   };

//   // useEffect(() => {
//   //   if (wishlistStatus !== undefined) {
//   //     setIsWishlisted(wishlistStatus);
//   //   }
//   // }, []);

//   const { containerClass: container, imageClass: img } = useProductCardLayout(
//     gridLayout,
//     customWidth
//   );
//   const [isHovered, setIsHovered] = useState(false);

//   const colorMap = {
//     WHITE: "var(--white-gold)",
//     YELLOW: "var(--yellow-gold)",
//     ROSE: "var(--rose-gold)",
//     "WHITE/YELLOW": "linear-gradient(135deg, #ffffff 50%, #FFD700 50%)",
//     "WHITE/ROSE": "linear-gradient(135deg, #ffffff 50%, #E75480 50%)",
//   };

//   const getBackground = (value) =>
//     value.includes("/")
//       ? `linear-gradient(135deg, ${colorMap[value.split("/")[0]]} 50%, ${
//           colorMap[value.split("/")[1]]
//         } 50%)`
//       : colorMap[value] || "#ccc";

//   const handleClick = (id) => {
//     router.push(
//       `/product/${id}?categoryId=${categoryId}&selectedMetalColor=${selectedColor}&variantId=${productId}&shape=${shape}`
//     );
//   };
//   console.log("selectedColor", selectedColor);

//   const handleChangeMetalColor = async (palette) => {
//     try {
//       const response = await create(
//         { product_id: productId, color: palette },
//         { headers: { "x-customer-id": customerId } }
//       );

//       setSelectedColor(palette);
//       setCurrentImage(response.product_image);
//       setHoverImage(response.rollover_image);

//       await checkIfWishlisted(palette);
//     } catch (error) {
//       console.error("Error changing metal color:", error);
//     }
//   };

//   const handleWishlistToggle = async () => {
//     const payload = {
//       product_id: productId,
//       product_price: price,
//       category_id: categoryId,
//       metal_type: metalType,
//       metal_color: selectedColor?.toUpperCase(),
//       diamond_shape: shape,
//       size: size || "small",
//     };

//     if (centerDiamondWeight != null) {
//       payload.center_diamond_weight = String(centerDiamondWeight);
//     }

//     if (ringSize != null) {
//       payload.ring_size = String(ringSize);
//     }

//     const isNowWishlisted = await toggleWishlist(payload);

//     // If removed from wishlist and we are on wishlist page → remove from UI
//     if (!isNowWishlisted && onWishlistRemoved) {
//       onWishlistRemoved();
//     }
//   };

//   return (
//     <div className={`${className} cursor-pointer`}>
//       <div
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         className={`bg-[#F5F5F5] relative mb-[14px] ${
//           customWidth ? cardClass : container
//         }`}
//       >
//         <img
//           src={isHovered && hoverImage ? hoverImage : currentImage}
//           alt={productName}
//           onContextMenu={(e) => e.preventDefault()}
//           onDragStart={(e) => e.preventDefault()}
//           style={{
//             userSelect: "none",
//             pointerEvents: "auto",
//           }}
//           className={`object-contain transition-transform duration-300 ease-in-out  hover:scale-105 ${
//             customWidth ? imgClass : img
//           }`}
//           onClick={() => handleClick(productId)}
//         />

//         <div className="absolute top-0 right-0 m-[19px]">
//           <HeartIcon
//             wishlistStatus={isWishlisted}
//             // onClick={handleWishlistToggle}
//             onClick={toggleWishlist}
//           />
//         </div>
//       </div>

//       <div>
//         <div className="space-y-[12px]">
//           <Typography variant="p" className="!capitalize">
//             {toTitleCase(productName)}
//           </Typography>

//           {/* <Typography variant="p" textColor="customGrey" className="text-[10px]">{descri}</Typography> */}
//           <Typography variant="h4" textColor="teal">
//             {getCurrencySymbol(selectedCountry?.currency) + " " + price}
//           </Typography>
//           {isWishlistCard && (
//             <div className="space-y-[10px]">
//               <Typography variant="h6">
//                 Design No. :{" "}
//                 <span className="font-[500] text-[#222223]">{designNo}</span>
//               </Typography>
//               {shape && (
//                 <Typography variant="h6">
//                   Diamond Shape :{" "}
//                   <span className="font-[500] text-[#222223]">{shape}</span>
//                 </Typography>
//               )}
//               {metalType && metalColor && (
//                 <Typography variant="h6">
//                   Metal :{" "}
//                   <span className="font-[500] text-[#222223]">
//                     {metalType + " " + metalColor + " " + "Gold"}
//                   </span>
//                 </Typography>
//               )}
//               {centerDiamondWeight && (
//                 <Typography variant="h6">
//                   Center Diamond Weight :{" "}
//                   <span className="font-[500] text-[#222223]">
//                     {centerDiamondWeight}
//                   </span>
//                 </Typography>
//               )}
//             </div>
//           )}
//         </div>
//         {colorsPalettes && (
//           <div className="flex gap-[5px]">
//             {colorsPalettes?.map((palette, i) => {
//               return (
//                 <Button
//                   background={getBackground(palette)}
//                   variant="colorPalette"
//                   key={palette}
//                   onClick={(e) => {
//                     handleChangeMetalColor(palette);
//                     // checkIfWishlisted(palette);
//                     e.stopPropagation();
//                   }}
//                   className={
//                     selectedColor === palette
//                       ? "border-[1px] border-[var(--teal-1)]"
//                       : "border-[1px] border-transparent"
//                   }
//                 />
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
