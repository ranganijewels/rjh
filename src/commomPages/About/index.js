"use client";
import FeaturesList from "@/components/common/FeaturesList/FeaturesList";
import HeroSection from "@/components/common/HeroSection";
import TwoColGrid from "@/components/common/TwoColGrid";
import React, { useEffect, useState } from "react";
import Heading from "@/components/ui/Heading/Heading";
import Newsletter from "../Home/Newsletter";
import JewelryCTA from "@/components/common/JewelryCTA";
import { useCrudApi } from "@/hooks/useCrudApi";
import { usePageHero } from "@/hooks/usePageHero";
import StoryBlocks, { Testimonials } from "../StoryPages/blocks";
import { OUR_STORY } from "../StoryPages/content";
import { useHashScroll } from "@/hooks/useHashScroll";

const About = () => {
  const [aboutData, setAboutData] = useState([]);
  const { fetchAll } = useCrudApi(`/api/about`);
  // Hero comes from the same CMS "Banners & Hero → About Us" tab as every other
  // page (most-recent hero-banner). Falls back to the /api/about default.
  const hero = usePageHero("about-us");
  const aboutHero = aboutData?.hero_section?.[0];
  // Deep-link support for the "About us → Our Story" nav items (/about-us#id).
  useHashScroll(aboutData);

  useEffect(() => {
    fetchAll()
      .then((res) => setAboutData(res.data || []))
      .catch((err) => console.error("Error fetching about Page", err));
  }, [fetchAll]);

  return (
    <div className="xl:space-y-[80px] space-y-[40px]">
      <HeroSection
        backgroundUrl={hero?.file || aboutHero?.file}
        mobileFile={hero?.mobileFile}
        title={hero?.title || aboutHero?.title}
        description={hero?.description || aboutHero?.subtitle}
        imageClass="!h-[475px]"
        containerClass="!h-[475px]"
        buttons={hero?.buttons?.length ? hero.buttons : aboutHero?.buttons}
      />

      {/* Our Story — the four anchored sub-sections linked from the
          "About us → Our Story" nav group (/about-us#our-story, etc.):
          image split → stats band → values band → pull-quote → split. */}
      <StoryBlocks blocks={OUR_STORY.blocks} />

      {(aboutData?.explore || []).map((items, index) => (
        <TwoColGrid
          key={index}
          title={items?.title}
          description={items?.description}
          file={items?.file}
          quotes={items?.quote}
          isReverse={index % 2 !== 0}
        />
      ))}
      <div>
        {aboutData?.service_section?.length > 0 && (
          <>
            <Heading
              className="lg:px-[30px] px-[18px] container mx-auto"
              title={aboutData?.service_section[0]?.headtitle}
              description={aboutData?.service_section[0]?.description}
              isCenter
            />
            <FeaturesList
              items={aboutData?.service_section[0]?.service_items}
              isGrid
              desktopCols={3}
              mobileCols={2}
              containerClass="xl:p-[40] pt-[30px]"
            />
          </>
        )}
      </div>

      {/* Testimonials — CMS-titled (About Page editor), review cards from the
          live homepage testimonial_section.reviews. Replaces the legacy
          CustomerReview carousel, which mapped a `testimonialitems` key the
          API no longer sends and therefore rendered an empty strip. */}
      <Testimonials
        eyebrow="In Their Words"
        title={aboutData?.testimonial_section?.[1]?.title || "Loved by Our Customers"}
        intro={aboutData?.testimonial_section?.[1]?.description || ""}
      />

      {aboutData?.banner_section?.[0] && (
        <JewelryCTA
          backgroundUrl={aboutData?.banner_section[0]?.bg_file}
          title={aboutData?.banner_section[0]?.title}
          description={aboutData?.banner_section[0]?.description}
          backgroundIsVideo
          blockWidth={"xl:!w-[840px] lg:!w-[446px] !w-[351px]"}
          buttons={aboutData?.banner_section?.[0]?.buttons}
        />
      )}
      <Newsletter />
    </div>
  );
};

export default About;
