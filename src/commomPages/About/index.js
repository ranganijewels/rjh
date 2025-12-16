"use client";
import FeaturesList from "@/components/common/FeaturesList/FeaturesList";
import HeroSection from "@/components/common/HeroSection";
import TwoColGrid from "@/components/common/TwoColGrid";
import React, { useEffect, useState } from "react";
import Heading from "@/components/ui/Heading/Heading";
import CustomerReview from "../Home/CustomerReview";
import Newsletter from "../Home/Newsletter";
import JewelryCTA from "@/components/common/JewelryCTA";
import { useCrudApi } from "@/hooks/useCrudApi";
import { useHomepageData } from "../Home/useHomepageData";

const About = () => {
  const [aboutData, setAboutData] = useState([]);
  const { fetchAll } = useCrudApi(`/api/about`);
  const { homeData } = useHomepageData();

  useEffect(() => {
    fetchAll()
      .then((res) => setAboutData(res.data || []))
      .catch((err) => console.error("Error fetching about Page", err));
  }, [fetchAll]);

  useEffect(() => {
    const disableRightClick = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  return (
    <div className="xl:space-y-[80px] space-y-[40px]">
      <HeroSection
        backgroundUrl={aboutData?.hero_section?.[0]?.file}
        title={aboutData?.hero_section?.[0]?.title}
        description={aboutData?.hero_section?.[0]?.subtitle}
        imageClass="!h-[475px]"
        containerClass="!h-[475px]"
        buttons={aboutData?.hero_section?.[0]?.buttons}
      />

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

      <div>
        <Heading
          className={"lg:px-[30px] px-[18px]"}
          title={aboutData?.testimonial_section?.[1]?.title ?? ""}
          description={aboutData?.testimonial_section?.[1]?.description ?? ""}
        />

        <CustomerReview
          reviewdata={homeData?.testimonial_section?.[0] ?? null}
          hideLabel
        />
      </div>

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
