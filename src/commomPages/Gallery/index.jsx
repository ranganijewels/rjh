"use client";
import HeroSection from "@/components/common/HeroSection";
import React from "react";
import { LOVED_BY_HEARTS } from "../Customize/constant";
import { useCustomizeData } from "../Customize/useCustomizeData";
import GalleryGrid from "./GalleryGrid";
import { usePageHero } from "@/hooks/usePageHero";

const Gallery = () => {
  // Custom creations are managed in one place (CMS → Customize Page → Gallery).
  // The dedicated gallery shows the full set; fall back to the seed if empty.
  const { customizeData } = useCustomizeData();
  const hero = usePageHero("gallery");
  const items =
    customizeData?.cms_page?.custom_creation?.length > 0
      ? customizeData.cms_page.custom_creation
      : LOVED_BY_HEARTS.map((g) => ({ image: g.imageUrl, title: g.title }));

  return (
    <section>
      <HeroSection
        title={hero?.title || " Your Stories. Our Craft."}
        description={hero?.description || " A curated showcase of one-of-a-kind pieces created by our customers — each with its own meaning and magic."}
        leftBtnText="Start Your Custom Journey"
        backgroundUrl={hero?.file || "/videos/gallery.webm"}
        mobileFile={hero?.mobileFile}
        buttons={hero?.buttons?.length ? hero.buttons : undefined}
        btnContainerclass="md:flex-row flex-col"
        backgroundIsVideo
        containerClass="!h-[475px]"
        imageClass="!h-[475px]"
      />
      <div className="xl:pt-[100px] lg:pt-[80px] pt-[40px]">
        <GalleryGrid items={items} />
      </div>
    </section>
  );
};

export default Gallery;
