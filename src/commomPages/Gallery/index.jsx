import HeroSection from "@/components/common/HeroSection";
import ImageWithContent from "@/components/common/ImageWithContent";
import React from "react";
import { LOVED_BY_HEARTS } from "../Customize/constant";

const Gallery = () => {
  return (
    <section>
      <HeroSection
        title=" Your Stories. Our Craft."
        description=" A curated showcase of one-of-a-kind pieces created by our customers — each with its own meaning and magic."
        leftBtnText="Start Your Custom Journey"
        backgroundUrl="/videos/gallery.webm"
        btnContainerclass="md:flex-row flex-col"
        backgroundIsVideo
          containerClass="xl:h-[601px]"
        imageClass="xl:h-[601px]"
      />
      <div className="xl:pt-[100px] lg:pt-[80px] pt-[40px]">
        <ImageWithContent data={LOVED_BY_HEARTS} />
      </div>
    </section>
  );
};

export default Gallery;
