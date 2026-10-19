"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import { useRouter } from "next/navigation";
import Typography from "@/components/ui/Typography/Typography";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { responsiveImg } from "@/lib/imageSizes";

/**
 * "Discover Styles" coverflow carousel (keyzarjewelry-style): a centered,
 * emphasized ring with smaller flanking styles, arrows, and the active
 * style's name + description below. Fully CMS-driven via the `discover-styles`
 * homepage section.
 */
export default function DiscoverStyles({ heading, subHeading, styles = [] }) {
  const router = useRouter();
  const swiperRef = useRef(null);
  const [active, setActive] = useState(0);

  if (!styles.length) return null;
  const current = styles[active] || {};

  return (
    <section className="text-center overflow-hidden bg-white py-14 lg:py-24">
      {/* Depth fade — active ring full opacity, neighbours dimmer (keyzar-style) */}
      <style>{`
        .discover-styles-swiper .swiper-slide { opacity: .65; transition: opacity .35s ease; }
        .discover-styles-swiper .swiper-slide-next,
        .discover-styles-swiper .swiper-slide-prev { opacity: .7; }
        .discover-styles-swiper .swiper-slide-prev { opacity: .85; }
        .discover-styles-swiper .swiper-slide-active { opacity: 1; }
      `}</style>
      <div className="lg:px-[30px] px-[18px]">
        <Typography
          variant="h2"
          className="uppercase tracking-[0.06em] xl:text-[46px] lg:text-[38px] text-[28px]"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          {heading || "Discover Styles"}
        </Typography>
        {subHeading && (
          <p className="max-w-[520px] mx-auto mt-3 text-[14px] lg:text-[15px] text-[var(--grey-2)] leading-relaxed">
            {subHeading}
          </p>
        )}
      </div>

      <div className="mt-6 lg:mt-10">
        <Swiper
          modules={[EffectCoverflow]}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop={styles.length > 2}
          slideToClickedSlide
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 120,
            modifier: 1,
            scale: 0.72,
            slideShadows: false,
          }}
          breakpoints={{
            0: { slidesPerView: 1.8 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={(s) => setActive(s.realIndex)}
          className="discover-styles-swiper"
        >
          {styles.map((st, i) => (
            <SwiperSlide
              key={i}
              className="!flex items-center justify-center transition-opacity duration-300"
            >
              <button
                type="button"
                aria-label={st.title || `Style ${i + 1}`}
                onClick={() => st.link && router.push(st.link)}
                className="block w-full max-w-[380px] aspect-square outline-none bg-white"
              >
                <img
                  {...responsiveImg(st.imageUrl, "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 56vw")}
                  src={st.imageUrl}
                  alt={st.title || "Ring style"}
                  className="w-full h-full object-contain select-none pointer-events-none"
                  loading="lazy"
                  width={380}
                  height={380}
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Active style: arrows + name + description */}
      <div className="mt-6 lg:mt-10 flex items-center justify-center gap-8">
        <button
          type="button"
          aria-label="Previous style"
          onClick={() => swiperRef.current?.slidePrev()}
          className="w-10 h-10 flex items-center justify-center text-[var(--teal-1)] hover:opacity-60 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--teal-1)] transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h3 className="min-w-[180px] text-[20px] lg:text-[24px] font-[500] text-[var(--teal-1)]">
          {current.title}
        </h3>

        <button
          type="button"
          aria-label="Next style"
          onClick={() => swiperRef.current?.slideNext()}
          className="w-10 h-10 flex items-center justify-center text-[var(--teal-1)] hover:opacity-60 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--teal-1)] transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      {current.description && (
        <p className="mt-3 text-[14px] lg:text-[16px] text-[var(--grey-2)]">
          {current.description}
        </p>
      )}
    </section>
  );
}
