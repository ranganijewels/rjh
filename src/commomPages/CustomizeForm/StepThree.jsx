"use client";

import React from "react";

const StepThree = ({
  files,
  description,
  colorRange = [],
  cutRange = [],
  clarityRange = [],
  ringSize,
  metal,
  additionalNotes,
  setAdditionalNotes,
  diamondShapeLabel,
  diamondWeight,
  diamondShapeIcon,
}) => {
  const formatRange = (rangeArray) => {
    return rangeArray.length > 0
      ? `${rangeArray[0]} - ${rangeArray[rangeArray.length - 1]}`
      : "Not selected";
  };
  return (
    <div className="bg-[var(--product-bg)] xl:p-[53px] lg:p-[40px] p-[40px_10px] xl:w-[80%] xl:space-y-[54px] space-y-[40px]">
      <div className="pb-[32px]">
        <p className="xl:text-[24px] font-[500] text-[18px]">
          Review Your Selections
        </p>
        <p className="xl:text-[18px] font-[500] text-[14px] text-[var(--placeholder)]">
          Check your details before submitting.
        </p>
      </div>
      <hr className="hr-teal-3" />

      <div className="my-[60px] space-y-[40px]">
        <div className="">
          <p className="mb-[20px]">Uploaded Images</p>
          <div className="flex lg:gap-[16px] gap-[11px]">
            {files?.map((file, index) => (
              <div
                key={index}
                className="xl:w-[223px] xl:h-[223px] lg:w-[170px] lg:h-[170px] w-[104px] h-[104px] relative"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded ${index}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-[12px]">
          <h3 className="text-[18px] font-[500]">
            What you’re envisioning or why this inspiration is meaningful to you
          </h3>
          <p className="text-[16px] font-[400]">{description}</p>
        </div>

        <div className="space-x-[14px] flex items-start gap-[37px]">
          {diamondShapeIcon && (
            <img src={diamondShapeIcon} alt={diamondShapeLabel} />
          )}
          <div className="space-y-[12px]">
            <div className="grid grid-cols-2">
              <h3 className="text-[18px] font-[500] text-[var(--grey-2)]">
                Shape :
              </h3>
              <p className="text-[18px] font-[400] text-[var(--teal-1)]">
                {diamondShapeLabel || "Not selected"}
              </p>
            </div>{" "}
            <div className="grid grid-cols-2">
              <h3 className="text-[18px] font-[500] text-[var(--grey-2)]">
                Carat :
              </h3>
              <p className="text-[18px] font-[400] text-[var(--teal-1)]">
                {diamondWeight ? `${diamondWeight}` : "Not selected"}
              </p>
            </div>{" "}
            <div className="grid grid-cols-2">
              <h3 className="text-[18px] font-[500] text-[var(--grey-2)]">
                Color :
              </h3>
              <p className="text-[18px] font-[400] text-[var(--teal-1)]">
                {formatRange(colorRange)}
              </p>
            </div>{" "}
            <div className="grid grid-cols-2">
              <h3 className="text-[18px] font-[500] text-[var(--grey-2)]">
                Clarity :
              </h3>
              <p className="text-[18px] font-[400] text-[var(--teal-1)]">
                {formatRange(clarityRange)}
              </p>
            </div>{" "}
            <div className="grid grid-cols-2">
              <h3 className="text-[18px] font-[500] text-[var(--grey-2)]">
                Cut :
              </h3>
              <p className="text-[18px] font-[400] text-[var(--teal-1)]">
                {formatRange(cutRange)}
              </p>
            </div>
            <div className="grid grid-cols-2">
              <h3 className="text-[18px] font-[500] text-[var(--grey-2)]">
                Metal :
              </h3>
              <p className="text-[18px] font-[400] text-[var(--teal-1)]">
                {metal
                  ? `${metal.karat?.value || metal.karat || ""} ${
                      (metal.color?.name || metal.color || "") + " Gold"
                    }`.trim() || "Not selected"
                  : "Not selected"}
              </p>
            </div>
            <div className="grid grid-cols-2">
              <h3 className="text-[18px] font-[500] text-[var(--grey-2)]">
                Ring Size :
              </h3>
              <p className="text-[18px] font-[400] text-[var(--teal-1)]">
                {ringSize}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-[12px]">
          <h3 className="text-[18px] font-[500]">
            Anything Else We Should Know?
          </h3>
          <textarea
            placeholder="Enter text..."
            className="bg-white p-[20px_11px] w-full focus:outline-[var(--teal-1)] focus:outline-1"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default StepThree;
