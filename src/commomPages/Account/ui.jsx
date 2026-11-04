"use client";

import React from "react";
import Link from "next/link";

// Shared pieces for the account pages, so every page has the same title,
// chips, cards and empty states.

export const AccountPageTitle = ({ title, description, action }) => (
  <div className="flex flex-wrap items-end justify-between gap-4 mb-[24px] lg:mb-[32px]">
    <div>
      <h1 className="font-heading text-[26px] lg:text-[34px] leading-tight text-[var(--color-text)]">{title}</h1>
      {description && <p className="mt-1 text-[14px] text-[var(--color-text-muted)]">{description}</p>}
    </div>
    {action}
  </div>
);

const TONES = {
  success: "bg-[var(--color-success-tint)] text-[var(--color-success)]",
  error: "bg-[var(--color-error-tint)] text-[var(--color-error)]",
  warning: "bg-[var(--color-warning-tint)] text-[var(--color-warning)]",
  info: "bg-[var(--surface-tint)] text-[var(--color-primary)]",
  neutral: "bg-[var(--surface-band)] text-[var(--color-text-muted)]",
};

export const Chip = ({ tone = "neutral", children }) => (
  <span className={`inline-flex items-center px-[10px] py-[4px] text-[11px] font-[500] leading-none tracking-[0.06em] uppercase ${TONES[tone] || TONES.neutral}`}>
    {children}
  </span>
);

export const Card = ({ className = "", children }) => (
  <div className={`border border-[var(--border-subtle)] bg-[var(--surface-card)] p-[16px] lg:p-[24px] ${className}`}>{children}</div>
);

export const EmptyState = ({ title, text, actionLabel, actionHref }) => (
  <div className="border border-dashed border-[var(--border-tint)] p-[32px] text-center">
    <p className="font-heading text-[22px] text-[var(--color-text)]">{title}</p>
    {text && <p className="mt-2 text-[14px] text-[var(--color-text-muted)]">{text}</p>}
    {actionLabel && actionHref && (
      <Link
        href={actionHref}
        className="inline-block mt-4 px-[24px] py-[12px] text-[13px] uppercase tracking-[0.28px] bg-[var(--color-primary)] text-[var(--color-text-on-dark)] hover:bg-[var(--color-primary-hover)]"
      >
        {actionLabel}
      </Link>
    )}
  </div>
);

export const Skeleton = ({ className = "h-[120px]" }) => <div className={`animate-pulse bg-[var(--surface-band)] ${className}`} />;

/** The customer-facing steps an order moves through. */
export const ORDER_STEPS = ["Placed", "Confirmed", "In production", "Shipped", "Delivered"];

/** Map the stored order status (staff can type several spellings) to a step. */
export function orderStage(order = {}) {
  const s = String(order.status || "").toLowerCase();
  if (/cancel/.test(s)) return { label: "Cancelled", tone: "error", step: -1 };
  if (order.delivered_at || /deliver/.test(s)) return { label: "Delivered", tone: "success", step: 4 };
  if (order.shipped_at || /ship|dispatch|transit/.test(s)) return { label: "Shipped", tone: "info", step: 3 };
  if (/product|process|making|manufactur|craft|qc|ready/.test(s)) return { label: "In production", tone: "info", step: 2 };
  if (/confirm/.test(s)) return { label: "Confirmed", tone: "info", step: 1 };
  return { label: "Placed", tone: "neutral", step: 0 };
}

/** Payment state for the chip; online-only checkout makes this matter. */
export function paymentInfo(order = {}) {
  const s = String(order.payment_status || "").toLowerCase();
  if (s === "paid") return { label: "Paid", tone: "success" };
  if (s === "failed") return { label: "Payment failed", tone: "error" };
  if (String(order.payment_method || "").toUpperCase() === "COD") return { label: "Pay on delivery", tone: "neutral" };
  return { label: "Payment pending", tone: "warning" };
}

/** "₹ 28,139.06" from what the customer was charged, else the USD total. */
export function orderAmount(order = {}) {
  const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£", AED: "AED ", AUD: "A$", SGD: "S$" };
  const charged = order.charged_amount != null && order.currency_code && order.currency_code !== "USD";
  const value = charged ? order.charged_amount : order.total;
  const cur = charged ? order.currency_code : "USD";
  return `${symbols[cur] || `${cur} `}${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};
