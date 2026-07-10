"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePreferences } from "@/context/PreferencesContext";
import { formatProductPrice } from "@/utils/money";

// Small "Pair It With" cards under the FAQs (Ecksand's "Pairs Well With"):
// admin-picked products (metadata.pairsWith) with a Wedding-Bands fallback.
export default function PairItWith({ pairsWith = [], excludeId }) {
  const [items, setItems] = useState([]);
  const [prices, setPrices] = useState({});
  const { selectedCountry } = usePreferences();

  useEffect(() => {
    const qs = new URLSearchParams();
    if (pairsWith?.length) qs.set("ids", pairsWith.join(","));
    if (excludeId) qs.set("exclude", excludeId);
    fetch(`/api/product/pair-with?${qs.toString()}`)
      .then((r) => r.json())
      .then(async (j) => {
        const list = j?.data || [];
        setItems(list);
        // Live engine price per card (small count — fine).
        const entries = await Promise.all(
          list.map((it) =>
            fetch("/api/productDetail/get-amount", {
              method: "POST",
              headers: { "Content-Type": "application/json", currency: selectedCountry?.currency || "" },
              body: JSON.stringify({ product_id: it.id }),
            })
              .then((r) => r.json())
              .then((res) => [it.id, res?.data?.total_price || null])
              .catch(() => [it.id, null])
          )
        );
        setPrices(Object.fromEntries(entries));
      })
      .catch(() => setItems([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(pairsWith), excludeId]);

  if (!items.length) return null;

  return (
    <div className="pt-[18px]">
      <p className="text-[12px] uppercase tracking-[0.18em] text-[var(--grey-2)] mb-[12px]">
        Pair It With
      </p>
      <div className="grid grid-cols-3 gap-[10px]">
        {items.map((it) => (
          <Link key={it.id} href={`/product/${it.id}`} className="group block text-center">
            <div className="bg-[var(--product-bg)] aspect-square overflow-hidden mb-[6px]">
              {it.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={it.image}
                  alt={it.title}
                  loading="lazy"
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              ) : null}
            </div>
            <p className="text-[11px] leading-snug text-[var(--grey-2)] line-clamp-2">{it.title}</p>
            {prices[it.id] > 0 && (
              <p className="text-[11px] font-medium text-[var(--teal-1)] mt-[2px]">
                From {formatProductPrice(Math.floor(prices[it.id]), selectedCountry)}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
