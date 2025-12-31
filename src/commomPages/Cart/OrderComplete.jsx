"use client";
import Button from "@/components/ui/Button/Button";
import Typography from "@/components/ui/Typography/Typography";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import FailedOrder from "./FailedOrder";

const OrderComplete = () => {
  const router = useRouter();

  const rawOrder = useSelector((state) => state.order?.order);
  let order = rawOrder?.data?.order || rawOrder?.order || rawOrder;

  if (!order) {
    const saved = JSON.parse(localStorage.getItem("recentOrder"));
    order = saved?.data?.order || saved?.order || saved;
  }

  if (rawOrder?.data?.payment_status === "failed") {
    return <FailedOrder />;
  }

  return (
    <section className="lg:py-[80px] py-[40px] lg:px-[95px] px-0 flex flex-col items-center gap-[40px] container mx-auto max-w-[738px] text-center border border-[var(--teal-3)]">
      <div className="space-y-[16px]">
        <h2 className="font-[500] lg:text-[34px] text-[24px] text-[var(--placeholder)]">
          Thank you!
        </h2>
        <h1 className="lg:text-[40px] text-[28px] font-[500] max-w-[492px]">
          Your order has been received
        </h1>
      </div>

      {/* Items list */}
      <div className="flex flex-wrap gap-[30px]">
        {Array.isArray(order?.items) &&
          order.items.length > 0 &&
          order.items.map((item) => (
            <div
              className="w-[105px] h-[115px] p-[18px_13px] bg-[var(--product-bg)] relative"
              key={item.id}
            >
              <img
                className="w-[78px] h-[78px] object-cover"
                src={item.product?.image}
                alt="product"
              />
              <div className="p-[4px_11px] rounded-full bg-[var(--teal-1)] w-[32px] h-[32px] absolute -top-[11px] -right-[4px]">
                <Typography
                  className="font-[600]"
                  variant="h5"
                  textColor="white"
                >
                  {item.quantity}
                </Typography>
              </div>
            </div>
          ))}
      </div>

      {/* Order Summary */}
      <div className="mx-auto space-x-[32px] flex justify-center">
        <div className="inline-flex flex-col justify-start items-start gap-5 text-left">
          <Typography
            className="font-[600]"
            variant="h6"
            textColor="placeholder"
          >
            Order Number:
          </Typography>
          <Typography
            className="font-[600]"
            variant="h6"
            textColor="placeholder"
          >
            Date:
          </Typography>
          <Typography
            className="font-[600]"
            variant="h6"
            textColor="placeholder"
          >
            Total:
          </Typography>
          <Typography
            className="font-[600]"
            variant="h6"
            textColor="placeholder"
          >
            Payment method:
          </Typography>
        </div>

        <div className="inline-flex flex-col justify-start items-start gap-5 text-left">
          <Typography className="font-[600]" variant="h6">
            {order?.id}
          </Typography>

          <Typography className="font-[600]" variant="h6">
            {order?.created_at &&
              new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </Typography>

          <Typography className="font-[600]" variant="h6">
            ${order?.total?.toFixed(2)}
          </Typography>

          <Typography className="font-[600]" variant="h6">
            {order?.payment_method}
          </Typography>
        </div>
      </div>

      <Button
        title={"Purchase history"}
        onClick={() => router.push("/account/orders")}
      />
    </section>
  );
};

export default OrderComplete;
