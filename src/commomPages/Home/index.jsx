"use client";
import React, { useEffect, useState } from "react";
import HeroSection from "@/components/common/HeroSection";
import FeaturedCollections from "@/components/common/FeaturedCollections";
import FeaturesList from "@/components/common/FeaturesList/FeaturesList";
import WhyChoose from "./WhyChoose";
import DiscoverStyles from "./DiscoverStyles";
import JewelryCTA from "@/components/common/JewelryCTA";
import LovedByRJHouse from "./LovedByRJHouse";
import CustomerReview from "./CustomerReview";
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
    <div className="xl:space-y-20 space-y-10 relative">
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
            return `<span class="${className}" style="background-color: var(--teal-1)"></span>`;
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
              posterUrl={item?.poster}
              backgroundIsVideo
              fullViewport
              textClass="xl:text-[46px]"
              buttons={item.buttons}
              mobileFile={item.mobile_file}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Featured Collections — grid of 4; becomes an arrow-navigable
          carousel automatically when the CMS has more than 4 collections. */}
      <FeaturedCollections
        collections={homeData?.collection_section?.[0]?.items ?? []}
        title={homeData?.collection_section?.[0]?.section_title}
        imageStyle="2xl:h-[595px] xl:h-[450px] lg:h-[308px] !w-full h-[224px]"
        onClick={(product) => {
          router.push(product.link || `/product?category_id=${product.category_id}`);
        }}
        isGrid={(homeData?.collection_section?.[0]?.items?.length ?? 0) <= 4}
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

      {/* Discover Styles — coverflow carousel of ring styles */}
      <DiscoverStyles
        heading={homeData?.discover_styles?.heading}
        subHeading={homeData?.discover_styles?.subHeading}
        styles={homeData?.discover_styles?.styles ?? []}
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
        id="best-seller"
      />
      {/* Customer testimonials — text reviews from CMS (Homepage → Customer Reviews) */}
      {(homeData?.testimonial_section?.[0]?.reviews?.length ?? 0) > 0 && (
        <CustomerReview
          reviewdata={{
            title: homeData?.testimonial_section?.[0]?.section_title || "Loved by Our Customers",
            testimonialitems: (homeData?.testimonial_section?.[0]?.reviews || []).map((r) => ({
              id: r.id,
              author_name: r.name,
              author_position: "",
              review: r.review,
              image: r.image,
            })),
          }}
        />
      )}

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

      <LovedByRJHouse items={homeData?.loved_by_section?.[1] ?? null} />
      <Newsletter />
    </div>
  );
};

export default HomepageLayout;
