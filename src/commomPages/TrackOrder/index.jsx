"use client";

import { useState } from "react";
import Link from "next/link";
import Typography from "@/components/ui/Typography/Typography";

const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

function formatDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    if (!orderNumber.trim() || !email.trim()) {
      setError("Please enter both your order number and email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/track-order?orderNumber=${encodeURIComponent(orderNumber.trim())}&email=${encodeURIComponent(email.trim())}`
      );
      const json = await res.json();
      if (json.status && json.data) {
        setOrder(json.data);
      } else {
        setError(json.message || "No order found for that number and email.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order
    ? Math.max(
        0,
        STATUS_STEPS.findIndex(
          (s) => s.toLowerCase() === (order.status || "").toLowerCase()
        )
      )
    : 0;

  return (
    <section className="max-w-[720px] mx-auto px-5 py-14">
      <Typography
        variant="h2"
        as="h1"
        className="text-[var(--teal-1)] mb-2 font-cormorant"
      >
        Track Your Order
      </Typography>
      <p className="text-[14px] text-[var(--grey-2)] mb-8">
        Enter your order number and the email you used at checkout. Have an
        account?{" "}
        <Link href="/account/orders" className="underline text-[var(--teal-1)]">
          View all your orders
        </Link>
        .
      </p>

      <form onSubmit={submit} className="space-y-4 mb-8">
        <div>
          <label className="block text-[13px] font-[500] mb-1">Order number</label>
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. SF-1783073719544"
            className="w-full border border-[var(--teal-3)] rounded-md px-4 py-2.5 text-[14px] outline-none focus:border-[var(--teal-1)]"
          />
        </div>
        <div>
          <label className="block text-[13px] font-[500] mb-1">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border border-[var(--teal-3)] rounded-md px-4 py-2.5 text-[14px] outline-none focus:border-[var(--teal-1)]"
          />
        </div>
        {error && <p className="text-[13px] font-[600] text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-7 py-3 rounded-full bg-[var(--teal-1)] text-white text-[13px] font-[600] disabled:opacity-60 disabled:bg-[var(--grey-3)] disabled:text-[var(--grey-2)]"
        >
          {loading ? "Looking up…" : "Track Order"}
        </button>
      </form>

      {order && (
        <div className="border border-[var(--teal-3)] rounded-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
            <div>
              <p className="text-[12px] uppercase tracking-wide text-[var(--placeholder)]">
                Order
              </p>
              <p className="text-[18px] font-[600]">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] uppercase tracking-wide text-[var(--placeholder)]">
                Placed
              </p>
              <p className="text-[14px]">{formatDate(order.orderDate)}</p>
            </div>
          </div>

          {/* Status progress */}
          <div className="flex items-center mb-6">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex-1 flex items-center last:flex-none">
                <div className="flex flex-col items-center">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-[600] ${
                      i <= currentStep
                        ? "bg-[var(--teal-1)] text-white"
                        : "bg-[var(--grey-0)] text-[var(--placeholder)]"
                    }`}
                  >
                    {i < currentStep ? "✓" : i + 1}
                  </span>
                  <span className="text-[11px] mt-1 text-[var(--grey-2)]">{step}</span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div
                    className={`h-[2px] flex-1 mx-1 ${
                      i < currentStep ? "bg-[var(--teal-1)]" : "bg-[var(--grey-0)]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <dl className="grid grid-cols-2 gap-y-2 text-[14px]">
            <dt className="text-[var(--grey-2)]">Item</dt>
            <dd className="text-right font-[500]">{order.productName || "—"}</dd>
            <dt className="text-[var(--grey-2)]">Total</dt>
            <dd className="text-right font-[500]">
              ${Number(order.totalAmount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </dd>
            <dt className="text-[var(--grey-2)]">Payment</dt>
            <dd className="text-right font-[500]">{order.paymentStatus || "—"}</dd>
            {order.trackingNumber && (
              <>
                <dt className="text-[var(--grey-2)]">Tracking</dt>
                <dd className="text-right font-[500]">
                  {order.trackingUrl ? (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-[var(--teal-1)]"
                    >
                      {order.courierName ? `${order.courierName} · ` : ""}
                      {order.trackingNumber}
                    </a>
                  ) : (
                    `${order.courierName ? `${order.courierName} · ` : ""}${order.trackingNumber}`
                  )}
                </dd>
              </>
            )}
          </dl>
        </div>
      )}
    </section>
  );
}
