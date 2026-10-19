"use client";
import Link from "next/link";
import SocialMediaIcons from "@/components/ui/SocialMediaIcons/SocialMediaIcons";
import useIsMobile from "@/utils/useIsMobile";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import clsx from "clsx";
import { usePreferences } from "@/context/PreferencesContext";
import CountryCurrencyModal from "@/components/ui/Modal/CountryCurrencyModal";
import { useEffect, useState } from "react";
import { useCrudApi } from "@/hooks/useCrudApi";
import { SOCIAL_MEDIA_ICONS } from "@/constants/constant";

const TopBar = () => {
  const { fetchAll } = useCrudApi(`/api/swiper-messages`);
  const [swiperMessages, setSwiperMessages] = useState([]);
  const { isMobile } = useIsMobile();
  const { selectedCountry, handleCountryChange } = usePreferences();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const country = selectedCountry;
  useEffect(() => {
    fetchAll()
      .then((res) => {
        const messages = Array.isArray(res.data)
          ? res.data.map((item) => item.message)
          : [];
        setSwiperMessages(messages);
      })
      .catch((err) => {
        console.error("Error fetching swiper messages:", err);
        setSwiperMessages([]);
      });
  }, [fetchAll]);

  return (
    <>
      <div className="bg-[var(--teal-1)] text-[var(--grey-00)] py-2 px-8 flex text-[12px] font-[500] justify-center w-full">
        {!isMobile && (
          <SocialMediaIcons className="w-[300px]" icons={SOCIAL_MEDIA_ICONS} />
        )}
        {/* min-h reserves the message line before /api/swiper-messages answers,
            so the page below doesn't jump down when the text arrives (CLS). */}
        <div className="text-center lg:flex-1 w-full min-h-[36px]">
          <Swiper
            loop={swiperMessages.length > 1}
            slidesPerView={1}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            modules={[Autoplay]}
            className="w-full max-w-[450px] mx-auto py-4"
          >
            {swiperMessages.map((msg, i) => (
              <SwiperSlide key={i}>{msg}</SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="text-end lg:inline-flex hidden justify-end items-baseline gap-[16px] w-[300px]">
          <Link href={"/book-an-appointment"} className="uppercase shrink-0">
            Book now
          </Link>
          <button
            className="flex items-center gap-2 text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={`https://flagcdn.com/w20/${
                country?.value ? country.value.toLowerCase() : "ca"
              }.png`}
              alt={country?.label}
            />
            <span>{country?.currency}</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div
          className={`fixed inset-0 z-[9999] bg-[var(--teal-3)]/50 flex items-center justify-center`}
        >
          <CountryCurrencyModal
            setIsModalOpen={setIsModalOpen}
            selectedCountry={country}
            handleCountryChange={handleCountryChange}
            isModalOpen={isModalOpen}
          />
        </div>
      )}
    </>
  );
};

export default TopBar;
