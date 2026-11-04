"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCrudApi } from "@/hooks/useCrudApi";
import { ReturnRepair } from "./ReturnRepair";
import {
  AccountPageTitle,
  Card,
  Chip,
  EmptyState,
  Skeleton,
  ORDER_STEPS,
  formatDate,
  orderAmount,
  orderStage,
  paymentInfo,
} from "./ui";

const FILTERS = [
  { key: "all", label: "All", test: () => true },
  { key: "progress", label: "In progress", test: (o) => { const s = orderStage(o).step; return s >= 0 && s < 4; } },
  { key: "delivered", label: "Delivered", test: (o) => orderStage(o).step === 4 },
  { key: "cancelled", label: "Cancelled", test: (o) => orderStage(o).step === -1 },
];

const readAccount = () => {
  try {
    const raw = localStorage.getItem("userRJHouse") || localStorage.getItem("user");
    const u = raw ? JSON.parse(raw) : {};
    return { name: u?.name || u?.fullName || "", email: u?.email || "" };
  } catch {
    return {};
  }
};

/** A wide right-hand panel (order details, returns). */
const Drawer = ({ open, onClose, title, children }) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCloseRef.current?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} className="absolute top-0 right-0 h-full w-full max-w-[640px] bg-[var(--surface-card)] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-[var(--surface-card)] border-b border-[var(--border-subtle)] px-[20px] lg:px-[28px] py-[16px]">
          <p className="text-[16px] font-[600] text-[var(--color-text)]">{title}</p>
          <button type="button" aria-label="Close" onClick={onClose} className="p-2">
            <img src="/icons/close.svg" className="w-[12px] h-[12px]" alt="" />
          </button>
        </div>
        <div className="px-[20px] lg:px-[28px] py-[20px]">{children}</div>
      </div>
    </div>
  );
};

