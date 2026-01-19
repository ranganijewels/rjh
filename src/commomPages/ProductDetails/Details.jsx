"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import FeaturesList from "@/components/common/FeaturesList/FeaturesList";
import Button from "@/components/ui/Button/Button";
import { WHY_CHOOSE_ICON } from "@/constants/constant";
import ProductsGallery from "./ProductsGallery";
import MetalSelector from "./MetalSelector";
import DiamondOptions from "./DiamondOptions";
import RingSizeSelector from "./RingSizeSelector";
import FeaturesSpecs from "./FeaturesSpecs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { cleanCarat, toTitleCase } from "@/utils/string";
import { useCrudApi } from "@/hooks/useCrudApi";
import HeartIcon from "@/components/Icons/HeartIcon";
import { usePreferences } from "@/context/PreferencesContext";
import { getCurrencySymbol } from "@/utils/currencySymbol";
import { useSelector } from "react-redux";
import { useWishlistLogic } from "@/hooks/useWishlistLogic";

const Details = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { productId } = useParams();
  const [selectedVariantId, setSelectedVariantId] = useState(productId);
  const [designNo, setDesignNo] = useState("");
  const { create: getAmount } = useCrudApi("/api/productDetail/get-amount");
  const { create } = useCrudApi(`/api/cart/add-to-cart`);
  const { create: filters } = useCrudApi("/api/product/filters");
  const [filtersData, setFiltersData] = useState([]);
  const { create: createWishlist } = useCrudApi(`/api/wishlist`);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await filters({
          category_id: null,
        });
        setFiltersData(res.data);
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };

    fetchFilters();
  }, []);

  const [productInfo, setProductInfo] = useState(null);
  const [galleryMedia, setGalleryMedia] = useState([]);
  const [selectedShape, setSelectedShape] = useState(
    productInfo?.occasion?.custom_title
  );
  const [selectedWeight, setSelectedWeight] = useState(
    productInfo?.diamonds?.find((e) => e?.center === 1)?.wt
  );
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [pricing, setPricing] = useState();

  const [loadingGallery, setLoadingGallery] = useState(false);
  const [selectedRingSize, setSelectedRingSize] = useState();
  const [selectedWidth, setSelectedWidth] = useState("");
  const DEFAULT_COLOR = "YELLOW";
  const selectedColor = searchParams.get("selectedMetalColor");
  const [activeColor, setActiveColor] = useState(
    selectedColor?.toUpperCase() || DEFAULT_COLOR
  );
  const [selectDiamondWeightId, setSelectDiamondWeightId] = useState();
  const { selectedCountry } = usePreferences();
  const [selectedCarat, setSelectedCarat] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const customerId = useSelector((state) => state.auth?.customer?.id);

  const { checkIfWishlisted, toggleWishlist } = useWishlistLogic({
    createWishlistApi: createWishlist,
  });

  const pricingEnabledRef = useRef(false);

  useEffect(() => {
    const activeId = selectDiamondWeightId || selectedVariantId;
    if (!activeId) return;

    let isCurrent = true;
    setLoadingGallery(true);

    const currency =
      typeof selectedCountry?.currency === "string"
        ? selectedCountry.currency
        : selectedCountry?.currency?.code || "CAD";

    fetch(
      `https://api.jewellabel.in/api/store-web/customer/product-detail/${activeId}`,
      {
        method: "GET",
        headers: {
          "x-tenant-id": process.env.NEXT_PUBLIC_TENANT_ID,
          currency,
          Accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        if (!isCurrent) return;
        if (!selectDiamondWeightId) {
          const data = json?.data ?? {};
          setProductInfo(data);
          setGalleryMedia(data?.media || []);
        } else {
        }
      })
      .catch(console.error)
      .finally(() => isCurrent && setLoadingGallery(false));

    return () => (isCurrent = false);
  }, [selectedVariantId, selectedCountry, selectDiamondWeightId]);

  const updatePricing = async (
    id,
    designNo,
    metal,
    size = selectedRingSize,
    weight = selectedWeight
  ) => {
    if (!pricingEnabledRef.current) return;

    if (!metal?.karat || !productInfo) return;

    try {
      const res = await getAmount(
        {
          product_id: id || productInfo.id,
          design_no: designNo || productInfo.design_no,
          quality: metal.karat.value,
          size: size || "0",
          center_diamond_weight: weight
            ? String(weight).replace(/[^0-9.]/g, "")
            : null,
        },
        {
          headers: {
            currency: selectedCountry?.currency,
          },
        }
      );

      if (res?.status && res?.data?.total_price) {
        setPricing(res.data.total_price);
      }
    } catch (err) {
      console.error("Error fetching amount", err);
    }
  };

  // const checkIfWishlisted = async () => {
  //   if (
  //     !customerId ||
  //     !productInfo?.id ||
  //     !selectedMetal?.karat?.value ||
  //     !activeColor ||
  //     !selectedShape
  //   ) {
  //     return;
  //   }

  //   try {
  //     const payload = {
  //       product_id: productInfo.id,
  //       metal_color: activeColor.toUpperCase(),
  //       metal_type: selectedMetal.karat.value,
  //       diamond_shape: selectedShape,
  //       ring_size: selectedRingSize ? String(selectedRingSize) : "",
  //       size: selectedWidth ? selectedWidth.toString() : "",
  //     };

  //     if (selectedWeight != null) {
  //       payload.center_diamond_weight = String(selectedWeight);
  //     }

  //     const res = await checkWishlist(payload);
  //     setIsWishlisted(Boolean(res?.data?.wishlist));
  //   } catch (err) {
  //     console.error("Error checking wishlist status:", err);
  //   }
  // };

  // useEffect(() => {
  //   checkIfWishlisted();
  // }, [
  //   customerId,
  //   productInfo?.id,
  //   selectedMetal?.karat?.value,
  //   activeColor,
  //   selectedWeight,
  //   selectedRingSize,
  //   // selectedShape,
  // ]);

  const syncWishlistState = async () => {
    const isWishlisted = await checkIfWishlisted({
      product_id: productInfo.id,
      metal_color: activeColor,
      metal_type: selectedMetal.karat.value,
      diamond_shape: selectedShape,
      center_diamond_weight: selectedWeight,
      ring_size: selectedRingSize,
      size: selectedWidth,
    });

    setIsWishlisted(isWishlisted);
  };

  useEffect(() => {
    if (
      !customerId ||
      !productInfo?.id ||
      !selectedMetal?.karat?.value ||
      !activeColor ||
      !selectedShape
    ) {
      setIsWishlisted(false);
      return;
    }

    syncWishlistState();
  }, [
    customerId,
    productInfo?.id,
    selectedMetal?.karat?.value,
    activeColor,
    selectedShape,
    selectedWeight,
    selectedRingSize,
    selectedWidth,
  ]);

  // const handleWishlist = async () => {
  //   const token = localStorage.getItem("authTokenElova");

  //   if (!token || !customerId) {
  //     toast.error("Please login first");
  //     router.push("/login");
  //     return;
  //   }

  //   if (
  //     !productInfo?.id ||
  //     !productInfo?.product_price ||
  //     !productInfo?.category_id ||
  //     !selectedMetal?.karat?.value ||
  //     !activeColor ||
  //     !selectedShape
  //   ) {
  //     console.warn("Wishlist blocked: incomplete data");
  //     return;
  //   }

  //   try {
  //     const res = await createWishlist({
  //       product_id: productInfo.id,
  //       product_price: productInfo.product_price,
  //       category_id: productInfo.category_id,
  //       metal_type: selectedMetal.karat.value,
  //       metal_color: activeColor.toUpperCase(),
  //       diamond_shape: selectedShape,
  //       center_diamond_weight: selectedWeight ? selectedWeight.toString() : "",
  //       ring_size: selectedRingSize ? String(selectedRingSize) : "",
  //       size: selectedWidth.toString() || "",
  //     });

  //     setIsWishlisted(Boolean(res?.data?.wishlist));
  //   } catch (err) {
  //     console.error("Wishlist error:", err);
  //     toast.error("Wishlist failed");
  //   }
  // };

  const handleWishlist = async () => {
    const wishlisted = await toggleWishlist({
      product_id: productInfo.id,
      product_price: productInfo.product_price,
      category_id: productInfo.category_id,
      metal_type: selectedMetal.karat.value,
      metal_color: activeColor.toUpperCase(),
      diamond_shape: selectedShape,
      center_diamond_weight: selectedWeight ? cleanCarat(selectedWeight) : "",
      ring_size: selectedRingSize ? String(selectedRingSize) : "",
      size: selectedWidth?.toString() || "",
    });

    setIsWishlisted(wishlisted);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("authTokenElova");

    try {
      if (!token) return router.push("/login");
      if (!selectedRingSize && productInfo?.sizes.length > 0) {
        setErrorMessage(
          `Please select a ${toTitleCase(productInfo?.category?.name)} Size.`
        );
        return;
      }

      setErrorMessage("");

      const payload = {
        product_id: String(productInfo?.id),
        metal_type: selectedMetal?.karat?.value,
        diamond_shape: selectedShape,
        center_diamond_weight: selectedWeight
          ? selectedWeight.toString().replace(/[^0-9.]/g, "")
          : null,
        ring_size: selectedRingSize ? String(selectedRingSize) : "",
        quantity: 1,
        unit_price: pricing,
        metal_color: activeColor,
        size: selectedWidth,
        is_wishlist: isWishlisted,
      };
      const response = await create(payload);
      if (response.status) router.push("/cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      const button = element.querySelector("button");
      if (button) button.click();
    }
  };

  // useEffect(() => {
  //   if (!productInfo) return;

  //   if (!selectedSize) {
  //     setSelectedSize(productInfo?.occasion?.custom_title || null);
  //   }
  // }, [productInfo]);

  const diamondWeightArray = productInfo?.variants
    ?.filter((v) => v?.carat && v?.carat.trim() !== "")
    .map((v) => ({
      id: v?.id,
      carat: v?.carat,
      shape: v?.shape,
    }));

  useEffect(() => {
    if (!productInfo?.productsizevariant?.length) return;
    if (!selectedWidth) return;

    const ringOptions = productInfo.productsizevariant
      .filter((v) => v.size?.toLowerCase() === selectedWidth?.toLowerCase())
      .map((s) => ({
        label: s.size_value + '"',
        value: s.size_value,
        variantId: s.variant_product_id,
      }));
  }, [selectedWidth, productInfo]);

  useEffect(() => {
    const colorParam = searchParams.get("selectedMetalColor");

    if (colorParam) {
      const upper = colorParam.toUpperCase();

      if (upper !== activeColor) {
        setActiveColor(upper);
      }
    } else {
      // URL has no color → force default
      if (activeColor !== DEFAULT_COLOR) {
        setActiveColor(DEFAULT_COLOR);
      }
    }
    const shapeParam = searchParams.get("shape");

    if (shapeParam) {
      setSelectedShape(shapeParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!productInfo) return;

    const shapeParam = searchParams.get("shape");
    if (!shapeParam) return;

    // find the variant for the shape
    const variant = productInfo.variants?.find((v) => {
      const label = (
        v.custom_shape_title ||
        v.label ||
        v.shape ||
        ""
      ).toLowerCase();
      return label === shapeParam.toLowerCase();
    });

    if (variant) {
      setSelectedShape(shapeParam);

      // Update gallery to show correct images
      if (variant.media?.length) {
        setGalleryMedia(variant.media);
      }

      // Use the correct variant ID
      if (variant.variant_product_id) {
        setSelectedVariantId(variant.variant_product_id);
      }
    }

    if (!productInfo?.size) return;
    if (selectedRingSize) return;

    const numericSize = String(productInfo.size).match(/[\d.]+/)?.[0];

    if (numericSize) {
      setSelectedRingSize(numericSize);
    }
  }, [productInfo]);

  const ringSizeOptions = useMemo(() => {
    if (!productInfo) return [];

    const hasCategorySizes = productInfo.productsizevariant?.some((v) =>
      ["small", "medium", "large"].includes(v?.size?.toLowerCase())
    );

    if (hasCategorySizes) {
      if (!selectedWidth) return [];

      return productInfo.productsizevariant
        .filter((v) => v.size?.toLowerCase() === selectedWidth.toLowerCase())
        .map((s) => ({
          label: `${s.size_value}"`,
          value: String(s.size_value),
          variantId: s.variant_product_id,
        }));
    }

    return (
      productInfo.sizes?.map((s) => ({
        label: `${s.size}"`,
        value: String(s.size),
        variantId: null,
      })) || []
    );
  }, [productInfo, selectedWidth]);

  useEffect(() => {
    if (!productInfo?.size || selectedRingSize) return;

    const ring = productInfo.size.match(/[\d.]+/)?.[0];
    if (ring) setSelectedRingSize(ring);
  }, [productInfo]);

  return (
    <section className="xl:px-[172px] lg:px-[30px] px-[18px] flex lg:flex-row items-start flex-col xl:gap-[66px] gap-[26px] w-full">
      {/* Gallery */}
      <div className="relative lg:w-[71%] w-full">
        <ProductsGallery
          allImagesAndVideos={galleryMedia}
          selectedMetal={selectedMetal}
          selectDiamond={selectedShape}
          loadingProductInfo={loadingGallery}
          activeColor={activeColor}
        />
      </div>

      {/* Product details */}
      <div className="lg:w-[29%] w-full space-y-[30px] lg:sticky lg:top-[20px]">
        <div>
          <p className="xl:text-[20px] text-[16px] font-[500]">
            {productInfo?.title && toTitleCase(productInfo.title)}
          </p>
          <p className="xl:text-[14px] text-[12px] font-[300] italic">
            {productInfo?.description}
          </p>
        </div>
        <div className="space-y-[12px]">
          <label className="xl:text-[24px] lg:text-[20px] text-[18px] font-[500] text-[var(--teal-1)]">
            {getCurrencySymbol(selectedCountry?.currency) + " " + pricing}
          </label>
          {/* <div
            className="flex gap-2 items-center"
            onClick={() => handleScrollTo("priceBreakupId")}
          >
            <p className="text-[12px] font-[400]">View Price Breakup</p>
            <img
              src="/icons/price-breakup.svg"
              className="cursor-pointer w-[14px] h-[14px]"
            />
          </div> */}
        </div>
        {productInfo && (
          <MetalSelector
            metal={productInfo.quality || []}
            carat={
              filtersData?.purity?.filter(
                (e) => e?.value?.toLowerCase?.().trim() !== "9k"
              ) || []
            }
            colorType={productInfo.metal_colors || []}
            value={selectedMetal}
            onChange={(metal) => {
              pricingEnabledRef.current = true;

              setSelectedMetal(metal);

              const raw = metal?.karat?.value || "";
              const cleanCarat = raw.replace(/k/i, "");

              const color =
                metal?.color?.toUpperCase?.() ||
                metal?.metal_color?.toUpperCase?.() ||
                "";

              const params = new URLSearchParams(
                Array.from(searchParams.entries())
              );

              // update both params
              params.set("carat", cleanCarat);
              params.set("selectedMetalColor", color);

              router.replace(`/product/${productId}?${params.toString()}`, {
                scroll: false,
                shallow: true,
              });

              updatePricing(
                productInfo?.id,
                designNo,
                metal,
                selectedRingSize,
                selectedWeight
              );
            }}
            activeColor={activeColor}
            setActiveColor={setActiveColor}
            useActiveSource="activeColor"
          />
        )}

        {productInfo && (
          <DiamondOptions
            diamodShapeTitle="Diamond Shape :"
            caretTitle={"title"}
            variantList={productInfo.variants || []}
            dimondShapeWithNavigation
            diamondWeightArray={diamondWeightArray}
            dimonShapNavIconStyle="w-[28px] h-[28px]"
            onShapeClick={async (
              designno,
              shapeName,
              media,
              occasion,
              id,
              variantProductId
            ) => {
              pricingEnabledRef.current = true;

              setSelectDiamondWeightId(null);
              if (variantProductId) {
                // setSelectedVariantId(variantProductId);
                if (media?.length) {
                  setGalleryMedia(media);
                }

                setSelectedVariantId(variantProductId);
                const params = new URLSearchParams(
                  Array.from(searchParams.entries())
                );
                params.set("variantId", variantProductId);
                params.set("shape", shapeName);
                params.set("carat", selectedMetal?.karat.value || "");

                router.replace(`/product/${productId}?${params.toString()}`, {
                  scroll: false,
                });

                updatePricing(
                  productInfo?.id,
                  designno,
                  selectedMetal,
                  selectedRingSize,
                  selectedWeight
                );
              } else {
                setGalleryMedia(productInfo?.media);
              }
              setSelectedShape(shapeName);
            }}
            onWeightChange={(data) => {
              pricingEnabledRef.current = true;

              setSelectedWeight(data.carat);
              setErrorMessage("");
              setDesignNo(data?.designNo);

              if (data.variantId) {
                setSelectDiamondWeightId(data.variantId);
                const params = new URLSearchParams(
                  Array.from(searchParams.entries())
                );
                params.set("DiamondWeightId", data.variantId);

                router.replace(`/product/${productId}?${params.toString()}`, {
                  scroll: false,
                });
              }

              updatePricing(
                data?.variantId,
                data?.designNo,
                selectedMetal,
                selectedRingSize,
                data.carat
              );
            }}
            onSizeChange={(data) => {
              setSelectedWidth(data?.size);
            }}
            occasion={productInfo?.occasion}
            selectedWeight={selectedWeight}
            productInfo={productInfo}
            showSizeSection={productInfo?.center_diamonds?.length > 0}
            selectedCarat={selectedCarat}
            setSelectedCarat={setSelectedCarat}
          />
        )}
        {productInfo?.sizes?.length > 0 && (
          <RingSizeSelector
            label={productInfo?.category?.name}
            productInfo={productInfo}
            ringSizeOptions={ringSizeOptions || []}
            selectedValue={selectedRingSize}
            onChange={(option) => {
              pricingEnabledRef.current = true;

              setSelectedRingSize(option.value);
              setErrorMessage("");

              const variantId = option.variantId;
              if (option?.variantId) {
                setSelectedVariantId(option.variantId);
              }

              if (variantId) {
                const params = new URLSearchParams(
                  Array.from(searchParams.entries())
                );
                params.set("RingSizeId", variantId);

                router.replace(`/product/${productId}?${params.toString()}`, {
                  scroll: false,
                });

                setSelectDiamondWeightId(variantId);
              }
              updatePricing(
                productInfo?.id,
                productInfo?.design_no,
                selectedMetal,
                option.value,
                selectedWeight
              );
            }}
            isInvalid={!!errorMessage}
          />
        )}

        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
        <div className="space-y-[12px] ">
          <div className="flex gap-[6px]">
            <Button
              title="add to bag"
              className="w-full h-[42px]"
              onClick={handleAddToCart}
            />
            <Button
              variant="ghost"
              icon={
                <HeartIcon
                  wishlistStatus={isWishlisted}
                  onClick={handleWishlist}
                />
              }
              iconOnly
              className="w-[42px] h-[42px] !p-[9px]"
            />
            <Button
              variant="ghost"
              icon={<img src="/icons/share.svg" />}
              iconOnly
              className="w-[42px] h-[42px] !p-[9px]"
              onClick={() => {
                navigator.clipboard
                  .writeText(window.location.href)
                  .then(() => toast.success("URL copied!"))
                  .catch(() => toast.error("Failed to copy URL"));
              }}
            />
          </div>
          <div className="xl:text-[14px] font-[400] text-[12px] pb-[16px]">
            Need Help? Chat with a Specialist
          </div>
          <hr className="hr-teal-3" />
        </div>
        <FeaturesList items={WHY_CHOOSE_ICON} />
        {productInfo && (
          <FeaturesSpecs
            selectedWeight={selectedWeight}
            selectedMetal={selectedMetal}
            productDetail={productInfo}
            selectedShape={selectedShape}
            selectedCarat={selectedCarat}
            selectedColor={activeColor}
            id="priceBreakupId"
          />
        )}
      </div>
    </section>
  );
};

export default Details;
