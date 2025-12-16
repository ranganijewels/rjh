import React from "react";

const Heading = ({ title, description, isCenter, className }) => {
  return (
    <div
      className={`text-center ${
        isCenter ? "text-center" : "text-left"
      } ${className}`}
    >
      <h2 className="xl:text-[28px] text-[16px] font-[400] mb-[11px] text-[var(--grey-2)] capitalize">
        {title}
      </h2>
      <p className="xl:text-[16px] text-[12px] font-[400] text-[var(--grey-2)]">{description}</p>
    </div>
  );
};

export default Heading;
