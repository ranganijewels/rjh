"use client";
import React, { useEffect, useMemo, useState } from "react";

// "Speak to an Expert" booking modal: pick a date (Mon–Fri), pick a free
// 30-minute slot (09:00–18:00 US Eastern), leave contact details. Slots come
// from /api/appointments/slots; booking posts to /api/appointments/book.
const TZ_LABEL = "US Eastern";

function nextWeekdays(count = 10) {
  const days = [];
  const d = new Date();
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;
    const ymd = d.toISOString().slice(0, 10);
    days.push({
      ymd,
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      day: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return days;
}

export default function BookAppointment({ open, onClose, product }) {
  const days = useMemo(() => nextWeekdays(10), []);
  const [date, setDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slot, setSlot] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setDate(null); setSlots([]); setSlot(null); setDone(false); setError("");
    }
  }, [open]);

  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    setSlot(null);
    fetch(`/api/appointments/slots?date=${date}`)
      .then((r) => r.json())
      .then((j) => setSlots(Array.isArray(j?.slots) ? j.slots : []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [date]);

  const submit = async () => {
    setError("");
    if (!form.name.trim() || !form.email.trim()) {
      setError("Please add your name and email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          slot,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          productId: product?.id || "",
          productName: product?.title || product?.name || "",
        }),
      });
      const j = await res.json();
      if (!res.ok || j?.status === false) {
        throw new Error(j?.message || "That slot may have just been taken — please pick another.");
      }
      setDone(true);
    } catch (e) {
      setError(e.message);
      // refresh slots in case ours was taken
      if (date) {
        fetch(`/api/appointments/slots?date=${date}`)
          .then((r) => r.json())
          .then((j) => setSlots(Array.isArray(j?.slots) ? j.slots : []))
          .catch(() => {});
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/45 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-[560px] sm:rounded-lg rounded-t-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-5 pb-3 border-b border-[var(--teal-3)]">
          <div>
            <h3 className="font-[var(--font-cormorant)] text-[22px] text-[var(--teal-1)] leading-tight">
              Speak to an Expert
            </h3>
            <p className="text-[12px] text-[var(--grey-2)] mt-[2px]">
              Free 30-minute consultation · Mon–Fri · 9:00–18:00 {TZ_LABEL}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-[22px] leading-none text-[var(--grey-2)] hover:text-[var(--teal-1)]">×</button>
        </div>

        {done ? (
          <div className="px-6 py-10 text-center space-y-3">
            <div className="text-[40px]">✓</div>
            <h4 className="font-[var(--font-cormorant)] text-[20px] text-[var(--teal-1)]">You're booked!</h4>
            <p className="text-[13px] text-[var(--grey-2)]">
              {date} at {slot} ({TZ_LABEL}). A confirmation email is on its way to {form.email}.
            </p>
            <button onClick={onClose} className="mt-2 px-6 py-2 bg-[var(--teal-1)] text-white text-[13px] uppercase tracking-[0.08em]">
              Done
            </button>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-5">
            {product?.title && (
              <p className="text-[12px] text-[var(--grey-2)]">
                Regarding: <span className="text-[var(--teal-1)] font-medium">{product.title}</span>
              </p>
            )}

            {/* 1 · date */}
            <div>
              <p className="text-[12px] uppercase tracking-[0.1em] text-[var(--grey-2)] mb-2">1 · Pick a day</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {days.map((d) => (
                  <button
                    key={d.ymd}
                    onClick={() => setDate(d.ymd)}
                    className={`flex flex-col items-center min-w-[64px] border px-3 py-2 text-[12px] transition-colors ${
                      date === d.ymd
                        ? "border-[var(--teal-1)] bg-[var(--teal-1)] text-white"
                        : "border-[var(--teal-3)] text-[var(--grey-2)] hover:border-[var(--teal-1)]"
                    }`}
                  >
                    <span className="uppercase text-[10px] tracking-[0.08em]">{d.label}</span>
                    <span className="text-[16px] font-medium leading-tight">{d.day}</span>
                    <span className="text-[10px]">{d.month}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2 · slot */}
            {date && (
              <div>
                <p className="text-[12px] uppercase tracking-[0.1em] text-[var(--grey-2)] mb-2">
                  2 · Pick a time ({TZ_LABEL})
                </p>
                {loadingSlots ? (
                  <p className="text-[13px] text-[var(--grey-2)]">Loading times…</p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {slots.map((s) => (
                      <button
                        key={s.time}
                        disabled={!s.available}
                        onClick={() => setSlot(s.time)}
                        className={`py-2 text-[12px] border transition-colors ${
                          slot === s.time
                            ? "border-[var(--teal-1)] bg-[var(--teal-1)] text-white"
                            : s.available
                            ? "border-[var(--teal-3)] text-[var(--grey-2)] hover:border-[var(--teal-1)]"
                            : "border-[var(--teal-3)] text-[var(--placeholder)] line-through cursor-not-allowed opacity-50"
                        }`}
                      >
                        {s.time}
                      </button>
                    ))}
                    {slots.length === 0 && (
                      <p className="col-span-full text-[13px] text-[var(--grey-2)]">No times for this day.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 3 · details */}
            {slot && (
              <div className="space-y-3">
                <p className="text-[12px] uppercase tracking-[0.1em] text-[var(--grey-2)]">3 · Your details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input className="border border-[var(--teal-3)] px-3 py-2 text-[13px] focus:outline-none focus:border-[var(--teal-1)]" placeholder="Full name *"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <input className="border border-[var(--teal-3)] px-3 py-2 text-[13px] focus:outline-none focus:border-[var(--teal-1)]" placeholder="Email *" type="email"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <input className="border border-[var(--teal-3)] px-3 py-2 text-[13px] focus:outline-none focus:border-[var(--teal-1)] sm:col-span-2" placeholder="Phone (optional)"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <textarea className="border border-[var(--teal-3)] px-3 py-2 text-[13px] focus:outline-none focus:border-[var(--teal-1)] sm:col-span-2" rows={2} placeholder="Anything we should prepare? (optional)"
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                {error && <p className="text-[12px] text-[var(--color-error)]">{error}</p>}
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="w-full py-3 bg-[var(--teal-1)] text-white text-[13px] uppercase tracking-[0.1em] hover:bg-[var(--teal-2)] disabled:opacity-60"
                >
                  {submitting ? "Booking…" : `Book ${date} · ${slot}`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
