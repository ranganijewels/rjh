// import React, {
//   forwardRef,
//   useEffect,
//   useImperativeHandle,
//   useState,
// } from "react";
// import { useSelector } from "react-redux";
// import { useCrudApi } from "@/hooks/useCrudApi";
// import { useSearchParams } from "next/navigation";
// import toast from "react-hot-toast";

// import Typography from "@/components/ui/Typography/Typography";
// import RangeSlider from "@/components/ui/RangeSlider/RangeSlider";
// import DiamondOptions from "../ProductDetails/DiamondOptions";
// import MetalSelector from "../ProductDetails/MetalSelector";
// import RingSizeSelector from "../ProductDetails/RingSizeSelector";
// import { CUSTOM_DIAMOND_WEIGHTS } from "../ProductDetails/constants";
// import { SHAPE_CODES_IMAGE } from "@/constants/constant";

// const StepTwo = forwardRef(({ data, setData }, ref) => {
//   const { data: filters } = useSelector((state) => state.filters);
//   const searchParams = useSearchParams();

//   // ✅ DEFAULT CATEGORY FIX
//   const category = searchParams.get("category_id") || "ring";

//   const { create } = useCrudApi("/api/product/filters");
//   const { fetchAll } = useCrudApi("/api/sizes");

//   const [filtersData, setFiltersData] = useState([]);
//   const [sizes, setSizes] = useState([]);
//   const [selectedShape, setSelectedShape] = useState(null);

//   const setField = (field, value) =>
//     setData((prev) => ({ ...prev, [field]: value }));

//   // ✅ Fetch product filters
//   useEffect(() => {
//     const fetchFilters = async () => {
//       try {
//         const res = await create({ category_id: category });
//         setFiltersData(res.data);
//       } catch (err) {
//         console.error("Error fetching filters:", err);
//       }
//     };

//     fetchFilters();
//   }, [category]);

//   // ✅ Fetch sizes
//   useEffect(() => {
//     fetchAll()
//       .then((res) => setSizes(res.data || []))
//       .catch((err) => console.error("Error fetching sizes", err));
//   }, [fetchAll]);

//   // ✅ MATCH CATEGORY CORRECTLY USING SLUG
//   const matchedCategory = sizes.find(
//     (c) => c.slug?.toLowerCase() === category.toLowerCase()
//   );

//   const availableSizes = matchedCategory?.sizes || [];

//   // ✅ Set category in form data
//   useEffect(() => {
//     if (category) {
//       setField("category_id", category);
//     }
//   }, [category]);

//   const normalizedShapes = filtersData?.shape?.map((s) => ({
//     id: s.id,
//     designno: s.slug,
//     shape: s.name,
//     label: s.custom_title || s.name,
//     image: null,
//     variant_product_id: null,
//   }));

//   const normalizedCarat = (filtersData?.purity || []).map((p) => ({
//     value: p.value || p,
//   }));

//   const normalizedColors = (filtersData?.metal_colors || []).map(
//     (c) => c.value || c
//   );

//   // ✅ Validation
//   useImperativeHandle(ref, () => ({
//     validate: () => {
//       let isValid = true;

//       return {
//         isValid,
//         data: isValid
//           ? {
//               ...data,
//               category_id: data.category_id,
//               diamondShape: data.selectedDesignNo,
//               diamondShapeLabel: selectedShape || "",
//               diamondShapeIcon: null,
//               diamondWeight: data.selectedWeight,
//             }
//           : null,
//       };
//     },
//   }));

//   // ✅ DEBUG (YOU CAN REMOVE LATER)
//   console.log("category_id =", category);
//   console.log("matchedCategory =", matchedCategory);
//   console.log("availableSizes =", availableSizes);

