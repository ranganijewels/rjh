"use client";
import Star from "@/components/Icons/common/Star";
import React from "react";

const ReviewSummary = ({
  rating,
  totalReviews,
  maxRating = 5,
  size = 16,
  showCount = true,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      {/* Stars */}
      <div
        className="flex items-center gap-[2px]"
        aria-label={`Rated ${rating} out of ${maxRating}`}
      >
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={size} type="full" />
        ))}

        {hasHalfStar && <Star size={size} type="half" />}

        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} type="empty" />
        ))}
      </div>

      {/* Rating text */}
      <span className="text-sm text-[var(--grey-2)]">
        {Number(rating).toFixed(1)}
        {showCount && totalReviews !== undefined && (
          <span className="text-[var(--placeholder)]">
            {" "}
            ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
          </span>
        )}
      </span>
    </div>
  );
};

export default ReviewSummary;
