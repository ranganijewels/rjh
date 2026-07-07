import React from "react";

/**
 * Small circular count badge used on icon buttons (wishlist, cart, account, etc).
 * Renders nothing if count is falsy/zero so callers can use it unconditionally
 * or still guard with `{count > 0 && <Badge count={count} />}`.
 */
const Badge = ({ count }) => {
  if (!count) return null;

  return (
    <span className="absolute -top-[8px] -right-[11px] min-w-[18px] h-[18px] px-[5px] bg-[var(--teal-1)] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none border border-white">
      {count}
    </span>
  );
};

export default Badge;
