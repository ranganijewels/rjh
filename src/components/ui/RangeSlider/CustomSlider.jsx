"use client";

import React, { useState, useRef, useEffect } from "react";

const CustomSlider = ({
  value = [],
  from,
  to,
  hasSteps = true,
  onChange,
  formatter = (val) => val,
}) => {
  const [minIndex, setMinIndex] = useState(value.indexOf(from));
  const [maxIndex, setMaxIndex] = useState(value.indexOf(to));

  const trackRef = useRef(null);

  const total = value.length - 1;

  const handlePosition = (index) => `${(index / total) * 100}%`;

  const handleDrag = (e, type) => {
    const track = trackRef.current;
    const rect = track.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    const nearestIndex = Math.round((percent / 100) * total);

    if (type === "min" && nearestIndex < maxIndex) {
      setMinIndex(nearestIndex);
      onChange?.([value[nearestIndex], value[maxIndex]]);
    }

    if (type === "max" && nearestIndex > minIndex) {
      setMaxIndex(nearestIndex);
      onChange?.([value[minIndex], value[nearestIndex]]);
    }
  };

  return (
    <div className="px-4 py-8 w-full relative">
      {/* Marks */}
      <div className="flex justify-between mb-3">
        {value.map((val, idx) => (
          <span key={val} className="text-sm text-center w-4">
            {formatter(val)}
          </span>
        ))}
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-1 bg-[var(--grey-1)] rounded"
      >
        {/* Active Track */}
        <div
          className="absolute h-1 bg-[var(--teal-1)]"
          style={{
            left: handlePosition(minIndex),
            width: `calc(${handlePosition(maxIndex)} - ${handlePosition(minIndex)})`,
          }}
        />

        {/* Handles */}
        <div
          className="absolute w-4 h-4 rounded-full bg-[var(--teal-1)] cursor-pointer -top-1.5"
          style={{ left: handlePosition(minIndex) }}
          onMouseDown={(e) => {
            const move = (ev) => handleDrag(ev, "min");
            const up = () => window.removeEventListener("mousemove", move);
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up, { once: true });
          }}
        />
        <div
          className="absolute w-4 h-4 rounded-full bg-[var(--teal-1)] cursor-pointer -top-1.5"
          style={{ left: handlePosition(maxIndex) }}
          onMouseDown={(e) => {
            const move = (ev) => handleDrag(ev, "max");
            const up = () => window.removeEventListener("mousemove", move);
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up, { once: true });
          }}
        />
      </div>
    </div>
  );
};

export default CustomSlider;
