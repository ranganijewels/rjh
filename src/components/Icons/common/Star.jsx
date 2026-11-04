import React from "react";

const Star = ({ size = 16, type }) => {
  const fill =
    type === "full"
      ? "var(--rating-star)"
      : type === "half"
      ? "url(#halfGradient)"
      : "none";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="var(--rating-star)"
      strokeWidth="1.5"
    >
      {type === "half" && (
        <defs>
          <linearGradient id="halfGradient">
            <stop offset="50%" stopColor="var(--rating-star)" />
            <stop offset="50%" stopColor="var(--border-subtle)" />
          </linearGradient>
        </defs>
      )}

      <path d="M12 2l2.9 6.6L22 9.2l-5 4.9 1.2 7-6.2-3.5-6.2 3.5 1.2-7-5-4.9 7.1-.6z" />
    </svg>
  );
};

export default Star;