const Orders = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [returnOpen, setReturnOpen] = useState(false);
  const [invoiceBusy, setInvoiceBusy] = useState(null);
  const { fetchAll } = useCrudApi("/api/orders");

  useEffect(() => {
    fetchAll()
      .then((r) => {
        const list = [...(r?.data || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setOrders(list);
      })
      .catch(() => setOrders([]));
  }, [fetchAll]);

  // /account/orders?order=<id> (from the dashboard) opens that order.
  useEffect(() => {
    const id = params.get("order");
    if (id && orders) setSelected(orders.find((o) => String(o.id) === id) || null);
  }, [params, orders]);

  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f.key, (orders || []).filter(f.test).length])),
    [orders]
  );
  const visible = (orders || []).filter(FILTERS.find((f) => f.key === filter).test);

  const closeDetail = () => {
    setSelected(null);
    if (params.get("order")) router.replace("/account/orders", { scroll: false });
  };

  const invoice = async (order, download) => {
    setInvoiceBusy(order.id);
    try {
      const mod = await import("@/lib/invoice/orderInvoice");
      if (download) await mod.downloadOrderInvoice(order, { account: readAccount() });
      else await mod.openOrderInvoice(order, { account: readAccount() });
    } catch (err) {
      console.error("Error generating invoice:", err);
    } finally {
      setInvoiceBusy(null);
    }
  };

  return (
    <>
      <AccountPageTitle title="Orders" description="Track your orders, download invoices and request returns." />

      {orders === null ? (
        <div className="space-y-[12px]">
          <Skeleton className="h-[112px]" />
          <Skeleton className="h-[112px]" />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState title="No orders yet" text="Your orders will appear here once you place one." actionLabel="Start shopping" actionHref="/product" />
      ) : (
        <>
          <div role="tablist" aria-label="Filter orders" className="flex gap-[8px] overflow-x-auto hide-scrollbar overflow-y-hidden! mb-[16px]">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={`whitespace-nowrap px-[14px] py-[8px] text-[13px] border transition-colors ${
                  filter === f.key
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text-on-dark)]"
                    : "border-[var(--border-subtle)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]"
                }`}
              >
                {f.label} ({counts[f.key]})
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="text-[14px] text-[var(--color-text-muted)] py-[24px]">No orders here.</p>
          ) : (
            <ul className="space-y-[12px]">
              {visible.map((o) => (
                <li key={o.id}>
                  <OrderRow order={o} onOpen={() => setSelected(o)} onInvoice={() => invoice(o, false)} busy={invoiceBusy === o.id} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <Drawer open={!!selected && !returnOpen} onClose={closeDetail} title={selected ? `Order ${selected.order_number}` : ""}>
        {selected && (
          <OrderDetail
            order={selected}
            busy={invoiceBusy === selected.id}
            onInvoice={() => invoice(selected, true)}
            onReturn={() => setReturnOpen(true)}
          />
        )}
      </Drawer>

      <Drawer open={returnOpen} onClose={() => setReturnOpen(false)} title={selected ? `Return or repair · ${selected.order_number}` : "Return or repair"}>
        <ReturnRepair order={selected} />
      </Drawer>
    </>
  );
};

const OrderRow = ({ order, onOpen, onInvoice, busy }) => {
  const first = order.items?.[0] || {};
  const more = (order.items?.length || 1) - 1;
  const stage = orderStage(order);
  const pay = paymentInfo(order);
  return (
    <Card className="flex flex-col sm:flex-row gap-[16px] sm:items-center">
      <img src={first.product?.image || "/logo/rj-house.svg"} alt="" className="w-[80px] h-[80px] object-contain bg-[var(--surface-product)] shrink-0" />
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
          {order.order_number} · {formatDate(order.created_at)}
        </p>
      </div>
      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-[8px]">
        <p className="text-[16px] font-[600] text-[var(--color-text)]">{orderAmount(order)}</p>
        <div className="flex gap-[8px]">
          <button type="button" onClick={onInvoice} disabled={busy} className="px-[14px] py-[8px] text-[12px] uppercase tracking-[0.28px] border border-[var(--border-strong)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-50">
            {busy ? "Preparing…" : "Invoice"}
          </button>
          <button type="button" onClick={onOpen} className="px-[14px] py-[8px] text-[12px] uppercase tracking-[0.28px] bg-[var(--color-primary)] text-[var(--color-text-on-dark)] hover:bg-[var(--color-primary-hover)]">
            View details
          </button>
        </div>
      </div>
    </Card>
  );
};

const Section = ({ title, children }) => (
  <section className="py-[16px] border-b border-[var(--border-subtle)] last:border-b-0">
    <h3 className="text-[12px] uppercase tracking-[0.1em] text-[var(--color-text-muted)] mb-[10px]">{title}</h3>
    {children}
  </section>
);

const OrderDetail = ({ order, onInvoice, onReturn, busy }) => {
  const stage = orderStage(order);
  const pay = paymentInfo(order);
  const unpaidOnline = pay.label === "Payment pending" || pay.label === "Payment failed";
  return (
    <div>
      <div className="flex flex-wrap items-center gap-[8px]">
        <Chip tone={stage.tone}>{stage.label}</Chip>
        <Chip tone={pay.tone}>{pay.label}</Chip>
        <span className="text-[13px] text-[var(--color-text-muted)]">Placed {formatDate(order.created_at)}</span>
      </div>

      <Section title="Status">
        {stage.step < 0 ? (
          <p className="text-[14px] text-[var(--color-text-muted)]">This order was cancelled.</p>
        ) : (
          <ol className="flex items-start">
            {ORDER_STEPS.map((label, i) => {
              const done = i <= stage.step;
              return (
                <li key={label} className="flex-1 flex flex-col items-center text-center relative">
                  {i > 0 && (
                    <span aria-hidden className={`absolute top-[9px] right-1/2 w-full h-[2px] ${i <= stage.step ? "bg-[var(--color-primary)]" : "bg-[var(--border-subtle)]"}`} />
                  )}
                  <span
                    aria-hidden
                    className={`relative z-[1] w-[20px] h-[20px] rounded-full border-2 ${
                      done ? "bg-[var(--color-primary)] border-[var(--color-primary)]" : "bg-[var(--surface-card)] border-[var(--border-strong)]"
                    }`}
                  />
                  <span className={`mt-[6px] text-[11.5px] leading-tight ${i === stage.step ? "font-[600] text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"}`}>
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
        <p className="sr-only">Current status: {stage.label}</p>
      </Section>

      {unpaidOnline && stage.step >= 0 && (
        <div className="my-[12px] p-[12px] bg-[var(--color-warning-tint)] text-[13px] text-[var(--color-warning)]">
          {pay.label === "Payment failed"
            ? "We didn't receive the payment for this order. "
            : "We haven't received the payment for this order yet. "}
          If you were charged or need help,{" "}
          <Link href="/account/support" className="underline">contact us</Link>.
        </div>
      )}

      <Section title={`Items (${order.items?.length || 0})`}>
        <ul className="space-y-[14px]">
          {(order.items || []).map((it, i) => (
            <li key={i} className="flex gap-[12px]">
              <img src={it.product?.image || "/logo/rj-house.svg"} alt="" className="w-[64px] h-[64px] object-contain bg-[var(--surface-product)] shrink-0" />
              <div className="min-w-0 flex-1 text-[13px] leading-[1.5]">
                <p className="text-[14px] font-[600] text-[var(--color-text)]">{it.product?.title}</p>
                <p className="text-[var(--color-text-muted)]">
                  {[
                    [it.metal_type, it.metal_color].filter(Boolean).join(" "),
                    it.diamond_shape,
                    Number(it.center_diamond_weight) ? `${it.center_diamond_weight} ct` : "",
                    it.ring_size && it.ring_size !== "-" ? `Size ${it.ring_size}` : "",
                    it.engraving ? `Engraving “${it.engraving}”` : "",
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className="text-[var(--color-text-muted)]">Qty {it.quantity}</p>
              </div>
              <p className="text-[14px] font-[600] text-[var(--color-text)] whitespace-nowrap">
                ${Number(it.line_total ?? it.price * it.quantity).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-[14px] pt-[12px] border-t border-[var(--border-subtle)] text-[14px]">
          <span className="text-[var(--color-text-muted)]">Total{order.currency_code && order.currency_code !== "USD" ? ` (charged in ${order.currency_code})` : ""}</span>
          <span className="font-[600] text-[var(--color-text)]">{orderAmount(order)}</span>
        </div>
      </Section>

      <Section title="Delivery">
        <p className="text-[14px] leading-[1.6] text-[var(--color-text)] break-words">{order.customer_address || "—"}</p>
        {(order.tracking_number || order.courier_name) && (
          <div className="mt-[10px] text-[13px] text-[var(--color-text-muted)]">
            {order.courier_name && <p>Courier: {order.courier_name}</p>}
            {order.tracking_number && <p>Tracking number: {order.tracking_number}</p>}
            {order.tracking_url && (
              <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-link)] underline">
                Track shipment
              </a>
            )}
          </div>
        )}
      </Section>

      <div className="flex flex-wrap gap-[10px] pt-[16px]">
        <button type="button" onClick={onInvoice} disabled={busy} className="px-[18px] py-[10px] text-[13px] uppercase tracking-[0.28px] bg-[var(--color-primary)] text-[var(--color-text-on-dark)] hover:bg-[var(--color-primary-hover)] disabled:opacity-50">
          {busy ? "Preparing…" : "Download invoice"}
        </button>
        {stage.step >= 0 && (
          <button type="button" onClick={onReturn} className="px-[18px] py-[10px] text-[13px] uppercase tracking-[0.28px] border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--surface-band)]">
            Return or repair
          </button>
        )}
        <Link href="/account/support" className="px-[18px] py-[10px] text-[13px] uppercase tracking-[0.28px] text-[var(--color-link)] underline underline-offset-4">
          Need help?
        </Link>
      </div>
    </div>
  );
};

export default Orders;
