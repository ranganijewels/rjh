import React from "react";
import Image from "next/image";

const PaymentOptions = ({ className = "" }) => {
  const paymentIcons = [
    { src: "/icons/am-ex.svg", alt: "American Express" },
    { src: "/icons/apple-pay.svg", alt: "Apple Pay" },
    // { src: "/icons/g-pay.svg", alt: "Google Pay" },
    { src: "/icons/mastercard.svg", alt: "Mastercard" },
    // { src: "/icons/paypal.svg", alt: "PayPal" },
    // { src: "/icons/shop.svg", alt: "Shop Pay" },
    { src: "/icons/visa.svg", alt: "Visa" },
  ];

  return (
    <div className={`flex xl:gap-[20px] gap-[10px] ${className} flex-wrap`}>
      {paymentIcons.map((icon, index) => (
        <Image
          key={index}
          src={icon.src}
          alt={icon.alt || "Payment method"}
          width={38}
          height={24}
          className="xl:w-[38px] xl:h-[24px] w-[28px] h-[18px]"
        />
      ))}
    </div>
  );
};

export default PaymentOptions;
