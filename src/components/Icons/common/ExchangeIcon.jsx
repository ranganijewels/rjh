"use client";
import React from "react";

const ExchangeIcon = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className={className}
      fill="currentColor"
      role="img"
      aria-hidden="true"
    >
      <path d="M62 31c0 9.925-8.075 18-18 18H9.212l6.126 5.514a2 2 0 1 1-2.676 2.972l-10-9a1.998 1.998 0 0 1 0-2.972l10-9a1.999 1.999 0 1 1 2.676 2.972L9.212 45H44c7.72 0 14-6.28 14-14a2 2 0 0 1 4 0zM4 35a2 2 0 0 0 2-2c0-7.72 6.28-14 14-14h34.788l-6.126 5.513a2 2 0 1 0 2.676 2.974l10-9a2 2 0 0 0 0-2.974l-10-9a2 2 0 0 0-2.676 2.974L54.788 15H20c-9.925 0-18 8.075-18 18a2 2 0 0 0 2 2z" />
    </svg>
  );
};

export default ExchangeIcon;
