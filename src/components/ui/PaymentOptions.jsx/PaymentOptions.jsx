import React from "react";

const PaymentOptions = ({ className = "" }) => {
  const paymentIcons = [
    { src: "/icons/am-ex.svg" },
    { src: "/icons/apple-pay.svg" },
    // { src: "/icons/g-pay.svg" },
    { src: "/icons/mastercard.svg" },
    // { src: "/icons/paypal.svg" },
    // { src: "/icons/shop.svg" },
    { src: "/icons/visa.svg" },
  ];

  return (
    <div className={`flex xl:gap-[20px] gap-[10px] ${className} flex-wrap`}>
      {paymentIcons.map((icon, index) => (
        <img
          key={index}
          src={icon.src}
          alt={`payment-${index}`}
          className="xl:w-[38px] xl:h-[24px] w-[28px] h-[18px]"
        />
      ))}
    </div>
  );
};

export default PaymentOptions;
