import HeroSection from "@/components/common/HeroSection";
import TwoColGrid from "@/components/common/TwoColGrid";
import React from "react";

const Reviews = () => {
  return (
    <section>
      <HeroSection
        backgroundUrl="images/review/review-bg.png"
        title="Your Stories. Our Craft."
        description=" A curated showcase of one-of-a-kind pieces created by our customers — each with its own meaning and magic."
        imageClass="!h-[475px]"
        containerClass="!h-[475px]"
        leftBtnText={"Start Your Custom Journey"}
      />
      <div className="xl:pt-[100px] lg:pt-[80px] pt-[40px] space-y-[10px] lg:space-x-[30px] space-x-[18px]">
        <TwoColGrid
          title="Samantha Lake"
          designation="Chief Innovation Officer"
          imageUrl="/images/review/review-1.png"
          reviewText={
            "I recently bought a breathtaking diamond ring from ELOVA, and I'm absolutely thrilled! The craftsmanship is outstanding, and it shines brilliantly in the light."
          }
        />

        <TwoColGrid
          title="Samantha Lake"
          designation="Chief Innovation Officer"
          imageUrl="/images/review/review-2.png"
          reviewText={
            "I recently bought a breathtaking diamond ring from ELOVA, and I'm absolutely thrilled! The craftsmanship is outstanding, and it shines brilliantly in the light."
          }
          isReverse
        />

        <TwoColGrid
          title="Samantha Lake"
          designation="Chief Innovation Officer"
          imageUrl="/images/review/review-3.png"
          reviewText={
            "I recently bought a breathtaking diamond ring from ELOVA, and I'm absolutely thrilled! The craftsmanship is outstanding, and it shines brilliantly in the light."
          }
        />
      </div>
    </section>
  );
};

export default Reviews;
