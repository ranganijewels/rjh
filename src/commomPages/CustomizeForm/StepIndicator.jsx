"use client";
import React, { useState, useEffect, useRef } from "react";

export const StepIndicator = ({ steps, currentStep }) => {
  const stepWrapperRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState("100%");
  const [filledHeight, setFilledHeight] = useState("0%");

  useEffect(() => {
    if (stepWrapperRef.current) {
      const totalHeight = stepWrapperRef.current.offsetHeight;
      const stepHeight = totalHeight / (steps.length - 1);
      setContainerHeight(`${totalHeight}px`);
      setFilledHeight(`${stepHeight * currentStep}px`);
    }
  }, [steps, currentStep]);

  return (
    <div className="relative xl:w-[20%] md:w-full">
      {/* Desktop: Vertical Layout */}
      <div className="hidden xl:flex flex-col sticky top-[130px]">
        {/* Full gray vertical line */}
        <div
          className="absolute left-2 top-0 w-[4px] bg-gray-300 rounded-full"
          style={{ height: containerHeight }}
        />

        {/* Dynamic teal filled line */}
        <div
          className="absolute left-2 top-0 w-[4px] bg-[var(--teal-1)] transition-all duration-500 rounded-full"
          style={{ height: filledHeight }}
        />

        {/* Step Labels */}
        <div ref={stepWrapperRef} className="flex flex-col gap-[100px] pl-6">
          {steps.map((label, index) => (
            <div key={index}>
              <div
                className={`text-sm shrink-0 ${
                  index === currentStep
                    ? "font-semibold text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Tablet and Mobile: Horizontal Layout */}
      <div className="xl:hidden flex flex-col w-full">
        {/* Step Label */}
        <div className="lg:hidden  font-semibold text-[var(--grey-2)] text-sm mb-2">
          {steps[currentStep]}
        </div>

        {/* Progress Bar */}
        <div className="relative h-1 bg-gray-300 rounded-full w-full mb-[20px]">
          <div
            className="absolute left-0 top-0 h-1 bg-[var(--teal-1)] transition-all duration-500 rounded-full"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Step Labels */}
        <div className="hidden lg:flex justify-between text-sm">
          {steps.map((label, index) => (
            <div
              key={index}
              className={`text-center shrink-0 ${
                index === currentStep
                  ? "font-semibold text-[var(--grey-2)]"
                  : "text-[var(--placeholder)]"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
     
    </div>
  );
};