import PageHeading from "@/components/ui/Heading/PageHeading";
import Typography from "@/components/ui/Typography/Typography";
import React from "react";

const Shipping = () => {
  return (
    <section>
      <PageHeading title={"Shipping"} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Typography variant="h5">
          We offer free, insured, and trackable shipping worldwide. Your Elova
          piece is packaged with care and designed to make a lasting first
          impression.
        </Typography>
        <Typography variant="h4">
          <b>Shipping Details :</b>
        </Typography>
        <Typography variant="h5">
          <li>Free express shipping on all orders</li>
          <li>Fully insured during transit</li>
          <li>Signature required for delivery</li>
          <li>Luxury packaging and unboxing experience included</li>
        </Typography>

        <Typography variant="h5">
          Once shipped, we’ll send you tracking information and delivery updates
          in real-time. Your journey to brilliance begins with confidence.
        </Typography>
      </div>
    </section>
  );
};

export default Shipping;
