import React from "react";
import Typography from "../Typography/Typography";

const toTitleCase = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const PageHeading = ({ title }) => {
  return (
    <div className="bg-[var(--teal-3)] xl:py-[59px] lg:py-[47px] py-[34px]">
      <Typography variant="h2" className="capitalize text-center">
        {toTitleCase(title)}
      </Typography>
    </div>
  );
};

export default PageHeading;
