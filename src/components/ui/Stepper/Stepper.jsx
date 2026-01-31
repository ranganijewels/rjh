import React from "react";
import Typography from "../Typography/Typography";

const Stepper = ({ steps, currentPath }) => {
  return (
    <div className="flex md:justify-center justify-start gap-[32px] mb-8 overflow-x-auto hide-scrollbar no-scrollbar scroll-smooth">
      {steps.map((step, index) => {
        const isActive = index == currentPath;

        return (
          <div
            key={step.title}
            className={`flex gap-[17px] items-center xl:pb-[26px] pb-[16px] ${
              isActive && "border-b-2 border-b-[var(--teal-1)]"
            }`}
          >
            <div
              className={`px-4 py-2 ${
                isActive ? "bg-[var(--teal-1)]" : "bg-[var(--placeholder)]"
              } rounded-[40px]`}
            >
              <div className="text-center text-[var(--grey-00)] text-base font-semibold">
                {index + 1}
              </div>
            </div>

            <Typography
              variant="h5"
              className={`${
                isActive ? "text-[var(--teal-1)]" : "text-[var(--placeholder)]"
              } font-[500]`}
            >
              {step.title}
            </Typography>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
