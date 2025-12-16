import PageHeading from "@/components/ui/Heading/PageHeading";
import Typography from "@/components/ui/Typography/Typography";
import React from "react";

const LifetimeWarranty = () => {
  return (
    <section>
      <PageHeading title={"Life Time Warranty"} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Typography variant="h5">
          Elova offers a lifetime warranty on all fine jewelry, covering
          manufacturing defects and craftsmanship issues.
        </Typography>

        <Typography variant="h4">
          <b>Warranty Includes :</b>
        </Typography>
        <Typography variant="h5">
          <li>Prong tightening and polish</li>
          <li>Stone inspection</li>
          <li>Clasp and chain repair</li>
          <li>Resizing and adjustments</li>
        </Typography>

        <Typography variant="h5">
          We also provide complimentary annual cleanings. Our pieces are made to
          last—and so is our promise to you.
        </Typography>
      </div>
    </section>
  );
};

export default LifetimeWarranty;
