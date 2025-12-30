"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useCrudApi } from "@/hooks/useCrudApi";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import Typography from "@/components/ui/Typography/Typography";
import RangeSlider from "@/components/ui/RangeSlider/RangeSlider";
import DiamondOptions from "../ProductDetails/DiamondOptions";
import MetalSelector from "../ProductDetails/MetalSelector";
import RingSizeSelector from "../ProductDetails/RingSizeSelector";
import { CUSTOM_DIAMOND_WEIGHTS } from "../ProductDetails/constants";
import { SHAPE_CODES_IMAGE } from "@/constants/constant";

const StepTwo = forwardRef(({ data, setData }, ref) => {
  const { data: filters } = useSelector((state) => state.filters);
  const searchParams = useSearchParams();

  const categoryIdParam = searchParams.get("category_id");
  const categorySlugParam =
    searchParams.get("category") || searchParams.get("slug") || "";

  const { create } = useCrudApi("/api/product/filters");
  const { fetchAll } = useCrudApi("/api/sizes");

  const [filtersData, setFiltersData] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [matchedCategory, setMatchedCategory] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  console.log("sizes", sizes);
  const sizeFromUrl = searchParams.get("size");

  const setField = (field, value) =>
    setData((prev) => ({ ...prev, [field]: value }));

  /* ---------------- FETCH FILTERS ---------------- */
  useEffect(() => {
    if (!categoryIdParam) return;

    const fetchFilters = async () => {
      try {
        const res = await create({ category_id: categoryIdParam });
        setFiltersData(res.data || {});
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };

    fetchFilters();
  }, [categoryIdParam]);

  /* ---------------- FETCH SIZES ---------------- */
  useEffect(() => {
    fetchAll()
      .then((res) => setSizes(res.data || []))
      .catch((err) => console.error("Error fetching sizes:", err));
  }, [fetchAll]);

  /* ---------------- MATCH CATEGORY + SIZES (ONLY PLACE) ---------------- */
  useEffect(() => {
    if (!sizes.length) {
      setMatchedCategory(null);
      setAvailableSizes([]);
      return;
    }

    const normalizedId = categoryIdParam
      ? String(categoryIdParam).toLowerCase()
      : null;
    const normalizedSlug = categorySlugParam.toLowerCase();

    const matched = sizes.find((item) => {
      if (normalizedId && String(item.id) === normalizedId) return true;
      if (normalizedSlug && item.slug?.toLowerCase() === normalizedSlug)
        return true;
      return false;
    });

    setMatchedCategory(matched || null);

    const sizeValues =
      matched?.sizes
        ?.filter((s) => s.is_active)
        ?.sort((a, b) => a.sort_order - b.sort_order)
        ?.map((s) => s.value) || [];

    setAvailableSizes(sizeValues);
  }, [sizes, categoryIdParam, categorySlugParam]);

  /* ---------------- NORMALIZERS ---------------- */
  const normalizedShapes = filtersData?.shape?.map((s) => ({
    id: s.id,
    designno: s.slug,
    shape: s.name,
    label: s.custom_title || s.name,
    image: null,
    variant_product_id: null,
  }));

  const normalizedCarat = (filtersData?.purity || []).map((p) => ({
    value: p.value || p,
  }));

  const normalizedColors = (filtersData?.metal_colors || []).map(
    (c) => c.value || c
  );

  /* ---------------- CATEGORY FIELD ---------------- */
  useEffect(() => {
    if (categoryIdParam) {
      setField("category_id", categoryIdParam);
    }
  }, [categoryIdParam]);

  /* ---------------- VALIDATION ---------------- */
  useImperativeHandle(ref, () => ({
    validate: () => {
      let isValid = true;

      if (!data.ringSize) {
        toast.error("Please select a ring size.");
        isValid = false;
      }
      if (!data.metal?.karat || !data.metal?.color) {
        toast.error("Please select metal and karat");
        isValid = false;
      }
      if (!data.selectedWeight) {
        toast.error("Please select a carat value.");
        isValid = false;
      }
      if (!data.selectedDesignNo) {
        toast.error("Please select a diamond shape.");
        isValid = false;
      }

      return {
        isValid,
        data: isValid
          ? {
              ...data,
              category_id: data.category_id,
              diamondShape: data.selectedDesignNo,
              diamondShapeLabel: selectedShape || "",
              diamondShapeIcon: null,
              diamondWeight: data.selectedWeight,
            }
          : null,
      };
    },
  }));
  console.log("data", data);

  /* ---------------- RENDER ---------------- */
  return (
    <div>
      {/* Header */}
      <div className="pb-[32px]">
        <p className="xl:text-[24px] font-[500] text-[18px]">
          Customize Your Jewelry
        </p>
        <p className="xl:text-[18px] font-[500] text-[14px] text-[var(--placeholder)]">
          Choose your ideal metal and diamond details. Unsure? Make your best
          guess—we’ll fine-tune everything.
        </p>
      </div>

      <hr className="hr-teal-3" />

      <div className="my-[60px] space-y-[50px]">
        {/* Diamond Options */}
        <DiamondOptions
          diamodShapeTitle="Choose Diamond shape:"
          caretTitle="Carat"
          containerClass="space-y-[50px]"
          dimondShapeWithNavigation
          variantList={normalizedShapes}
          designNo={data.selectedDesignNo}
          selectedWeight={data.selectedWeight}
          onShapeClick={(id, shapeName) => {
            const shapeKey = shapeName.toUpperCase();
            const shapeEntry = SHAPE_CODES_IMAGE.find((entry) =>
              Object.hasOwn(entry, shapeKey)
            );
            const fullShapeName = shapeEntry?.[shapeKey]?.title || shapeName;

            setField("selectedDesignNo", id);
            setSelectedShape(fullShapeName);
          }}
          onWeightChange={(weight) => setField("selectedWeight", weight)}
          diamondWeightArray={CUSTOM_DIAMOND_WEIGHTS}
          productInfo={5.2}
        />

        {/* Sliders */}
        <div className="grid lg:grid-cols-2 grid-cols-1 md:gap-x-[124px] gap-[50px]">
          <div>
            <Typography variant="p">
              Color:
              <span className="text-[18px] font-[400] text-[var(--teal-1)] ml-1">
                {data.colorRange[0]} -{" "}
                {data.colorRange[data.colorRange.length - 1]}
              </span>
            </Typography>
            <RangeSlider
              value={["D", "E", "F", "G", "H", "I"]}
              from={data.colorRange[0]}
              to={data.colorRange[data.colorRange.length - 1]}
              hasSteps
              onChange={(val) => setField("colorRange", val)}
            />
          </div>

          <div>
            <Typography variant="p">
              Cut:
              <span className="text-[18px] font-[400] text-[var(--teal-1)] ml-1">
                {data.cutRange[0]} - {data.cutRange[data.cutRange.length - 1]}
              </span>
            </Typography>
            <RangeSlider
              value={["Excellent", "Ideal", "Very Good", "Good"]}
              from={data.cutRange[0]}
              to={data.cutRange[data.cutRange.length - 1]}
              hasSteps
              onChange={(val) => setField("cutRange", val)}
            />
          </div>
        </div>

        {/* Metal + Ring Size */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-[24px]">
          <MetalSelector
            metal={filters?.quality}
            carat={normalizedCarat}
            colorType={normalizedColors}
            value={data.metal}
            onChange={(newMetal) => {
              setField("metal", {
                karat:
                  typeof newMetal.karat === "object"
                    ? newMetal.karat
                    : { value: newMetal.karat },
                color: newMetal.color,
              });
            }}
            useActiveSource="color"
          />

          <RingSizeSelector
            containerStyle="flex-row gap-[20px] !items-baseline"
            label={sizeFromUrl || "Ring"}
            ringSizeOptions={availableSizes}
            dropdownPlaceholder="Select Size"
            selectedValue={data.ringSize}
            onChange={(val) => setField("ringSize", val)}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
});

export default StepTwo;
