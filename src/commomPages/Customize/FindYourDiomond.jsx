import Button from "@/components/ui/Button/Button";
import Heading from "@/components/ui/Heading/Heading";
import Typography from "@/components/ui/Typography/Typography";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";

const FindYourDiomond = ({ title, description, shapes, buttons }) => {
  const router = useRouter();
  return (
    <section>
      <Heading
        title={title}
        description={description}
        isCenter
        className={"xl:mb-[54px] mb-[20px]"}
      />
      <div className="container mx-auto">
        <div className=" flex mx-auto gap-[24px] sm:gap-[32px] xl:gap-[50px] hide-scrollbar overflow-x-auto px-[10px] scroll-smooth xl:mb-[70px] mb-[36px]">
          {Array.isArray(shapes) &&
            shapes.map((shape, idx) => {
              return (
                <div
                  key={idx}
                  className="flex flex-col xl:gap-[10px] gap-[5px] items-center shrink-0"
                >
                  <img
                    src={shape?.icon_image}
                    alt={shape?.icon_title}
                    className={clsx(
                      "xl:w-[106px] xl:h-[106px] w-[54px] h-[54px] cursor-pointer",
                      "transition-transform duration-300 ease-in-out",
                      "hover:scale-120"
                    )}
                    onClick={() => {
                      // router.push(
                      //   `/product?shape=${
                      //     shape?.shape_id
                      //   }&banner=${encodeURIComponent(
                      //     shape?.banner
                      //   )}&title=${encodeURIComponent(
                      //     shape?.title || ""
                      //   )}&description=${encodeURIComponent(
                      //     shape?.description || ""
                      //   )}`
                      // );
                      router.push('/product');
                    }}
                  />
                  <Typography variant="p">{shape?.icon_title}</Typography>
                </div>
              );
            })}
        </div>

        <div className="text-center">
          {buttons?.map((btn, i) => (
            <Button
              key={i}
              variant={
                btn.button_color ? undefined : i === 0 ? "primary" : "outline"
              }
              title={btn.button_text}
              background={btn.button_color}
              border={btn.button_border}
              url={btn.button_url}
              textColor={btn.button_text_color}
              hoverColor={btn.button_hover_color || "var(--teal-1)"}
              className="hover:!text-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FindYourDiomond;
