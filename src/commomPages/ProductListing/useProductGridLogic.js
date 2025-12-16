'use client';
import { useEffect, useState } from "react";
import useIsMobile from "@/utils/useIsMobile";

const useProductGridLogic = () => {
  const [gridLayout, setGridLayout] = useState("grid-cols-4");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [activeFilterIndex, setActiveFilterIndex] = useState(null);
  const { isMobile } = useIsMobile();

  const handleFilterClick = (index) => {
    setShowOptions(true);
    setActiveFilterIndex(index === activeFilterIndex ? null : index);
  };

  useEffect(() => {
    if (isMobile) {
      setGridLayout("grid-cols-4");
    }
  }, [isMobile]);

  const isActive = (layout) => gridLayout === layout;

  const effectiveLayout = () => {
    if (isMobile && gridLayout === "grid-cols-2") return "grid-cols-1";
    if (isMobile && gridLayout === "grid-cols-4") return "grid-cols-2";
    return isMobile ? "grid-cols-2" : gridLayout;
  };

  return {
    isMobile,
    gridLayout,
    setGridLayout,
    effectiveLayout,
    isActive,
    showFilterModal,
    setShowFilterModal,
    showOptions,
    activeFilterIndex,
    handleFilterClick,
  };
};

export default useProductGridLogic;
