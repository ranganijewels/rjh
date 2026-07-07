"use client";
export const useProductCardLayout = (gridLayout, customWidth) => {
  const layoutClasses = {
    "grid-cols-2": {
      container:
        "w-full 2xl:h-[781px] xl:h-[661px] 2xl:p-[70px_96px] xl:h-[561px] xl:p-[21px_96px] lg:h-[406px] h-[249px] lg:p-[10px_50px] p-[50px_20px]",
      img: "w-full 2xl:h-[742px] xl:h-[586px] lg:h-[386px] h-[147px]",
    },
    "grid-cols-4": {
      container:
        "w-full 2xl:h-[533px] xl:h-[416px] 2xl:p-[70px_0px] lg:h-[316px] lg:p-[64px_0px]",
      img: "w-full 2xl:h-[392px] xl:h-[310px] lg:h-[230px]",
    },
    "grid-cols-5": {
      container:
        "w-full 2xl:h-[416px] xl:h-[340px] 2xl:p-[67px_0px] lg:h-[249px] lg:p-[50px_20px]",
      img: "w-full 2xl:h-[310px] xl:h-[240px] lg:h-[147px]",
    },
  };

  const defaultLayout = layoutClasses["grid-cols-5"];
  const currentLayout = layoutClasses[gridLayout] || defaultLayout;

  return {
    containerClass: customWidth ? "" : currentLayout.container,
    imageClass: currentLayout.img,
  };
};
