"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useCrudApi } from "@/hooks/useCrudApi";
import { addressLines } from "@/commomPages/Cart/checkout/DeliveryAddress";
import { AccountPageTitle, Card, Chip, EmptyState, Skeleton, formatDate, orderAmount, orderStage, paymentInfo } from "./ui";

const SHORTCUTS = [
  { label: "Track an order", text: "See where your piece is", href: "/track-order" },
  { label: "Book an appointment", text: "Visit or meet us online", href: "/book-an-appointment" },
  { label: "Resize & repair", text: "Request a resize or repair", href: "/resize-repair-request" },
  { label: "Ring size guide", text: "Find your size at home", href: "/ring-size-guide" },
];

/** Account dashboard: latest order, a few facts and shortcuts. */
const Overview = () => {
  const wishlistCount = useSelector((state) => state.wishlist?.count ?? state.wishlist?.items?.length ?? 0);
  const [orders, setOrders] = useState(null);
  const [addresses, setAddresses] = useState(null);
  const { fetchAll: fetchOrders } = useCrudApi("/api/orders");
  const { fetchAll: fetchAddresses } = useCrudApi("/api/address");

  useEffect(() => {
    fetchOrders().then((r) => setOrders(r?.data || [])).catch(() => setOrders([]));
    fetchAddresses().then((r) => setAddresses(r?.data || [])).catch(() => setAddresses([]));
  }, [fetchOrders, fetchAddresses]);

  const latest = orders?.length
    ? [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
    : null;
  const defaultAddress = addresses?.find((a) => a.is_default) || addresses?.[0];

  return (
    <>
      <AccountPageTitle title="Dashboard" description="Your orders, saved details and quick links." />

      {/* Latest order */}
      <section aria-labelledby="latest-order" className="mb-[24px]">
        <h2 id="latest-order" className="text-[13px] uppercase tracking-[0.1em] text-[var(--color-text-muted)] mb-[10px]">
          Latest order
        </h2>
        {orders === null ? (
          <Skeleton className="h-[132px]" />
        ) : latest ? (
          <LatestOrder order={latest} />
        ) : (
          <EmptyState title="No orders yet" text="When you place an order it will show here." actionLabel="Start shopping" actionHref="/product" />
        )}
      </section>

      {/* Quick facts */}
      <section className="grid md:grid-cols-3 grid-cols-1 gap-[16px] mb-[24px]">
        <Fact label="Orders" value={orders === null ? "…" : orders.length} href="/account/orders" linkLabel="View orders" />
        <Fact label="Wishlist" value={wishlistCount} href="/account/wishlist" linkLabel="View wishlist" />
        <Card className="flex flex-col justify-between gap-3">
          <div>
            <p className="text-[13px] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">Default address</p>
            {addresses === null ? (
              <Skeleton className="h-[48px] mt-2" />
            ) : defaultAddress ? (
              <div className="mt-2 text-[14px] leading-[1.5]">
                <p className="font-[600] text-[var(--color-primary)]">{defaultAddress.name}</p>
                {addressLines(defaultAddress).map((l) => (
                  <p key={l} className="text-[var(--color-text-muted)]">{l}</p>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[14px] text-[var(--color-text-muted)]">No saved address yet.</p>
            )}
          </div>
          <Link href="/account/addresses" className="text-[13px] text-[var(--color-link)] underline underline-offset-4">
            {defaultAddress ? "Manage addresses" : "Add an address"}
          </Link>
        </Card>
      </section>

      {/* Shortcuts */}
      <section aria-labelledby="shortcuts">
        <h2 id="shortcuts" className="text-[13px] uppercase tracking-[0.1em] text-[var(--color-text-muted)] mb-[10px]">
          Quick links
        </h2>
        <div className="grid md:grid-cols-4 grid-cols-2 gap-[12px]">
          {SHORTCUTS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="border border-[var(--border-subtle)] p-[16px] hover:border-[var(--color-primary)] transition-colors"
            >
              <p className="text-[14px] font-[600] text-[var(--color-primary)]">{s.label}</p>
              <p className="text-[12.5px] text-[var(--color-text-muted)] mt-1">{s.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

const Fact = ({ label, value, href, linkLabel }) => (
  <Card className="flex flex-col justify-between gap-3">
    <div>
      <p className="text-[13px] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">{label}</p>
      <p className="font-heading text-[32px] leading-none mt-2 text-[var(--color-text)]">{value}</p>
    </div>
    <Link href={href} className="text-[13px] text-[var(--color-link)] underline underline-offset-4">
      {linkLabel}
    </Link>
  </Card>
);

const LatestOrder = ({ order }) => {
  const first = order.items?.[0] || {};
  const more = (order.items?.length || 1) - 1;
  const stage = orderStage(order);
  const pay = paymentInfo(order);
  return (
    <Card className="flex flex-col sm:flex-row gap-[16px] sm:items-center">
      <img
        src={first.product?.image || "/logo/rj-house.svg"}
        alt=""
        className="w-[88px] h-[88px] object-contain bg-[var(--surface-product)] shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap gap-[8px] mb-[6px]">
          <Chip tone={stage.tone}>{stage.label}</Chip>
          <Chip tone={pay.tone}>{pay.label}</Chip>
        </div>
        <p className="text-[15px] font-[600] text-[var(--color-text)] truncate">
          {first.product?.title || "Jewelry"}
          {more > 0 ? ` and ${more} more` : ""}
        </p>
        <p className="text-[13px] text-[var(--color-text-muted)]">
          {order.order_number} · {formatDate(order.created_at)} · {orderAmount(order)}
        </p>
      </div>
      <Link
        href={`/account/orders?order=${encodeURIComponent(order.id)}`}
        className="self-start sm:self-center px-[20px] py-[10px] text-[13px] uppercase tracking-[0.28px] border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-text-on-dark)] transition-colors"
      >
        View order
      </Link>
    </Card>
  );
};

export default Overview;
