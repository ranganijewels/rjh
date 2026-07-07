"use client";

import { useEffect, useState } from "react";
import { getRecentlyViewed } from "@/utils/recentlyViewed";
import Typography from "@/components/ui/Typography/Typography";
import ProductCard from "@/components/ui/Cards/ProductCard";

// Bottom-of-PDP utility strip. Renders the SAME ProductCard used across the
// listing/collection grids (discount badge, "From" price, swatches) instead of
// the old bespoke thumbnail markup, so cards look consistent site-wide.
const RecentlyViewed = ({ currentId }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const all = getRecentlyViewed().filter((p) => p.id !== currentId);
    setItems(all);
  }, [currentId]);

  if (!items.length) return null;

  return (
    <section className="w-full px-[18px] md:px-[30px] py-[40px] border-t border-[var(--teal-3)]">
      <div className="flex items-end justify-between mb-6">
        <Typography
          variant="h3"
          className="!font-[var(--font-cormorant)]"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          Recently Viewed
        </Typography>
      </div>
      <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-2">
        {items.map((p) => (
          <div key={p.id} className="shrink-0 w-[230px]">
            <ProductCard
              productName={p.name}
              price={p.price}
              productImg={p.image}
              productId={p.slug || p.id}
              customWidth
              cardClass="w-full h-[230px]"
              imgClass="w-full h-full"
              disableWishlistPopup
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