//   return (
//     <div>
//       <div className="pb-[32px]">
//         <p className="xl:text-[24px] font-[500] text-[18px]">
//           Customize Your Jewelry
//         </p>
//         <p className="xl:text-[18px] font-[500] text-[14px] text-[var(--placeholder)]">
//           Choose your ideal metal and diamond details.
//         </p>
//       </div>

//       <hr className="hr-teal-3" />

//       <div className="my-[60px] space-y-[50px]">
//         {/* ✅ Diamond Options */}
//         <DiamondOptions
//           diamodShapeTitle="Choose Diamond shape:"
//           caretTitle="Carat"
//           containerClass="space-y-[50px]"
//           dimondShapeWithNavigation
//           variantList={normalizedShapes}
//           designNo={data.selectedDesignNo}
//           selectedWeight={data.selectedWeight}
//           onShapeClick={(id, shapeName) => {
//             const shapeKey = shapeName.toUpperCase();
//             const shapeEntry = SHAPE_CODES_IMAGE.find((entry) =>
//               Object.hasOwn(entry, shapeKey)
//             );
//             const fullShapeName = shapeEntry?.[shapeKey]?.title || shapeName;

//             setField("selectedDesignNo", id);
//             setSelectedShape(fullShapeName);
//           }}
//           onWeightChange={(weight) => setField("selectedWeight", weight)}
//           diamondWeightArray={CUSTOM_DIAMOND_WEIGHTS}
//           productInfo={5.2}
//         />

//         {/* ✅ Sliders */}
//         <div className="grid lg:grid-cols-2 grid-cols-1 md:gap-x-[124px] gap-[50px] gap-y-[50px]">
//           <div>
//             <Typography variant="p">
//               Color:{" "}
//               <span className="text-[18px] font-[400] text-[var(--teal-1)]">
//                 {data.colorRange[0]} -{" "}
//                 {data.colorRange[data.colorRange.length - 1]}
//               </span>
//             </Typography>
//             <RangeSlider
//               value={["D", "E", "F", "G", "H", "I"]}
//               from={data.colorRange[0]}
//               to={data.colorRange[data.colorRange.length - 1]}
//               hasSteps
//               onChange={(val) => setField("colorRange", val)}
//               formatter={(val) => val}
//             />
//           </div>

//           <div>
//             <Typography variant="p">
//               Cut:{" "}
//               <span className="text-[18px] font-[400] text-[var(--teal-1)]">
//                 {data.cutRange[0]} - {data.cutRange[data.cutRange.length - 1]}
//               </span>
//             </Typography>
//             <RangeSlider
//               value={["Excellent", "Ideal", "Very Good", "Good"]}
//               from={data.cutRange[0]}
//               to={data.cutRange[data.cutRange.length - 1]}
//               hasSteps
//               onChange={(val) => setField("cutRange", val)}
//               formatter={(val) => val}
//             />
//           </div>

//           <div>
//             <Typography variant="p">
//               Clarity:{" "}
//               <span className="text-[18px] font-[400] text-[var(--teal-1)]">
//                 {data.clarityRange[0]} -{" "}
//                 {data.clarityRange[data.clarityRange.length - 1]}
//               </span>
//             </Typography>
//             <RangeSlider
//               value={["SI1", "SI2", "VS1", "VS2", "VVS1", "VVS2"]}
//               from={data.clarityRange[0]}
//               to={data.clarityRange[data.clarityRange.length - 1]}
//               hasSteps
//               onChange={(val) => setField("clarityRange", val)}
//               formatter={(val) => val}
//             />
//           </div>
//         </div>

//         {/* ✅ Metal + Ring Size */}
//         <div className="grid md:grid-cols-2 grid-cols-1 gap-[24px]">
//           <MetalSelector
//             metal={filters?.quality}
//             carat={normalizedCarat}
//             colorType={normalizedColors}
//             value={data.metal}
//             onChange={(newMetal) => {
//               setField("metal", {
//                 karat:
//                   typeof newMetal.karat === "object"
//                     ? newMetal.karat
//                     : { value: newMetal.karat },
//                 color: newMetal.color,
//               });
//             }}
//             useActiveSource="color"
//           />

