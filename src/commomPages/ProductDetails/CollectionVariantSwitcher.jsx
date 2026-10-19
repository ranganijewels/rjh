"use client";
import React from "react";
import Button from "@/components/ui/Button/Button";
import clsx from "clsx";
import { useRouter } from "next/navigation";

// Renders a switcher for products that are variants of one another within a
// single "variant mode" collection (e.g. an "Initials" collection where each
// letter A/B/C/... is its own product). Unlike the shape-variant switcher
// (DiamondOptions), this is label-driven, not icon-driven — each button's
// text is the product's own metadata.variantLabel, set in the admin Product
// Form. Clicking navigates straight to that sibling product's page.
const CollectionVariantSwitcher = ({ variants = [], currentProductId }) => {
  const router = useRouter();
  const items = (variants || []).filter((v) => v?.id && v?.variant_label);
  if (items.length < 2) return null;

  return (
    <div className="space-y-2">
      <p className="text-[13px] text-[var(--grey-2)]">
        Also available as:
      </p>
      <div className="flex gap-2 flex-wrap">
        {items.map((v) => {
          const isActive = v.id === currentProductId;
          return (
            <Button
              key={v.id}
              variant="filtersOutline"
              title={v.variant_label}
              disabled={isActive}
              onClick={() => {
                if (!isActive) router.push(`/product/${v.id}`);
              }}
              className={clsx(
                "min-w-[44px] !w-auto px-3",
                isActive && "border border-[var(--teal-1)]"
              )}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CollectionVariantSwitcher;
