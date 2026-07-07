"use client";
import Link from "next/link";

// Ecksand-style quick-links strip: three quiet, icon-led links (size guide /
// consultation / shipping). CMS-driven via pdp-content `quick_links`.
const ICONS = {
  ruler: (
    <path d="M3 17.2L17.2 3l3.8 3.8L6.8 21 3 17.2zm3.8 1L19 5.9 18.1 5 16 7.1l-1-1-1 1 1 1-1.6 1.6-1-1-1 1 1 1L10.8 12l-1-1-1 1 1 1-1.6 1.6-1-1-1 1 1 1L5.9 18l.9.9z" />
  ),
  calendar: (
    <path d="M7 2h2v2h6V2h2v2h4v18H3V4h4V2zm14 8H5v10h16V10zM5 8h16V6H5v2zm4 6h2v2H9v-2zm4 0h2v2h-2v-2z" />
  ),
  shipping: (
    <path d="M1 5h14v4h4l4 5v5h-3a3 3 0 11-6 0H9a3 3 0 11-6 0H1V5zm16 6v3h4.6L19 11h-2zM6 19a1.4 1.4 0 100 .1V19zm10 0a1.4 1.4 0 100 .1V19zM3 7v8h.8a3 3 0 015.4 0H13V7H3z" />
  ),
};

const QuickLinks = ({ config }) => {
  if (config && config.enabled === false) return null;
  const items = config?.items?.length
    ? config.items
    : [
        { icon: "ruler", label: "Ring Size Guide", url: "/ring-size-guide" },
        { icon: "calendar", label: "Book a Consultation", url: "/book-consultancy" },
        { icon: "shipping", label: "Complimentary Shipping", url: "/shipping" },
      ];

  return (
    <section className="border-y border-[var(--teal-3)]">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--teal-3)]">
        {items.map((item, i) => (
          <Link
            key={i}
            href={item.url || "#"}
            className="group flex items-center justify-center gap-[12px] py-[26px] px-[18px] transition-colors hover:bg-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-[22px] h-[22px] text-[var(--teal-1)]"
              fill="currentColor"
              aria-hidden
            >
              {ICONS[item.icon] || ICONS.ruler}
            </svg>
            <span className="text-[13px] uppercase tracking-[0.12em] text-[var(--grey-2)] group-hover:text-[var(--teal-1)] transition-colors">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickLinks;
