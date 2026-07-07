import PageHeading from "@/components/ui/Heading/PageHeading";
import Typography from "@/components/ui/Typography/Typography";
import React from "react";

const ChooseYourMetal = () => {
  return (
    <section>
      <PageHeading title={"Choose Your Metal"} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Typography variant="h5">
          The foundation of every RJ House piece begins with a thoughtful
          decision—your metal. Whether you seek warm hues, enduring durability,
          or cool sophistication, our metals are chosen for their purity,
          beauty, and ethical origins.
        </Typography>
        <Typography variant="h4">Explore Our Metal Palette:</Typography>
        <Typography variant="h5">
          <b>14K/18K Yellow Gold</b> The most timeless of choices, yellow gold
          adds a rich, classic glow. Its natural color flatters most skin tones
          and ages beautifully over time.
        </Typography>

        <Typography variant="h5">
          We also provide a printable Ring Size Guide and a complimentary sizer
          upon request to help you get the most accurate measurement. Still
          unsure? Our jewelry consultants are available for virtual sizing
          support. With RJ House, comfort and beauty go hand in hand.
        </Typography>
      </div>
    </section>
  );
};

export default ChooseYourMetal;
