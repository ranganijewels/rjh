"use client";

import React from "react";
import Accordion from "@/components/ui/Accordion/Accordion";
import { toTitleCase } from "@/utils/string";

// Spec row helper — only renders when a value is present.
const Spec = ({ label, value }) =>
  value ? (
    <div className="flex justify-between gap-4 py-[7px] border-b border-[var(--teal-3)] last:border-0">
      <span className="text-[var(--teal-1)] text-[13px]">{label}</span>
      <span className="font-[500] text-[13px] text-right">{value}</span>
    </div>
  ) : null;

// Detail accordions for the product info column — Description, Specifications,
// Shipping & Returns, and Certification & Care.
const DEFAULT_SHIPPING = [
  "Complimentary insured shipping on every order, worldwide.",
  "Ready-to-ship fine jewelry dispatches in 3–4 business days.",
  "Made-to-order engagement & wedding rings ship in 4–6 weeks.",
  "Easy 30-day returns on eligible items in original condition.",
];
const DEFAULT_CARE = [
  "Each diamond is graded and accompanied by a lab certificate.",
  "Precious metals are responsibly sourced and hallmarked for purity.",
  "Complimentary cleaning & inspection at our atelier, for life.",
  "Store separately in the provided pouch; avoid contact with chemicals.",
];

export default function ProductInfoAccordion({
  product,
  selectedMetal,
  selectedShape,
  shippingReturns,
  certificationCare,
}) {
  const p = product || {};
  const shipping = Array.isArray(shippingReturns) && shippingReturns.length ? shippingReturns : DEFAULT_SHIPPING;
  const care = Array.isArray(certificationCare) && certificationCare.length ? certificationCare : DEFAULT_CARE;
  const metal =
    selectedMetal?.karat?.value || p.meta_quality || p.metal_purity || "";
  const color =
    selectedMetal?.color || p.product_color || p.metal_color || "";
  const shape = selectedShape || p.shape || p.diamond_shape || "";

  return (
    <div className="pt-[6px]">
      <Accordion title="Description" defaultOpen containerClass="!py-[16px]">
        <p className="leading-relaxed text-[var(--grey-2)]">
          {p.description ||
            "Crafted by hand in our atelier, this piece pairs ethically sourced diamonds with responsibly refined precious metal — designed to be worn every day and treasured for a lifetime."}
        </p>
      </Accordion>

      <Accordion title="Specifications" containerClass="!py-[16px]">
        <div>
          <Spec label="Design No." value={p.design_no || p.productCode} />
          <Spec label="Metal" value={[toTitleCase(p.metal_type || "Gold"), metal].filter(Boolean).join(" · ")} />
          <Spec label="Metal Color" value={toTitleCase(color)} />
          <Spec label="Diamond Shape" value={toTitleCase(shape)} />
          <Spec label="Diamond Quality" value={p.diamond_quality} />
          <Spec label="Gross Weight" value={p.gross_weight ? `${p.gross_weight} g` : null} />
          <Spec label="Diamond Weight" value={p.diamond_wt ? `${p.diamond_wt} ct` : (p.center_diamond_weight ? `${p.center_diamond_weight} ct` : null)} />
          <Spec label="Collection" value={toTitleCase(p.collection)} />
          <Spec label="Category" value={toTitleCase(p.category?.name || p.category)} />
        </div>
      </Accordion>

      <Accordion title="Shipping & Returns" containerClass="!py-[16px]">
        <ul className="space-y-[8px] leading-relaxed text-[var(--grey-2)]">
          {shipping.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </Accordion>

      <Accordion title="Certification &amp; Care" containerClass="!py-[16px]">
        <ul className="space-y-[8px] leading-relaxed text-[var(--grey-2)]">
          {care.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </Accordion>
    </div>
  );
}
