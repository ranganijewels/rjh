// components/common/SearchIcon.jsx
import React from "react";

const SearchIcon = ({ className = "", onClick, ariaLabel = "Open search" }) => {
  return (
    <div
      onClick={onClick}
      className={`${className} cursor-pointer`}
      role="button"
      aria-label={ariaLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
      >
        <g clipPath="url(#clip0_2099_4247)">
          <path
            d="M23.7309 23.0258L17.4099 16.7048C19.0169 14.9298 20.0059 12.5848 20.0059 10.0068C20.0059 4.49381 15.5199 0.0078125 10.0059 0.0078125C4.49186 0.0078125 0.00585938 4.49381 0.00585938 10.0078C0.00585938 15.5218 4.49186 20.0078 10.0059 20.0078C12.5829 20.0078 14.9279 19.0198 16.7029 17.4128L23.0239 23.7338C23.1219 23.8318 23.2499 23.8798 23.3779 23.8798C23.5059 23.8798 23.6339 23.8308 23.7319 23.7338C23.9269 23.5388 23.9269 23.2218 23.7319 23.0268L23.7309 23.0258ZM1.00586 10.0078C1.00586 5.04481 5.04286 1.00781 10.0059 1.00781C14.9689 1.00781 19.0059 5.04581 19.0059 10.0078C19.0059 14.9698 14.9689 19.0078 10.0059 19.0078C5.04286 19.0078 1.00586 14.9698 1.00586 10.0078Z"
            fill="#222223"
          />
        </g>
        <defs>
          <clipPath id="clip0_2099_4247">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default SearchIcon;
