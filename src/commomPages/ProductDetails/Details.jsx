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
import TrustStrip from "./TrustStrip";
import { addRecentlyViewed } from "@/utils/recentlyViewed";
import { trackViewItem, trackAddToCart } from "@/lib/analytics";
import toast from "react-hot-toast";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { cleanCarat, toTitleCase } from "@/utils/string";
import { useCrudApi } from "@/hooks/useCrudApi";
import HeartIcon from "@/components/Icons/HeartIcon";
import { usePreferences } from "@/context/PreferencesContext";
import { formatMoney, PRICE_ON_REQUEST_LABEL } from "@/utils/money";
import { getDiscount } from "@/utils/discount";
import BookAppointment from "./BookAppointment";
import PairItWith from "./PairItWith";
import { useSelector } from "react-redux";
import { useWishlistLogic } from "@/hooks/useWishlistLogic";
import ShareModal from "@/components/ui/Modal/ShareModal";
import ReviewSummary from "@/components/ui/ReviewSummary";
import { usePdpContent } from "./usePdpContent";

const Details = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { productId } = useParams();
  const pdp = usePdpContent(); // CMS-managed trust/financing/why-choose/accordion copy
  const [selectedVariantId, setSelectedVariantId] = useState(productId);
  const [designNo, setDesignNo] = useState("");
  const { create: getAmount } = useCrudApi("/api/productDetail/get-amount");
  // Buy-box spec additions: clarity chips (re-price), free engraving, booking.
  const [clarityOptions, setClarityOptions] = useState([]);
  const [selectedClarity, setSelectedClarity] = useState("");
  const [engraving, setEngraving] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);
  useEffect(() => {
    fetch("/api/diamond-clarity")
      .then((r) => r.json())
      .then((j) => setClarityOptions(j?.data || []))
      .catch(() => {});
  }, []);
  const { create } = useCrudApi(`/api/cart/add-to-cart`);
  const { create: filters } = useCrudApi("/api/product/filters");
  const [filtersData, setFiltersData] = useState([]);
  const { create: createWishlist } = useCrudApi(`/api/wishlist`);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

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
    selectedColor ? selectedColor.toUpperCase() : DEFAULT_COLOR
  );
  const [selectDiamondWeightId, setSelectDiamondWeightId] = useState();
  const { selectedCountry } = usePreferences();
  const [selectedCarat, setSelectedCarat] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const customerId = useSelector((state) => state.auth?.customer?.id);
  const wishlistCount = useSelector((state) => state.wishlist.count);
  const [pricingDetails, setPricingDetails] = useState(null);

  const { checkIfWishlisted, toggleWishlist } = useWishlistLogic({
    createWishlistApi: createWishlist,
  });

  const pricingEnabledRef = useRef(false);

  // Restore selections carried across a design-sibling shape switch
  // (?karat=18K&ct=2.00&size=7 — written by onShapeClick before navigating).
  // Runs once per product load; user interactions afterwards are untouched.
  useEffect(() => {
    if (!productInfo?.id) return;
    const karatParam = searchParams.get("karat");
    const ctParam = searchParams.get("ct");
    const sizeParam = searchParams.get("size");
    if (!karatParam && !ctParam && !sizeParam) return;

    let metal = selectedMetal;
    if (karatParam) {
      const k = karatParam.toUpperCase();
      metal = { karat: { value: k, karat: k, label: k }, color: activeColor };
      setSelectedMetal(metal);
    }
    if (ctParam) {
      setSelectedCarat(ctParam);
      setSelectedWeight(ctParam);
    }
    if (sizeParam) setSelectedRingSize(sizeParam);

    // Reprice with the restored configuration (don't wait for a user click).
    pricingEnabledRef.current = true;
    updatePricing(
      productInfo.id,
      productInfo.design_no,
      metal,
      sizeParam || selectedRingSize,
      ctParam || selectedWeight
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productInfo?.id]);

  // Real review summary (approved reviews only) — replaces the old hardcoded stub.
  const [reviewSummary, setReviewSummary] = useState(null);
  useEffect(() => {
    if (!productInfo?.id) return;
    let alive = true;
    fetch(`/api/reviews/summary?productId=${productInfo.id}`)
      .then((r) => r.json())
      .then((j) => {
        if (alive) setReviewSummary(j?.data || null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [productInfo?.id]);

  useEffect(() => {
    const activeId = selectDiamondWeightId || selectedVariantId;
    if (!activeId) return;

    let isCurrent = true;
    setLoadingGallery(true);

    const currency =
      typeof selectedCountry?.currency === "string"
        ? selectedCountry.currency
        : selectedCountry?.currency?.code || "USD";

    fetch(
      `/api/productDetail/${activeId}`,
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
        setSelectDiamondWeightId(null);

        if (!selectDiamondWeightId) {
          const data = json?.data ?? {};
          setProductInfo(data);
          setGalleryMedia(data?.media || []);
          addRecentlyViewed(data);
          trackViewItem({
            id: data.id,
            name: data.name || data.title,
            category: data.category?.name,
            price: data.price,
          });
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
          // Metal family for the pricing engine (Gold / Silver / Platinum) —
          // set by the MetalSelector chips; defaults to Gold for old links.
          metal_type: metal.karat.metalType || "Gold",
          size: size || "0",
          center_diamond_weight: weight
            ? String(weight).replace(/[^0-9.]/g, "")
            : null,
          // Clarity re-prices via the engine's diamond-rate lookup.
          diamond_quality: selectedClarity || undefined,
        },
        {
          headers: {
            currency: selectedCountry?.currency,
          },
        }
      );
      setPricingDetails(res?.data);
      if (res?.status && res?.data?.total_price) {
        setPricing(res.data.total_price);
      }
    } catch (err) {
      console.error("Error fetching amount", err);
    }
  };

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
    wishlistCount,
  ]);

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

  const updatePricingWithClarity = async (clarity) => {
    if (!selectedMetal?.karat || !productInfo) return;
    try {
      const res = await getAmount(
        {
          product_id: productInfo.id,
          design_no: designNo || productInfo.design_no,
          quality: selectedMetal.karat.value,
          metal_type: selectedMetal.karat.metalType || "Gold",
          size: selectedRingSize || "0",
          center_diamond_weight: selectedWeight
            ? String(selectedWeight).replace(/[^0-9.]/g, "")
            : null,
          diamond_quality: clarity,
        },
        { headers: { currency: selectedCountry?.currency } }
      );
      setPricingDetails(res?.data);
      if (res?.status && res?.data?.total_price) setPricing(res.data.total_price);
    } catch {}
  };

  const handleAddToCart = async () => {
    if (isAddingToCart) return;

    const token = localStorage.getItem("authTokenRJHouse");

    // Bring the shopper right back to this product after they sign in.
    const returnTo =
      typeof window !== "undefined"
        ? encodeURIComponent(window.location.pathname + window.location.search)
        : "";
    const loginUrl = returnTo ? `/login?redirect=${returnTo}` : "/login";

    try {
      if (!token) {
        toast("Please sign in to add items to your bag.", { icon: "🔐" });
        return router.push(loginUrl);
      }
      if (!selectedRingSize && productInfo?.sizes?.length > 0) {
        setErrorMessage(
          `Please select a ${toTitleCase(productInfo?.category?.name)} Size.`
        );
        return;
      }

      setErrorMessage("");
      setIsAddingToCart(true);

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
        diamond_clarity: selectedClarity || "",
        engraving: engraving.trim() || "",
      };
      const response = await create(payload);
      if (response.status) {
        trackAddToCart({
          id: productInfo?.id,
          name: productInfo?.name || productInfo?.title,
          price: pricing,
          quantity: 1,
        });
        router.push("/cart");
      } else if (response.code === 401) {
        // Stale/expired session — clear it and send the shopper to sign in,
        // returning them to this product afterwards.
        localStorage.removeItem("authTokenRJHouse");
        toast.error("Your session expired — please sign in again.");
        router.push(loginUrl);
      } else {
        toast.error(response.message || "Could not add to bag. Please try again.");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Could not add to bag. Please try again.");
    } finally {
      setIsAddingToCart(false);
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
    // Default the active shape to THIS product's own diamond shape, so the
    // shape selector highlights the correct option on load (design-group model).
    if (!shapeParam && !selectedShape && productInfo.shape) {
      setSelectedShape(productInfo.shape);
    }
    if (!shapeParam) return;

    // find the variant for the shape
    const variant = productInfo?.variants?.find((v) => {
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
          label: `${s.size_value}`,
          value: String(s.size_value),
          variantId: s.variant_product_id,
        }));
    }

    return (
      productInfo.sizes?.map((s) => ({
        label: `${s.size.split(" ")[0]}`,
        value: String(s.size).split(" ")[0],
        variantId: null,
      })) || []
    );
  }, [productInfo, selectedWidth]);

  useEffect(() => {
    if (!productInfo?.size || selectedRingSize) return;

    const ring = productInfo.size.match(/[\d.]+/)?.[0];
    if (ring) setSelectedRingSize(ring);
  }, [productInfo]);

  const displayPrice = useMemo(() => {
    if (pricing === null || pricing === undefined) return null;

    const num = Number(pricing);
    if (!Number.isFinite(num) || num <= 0) return null;

    return Math.floor(num);
  }, [pricing]);

  // Promo "was/now" display — same deterministic per-product discount used on the
  // product cards (no real compare-at price exists in the data). Null when the
  // item is price-on-request or has no sellable price.
  const effectivePrice =
    displayPrice > 0
      ? displayPrice
      : productInfo?.product_price > 0
      ? Math.floor(productInfo.product_price)
      : null;
  const discount = productInfo?.price_on_request
    ? null
    : getDiscount(effectivePrice, productInfo?.display_discount_percent);

  const dynamicDescription = useMemo(() => {
    if (!productInfo) return "";

    const karat = selectedMetal?.karat?.value || "";
    const color = activeColor ? toTitleCase(activeColor) : "";
    const metalStr =
      karat || color ? `${karat} ${color} Gold` : "premium metal";

    const isBlank = (v) =>
      !v || v === "undefined" || v === "null" || v === "NaN";
    const shape = !isBlank(selectedShape) ? toTitleCase(selectedShape) : "";
    const cleanWeight = !isBlank(selectedWeight)
      ? String(selectedWeight).replace(/[^\d.]/g, "")
      : "";
    const weight = cleanWeight ? `${cleanWeight} ct` : "";
    const diamondPart =
      shape || weight ? `a ${weight} ${shape} diamond` : "brilliant accents";

    return `Crafted in ${metalStr} with ${diamondPart} for timeless elegance.`;
  }, [productInfo, selectedMetal, activeColor, selectedShape, selectedWeight]);

  return (
    <>
    <section className="md:px-[30px] px-[18px] flex lg:flex-row items-start flex-col xl:gap-[66px] gap-[26px] w-full">
      {/* Gallery — pinned while the details column scrolls (sticky on desktop) */}
      <div className="relative lg:w-[60%] w-full lg:sticky lg:top-[20px] lg:self-start">
        <ProductsGallery
          allImagesAndVideos={galleryMedia}
          selectedMetal={selectedMetal}
          selectDiamond={selectedShape}
          loadingProductInfo={loadingGallery}
          activeColor={activeColor}
          setActiveColor={setActiveColor}
          productName={productInfo?.title || productInfo?.name}
        />
      </div>

      {/* Product details — scrolls while the gallery stays pinned */}
      <div className="lg:w-[40%] w-full space-y-[18px]">
        {/* Collection eyebrow → title → price → reviews → description (Ecksand hierarchy) */}
        <div className="space-y-[14px]">
          <div className="space-y-[6px]">
            {(productInfo?.category?.name || productInfo?.collection_name) && (
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--teal-2)]">
                {productInfo?.category?.name ? toTitleCase(productInfo.category.name) : ""}
                {productInfo?.category?.name && productInfo?.collection_name ? " · " : ""}
                {productInfo?.collection_name && (
                  <a
                    href={`/collections/${String(productInfo.collection_name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`}
                    className="hover:underline underline-offset-4"
                  >
                    {productInfo.collection_name.toUpperCase()} COLLECTION
                  </a>
                )}
              </p>
            )}
            <h1
              className="font-[var(--font-cormorant)] text-[26px] md:text-[30px] leading-[1.15] tracking-[-0.01em] text-[var(--grey-2)] font-medium"
            >
              {productInfo?.title && toTitleCase(productInfo.title)}
            </h1>
          </div>

          {reviewSummary?.count > 0 && (
            <ReviewSummary
              rating={Number(reviewSummary.average) || 0}
              totalReviews={reviewSummary.count}
            />
          )}

          {productInfo?.short_description && (
            <p className="text-[13.5px] font-[300] text-[var(--grey-2)] leading-relaxed">
              {productInfo.short_description}
            </p>
          )}

          <div className="space-y-[8px]">
            {effectivePrice > 0 ? (
              <div className="flex flex-wrap items-center gap-[10px]">
                <p className="xl:text-[22px] lg:text-[20px] text-[19px] font-[500] text-[var(--teal-1)]">
                  {formatMoney(effectivePrice, selectedCountry, { decimals: 0 })}
                </p>
                {discount && (
                  <>
                    <span className="xl:text-[16px] text-[14px] font-[400] text-[var(--placeholder)] line-through">
                      {formatMoney(discount.originalPrice, selectedCountry, { decimals: 0 })}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[var(--color-error)] px-[10px] py-[3px] text-[11px] font-[600] uppercase tracking-[0.02em] text-white">
                      Save {discount.percent}%
                    </span>
                    {discount.endsSoon && (
                      <span className="inline-flex items-center gap-[5px] rounded-full border border-[var(--color-error)] px-[10px] py-[3px] text-[11px] font-[500] uppercase tracking-[0.02em] text-[var(--color-error)]">
                        <span className="h-[6px] w-[6px] rounded-full bg-[var(--color-error)]" />
                        Ends Soon
                      </span>
                    )}
                  </>
                )}
              </div>
            ) : (
              <p className="xl:text-[22px] lg:text-[20px] text-[19px] font-[500] text-[var(--teal-1)]">
                {PRICE_ON_REQUEST_LABEL}
              </p>
            )}
            {/* Financing strip removed per design review (installments not live
                yet). Re-enable by restoring <Financing config={pdp?.financing}
                price={effectivePrice} …/> here. */}
          </div>

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
            metalOptions={productInfo.metal_options || []}
            value={selectedMetal}
            onChange={(metal) => {
              pricingEnabledRef.current = true;

              setSelectedMetal(metal);

              const raw = metal?.karat?.value || "";
              const cleanCarat = raw.replace(/k/i, "");

              const color =
                metal?.color?.toUpperCase?.() ||
                metal?.metal_color?.toUpperCase?.() ||
                activeColor || // preserve the color the user clicked through with
                "";

              const params = new URLSearchParams(
                Array.from(searchParams.entries())
              );

              // update karat always; only set color when we actually have one
              params.set("carat", cleanCarat);
              if (color) params.set("selectedMetalColor", color);

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
            variantList={
              (productInfo?.variants || []).filter((e) => e.shape !== null)
            }
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

              // Design-group model: each shape is its OWN product. Clicking a
              // sibling shape navigates to that product (keeping the metal color).
              const clicked = (productInfo?.variants || []).find(
                (v) => v.id === id
              );
              if (
                clicked?.is_design_sibling &&
                clicked.product_id &&
                clicked.product_id !== productInfo?.id
              ) {
                const params = new URLSearchParams();
                if (activeColor) params.set("selectedMetalColor", activeColor);
                params.set("shape", shapeName || clicked.shape || "");
                // Preserve the shopper's full configuration across the product switch
                if (selectedMetal?.karat?.value)
                  params.set("karat", selectedMetal.karat.value);
                const carriedCt = selectedCarat || selectedWeight;
                if (carriedCt)
                  params.set("ct", String(carriedCt).replace(/[^0-9.]/g, ""));
                if (selectedRingSize) params.set("size", String(selectedRingSize));
                router.push(`/product/${clicked.product_id}?${params.toString()}`);
                return;
              }

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
                const params = new URLSearchParams(
                  Array.from(searchParams.entries())
                );
                params.set("shape", shapeName);
                router.replace(`/product/${productId}?${params.toString()}`, {
                  scroll: false,
                });
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
                designNo,
                selectedMetal,
                selectedRingSize,
                data.carat
              );
            }}
            onSizeChange={(data) => {
              setSelectedWidth(data?.size);
              updatePricing(
                productInfo?.id,
                designNo,
                selectedMetal,
                selectedWidth,
                selectedWeight
              );
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
              // updatePricing(
              //   productInfo?.id,
              //   productInfo?.design_no,
              //   selectedMetal,
              //   option.value,
              //   selectedWeight
              // );
            }}
            isInvalid={!!errorMessage}
          />
        )}

        {clarityOptions.length > 0 && (
          <div className="space-y-[8px]">
            <p className="text-[14px] font-[500] text-[var(--grey-2)]">
              Clarity :{" "}
              <span className="text-sm font-normal text-[var(--teal-1)]">
                {selectedClarity || "Select"}
              </span>
            </p>
            <div className="flex gap-2 flex-wrap">
              {clarityOptions.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    pricingEnabledRef.current = true;
                    setSelectedClarity(c.code);
                    updatePricingWithClarity(c.code);
                  }}
                  className={`min-w-[54px] px-3 py-[7px] text-[12px] border transition-colors ${
                    selectedClarity === c.code
                      ? "border-[var(--teal-1)] text-[var(--teal-1)]"
                      : "border-[var(--teal-3)] text-[var(--grey-2)] hover:border-[var(--teal-1)]"
                  }`}
                  title={c.name}
                >
                  {c.code}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Free engraving — max 20 characters, saved with the order */}
        <div className="space-y-[6px]">
          <p className="text-[14px] font-[500] text-[var(--grey-2)]">
            Engraving <span className="text-[12px] font-normal text-[var(--placeholder)]">(optional · free)</span>
          </p>
          <div className="relative max-w-[320px]">
            <input
              value={engraving}
              maxLength={20}
              onChange={(e) => setEngraving(e.target.value)}
              placeholder="e.g. Forever & Always"
              className="w-full border border-[var(--teal-3)] px-3 py-2 text-[13px] italic focus:outline-none focus:border-[var(--teal-1)]"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-[var(--placeholder)]">
              {engraving.length}/20
            </span>
          </div>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
        <div className="space-y-[12px] ">
          <div className="flex gap-[6px]">
            <Button
              title={isAddingToCart ? "adding..." : "add to bag"}
              className="w-full h-[42px]"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
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
              ariaLabel="Add to wishlist"
              className="w-[42px] h-[42px] !p-[9px]"
            />
            <Button
              variant="ghost"
              ariaLabel="Share"
              icon={<img src="/icons/share.svg" alt="share-icon" />}
              iconOnly
              className="w-[42px] h-[42px] !p-[9px]"
              onClick={() => {
                setOpenShareModal(true);
              }}
            />
          </div>
          {/* Description under the CTAs (Ecksand order) with read more/less */}
          <div className="pt-[4px]">
            <p
              className={`text-[14px] font-[300] text-[var(--grey-2)] leading-relaxed ${
                descExpanded ? "" : "line-clamp-2"
              }`}
            >
              {[productInfo?.description, dynamicDescription]
                .filter(Boolean)
                .join(" ")}
            </p>
            {(productInfo?.description || "").length > 90 && (
              <button
                type="button"
                onClick={() => setDescExpanded((v) => !v)}
                className="mt-[4px] text-[12px] uppercase tracking-[0.08em] underline underline-offset-4 text-[var(--teal-1)] hover:text-[var(--teal-2)]"
              >
                {descExpanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>

          <div className="xl:text-[14px] font-[400] text-[12px] pb-[16px]">
            Need Help?{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => setBookingOpen(true)}
            >
              {" "}
              Speak to an Expert
            </span>
          </div>
          <hr className="hr-teal-3" />
        </div>
        <TrustStrip badges={pdp?.trust_badges} />
        <FeaturesList
          items={pdp?.why_choose?.length ? pdp.why_choose : WHY_CHOOSE_ICON}
          containerClass="!grid !grid-cols-1 min-[400px]:!grid-cols-2 !gap-x-2 !gap-y-3"
          itemClass="!m-0 !p-1"
          iconClass="!w-[24px] !h-[24px] shrink-0"
        />
        {productInfo && (
          <FeaturesSpecs
            selectedWeight={selectedWeight}
            selectedMetal={selectedMetal}
            productDetail={productInfo}
            selectedShape={selectedShape}
            selectedCarat={selectedCarat}
            selectedColor={activeColor}
            pricingDetails={pricingDetails}
            shippingReturns={pdp?.shipping_returns}
            certificationCare={pdp?.certification_care}
            id="priceBreakupId"
          />
        )}
        {/* Pair It With — small cards under the FAQs (Ecksand "Pairs Well With") */}
        {productInfo && (
          <PairItWith pairsWith={productInfo?.pairs_with} excludeId={productInfo?.id} />
        )}
      </div>
      {openShareModal && (
        <ShareModal onClose={() => setOpenShareModal(false)} />
      )}
      <BookAppointment
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        product={{ id: productInfo?.id, title: productInfo?.title || productInfo?.name }}
      />
    </section>
    </>
  );
};

export default Details;
