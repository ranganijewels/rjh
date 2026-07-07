import React from "react";
import Typography from "../Typography/Typography";
import { toTitleCase } from "@/utils/string";

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
