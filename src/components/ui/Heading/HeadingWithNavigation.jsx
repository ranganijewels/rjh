import clsx from "clsx";
import React from "react";

const HeadingWithNavigation = ({
  title,
  onPrev,
  onNext,
  canScrollLeft,
  canScrollRight,
  buttonWithLabel,
  label,
  iconStyle,
  hideMarginBottom,
}) => {
  const showButtons = canScrollLeft || canScrollRight;

  return (
    <div
      className={clsx(
        "flex justify-between items-center",
        hideMarginBottom ? "" : "mb-[15px] xl:mb-[30px]"
      )}
    >
      {buttonWithLabel ? (
        <div className="inline-flex gap-2">
          <p className="text-[14px] font-[500] text-[var(--grey-2)]">{title}</p>
          <label className="text-[14px] font-[400] text-[var(--teal-1)]">
            {label}
          </label>
        </div>
      ) : (
        <h3 className="xl:text-[28px] text-[16px] font-[400] text-[var(--grey-2)] tracking-wide capitalize">
          {title}
        </h3>
      )}

      {showButtons && (
        <div className="2xl:space-x-[30px] xl:space-x-[20px] space-x-[15px] flex">
          <button
            onClick={onPrev}
            disabled={!canScrollLeft}
            className={`transition-opacity ${
              !canScrollLeft ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="26"
              viewBox="0 0 48 26"
              fill="none"
              className={`${
                iconStyle
                  ? iconStyle
                  : "2xl:w-[48px] 2xl:h-[26px] xl:w-[48px] xl:h-[26px] w-[24px] h-[12px]"
              }`}
            >
              <path
                d="M0.317245 13.7691L11.2261 24.678C11.618 25.1356 12.3066 25.1889 12.7642 24.797C13.2218 24.4051 13.2751 23.7164 12.8832 23.2588C12.8466 23.2162 12.8069 23.1763 12.7642 23.1399L3.72078 14.0855H46.9091C47.5116 14.0855 48 13.597 48 12.9945C48 12.392 47.5116 11.9037 46.9091 11.9037H3.72078L12.7642 2.86022C13.2218 2.46835 13.2751 1.77967 12.8832 1.32209C12.4912 0.864502 11.8026 0.811161 11.3451 1.20312C11.3024 1.23969 11.2626 1.27943 11.2261 1.32209L0.31715 12.231C-0.105751 12.6564 -0.105747 13.3435 0.317245 13.7691Z"
                fill={canScrollLeft ? "#222223" : "#A0A0A0"}
              />
            </svg>
          </button>

          <button
            onClick={onNext}
            disabled={!canScrollRight}
            className={`transition-opacity ${
              !canScrollRight ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="26"
              viewBox="0 0 48 26"
              fill="none"
              className={`${
                iconStyle
                  ? iconStyle
                  : "2xl:w-[48px] 2xl:h-[26px] xl:w-[48px] xl:h-[26px] w-[24px] h-[12px]"
              }`}
            >
              <path
                d="M47.6828 12.2309L36.7739 1.32201C36.382 0.864423 35.6934 0.81108 35.2358 1.20304C34.7782 1.59491 34.7249 2.28359 35.1168 2.74117C35.1534 2.78383 35.1931 2.82367 35.2358 2.86014L44.2792 11.9145H1.09086C0.488429 11.9145 0 12.403 0 13.0055C0 13.608 0.488429 14.0963 1.09086 14.0963H44.2792L35.2358 23.1398C34.7782 23.5317 34.7249 24.2203 35.1168 24.6779C35.5088 25.1355 36.1974 25.1888 36.6549 24.7969C36.6976 24.7603 36.7374 24.7206 36.7739 24.6779L47.6828 13.769C48.1058 13.3436 48.1057 12.6565 47.6828 12.2309Z"
                fill={canScrollRight ? "#222223" : "#A0A0A0"}
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default HeadingWithNavigation;
