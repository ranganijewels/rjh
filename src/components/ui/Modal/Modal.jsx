"use client";
import React, { useEffect, useRef } from "react";
import Typography from "@/components/ui/Typography/Typography";
import clsx from "clsx";

const Modal = ({ isOpen, onClose, title, children }) => {
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  // Callers pass an inline onClose, which changes every render. Reading it
  // from a ref keeps the effect below from re-running on each keystroke —
  // that re-run moved focus to the close button and made inputs untypeable.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    // Move focus to the close button when the panel opens
    closeBtnRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current?.();
        return;
      }

      if (event.key === "Tab") {
        const focusableEls = panelRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableEls || focusableEls.length === 0) return;

        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-[9998] bg-black/30 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Right Side Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={clsx(
          "fixed top-0 right-0 z-[9999] h-screen xl:w-[25%] lg:w-[40%] md:w-[50%] w-full md:min-w-[460px] max-w-full bg-[var(--grey-00)] drop-shadow-md transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-[25px_30px] flex justify-between items-center">
          <Typography id="modal-title" variant="p" className="font-[500] capitalize">
            {title}
          </Typography>
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            <img
              src="/icons/close.svg"
              className="w-[12px] h-[12px] cursor-pointer"
              alt=""
            />
          </button>
        </div>

        <hr className="hr-teal-3" />

        <div className="mt-12 pb-12 px-[30px] space-y-[30px] overflow-y-auto hide-scrollbar h-[calc(100%-100px)]">
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
