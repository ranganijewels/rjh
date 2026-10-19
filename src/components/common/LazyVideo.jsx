"use client";
import { useEffect, useRef, useState } from "react";

// Below-the-fold video that downloads nothing until it is about to scroll into
// view (autoplaying videos otherwise fetch the whole file on page load).
export default function LazyVideo({ src, autoPlay, rootMargin = "300px", ...props }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || active) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active, rootMargin]);

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      autoPlay={active && autoPlay}
      preload={active ? "metadata" : "none"}
      {...props}
    />
  );
}
