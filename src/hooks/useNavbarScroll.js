"use client";
import { useEffect, useState } from "react";
import { throttle } from "lodash";

export const useNavbarScroll = () => {
  const [isTopBarHidden, setIsTopBarHidden] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;

      // Scroll Down = Hide navbar
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsNavbarHidden(true);
      } else {
        setIsNavbarHidden(false);
      }

      // Hide topbar only after threshold
      setIsTopBarHidden(currentScrollY > 80);

      lastScrollY = currentScrollY;
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { isTopBarHidden, isNavbarHidden };
};
