"use client";
import React, { useState } from "react";

const Accordion = ({
  title,
  children,
  defaultOpen = false,
  caretIcons,
  containerClass,
  btnStyle,
  icon,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const openIcon = caretIcons?.open || "/icons/up-caret.svg";
  const closeIcon = caretIcons?.close || "/icons/down-caret.svg";

  return (
    <div
      className={`border-b border-[var(--teal-3)] py-[20px] ${containerClass}`}
      id={id}
    >
      <button
        className={`w-full flex justify-between items-start text-left text-[14px] font-[500] transition uppercase gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--teal-1)] ${btnStyle}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
      >
        {icon ? (
          <div className="flex items-center gap-2">
            {icon} <span className="flex-1 whitespace-normal">{title}</span>
          </div>
        ) : (
          <span className="flex-1 whitespace-normal">{title}</span>
        )}
        {/* <span className="flex-1 whitespace-normal">{title}</span> */}
        <span className="shrink-0">
          <img src={isOpen ? openIcon : closeIcon} alt="" />
        </span>
      </button>
      {isOpen && (
        <div
          id={`${id}-panel`}
          className="text-[14px] font-[400] text-[var(--grey-2)] mt-[12px]"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
