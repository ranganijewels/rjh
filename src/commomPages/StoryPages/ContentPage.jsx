"use client";
import React from "react";
import HeroSection from "@/components/common/HeroSection";
import JewelryCTA from "@/components/common/JewelryCTA";
import Newsletter from "../Home/Newsletter";
import StoryBlocks from "./blocks";
import { useHashScroll } from "@/hooks/useHashScroll";
import { usePageHero } from "@/hooks/usePageHero";

// Shared editorial page for the About-Us submenu groups (Craftsmanship,
// Sustainability, Customer Love): hero (image or video — HeroSection
// auto-detects) → composed story blocks → closing CTA → newsletter.
// The hero is CMS-editable: when a hero is saved in CMS Banners & Hero for
// `slug`, it overrides the authored defaults below (same pipeline as every
// other page hero).
const ContentPage = ({
  slug,
  heroTitle,
  heroSubtitle,
  heroImage = "/images/about-us-banner.png",
  blocks = [],
  cta,
}) => {
  useHashScroll(blocks);
  const cmsHero = usePageHero(slug);

  return (
    <div className="xl:space-y-[88px] space-y-[52px]">
      <HeroSection
        title={cmsHero?.title || heroTitle}
        description={cmsHero?.description || heroSubtitle}
        backgroundUrl={cmsHero?.file || heroImage}
        mobileFile={cmsHero?.mobileFile}
        buttons={cmsHero?.buttons?.length ? cmsHero.buttons : undefined}
        imageClass="!h-[475px]"
        containerClass="!h-[475px]"
      />

      <StoryBlocks blocks={blocks} />

      {cta && (
        <JewelryCTA
          backgroundUrl={cta.image}
          title={cta.title}
          description={cta.description}
          backgroundIsVideo={!!cta.backgroundIsVideo}
          buttons={cta.buttons}
        />
      )}

      <Newsletter />
    </div>
  );
};

export default ContentPage;
