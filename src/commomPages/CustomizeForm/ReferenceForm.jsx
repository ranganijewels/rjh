"use client";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import Input from "@/components/ui/Input/Input";
import React, { useEffect, useMemo, useState } from "react";
import MetalSelector from "../ProductDetails/MetalSelector";
import { useCrudApi } from "@/hooks/useCrudApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import RingSizeSelector from "../ProductDetails/RingSizeSelector";
import DiamondOptions from "../ProductDetails/DiamondOptions";
import Button from "@/components/ui/Button/Button";
import HeadingWithNavigation from "@/components/ui/Heading/HeadingWithNavigation";
import { formatCarat, getPreviewUrl } from "@/utils/string";
import RangeSlider from "@/components/ui/RangeSlider/RangeSlider";
import Typography from "@/components/ui/Typography/Typography";
import { shapeToCode } from "@/constants/constant";
import toast from "react-hot-toast";
import clsx from "clsx";
import { useCustomize } from "@/context/CustomizeContext";

const COLOR_OPTIONS = ["D", "E", "F", "G"];
const CLARITY_OPTIONS = ["VVS1", "VVS2", "VS1", "VS2"];
const CARATS = [
  "1 ctw",
  "1.5 ctw",
  "2 ctw",
  "2.5 ctw",
  "3 ctw",
  "3.5 ctw",
  "4 ctw",
  "4.5 ctw",
  "5 ctw",
  "Custom",
];

const ReferenceForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sizeSlug = searchParams.get("size");
  const { referenceForm, updateReferenceForm } = useCustomize();
  const { fetchAll: fetchCategories } = useCrudApi(`/api/product/categories`);
  const categoryId = searchParams.get("category_id");
  const [activeColor, setActiveColor] = useState(null);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories()
      .then((categories) => {
        setCategories(categories.data);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [fetchCategories]);

  const resolvedCategorySlug = useMemo(() => {
    if (!categoryId || !categories.length) return null;

    const category = categories.find(
      (cat) => String(cat.id) === String(categoryId)
    );

    return category?.slug || null;
  }, [categoryId, categories]);

  const [urlInput, setUrlInput] = useState("");
  const [sizes, setSizes] = useState([]);
  const [form, setForm] = useState(referenceForm);

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* ---------------- API ---------------- */
  const { fetchAll: fetchSizesApi } = useCrudApi("/api/sizes");
  const { data: filters } = useSelector((state) => state.filters);

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    if (form?.metal?.color) {
      setActiveColor(form.metal.color);
    }
  }, [form?.metal?.color]);

  useEffect(() => {
    fetchSizesApi()
      .then((res) => setSizes(res.data || []))
      .catch((err) => console.error("Error fetching sizes", err));
  }, [fetchSizesApi]);

  useEffect(() => {
    if (!referenceForm) return;

    setForm(referenceForm);
  }, [referenceForm]);

  const activeSizeCategory = useMemo(() => {
    if (!sizes.length) return null;

    if (sizeSlug) {
      return (
        // Optional-chain the slug — a malformed size row must not crash the form.
        sizes.find((s) => s.slug?.toLowerCase() === sizeSlug.toLowerCase()) ||
        null
      );
    }

    if (resolvedCategorySlug) {
      return sizes.find((s) => s.slug === resolvedCategorySlug) || null;
    }

    return null;
  }, [sizes, sizeSlug, resolvedCategorySlug]);

  const ringSizeOptions = activeSizeCategory?.sizes?.map((s) => s.value) || [];
  const sizeCategoryId = activeSizeCategory?.id || null;

  const normalizedShapes =
    filters?.shape?.map((s) => {
      return {
        id: s.id,
        designno: s.slug ?? String(s.id),
        // CODE (RND/OVL…) so DiamondOptions' SHAPE_CODES_IMAGE icon lookup resolves.
        shape: shapeToCode(s.name),
        name: s.name,
        label: s.custom_title || s.name,
      };
    }) || [];

  const normalizedColors = (filters?.metal_colors || []).map(
    (c) => c.value || c
  );

  /* ---------------- Handlers ---------------- */
  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange(Array.from(e.dataTransfer.files));
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    try {
      new URL(trimmed);
    } catch {
      toast.error("Enter a valid URL");
      return;
    }

    updateForm("urls", [...form.urls, trimmed].slice(-4));
    setUrlInput("");
  };

  const handleRemoveUrl = (index) => {
    updateForm(
      "urls",
      form.urls.filter((_, i) => i !== index)
    );
  };

  const MAX_FILES = 4;

  const handleFileChange = (selectedFiles) => {
    const valid = selectedFiles.every((file) =>
      ["image/jpeg", "image/png", "application/pdf"].includes(file.type)
    );

    if (!valid) {
      toast.error("Please upload valid images (JPG, PNG) or PDFs.");
      return;
    }

    // Combine old + new
    const combinedFiles = [...form.files, ...selectedFiles];

    // Keep ONLY last 4 (FIFO: remove oldest)
    const updatedFiles = combinedFiles.slice(-MAX_FILES);

    if (combinedFiles.length > MAX_FILES) {
      toast.success("Oldest image replaced with new one");
    }

    updateForm("files", updatedFiles);
  };

  const handleNext = () => {
    updateReferenceForm({
      ...form,
      sizeCategoryId,
      selectedCarat:
        form.selectedCarat === "Custom" ? form.customCarat : form.selectedCarat,
    });

    router.push(
      `/customize/form/review?size=${sizeSlug}&size_category_id=${sizeCategoryId}`
    );
  };
  const handleShapeClick = (designno, label, id) => {
    updateForm("shape", { id, designno, label });
  };

  return (
    <section className="xl:space-y-[40px] space-y-[20px]">
      <div className="">
        <p className="xl:text-[24px] text-[18px] font-[500]">
          Share Your Reference For Rings Customization
        </p>
        <p className="xl:text-[18px] text-[14px] font-[500] text-[var(--placeholder)]">
          Upload sketches, photos, or references that capture of Rings your
          idea.{" "}
        </p>
      </div>

      {/* Upload area */}
      <div className="flex md:flex-row flex-col items-center md:gap-[40px] gap-[20px]">
        <div
          className="flex items-center justify-center w-full"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full py-[32px]
                     outline-2 outline-[var(--teal-2)] outline-offset-2 
                     outline-dashed rounded-lg cursor-pointer"
          >
            <p className="mb-2 text-[16px] font-[500] text-[var(--grey-2)]">
              Drop your image here, or browse
            </p>
            <p className="text-[12px] font-[500] text-[var(--placeholder)]">
              Supports: JPG, PNG, PDF (Max 10MB each)
            </p>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              multiple
              onChange={(e) => handleFileChange(Array.from(e.target.files))}
            />
          </label>
        </div>

        {/* Preview */}
        <div className="flex flex-row gap-[18px]">
          {form?.files.slice(0, 4).map((file, index) => {
            const preview = getPreviewUrl(file);
            if (!preview) return null;

            return (
              <div
                key={index}
                className="relative w-[120px] h-[120px] xl:w-[183px] xl:h-[183px]"
              >
                <img
                  src={preview}
                  alt="Selected"
                  className="rounded-lg w-full h-full object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    updateForm(
                      "files",
                      form.files.filter((_, i) => i !== index)
                    )
                  }
                  className="absolute top-2 right-2 bg-white p-1 rounded-full"
                >
                  <DeleteIcon />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-[16px] font-[400]">
          Describe what you’re envisioning or why this inspiration is meaningful
          to you.{" "}
          <span className="text-[var(--placeholder)]">
            (minimum 15 characters){" "}
          </span>
        </label>
        <textarea
          placeholder="Enter text..."
          className={`bg-white border-b border-b-[var(--teal-3)] p-3 resize-none focus:outline-[var(--teal-1)] focus:outline-1`}
          value={form?.description}
          onChange={(e) => {
            updateForm("description", e.target.value);
          }}
        />
      </div>

      {/*Url */}
      <Input
        label={"URL :"}
        placeholder="Enter URL..."
        borderBottom
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        onPaste={(e) => {
          const pastedText = e.clipboardData.getData("text").trim();

          // Always stop default paste
          e.preventDefault();

          // Validate URL
          try {
            new URL(pastedText);
          } catch {
            toast.error("Enter a valid URL");
            setUrlInput("");
            return;
          }

          // If duplicate → just clear input and exit
          if (form.urls.includes(pastedText)) {
            setUrlInput("");
            return;
          }

          // Add URL
          updateForm("urls", [...form.urls, pastedText].slice(-4));
          setUrlInput("");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddUrl();
          }
        }}
        onFocus={() => handleAddUrl()}
      />

      <div className="flex gap-2 mt-2 flex-wrap">
        {form?.urls.map((url, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-[var(--grey-0)] px-3 py-2 rounded"
          >
            <span className="text-sm truncate max-w-[200px]">{url}</span>
            <button
              type="button"
              onClick={() => handleRemoveUrl(index)}
              className="text-gray-500"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="xl:space-y-[40px] space-y-[20px]">
        <div className="">
          <p className="xl:text-[24px] text-[18px] font-[500]">
            Select Diamond and Metal
          </p>
          <p className="xl:text-[18px] text-[14px] font-[500] text-[var(--placeholder)]">
            Choose your ideal metal and diamond details. Unsure? Make your best
            guess—we’ll fine-tune everything.
          </p>
        </div>

        <div className="flex lg:flex-row flex-col lg:gap-0 gap-[20px] justify-between">
          <MetalSelector
            metal={filters?.quality}
            carat={filters?.purity}
            colorType={normalizedColors}
            className="w-full"
            value={form?.metal}
            onChange={(newMetal) => {
              updateForm("metal", newMetal);
              if (newMetal?.color) {
                setActiveColor(newMetal?.color);
              }
            }}
            useActiveSource="color"
            activeColor={activeColor}
            setActiveColor={setActiveColor}
          />

          {ringSizeOptions.length > 0 && (
            <RingSizeSelector
              containerStyle="flex-row gap-[20px] !items-baseline w-full"
              label={activeSizeCategory?.name || ""}
              ringSizeOptions={ringSizeOptions}
              dropdownPlaceholder={`Select ${activeSizeCategory?.name || ""}`}
              selectedValue={form.ringSize}
              onChange={(value) => updateForm("ringSize", value)}
              fullWidth
            />
          )}
        </div>
        <DiamondOptions
          diamodShapeTitle="Choose Diamond shape:"
          variantList={normalizedShapes}
          dimondShapeWithNavigation
          showSizeSection={true}
          designNo={form?.shape?.designno}
          onShapeClick={handleShapeClick}
        />
        <div className="space-y-4">
          <HeadingWithNavigation
            title="Carats :"
            label={form?.selectedCarat}
            // onPrev={() => caratScroll("prev")}
            // onNext={() => caratScroll("next")}
            // canScrollLeft={caratCanScrollLeft}
            // canScrollRight={caratCanScrollRight}
            buttonWithLabel
            hideMarginBottom
            iconStyle="w-[24px] h-[12px] xl:w-[20px] xl:h-[26px]"
          />

          <div
            // ref={caratRef}
            className="flex gap-[30px] whitespace-nowrap"
          >
            <div className="flex gap-2 w-full flex-wrap">
              {CARATS.map((item, i) => {
                const isSelected = form?.selectedCarat === item;

                const displayValue = formatCarat(item);

                return (
                  <Button
                    key={`weight-${item}-${i}`}
                    variant="filtersOutline"
                    title={displayValue}
                    onClick={() => {
                      updateForm("selectedCarat", item);
                    }}
                    className={clsx(
                      "slide-card border !capitalize transition-all duration-200 w-full max-w-[70px]",
                      isSelected
                        ? "border-[var(--teal-1)]"
                        : "border-[var(--teal-3)] hover:border-[var(--teal-1)]"
                    )}
                  >
                    {displayValue}
                  </Button>
                );
              })}
            </div>
            {form?.selectedCarat === "Custom" && (
              <Input
                placeholder="Enter your requirement for above 5+CTW"
                containerClass="w-full"
                borderBottom
                value={form?.customCarat || ""}
                onChange={(e) => updateForm("customCarat", e.target.value)}
              />
            )}
          </div>
        </div>

        <div className="flex md:flex-row flex-col justify-between xl:gap-[341px] gap-[60px]">
          {/* Color */}
          <div className="w-full">
            <Typography variant="p">
              Color:{" "}
              <span className="text-[18px] font-[400] text-[var(--teal-1)]">
                {form?.colorRange[0]} -{" "}
                {form?.colorRange[form?.colorRange.length - 1]}
              </span>
            </Typography>

            <RangeSlider
              value={COLOR_OPTIONS}
              from={form?.colorRange[0]}
              to={form?.colorRange[form?.colorRange.length - 1]}
              hasSteps
              onChange={(range) => updateForm("colorRange", range)}
              formatter={(val) => val}
            />
          </div>
          {/* Clarity */}
          <div className="w-full">
            <Typography variant="p">
              Clarity:{" "}
              <span className="text-[18px] font-[400] text-[var(--teal-1)]">
                {form?.clarityRange[0]} -{" "}
                {form?.clarityRange[form?.clarityRange.length - 1]}
              </span>
            </Typography>
            <RangeSlider
              value={CLARITY_OPTIONS}
              from={form?.clarityRange[0]}
              to={form?.clarityRange[form?.clarityRange.length - 1]}
              hasSteps
              onChange={(range) => updateForm("clarityRange", range)}
              formatter={(val) => val}
            />
          </div>
        </div>
      </div>

      <Button title="Next" className="float-right" onClick={handleNext} />
    </section>
  );
};

export default ReferenceForm;
