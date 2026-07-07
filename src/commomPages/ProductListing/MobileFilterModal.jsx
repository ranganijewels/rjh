import React from "react";
import Button from "@/components/ui/Button/Button";
import clsx from "clsx";

const MobileFilterModal = ({
  setShowFilterModal,
  activeFilterIndex,
  showOptions,
  handleFilterClick,
  clearFilters,
  selectedStyle,
  selectedMetal,
  selectedShape,
  selectedCarat,
  selectedPrice,
  onFilterChange,
  filtersData,
}) => {
  return (
    <section className="fixed top-0 left-0 w-full h-screen bg-[var(--grey-00)] z-[9999] overflow-y-auto scroll-smooth">
      <div className="flex justify-between border-b border-b-[var(--grey-3)] p-[24px_20px]">
        <label className="text-[18px] font-[500]">FILTER</label>
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setShowFilterModal(false)}
          className="cursor-pointer"
        >
          <img src="/icons/close.svg" alt="" />
        </button>
      </div>

      <div className="mb-[91px]">
        {filtersData.length > 0 &&
          filtersData?.map((menu, index) => {
            const selectedValue = (() => {
              switch (menu.key) {
                case "subcat":
                  return selectedStyle;
                case "metal":
                  return selectedMetal;
                case "shape":
                  return selectedShape;
                case "carat":
                  return selectedCarat;
                case "price":
                  return selectedPrice;
                default:
                  return null;
              }
            })();

            return (
              <div key={index}>
                <button
                  type="button"
                  onClick={() => handleFilterClick(index)}
                  className="p-[16px_20px] flex justify-between w-full text-left"
                  aria-expanded={activeFilterIndex === index && !!showOptions}
                >
                  {menu.title}
                  <img
                    src={
                      activeFilterIndex === index
                        ? "/icons/down-caret.svg"
                        : "/icons/right-caret.svg"
                    }
                    alt=""
                  />
                </button>

                {activeFilterIndex === index && showOptions && (
                  <div className="p-[10px_18px] grid grid-cols-2 gap-y-[15px]">
                    {menu.options?.map((option, optIndex) => {
                      const value =
                        typeof option === "string" ? option : option.text;
                      const isSelected = selectedValue === value;

                      return (
                        <button
                          type="button"
                          key={optIndex}
                          className={clsx(
                            "flex items-center gap-[12px] cursor-pointer text-left",
                            isSelected && "text-primary font-semibold"
                          )}
                          onClick={() => {
                            // normalize lowercase for metals
                            const normalized =
                              menu.key === "metal"
                                ? value.toLowerCase()
                                : value;
                            // call shared handler
                            onFilterChange?.(menu.key, normalized);
                            setShowFilterModal(false);
                          }}
                        >
                          <p className="text-[12px] font-[400]">{value}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <div className="p-[24px_20px] space-y-[10px]">
        <Button
          variant="primary"
          title="View Products"
          className="py-[16px] w-full"
          onClick={() => {
            setShowFilterModal(false);
          }}
        />
        <Button
          variant="ghost"
          title="Clear Filter"
          className="py-[16px] w-full"
          onClick={() => {
            clearFilters();
            setShowFilterModal(false);
          }}
        />
      </div>
    </section>
  );
};

export default MobileFilterModal;
