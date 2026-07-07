import { useEffect, useRef, useState } from "react";

export const useScrollControls = () => {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const container = containerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth
    );
  };

  const scroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const firstCard = container.querySelector(".slide-card");
    const cardWidth = firstCard?.offsetWidth || 300;

    const amount = direction === "next" ? cardWidth + 20 : -cardWidth - 20;
    container.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateScrollState();
    container.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  return {
    containerRef,
    canScrollLeft,
    canScrollRight,
    scroll,
    updateScrollState,
  };
};
