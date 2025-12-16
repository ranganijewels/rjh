"use client";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import Typography from "@/components/ui/Typography/Typography";
import { toTitleCase } from "@/utils/string";
import Link from "next/link";
import React from "react";

const RingSizeSelector = ({
  label,
  ringSizeOptions = [],
  selectedValue,
  onChange,
  notShowGuide = false,
  labelStyle = "",
  buttonStyle = "",
  fullWidth = false,
  containerStyle = "",
  productInfo,
}) => {
  const displayValue = selectedValue || "";

  return (
    <div className={`space-y-4 ${containerStyle}`}>
      <Typography
        variant="h6"
        className={`font-[500] ${labelStyle} capitalize`}
      >
        {toTitleCase(`${label} size :`)}
        {displayValue && (
          <span className="font-[400] text-[var(--teal-1)] ml-1">
            {displayValue}
          </span>
        )}
      </Typography>

      <div className="flex flex-col gap-2 items-start">
        <Dropdown
          options={ringSizeOptions}
          placeholder={toTitleCase(`Select ${label} Size`)}
          value={selectedValue}
          onChange={onChange}
          buttonStyle={buttonStyle}
          fullWidth={fullWidth}
        />

        {!notShowGuide && (
          <Link
            href="/ring-size-guide"
            className="text-[12px] font-[400] underline tracking-wide capitalize"
          >
            {toTitleCase(`${label} Size Guide`)}
          </Link>
        )}
      </div>
    </div>
  );
};

export default RingSizeSelector;
