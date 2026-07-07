"use client";

import React, { useState } from "react";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";

const RangeSlider = ({
  value = [],
  from,
  to,
  hasSteps,
  onChange,
  formatter,
  className,
}) => {
  const [marks] = useState(() => {
    const obj = {};
    value.forEach((val, idx) => {
      obj[idx] = formatter ? formatter(val) : val;
    });
    return obj;
  });

  const min = 0;
  const max = value.length - 1;
  const defaultFrom = from ? value.indexOf(from) : 0;
  const defaultTo = to ? value.indexOf(to) : value.length - 1;

  const handleChange = (val) => {
    const mapped = val.map((i) => value[i]);
    onChange?.(mapped);
  };

  return (
    <div style={{ padding: "30px 10px" }}>
      <Slider
        className={className}
        range
        min={min}
        max={max}
        defaultValue={[defaultFrom, defaultTo]}
        marks={marks}
        step={hasSteps ? 1 : null}
        onChange={handleChange}
        allowCross={false}
        // dotStyle={{ borderColor: 'pink' }}
        activeDotStyle={{ borderColor: "var(--product-bg)" }}
        railStyle={{ backgroundColor: "var(--grey-1)", height: "1px" }}
        trackStyle={[{ backgroundColor: "var(--teal-1)", height: "1px" }]}
        handleStyle={[
          {
            borderColor: "var(--teal-1)",
            backgroundColor: "var(--teal-1)",
            opacity: 1,
          },
          {
            borderColor: "var(--teal-1)",
            backgroundColor: "var(--teal-1)",
            opacity: 1,
          },
        ]}
      />
    </div>
  );
};

export default RangeSlider;
