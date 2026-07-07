// hooks/useAccountMenu.ts
import { useState, useCallback } from "react";

export const useAccountMenu = (initialItem = "Overview") => {
  const [activeItem, setActiveItem] = useState(initialItem);

  // Handle menu click
  const handleClick = useCallback((item) => {
    setActiveItem(item);
  }, []);

  return {
    activeItem,
    handleClick,
  };
};
