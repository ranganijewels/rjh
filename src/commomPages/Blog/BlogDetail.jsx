import ImageWithContent from "@/components/common/ImageWithContent";
import { CalenderIcon, UserIcon } from "@/components/Icons/common";
import Typography from "@/components/ui/Typography/Typography";
import React from "react";
import { DESIGN_WITH_CONFIDENCE } from "../Customize/constant";

const BlogDetail = () => {
  return (
    <section className="space-y-[40px] container mx-auto xl:px-[160px] lg:px-[50px] px-[18px] pt-[100px]">
      <div className="space-y-[24px]">
        <h2 className="xl:text-[54px] lg:text-[32px] text-[28px] font-[500]">
          Why Lab-Grown Diamonds Are the Future of Sustainable Luxury
        </h2>
        <div className="flex gap-[48px]">
          <div className="flex gap-[11px]">
            <UserIcon />
            <Typography variant="h5" textColor="placeholder">
              Henrik Annemark
            </Typography>
          </div>

          <div className="flex gap-[11px]">
            <CalenderIcon />
            <Typography variant="h5" textColor="placeholder">
              October 16, 2023
            </Typography>
          </div>
        </div>
      </div>

      <img src="/images/blog/blog-1.png" alt="blog" className="w-full" />
      <div>
        <Typography variant="h5">
          In a world where conscious choices matter more than ever, lab-grown
          diamonds are changing the face of luxury. At Niora, we believe that
          elegance should be ethical, and brilliance should be born from
          innovation. Our lab-grown diamonds are not just a trend — they are the
          future of fine jewelry. 
        </Typography>

        <h2 className="xl:text-[28px] lg:text-[24px] text-[16px] font-[500]">
          What Are Lab-Grown Diamonds? 
        </h2>
        <Typography variant="h5">
          Lab-grown diamonds are real diamonds created in controlled laboratory
          environments that replicate the natural conditions under which
          diamonds form. They have the same physical, chemical, and optical
          properties as mined diamonds but come without the environmental or
          ethical cost. 
        </Typography>
      </div>

      <div className="flex lg:flex-row flex-col gap-[24px]">
        <img src="/images/blog/blog-2.png" alt="blog" className="xl:w-full lg:w-[450px] h-[558px] object-cover" />

        <img src="/images/blog/blog-3.png" alt="blog" className="xl:w-full lg:w-[450px] h-[558px] object-cover" />
      </div>

      <div>
        <h2 className="xl:text-[28px] lg:text-[24px] text-[16px] font-[500]">
          Why Lab-Grown Diamonds Are Better for the Planet?
        </h2>
        <Typography variant="h5">
          Unlike traditional mining, which can be destructive to ecosystems and
          exploitative to workers, lab-grown diamonds offer a cleaner,
          conflict-free alternative. They use significantly less water and
          energy, reduce carbon emissions, and eliminate harmful mining
          practices. 
        </Typography>
        <h2 className="xl:text-[28px] lg:text-[24px] text-[16px] font-[500]">
          Elova’s Promise: Sustainable, Stunning, and Transparent
        </h2>
        <Typography variant="h5">
          At Elova, our mission is to craft meaningful luxury with intention. We
          use only certified lab-grown diamonds, ensuring every gem is: 
          <ul>
            <li>Ethically Sourced</li>
            <li>Eco-Friendly</li>
          </ul>
        </Typography>
      </div>

      <div className="flex gap-[24px] lg:flex-row flex-col">
        <img src="/images/blog/blog-4.png" alt="blog" className="w-full" />
        <div>
          <div>
            <h2 className="xl:text-[28px] lg:text-[24px] text-[16px] font-[500]">
              Why Lab-Grown Diamonds Are Better for the Planet?
            </h2>
            <Typography variant="h5">
              Unlike traditional mining, which can be destructive to ecosystems
              and exploitative to workers, lab-grown diamonds offer a cleaner,
              conflict-free alternative. They use significantly less water and
              energy, reduce carbon emissions, and eliminate harmful mining
              practices. 
            </Typography>
          </div>
          <div>
            <h2 className="xl:text-[28px] lg:text-[24px] text-[16px] font-[500]">
              Why Lab-Grown Diamonds Are Better for the Planet?
            </h2>
            <Typography variant="h5">
              Unlike traditional mining, which can be destructive to ecosystems
              and exploitative to workers, lab-grown diamonds offer a cleaner,
              conflict-free alternative. They use significantly less water and
              energy, reduce carbon emissions, and eliminate harmful mining
              practices. 
            </Typography>
          </div>
          <div>
            <h2 className="xl:text-[28px] lg:text-[24px] text-[16px] font-[500]">
              Why Lab-Grown Diamonds Are Better for the Planet?
            </h2>
            <Typography variant="h5">
              Unlike traditional mining, which can be destructive to ecosystems
              and exploitative to workers, lab-grown diamonds offer a cleaner,
              conflict-free alternative. They use significantly less water and
              energy, reduce carbon emissions, and eliminate harmful mining
              practices. 
            </Typography>
          </div>
        </div>
      </div>

      <div className="lg:py-[100px] py-[40px]">
        <div className="flex justify-between flex-row mb-[48px]">
          <div className="xl:text-[28px] lg:text-[24px] text-[20px] font-[500]">
            You might also like
          </div>
          <Typography
            variant="h5"
            className="font-[500] underline lg:flex items-center hidden"
          >
            More Articles{" "}
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
              >
                <path
                  d="M4.6665 10.9219H16.3332"
                  stroke="#121212"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.3335 15.9219L16.3335 10.9219"
                  stroke="#121212"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.3335 5.92188L16.3335 10.9219"
                  stroke="#121212"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Typography>
        </div>

        <div>
          <ImageWithContent
            data={DESIGN_WITH_CONFIDENCE.slice(0, 3)}
            containerClass={"container lg:!grid-cols-3 !grid-cols-1 mx-auto"}
            sectionClass="!px-0"
          />
        </div>
        <Typography
          variant="h5"
          className="font-[500] underline lg:hidden justify-center flex items-center"
        >
          More Articles{" "}
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
            >
              <path
                d="M4.6665 10.9219H16.3332"
                stroke="#121212"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.3335 15.9219L16.3335 10.9219"
                stroke="#121212"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.3335 5.92188L16.3335 10.9219"
                stroke="#121212"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Typography>
      </div>
    </section>
  );
};

export default BlogDetail;
