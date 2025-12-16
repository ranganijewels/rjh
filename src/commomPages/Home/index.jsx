"use client";
import React, { useEffect, useState } from "react";
import HeroSection from "@/components/common/HeroSection";
import FeaturedCollections from "@/components/common/FeaturedCollections";
import FeaturesList from "@/components/common/FeaturesList/FeaturesList";
import WhyChoose from "./WhyChoose";
import JewelryCTA from "@/components/common/JewelryCTA";
import LovedByElova from "./LovedByElova";
import Newsletter from "./Newsletter";
import SignUpPopUp from "@/components/ui/PopUp/SignUpPopUp";
import FindYourDiomond from "../Customize/FindYourDiomond";
import { useHomepageData } from "./useHomepageData";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";
import Collection from "../Collection";

const HomepageLayout = () => {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const { homeData } = useHomepageData();

  // /** Handle Signup Popup */
  useEffect(() => {
    const alreadyClosed = localStorage.getItem("signUpPopupClosed");
    if (alreadyClosed) return;

    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowPopup(true);
        localStorage.setItem("signUpPopupClosed", "true");
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="xl:space-y-[80px] space-y-[40px] relative">
      {/* === Scroll Triggered SignUp Popup === */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center px-4 h-screen">
          <div className="max-w-full sm:max-w-[90%] md:max-w-[812px]">
            <SignUpPopUp onClose={() => setShowPopup(false)} />
          </div>
        </div>
      )}

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className}" style="background-color: #2F6F7A"></span>`;
          },
        }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="w-full"
      >
        {homeData?.hero_section?.map((item, index) => (
          <SwiperSlide key={index}>
            <HeroSection
              title={item?.title}
              description={item?.subtitle}
              backgroundUrl={item?.file}
              backgroundIsVideo
              containerClass="xl:h-[601px]"
              imageClass="xl:h-[601px]"
              textClass="xl:text-[46px]"
              buttons={item.buttons}
              mobileFile={item.mobile_file}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Featured Collections */}
      <FeaturedCollections
        collections={homeData?.collection_section?.[0]?.items.slice(0, 4) ?? []}
        title={homeData?.collection_section?.[0]?.section_title}
        imageStyle="2xl:h-[595px] xl:h-[450px] lg:h-[308px] !w-full h-[224px]"
        onClick={(product) => {
          router.push(`/product?category_id=${product.category_id}`);
        }}
        isGrid
      />

      {/* Diamond Finder */}
      <FindYourDiomond
        title="Personalized Shopping Experience"
        description="Your dream diamond awaits—whether it’s hidden in our exclusive vault or waiting to be crafted just for you. Let’s create something extraordinary together. Contact us today!"
        shapes={
          Array.isArray(homeData?.diamond_icon_shape)
            ? homeData?.diamond_icon_shape[0]?.shapes
            : []
        }
        buttons={homeData?.diamond_icon_shape?.[0]?.buttons}
      />

      {/* Why Choose */}
      <WhyChoose
        collections={
          Array.isArray(homeData?.why_choose_section)
            ? homeData?.why_choose_section[0]
            : null
        }
      />

      {/* Features Icons */}
      <FeaturesList
        items={homeData?.service_section?.[0] ?? null}
        isGrid
        desktopCols={4}
        mobileCols={2}
        hideTitle
      />

      {/* Best Sellers */}
      <Collection
        collectionName="best seller"
        apiPath="/api/product/get-collection"
        title="Best Sellers"
      />
      {/* <CustomerReview reviewdata={homeData?.testimonial_section?.[0] ?? null} /> */}

      {/* Jewelry CTA */}
      <JewelryCTA
        backgroundUrl={homeData?.banner_section?.[0]?.bg_file}
        title={homeData?.banner_section?.[0]?.title}
        description={homeData?.banner_section?.[0]?.description}
        textwhite
        primaryBtnVariant
        titleStyle="2xl:text-[90px]"
        buttons={homeData?.banner_section?.[0]?.buttons}
      />

      <LovedByElova items={homeData?.loved_by_section?.[1] ?? null} />
      <Newsletter />
    </div>
  );
};

export default HomepageLayout;
