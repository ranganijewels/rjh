"use client";

import { useEffect, useMemo, useState } from "react";

// Enterprise Configurator — multi-metal (type → purity → color) + center carat +
// ring size, with LIVE price resolved by the backend pricing engine + BOM. Renders
// only when the product offers configurable metalOptions (product.metal_options).

const COLOR_HEX = {
  White: "#E8E8E8",
  Yellow: "#E6C200",
  Rose: "#E0A899",
  Silver: "#C0C0C0",
  Platinum: "#D6D6D6",
};

const chip = (active) =>
  `px-3 py-1.5 rounded-full text-[12px] font-[500] border transition-all duration-150 ${
    active
      ? "bg-[var(--teal-1)] text-white border-[var(--teal-1)]"
      : "bg-white text-[#222223] border-[var(--teal-3)] hover:border-[var(--teal-1)]"
  }`;

const RING_SIZES = [];
for (let s = 3; s <= 10; s += 0.5) RING_SIZES.push(s);

const Row = ({ label, children }) => (
  <div className="mb-3.5">
    <div className="text-[13px] font-[500] text-[#222223] mb-1.5">{label}</div>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

export default function Configurator({ product, onResolved }) {
  const options = product?.metal_options || [];
  const matrix = product?.weight_matrix || [];

  const [metalIdx, setMetalIdx] = useState(0);
  const metal = options[metalIdx] || {};
  const [purity, setPurity] = useState(metal.purities?.[0] || "");
  const [color, setColor] = useState(metal.colors?.[0] || "");

  const carats = useMemo(
    () =>
      matrix.length
        ? matrix.map((m) => Number(m.carat)).filter((n) => Number.isFinite(n))
        : [],
    [matrix]
  );
  const [carat, setCarat] = useState(
    carats[0] ?? Number(product?.diamond_weight_ct) ?? 1
  );
  const [size, setSize] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reset purity/color when the metal type changes
  useEffect(() => {
    setPurity(options[metalIdx]?.purities?.[0] || "");
    setColor(options[metalIdx]?.colors?.[0] || "");
  }, [metalIdx]); // eslint-disable-line

  // Resolve weights + live price on every change (debounced)
  useEffect(() => {
    if (!product?.id) return;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/productDetail/configure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            metalType: metal.type,
            purity,
            color,
            centerCt: Number(carat) || undefined,
            ringSize: size ? Number(size) : undefined,
          }),
        });
        const j = await res.json();
        if (j?.status && j?.data) {
          setResult(j.data);
          onResolved?.(j.data);
        }
      } catch {
        /* non-fatal */
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [metalIdx, purity, color, carat, size, product?.id]); // eslint-disable-line

  if (!options.length) return null;

  const price = result?.price?.finalPrice;
  const net = result?.weights?.netWeightG;

  return (
    <div className="mt-2 rounded-2xl border border-[var(--teal-3)] overflow-hidden">
      <div className="px-5 py-3" style={{ background: "var(--teal-1)" }}>
        <div className="text-white text-[14px] font-[600]">Configure Your Piece</div>
        <div className="text-[var(--teal-3)] text-[11px]">
          Live price recalculated from the BOM &amp; pricing engine
        </div>
      </div>

      <div className="p-5 bg-white">
        {/* Metal type */}
        <Row label="Metal">
          {options.map((o, i) => (
            <button key={o.type + i} className={chip(i === metalIdx)} onClick={() => setMetalIdx(i)}>
              {o.type}
            </button>
          ))}
        </Row>

        {/* Purity */}
        {!!(metal.purities || []).length && (
          <Row label="Purity / Karat">
            {metal.purities.map((p) => (
              <button key={p} className={chip(p === purity)} onClick={() => setPurity(p)}>
                {p}
              </button>
            ))}
          </Row>
        )}

        {/* Color */}
        {!!(metal.colors || []).length && (
          <Row label="Metal Color">
            {metal.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                title={c}
                className={`w-8 h-8 rounded-md border transition ${
                  c === color ? "ring-2 ring-[var(--teal-1)] border-[var(--teal-1)]" : "border-[var(--teal-3)]"
                }`}
                style={{ background: COLOR_HEX[c] || "#ddd" }}
              />
            ))}
          </Row>
        )}

        {/* Center carat */}
        {!!carats.length && (
          <Row label="Center Diamond Weight">
            {carats.map((ct) => (
              <button
                key={ct}
                className={chip(Number(ct) === Number(carat))}
                onClick={() => setCarat(ct)}
              >
                {ct.toFixed(2)} ct
              </button>
            ))}
          </Row>
        )}

        {/* Ring size */}
        <Row label="Ring Size (US)">
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="border border-[var(--teal-3)] rounded-md px-3 py-1.5 text-[13px]"
          >
            <option value="">Select size</option>
            {RING_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Row>

        {/* Live resolved result */}
        <div className="mt-4 pt-4 border-t border-[var(--teal-3)] flex items-end justify-between gap-3">
          <div className="text-[12px] text-[var(--placeholder)]">
            {net != null && (
              <div>
                Net metal weight:{" "}
                <span className="font-[600] text-[#222223]">{net} g</span>
                {result?.weights?.source && (
                  <span className="text-[11px] text-[var(--placeholder)]">
                    {" "}
                    ({result.weights.source})
                  </span>
                )}
              </div>
            )}
            {result?.variantCode && (
              <div className="text-[11px] text-[var(--placeholder)] truncate max-w-[260px]">
                {result.variantCode}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-[var(--placeholder)]">
              Live Price
            </div>
            <div className="text-[22px] font-[600] text-[var(--teal-1)]">
              {loading
                ? "…"
                : price != null
                ? `$${Number(price).toLocaleString()}`
                : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
