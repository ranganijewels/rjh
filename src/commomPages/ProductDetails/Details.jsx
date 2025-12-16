"use client";
import React, { useState, useEffect } from "react";
import FeaturesList from "@/components/common/FeaturesList/FeaturesList";
import Button from "@/components/ui/Button/Button";
import { WHY_CHOOSE_ICON } from "@/constants/constant";
import ProductsGallery from "./ProductsGallery";
import MetalSelector from "./MetalSelector";
import DiamondOptions from "./DiamondOptions";
import RingSizeSelector from "./RingSizeSelector";
import FeaturesSpecs from "./FeaturesSpecs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { DIAMOND_WEIGHTS } from "./constants";
import toast from "react-hot-toast";
import { toTitleCase } from "@/utils/string";
import { useCrudApi } from "@/hooks/useCrudApi";
import HeartIcon from "@/components/Icons/HeartIcon";
import { usePreferences } from "@/context/PreferencesContext";
import { getCurrencySymbol } from "@/utils/currencySymbol";

const Details = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { productId } = useParams();
  const [selectedVariantId, setSelectedVariantId] = useState(productId);
  const { fetchById } = useCrudApi("/api/product");
  const { create: getAmount } = useCrudApi("/api/productDetail/get-amount");
  const { create } = useCrudApi(`/api/cart/add-to-cart`);
  const { create: filters } = useCrudApi("/api/product/filters");
  const [filtersData, setFiltersData] = useState([]);
  
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
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(
    productInfo?.diamonds?.find((e) => e?.center === 1)?.wt
  );
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [userSelectedMetal, setUserSelectedMetal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pricing, setPricing] = useState(productInfo?.product_price);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedRingSize, setSelectedRingSize] = useState("6"); // default 6 in label

  const selectedColor = searchParams.get("selectedMetalColor");
  const [selectDiamondWeightId, setSelectDiamondWeightId] = useState();
  const [activeColor, setActiveColor] = useState(selectedColor || "ROSE");
  const { selectedCountry } = usePreferences();
  const [selectedCarat, setSelectedCarat] = useState(null);

  useEffect(() => {
    const colorParam = searchParams.get("selectedMetalColor");
    if (colorParam && colorParam !== activeColor) {
      setActiveColor(colorParam.toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    let isCurrent = true;
    setLoadingGallery(true);

    fetchById(selectedVariantId, {
      headers: {
        currency: selectedCountry?.currency,
      },
    })
      .then((res) => {
        if (!isCurrent) return;
        const data = res?.data || {};

        setProductInfo({
          ...data,
        });

        setGalleryMedia(data?.media || []);
        setPricing(data?.product_price);

        // Set default selected shape to the first available shape
        const firstShape = data?.variants?.[0]?.shape || null;
        if (firstShape) {
          setSelectedShape(firstShape);
        }

        // set default selectedSize & selectedRingSize
        const sizesList = (data?.productsizevariant || []).filter(
          (v) => v.size && v.size_value
        );

        if (sizesList.length > 0) {
          const productSizeFromApi = data?.size;
          const defaultSizeGroup =
            sizesList.find(
              (s) =>
                s.size?.toLowerCase() ===
                (productSizeFromApi || "")?.toLowerCase()
            )?.size ||
            sizesList.find((s) => s.size?.toLowerCase() === "small")?.size ||
            sizesList[0].size;

          // set selectedSize (group name e.g. "Small")
          setSelectedSize(defaultSizeGroup);
        }
      })

      .catch((err) => console.error("Error fetching product/variant:", err))
      .finally(() => {
        if (isCurrent) setLoadingGallery(false);
      });

    return () => (isCurrent = false);
  }, [selectedVariantId, selectedCountry]);
  

  useEffect(() => {
    if (!selectDiamondWeightId) return;

    const fetchData = async () => {
      try {
        const res = await fetchById(selectDiamondWeightId, {
          headers: {
            currency: selectedCountry?.currency,
          },
        });

        // Assuming API returns data in res.data
        const data = res?.data;
        if (data?.product_price) {
          setPricing(data.product_price);
        } else {
          console.warn("No product_price found in response:", data);
        }
      } catch (error) {
        console.error("Error fetching diamond variant:", error);
      }
    };

    fetchData();
  }, [selectDiamondWeightId, selectedCountry]);

  const updatePricing = async (
    metal,
    size = selectedRingSize,
    weight = selectedWeight
  ) => {
    if (!metal?.karat || !productInfo) return;

    try {
      const res = await getAmount(
        {
          product_id: productInfo?.id,
          design_no: productInfo?.design_no,
          quality: metal?.karat?.value,
          size: size || "8",
          center_diamond_weight: weight
            ? weight.toString().replace(/[^0-9.]/g, "")
            : null,
        },
        {
          headers: {
            currency: selectedCountry?.currency,
          },
        }
      );

      setPricing(res?.data?.pricing?.data?.[0]?.final_amount);
    } catch (err) {
      console.error("Error fetching amount", err);
      setPricing(undefined);
    }
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
      // if (productInfo?.diamonds?.find((e) => e.center === 1)?.wt) {
      //   if (!selectedWeight || parseInt(selectedWeight) <= 0) {
      //     setErrorMessage("Please select a diamond weight.");
      //     return;
      //   }
      // }
      setErrorMessage("");

      const payload = {
        product_id: String(productInfo?.id),
        metal: selectedMetal?.karat?.value,
        diamond_shape: selectedShape,
        center_diamond_weight: selectedWeight,
        ring_size: selectedRingSize,
        quantity: 1,
        unit_price: productInfo?.product_price,
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

  const diamondWeightArray = productInfo?.variants
    ?.filter((v) => v?.carat && v?.carat.trim() !== "")
    .map((v) => ({
      id: v?.id,
      carat: v?.carat,
      shape: v?.shape,
    }));

  useEffect(() => {
    if (!productInfo?.productsizevariant?.length) return;
    if (!selectedSize) return;

    const ringOptions = productInfo.productsizevariant
      .filter((v) => v.size?.toLowerCase() === selectedSize?.toLowerCase())
      .map((s) => ({
        label: s.size_value + '"',
        value: s.size_value,
        variantId: s.variant_product_id,
      }));

    if (ringOptions.length > 0) {
      const first = ringOptions[0];

      // Update selected ring size
      setSelectedRingSize(first.value);
    }
  }, [selectedSize, productInfo]);

  // LOAD SELECTED SHAPE FROM URL ON REFRESH
  useEffect(() => {
    const shapeParam = searchParams.get("shape");

    if (shapeParam) {
      setSelectedShape(shapeParam);
    }
  }, [searchParams]);

  //added for variant images on shape select
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
              // User intentionally selected metal — mark flag true
              setSelectedMetal(metal);
              setUserSelectedMetal(true);

              // Update URL with cleaned carat (remove 'K')
              const raw = metal?.karat?.value || "";
              const cleanCarat = raw.replace(/k/i, "");
              const params = new URLSearchParams(
                Array.from(searchParams.entries())
              );
              params.set("carat", cleanCarat);
              router.replace(`/product/${productId}?${params.toString()}`, {
                scroll: false,
                shallow: true,
              });

              // Update pricing (immediately)
              updatePricing(
                metal,
                selectedRingSize,
                selectedWeight?.carat,
                selectedWeight?.design_no,
                selectedVariantId // Use current variant ID
              );
            }}
            // handleGetAmount={(metal) => updatePricing(metal)}
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
            onShapeClick={(
              designno,
              shapeName,
              media,
              occasion,
              id,
              variantProductId
            ) => {
              if (variantProductId) {
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
              } else {
                setGalleryMedia(productInfo?.media);
              }
            }}
            onWeightChange={(data) => {
              setSelectDiamondWeightId(data?.variantId);

              // if (data.carat) setSelectedWeight(data.carat);
              setErrorMessage("");

              if (data.variantId) {
                const params = new URLSearchParams(
                  Array.from(searchParams.entries())
                );
                params.set("DiamondWeightId", data.variantId);

                router.replace(`/product/${productId}?${params.toString()}`, {
                  scroll: false,
                });
              }
            }}
            onSizeChange={(data) => {
              setSelectedSize(data?.size);
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
            ringSizeOptions={
              productInfo?.productsizevariant
                ?.filter(
                  (e) => e?.size?.toLowerCase() === selectedSize?.toLowerCase()
                )
                ?.map((s) => ({
                  label: s?.size_value.concat('"'),
                  value: s?.size_value,
                  variantId: s?.variant_product_id,
                })) || []
            }
            // ringSizeOptions={
            //   productInfo?.sizes?.length
            //     ? productInfo.sizes.map((s) => ({
            //         label: s?.size?.toString().concat('"'),
            //         value: s?.size,
            //       }))
            //     : productInfo?.productsizevariant?.length
            //     ? productInfo?.productsizevariant.map((s) => ({
            //         label: s?.size_value?.toString().concat('"'),
            //         value: s?.size_value,
            //         variantId: s?.variant_product_id,
            //       }))
            //     : []
            // }
            selectedValue={selectedRingSize}
            onChange={(option) => {
              setSelectedRingSize(option.value);
              setErrorMessage("");

              const variantId = option.variantId;
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
                  productId={productInfo?.id}
                  productPrice={productInfo?.product_price}
                  categoryId={productInfo?.category_id}
                  wishlistStatus={productInfo?.wishlist}
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
