"use client";
import HeroSection from "@/components/common/HeroSection";
import React, { useEffect, useState } from "react";
import { useCustomizeData } from "../Customize/useCustomizeData";
import GalleryGrid from "./GalleryGrid";
import { usePageHero } from "@/hooks/usePageHero";

const Gallery = () => {
  // Client projects come from CMS → Customize Page → Gallery and are only
  // returned once marked as real + permitted. Until there are any, the gallery
  // shows photography of pieces from the live catalogue.
  const { customizeData } = useCustomizeData();
  const hero = usePageHero("gallery");
  const creations = customizeData?.cms_page?.custom_creation || [];
  const [catalogue, setCatalogue] = useState([]);

  useEffect(() => {
    if (creations.length) return;
    let cancelled = false;
    fetch("/api/product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ limit: 20, page: 1, sort_by: "new_arrival" }),
    })
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        const rows = j?.data?.products || j?.data || [];
        setCatalogue(
          (Array.isArray(rows) ? rows : [])
            .filter((p) => p?.product_image)
            .map((p) => ({ image: p.product_image, title: p.product_name || p.title || "" }))
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [creations.length]);

  const items = creations.length ? creations : catalogue;

  return (
    <section>
      <HeroSection
        title={hero?.title || "See Rangani in the Details"}
        description={hero?.description || "A closer look at lab-grown diamond jewellery from our collection."}
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
