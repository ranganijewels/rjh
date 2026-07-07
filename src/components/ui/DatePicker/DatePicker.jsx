"use client";

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { NextIcon, PreviousIcon } from "@/components/Icons/common";
import { Calendar } from "lucide-react";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DatePicker({
  label,
  value,
  onChange,
  placeholder = "dd-mm-yyyy",
}) {
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);

  const today = new Date();
  const [month, setMonth] = useState(
    value ? value.getMonth() : today.getMonth()
  );
  const [year, setYear] = useState(
    value ? value.getFullYear() : today.getFullYear()
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const firstDay = new Date(year, month, 1).getDay() || 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const formatValue = (date) =>
    date
      ? `${String(date.getDate()).padStart(2, "0")}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${date.getFullYear()}`
      : "";

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* LABEL */}
      {label && (
        <label className="block lg:text-[16px] text-[12px] font-[400] text-[var(--grey-2)] mb-2 capitalize">
          {label}
        </label>
      )}

      {/* INPUT + ICON */}
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={label ? `${label} date picker` : "Open date picker"}
        className="flex items-center border-b border-[var(--grey-2)] cursor-pointer"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <input
          readOnly
          value={formatValue(value)}
          placeholder={placeholder}
          tabIndex={-1}
          className="w-full py-[10px] outline-none bg-transparent text-[14px]"
        />

        {/* ICON */}
        <span className="ml-2 flex items-center text-[var(--teal-2)]">
          <Calendar size={18} />
        </span>
      </div>

      {/* CALENDAR */}
      {open && (
        <div className="absolute z-50 mt-2 bg-[var(--product-bg)] p-3 w-[260px] shadow-md">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() =>
                month === 0
                  ? (setMonth(11), setYear(year - 1))
                  : setMonth(month - 1)
              }
            >
              <PreviousIcon />
            </button>

            <span className="text-sm font-medium">
              {MONTHS[month]}, {year}
            </span>

            <button
              onClick={() =>
                month === 11
                  ? (setMonth(0), setYear(year + 1))
                  : setMonth(month + 1)
              }
            >
              <NextIcon />
            </button>
          </div>

          {/* DAYS */}
          <div className="grid grid-cols-7 text-center text-xs mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-[var(--teal-1)]">
                {d}
              </div>
            ))}
          </div>

          {/* DATES */}
          <div className="grid grid-cols-7 text-center text-sm gap-y-1">
            {Array.from({ length: firstDay - 1 }).map((_, i) => (
              <div key={i} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const selected =
                value &&
                value.getDate() === day &&
                value.getMonth() === month &&
                value.getFullYear() === year;

              return (
                <button
                  key={day}
                  onClick={() => {
                    onChange(new Date(year, month, day));
                    setOpen(false);
                  }}
                  className={clsx(
                    "w-7 h-7 mx-auto rounded",
                    selected
                      ? "bg-[var(--teal-1)] text-white"
                      : "hover:bg-gray-100"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* FOOTER */}
          <div className="flex justify-between mt-3 text-xs">
            <button
              className="text-[var(--teal-1)]"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
            >
              Clear
            </button>
            <button
              className="text-[var(--teal-1)]"
              onClick={() => {
                onChange(new Date());
                setOpen(false);
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
