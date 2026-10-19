"use client";
import React, { useEffect, useState } from "react";
import Newsletter from "../Home/Newsletter";
import TwoColGrid from "@/components/common/TwoColGrid";
import Details from "./Details";
import BrandDifference from "./BrandDifference";
import BuildYourOwn from "./BuildYourOwn";
import BuildColumns from "./BuildColumns";
import QuickLinks from "./QuickLinks";
import ExpertContact from "./ExpertContact";
import ReviewsSection from "./ReviewsSection";
import RecentlyViewed from "./RecentlyViewed";
import Collection from "../Collection";
import { useCrudApi } from "@/hooks/useCrudApi";
import { useParams, useSearchParams } from "next/navigation";
import { usePdpContent } from "./usePdpContent";

const ProductDetails = ({ initialDetail = null }) => {
  const params = useParams();
  const productId = params?.productId;
  const pdp = usePdpContent();
  const { fetchById } = useCrudApi("/api/product/category-hero");
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const [heroData, setHeroData] = useState([]);

  useEffect(() => {
    if (!categoryId) return;
    const getHero = async () => {
      try {
        const res = await fetchById(categoryId);
        setHeroData(res.data);
      } catch { /* hero is optional */ }
    };
    getHero();
  }, [categoryId]);

  return (
    <div className="xl:space-y-[80px] space-y-[40px] xl:mt-[50px] mt-[20px]">
      {/* Gallery + sticky buy box */}
      <Details initialDetail={initialDetail} />

      {/* Big "Complete the Look" removed (spec Jul 2026) — replaced by the small
          "Pair It With" cards inside the buy box, below the FAQs. */}

      {/* "The RJ House Difference" — Ecksand-style story + accordion band */}
      <BrandDifference config={pdp?.difference} />

      {/* Quick links (Ecksand: Ring Size Guide / Book / Complimentary Shipping) */}
      <QuickLinks config={pdp?.quick_links} />

      {/* Customer reviews (Ecksand: reviews sit after "The Difference") */}
      {productId && <ReviewsSection productId={productId} />}

      {/* Bespoke CTA (Ecksand: "Build your own Engagement Ring") */}
      <BuildYourOwn content={pdp?.build_your_own} />

      {/* 3-up bespoke editorial (Personalized / Diamonds / Atelier) */}
      <BuildColumns config={pdp?.build_columns} />

      {/* Editorial product-story banners ("Behind the piece") */}
      <div className="md:space-y-[20px] space-y-[10px]">
        {heroData?.banners?.map((banner, index) => {
          const isReverse = index % 2 !== 0;
          return (
            <TwoColGrid
              index={index}
              title={banner?.hero_text}
              description={banner?.hero_description}
              buttonText={banner?.button_text}
              file={banner?.image}
              textCenter
              backgroundColor
              isReverse={isReverse}
              buttons={banner?.buttons}
            />
          );
        })}
      </div>

      {/* Cross-sell recommendations (Ecksand: "You May Also Like") */}
      <Collection
        collectionName="Most Loved"
        title="You Might Also Love"
        apiPath="/api/product/get-collection"
      />

      {/* Expert designers contact (Ecksand: "Get in touch…") */}
      <ExpertContact config={pdp?.expert_contact} />

      {/* Utility strip pinned to the very bottom */}
      <RecentlyViewed currentId={productId} />

      <Newsletter />
    </div>
  );
};

export default ProductDetails;
