import Link from "next/link";
import React from "react";

const SocialMediaIcons = ({
  className = "",
  iconColor = "white",
  icons = [],
  imageSize,
}) => {
  return (
    <div className={`gap-[19px] inline-flex ${className}`}>
      {icons.map((iconObj, idx) => (
        <Link
          href={iconObj.url || "#"}
          key={idx}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={iconObj.label || iconObj.name}
          className="!cursor-pointer"
        >
          <img
            src={`/icons/${iconObj.name}-${iconColor}.svg`}
            alt={iconObj.label || iconObj.name}
            className={`w-auto xl:h-[16px] h-[14px] ${imageSize} transition-transform duration-300 transform hover:scale-110`}
          />
        </Link>
      ))}
    </div>
  );
};

export default SocialMediaIcons;
