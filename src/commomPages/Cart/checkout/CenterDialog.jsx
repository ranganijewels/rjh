"use client";

import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import Typography from "@/components/ui/Typography/Typography";

/** A centred pop-up (the side-panel version is components/ui/Modal/Modal). */
const CenterDialog = ({ isOpen, onClose, title, children }) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onCloseRef.current?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="center-dialog-title"
        className={clsx(
          "relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-[var(--grey-00)] drop-shadow-md",
          "p-[24px] md:p-[32px]"
        )}
      >
        <div className="flex items-center justify-between mb-[20px]">
          <Typography id="center-dialog-title" variant="h4" className="font-[500]">
            {title}
          </Typography>
          <button type="button" aria-label="Close" onClick={onClose} className="text-[22px] leading-none px-2 text-[var(--grey-2)] hover:text-[var(--teal-1)]">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default CenterDialog;