//           {/* ✅ RING SIZE NOW WORKING */}
//           <RingSizeSelector
//             containerStyle="flex-row gap-[20px] !items-baseline"
//             label={matchedCategory?.name || "Ring"}
//             ringSizeOptions={availableSizes.map((s) => s.value)}
//             selectedValue={data.ringSize}
//             onChange={(val) => setField("ringSize", val)}
//             fullWidth
//           />
//         </div>
//       </div>
//     </div>
//   );
// });

// export default StepTwo;

//Urvil's Code

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
  const category = searchParams.get("category_id");
  const { create } = useCrudApi("/api/product/filters");
  const [filtersData, setFiltersData] = useState([]);
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await create({
          category_id: category,
        });
        setFiltersData(res.data);
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };

    fetchFilters();
  }, [category]);

  const { fetchAll } = useCrudApi("/api/sizes");

  // ------------------- State -------------------
  const [sizes, setSizes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [matchedCategory, setMatchedCategory] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);

  const setField = (field, value) =>
    setData((prev) => ({ ...prev, [field]: value }));

  // ------------------- Effects -------------------
  useEffect(() => {
    fetchAll()
      .then((res) => setSizes(res.data || []))
      .catch((err) => console.error("Error fetching sizes", err));
  }, [fetchAll]);

  // ------------------- Helpers -------------------

  const size = searchParams.get("size");

  // --- FIX START ---
  const categoryParam = searchParams.get("category_id")?.toLowerCase();

  useEffect(() => {
    if (!sizes.length || !categoryParam) return;

    const matched = sizes.find((c) => {
      return (
        String(c.id) === categoryParam ||
        c.slug?.toLowerCase() === categoryParam
      );
    });

    setMatchedCategory(matched);
    setAvailableSizes(matched?.sizes?.map((s) => s.value) || []);
  }, [sizes, categoryParam]);

  // --- FIX END ---

  useEffect(() => {
    if (category) {
      setField("category_id", category);
    }
  }, [category]);

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

  // ------------------- Validation -------------------
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

  // ------------------- Render -------------------
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

      {/* Options */}
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
        <div className="grid lg:grid-cols-2 grid-cols-1 md:gap-x-[124px] gap-[50px] gap-y-[50px]">
          {/* Color */}
          <div>
            <Typography variant="p">
              Color:{" "}
              <span className="text-[18px] font-[400] text-[var(--teal-1)]">
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
              formatter={(val) => val}
            />
          </div>

          {/* Cut */}
          <div>
            <Typography variant="p">
              Cut:{" "}
              <span className="text-[18px] font-[400] text-[var(--teal-1)]">
                {data.cutRange[0]} - {data.cutRange[data.cutRange.length - 1]}
              </span>
            </Typography>
            <RangeSlider
              value={["Excellent", "Ideal", "Very Good", "Good"]}
              from={data.cutRange[0]}
              to={data.cutRange[data.cutRange.length - 1]}
              hasSteps
              onChange={(val) => setField("cutRange", val)}
              formatter={(val) => val}
            />
          </div>

          {/* Clarity */}
          <div>
            <Typography variant="p">
              Clarity:{" "}
              <span className="text-[18px] font-[400] text-[var(--teal-1)]">
                {data.clarityRange[0]} -{" "}
                {data.clarityRange[data.clarityRange.length - 1]}
              </span>
            </Typography>
            <RangeSlider
              value={["SI1", "SI2", "VS1", "VS2", "VVS1", "VVS2"]}
              from={data.clarityRange[0]}
              to={data.clarityRange[data.clarityRange.length - 1]}
              hasSteps
              onChange={(val) => setField("clarityRange", val)}
              formatter={(val) => val}
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
            label={matchedCategory?.name || "Ring"}
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
