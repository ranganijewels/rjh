"use client";
import React from "react";
import Typography from "@/components/ui/Typography/Typography";
import clsx from "clsx";

const Modal = ({ isOpen, onClose, title, children }) => {
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
        className={clsx(
          "fixed top-0 right-0 z-[9999] h-screen xl:w-[25%] lg:w-[40%] md:w-[50%] w-full bg-[var(--grey-00)] drop-shadow-md transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-[25px_30px] flex justify-between items-center">
          <Typography variant="p" className="font-[500] capitalize">
            {title}
          </Typography>
          <img
            src="/icons/close.svg"
            className="w-[12px] h-[12px] cursor-pointer"
            onClick={onClose}
            alt="close icon"
          />
        </div>

        <hr className="hr-teal-3" />

        <div className="mt-[51px] pb-[51px] px-[30px] space-y-[30px] overflow-y-auto hide-scrollbar h-[calc(100%-100px)]">
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
