"use client";
import React, { useEffect, useState } from "react";
import Newsletter from "../Home/Newsletter";
import TwoColGrid from "@/components/common/TwoColGrid";
import Details from "./Details";
import Collection from "../Collection";
import { useCrudApi } from "@/hooks/useCrudApi";
import { useParams, useSearchParams } from "next/navigation";

const ProductDetails = () => {
  const params = useParams();
  const productId = params?.productId;
  const { fetchById } = useCrudApi("/api/product/category-hero");
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const [heroData, setHeroData] = useState([]);

  useEffect(() => {
    const getHero = async () => {
      const res = await fetchById(categoryId);
      setHeroData(res.data);
    };
    getHero();
  }, [categoryId]);

  return (
    <div className="xl:space-y-[80px] space-y-[40px] xl:mt-[50px] mt-[20px]">
      <Details  />

      <Collection
        title="Complete the Look"
        apiPath="/api/product/complete-the-look"
        itemId={productId}
      />

      <div className="md:space-y-[20px] space-y-[10px]">
        {heroData?.banners?.map((banner, index) => {
          const isReverse = index % 2 !== 0;
          return (
            <TwoColGrid
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

      {/* <YouMightAlsoLove /> */}
      <Collection
        collectionName="Most Loved"
        title="You Might Also Love"
        apiPath="/api/product/get-collection"
      />
      <Newsletter />
    </div>
  );
};

export default ProductDetails;
