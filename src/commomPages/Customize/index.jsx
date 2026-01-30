"use client";
import FeaturedCollections from "@/components/common/FeaturedCollections";
import FeaturesList from "@/components/common/FeaturesList/FeaturesList";
import HeroSection from "@/components/common/HeroSection";
import Heading from "@/components/ui/Heading/Heading";
import React, { useEffect, useState } from "react";
import Questions from "./Questions";
import JewelryCTA from "@/components/common/JewelryCTA";
import ImageWithContent from "@/components/common/ImageWithContent";
import Newsletter from "../Home/Newsletter";
import FindYourDiomond from "./FindYourDiomond";
import { useCrudApi } from "@/hooks/useCrudApi";
import { useHomepageData } from "../Home/useHomepageData";
import { useRouter } from "next/navigation";
import { useCustomizeData } from "./useCustomizeData";

const Customize = () => {
  const router = useRouter();
  // const { fetchAll } = useCrudApi(`/api/customize`);
  const { customizeData } = useCustomizeData();
  const { fetchAll: fetchCategories } = useCrudApi(`/api/product/categories`);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then((categories) => {
        setCategories(categories.data);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [fetchCategories]);

  // useEffect(() => {
  //   const disableRightClick = (e) => {
  //     e.preventDefault();
  //   };

  //   document.addEventListener("contextmenu", disableRightClick);

  //   return () => {
  //     document.removeEventListener("contextmenu", disableRightClick);
  //   };
  // }, []);

  const normalizeString = (str) => str.toLowerCase().replace(/[^a-z]/g, "");

  return (
    <div className="lg:space-y-[80px] space-y-[40px]">
      <HeroSection
        title={customizeData?.cms_page?.hero_section?.[0]?.title}
        description={customizeData?.cms_page?.hero_section?.[0]?.subtitle}
        backgroundUrl={customizeData?.cms_page?.hero_section?.[0].file}
        backgroundIsVideo
        containerClass="xl:h-[601px]"
        imageClass="xl:h-[601px]"
        buttons={customizeData?.cms_page?.hero_section?.[0]?.buttons}
      />

      <FeaturedCollections
        title={customizeData?.cms_page?.collection_section?.[0]?.section_title}
        collections={customizeData?.cms_page?.collection_section?.[0]?.items?.map(
          (item) => ({
            title: item.title,
            file: item.file,
          })
        )}
        imageStyle="w-full  2xl:h-[494px] xl:h-[450px] lg:h-[289px] h-[224px]"
        onClick={(product) => {
          if (!categories.length) return;

          const productNameNormalized = normalizeString(product.title);

          const category = categories.find((c) =>
            productNameNormalized.includes(normalizeString(c.name))
          );

          if (!category) return;

          const sizeSlug = category.slug;
          const categoryId = category.id;

          router.push(
            `/customize/form/reference?category_id=${categoryId}&size=${sizeSlug}`
          );
        }}
      />

      <div>
        <Heading
          isCenter
          title={customizeData?.cms_page?.service_section?.[0]?.headtitle}
          description={
            customizeData?.cms_page?.service_section?.[0]?.description
          }
        />

        <FeaturesList
          isGrid
          items={customizeData?.cms_page?.service_section?.[0]?.service_items?.map(
            (item) => ({
              image: item.image,
              title: item.title,
              service_description: item.service_description,
            })
          )}
          desktopCols={4}
          mobileCols={2}
          containerClass="xl:mt-[40px] lg:mt-[30px] mt-[20px]"
        />
      </div>

      <ImageWithContent
        heading={customizeData?.cms_page?.custom_creation_head?.[0]?.title}
        headingDescription={
          customizeData?.cms_page?.custom_creation_head?.[0]?.description
        }
        data={customizeData?.cms_page?.custom_creation}
        showNavigation
        // data={testimonial}
      />

      {/* <FindYourDiomond
        title="Personalized Shopping Experience"
        description="Your dream diamond awaits—whether it’s hidden in our exclusive vault or waiting to be crafted just for you. Let’s create something extraordinary together. Contact us today!"
        shapes={
          Array.isArray(homeData?.diamond_icon_shape)
            ? homeData?.diamond_icon_shape[0]?.shapes
            : []
        }
        buttons={homeData?.diamond_icon_shape?.[0]?.buttons}
      /> */}
      <JewelryCTA
        // testimonial={testimonial}
        backgroundUrl={customizeData?.cms_page?.banner_section?.[0]?.bg_file}
        title={customizeData?.cms_page?.banner_section?.[0]?.title}
        description={customizeData?.cms_page?.banner_section?.[0]?.description}
        buttons={customizeData?.cms_page?.banner_section?.[0]?.buttons}
      />
      <ImageWithContent
        redirectUrl
        heading={customizeData?.blog_category?.heading}
        headingDescription={customizeData?.blog_category?.description}
        data={customizeData?.blog_category?.blogs || []}
        showNavigation
      />

      <Questions faq={customizeData?.faq_section || []} />

      <Newsletter email={"Enter email address*"} />
    </div>
  );
};

export default Customize;
