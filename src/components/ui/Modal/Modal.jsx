"use client";
import React from "react";
import Typography from "@/components/ui/Typography/Typography";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-screen z-[9999] xl:w-[25%] lg:w-[40%] md:w-[50%] w-full">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-white/30 backdrop-blur-none"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[var(--grey-00)] h-full ml-auto drop-shadow-md">
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
    </div>
  );
};

export default Modal;
