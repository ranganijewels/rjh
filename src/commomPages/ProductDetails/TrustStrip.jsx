"use client";

import React from "react";
import { CLAIMS } from "@/content/policies";

// Fixed icon set — the CMS badge stores an icon KEY + label (raw SVG paths
// aren't editable in the CMS). Unknown keys fall back to the shipping icon.
const ICON_PATHS = {
  shipping: "M3 7h13l3 4v6h-2a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H3V7Z",
  diamond: "M12 2 4 5v6c0 5 3.4 8.3 8 11 4.6-2.7 8-6 8-11V5l-8-3Zm-1 13-3-3 1.4-1.4L11 12.2l4.6-4.6L17 9l-6 6Z",
  returns: "M21 11.5a8.38 8.38 0 0 1-8.5 8.5A8.5 8.5 0 1 1 12 3.5M16 3l4 4-4 4",
  lock: "M12 1 3 5v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V5l-9-4Z",
  warranty: "M9 12l2 2 4-4m5.5 2a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z",
  certificate: "M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-3 2-1.5 5L12 20l4.5 2L15 17",
};

const DEFAULT_BADGES = [
  { icon: "shipping", label: CLAIMS.shipping },
  { icon: "diamond", label: CLAIMS.certification },
  { icon: "returns", label: CLAIMS.returnsShort },
  { icon: "lock", label: "Secure checkout" },
];

// Compact reassurance strip shown under the add-to-bag CTA. `badges` (from the
// CMS pdp-content section) override the defaults when provided.
export default function TrustStrip({ badges }) {
  const items = Array.isArray(badges) && badges.length ? badges : DEFAULT_BADGES;
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-3 py-[14px]">
      {items.map((it, i) => (
        <div key={`${it.label}-${i}`} className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0 text-[var(--teal-1)]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d={ICON_PATHS[it.icon] || it.icon || ICON_PATHS.shipping} />
          </svg>
          <span className="text-[12px] text-[var(--grey-2)] leading-tight">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

export { ICON_PATHS as TRUST_ICONS };
