import React from "react";
import Button from "../../components/ui/Button/Button";
import Typography from "@/components/ui/Typography/Typography";
import Heading from "@/components/ui/Heading/Heading";
import { useFileType } from "@/hooks/useFileType";

const WhyChoose = ({ collections }) => {
  const { isVideo } = useFileType(
    collections?.why_choose_left_sections[0]?.file
  );
  return (
    <section>
      <Heading
        title={collections?.title}
        className="xl:mb-[30px] mb-[15px] ml-[30px]"
      />
      <div className="grid lg:grid-cols-2 grid-cols-1">
        {/* VIDEO SECTION */}
        <div className="w-auto">
          {isVideo ? (
            <video
              className="w-[960px] xl:h-[709px] h-[378px] object-cover"
              src={collections?.why_choose_left_sections[0]?.file}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={collections?.why_choose_left_sections[0]?.file}
              alt="img"
              className="w-[960px] xl:h-[709px] h-[378px] object-cover"
            />
          )}
        </div>

        {/* TEXT SECTION */}
        <div
          className="relative bg-cover bg-center bg-no-repeat w-auto xl:h-[709px] h-[378px]"
          style={{
            backgroundImage: `url(${
              collections?.why_choose_right_sections?.[0]?.file || ""
            })`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20" />
          <div className="relative  p-5 xl:p-10 flex flex-col items-start justify-end h-full">
            <h2 className="text-[var(--grey-00)] text-[16px] xl:text-[24px] font-[400] tracking-[0.48px] mb-[10px] xl:mb-[18px]">
              {collections?.why_choose_right_sections?.[0]?.title || ""}
            </h2>
            <Typography
              variant="p"
              textColor="white"
              className="mb-[12px] xl:mb-[24px] !font-[300]"
            >
              {collections?.why_choose_right_sections?.[0]?.description || ""}
            </Typography>
            {collections?.why_choose_right_sections?.[0]?.buttons.map(
              (btn, index) => {
                return (
                  <Button
                    key={index}
                    title={btn?.button_text}
                    background={btn?.button_color}
                    border={btn?.button_border}
                    url={btn?.button_url}
                    // hoverColor={btn.button_hover_color || "var(--teal-1)"}
                    // className="hover:!text-white !hover:border-0"
                  />
                );
              }
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
