import React from "react";
import Typography from "../Typography/Typography";

const Heading = ({ title, description, isCenter, className, level }) => {
  const HeadingTag = level === 1 ? "h1" : level === 3 ? "h3" : "h2";

  return (
    <div className={`${isCenter ? "text-center" : "text-left"} ${className}`}>
      <Typography
        variant="h2"
        as={HeadingTag}
        className="mb-[11px] capitalize"
      >
        {title}
      </Typography>
      <p className="xl:text-[16px] text-[12px] font-[400] text-[var(--grey-2)]">{description}</p>
    </div>
  );
};

export default Heading;
