"use client";
import React from "react";
import toast from "react-hot-toast";

const ShareModal = ({ onClose }) => {
  const url = window.location.href;
  const encodedUrl = encodeURIComponent(url);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="relative w-[420px] bg-white rounded-[12px] shadow-lg p-6">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        {/* Title */}
        <h3 className="text-[18px] font-[500] mb-4">Let’s share this!</h3>

        {/* Copy Link */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-md p-2 mb-3">
          <input
            readOnly
            value={url}
            className="flex-1 bg-transparent text-[13px] outline-none"
          />
          <button
            onClick={handleCopy}
            className="bg-[var(--teal-1)] text-white px-4 py-2 rounded-md text-sm"
          >
            Copy link
          </button>
        </div>

        <p className="text-[12px] text-gray-500 pb-[20px] mb-[20px] border-b border-b-[var(--grey-1)]">
          Anyone with the link can view this page.
        </p>

        {/* Social Icons */}
        <div className="flex justify-evenly">
          <ShareIcon
            label="WhatsApp"
            href={`https://wa.me/?text=${encodedUrl}`}
            icon="/icons/whatsapp.svg"
          />
          <ShareIcon
            label="Facebook"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            icon="/icons/facebook.svg"
          />
          <ShareIcon
            label="X"
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
            icon="/icons/twitter.svg"
          />
        </div>
      </div>
    </div>
  );
};

const ShareIcon = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-2 text-[12px] text-gray-600 hover:text-black"
  >
    <div className="w-[44px] h-[44px] rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
      <img src={icon} alt={label} className="w-[20px] h-[20px]" />
    </div>
    {label}
  </a>
);

export default ShareModal;
