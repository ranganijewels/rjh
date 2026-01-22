"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { NextIcon, PreviousIcon } from "@/components/Icons/common";
import Typography from "../Typography/Typography";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIME_SLOTS = [
  { label: "10:00 AM - 11:00 AM", available: true },
  { label: "11:00 AM - 12:00 PM", available: true },
  { label: "1:00 PM - 2:00 PM", available: true },
  { label: "4:00 PM - 5:00 PM", available: false },
  { label: "5:00 PM - 6:00 PM", available: true },
];

const AppointmentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthLabel = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  return (
    <div className="bg-white rounded-md p-[28px_30px] w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-[32px]">
        <button onClick={handlePrevMonth} className="text-xl">
          <PreviousIcon />
        </button>
        <p className="font-medium text-[16px]">{monthLabel}</p>
        <button onClick={handleNextMonth} className="text-xl">
          <NextIcon />
        </button>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 text-center text-[12px] text-gray-400 mb-2">
        {DAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-2 justify-items-center text-center text-[14px]">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1;
          const isSelected = selectedDate === date;

          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={clsx(
                "w-9 h-9 rounded-md",
                isSelected
                  ? "bg-[var(--teal-1)] text-white"
                  : "hover:bg-gray-100"
              )}
            >
              {date}
            </button>
          );
        })}
      </div>

      {/* Timings */}
      {selectedDate && (
        <div className="mt-[42px]">
          <Typography variant="h4" className="text-center mb-[32px]">
            Timings
          </Typography>

          <div className="flex flex-wrap justify-center gap-3">
            {TIME_SLOTS.map((slot, index) => (
              <button
                key={index}
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot.label)}
                className={clsx(
                  "px-[20px] py-[10px] border rounded-[4px] text-[12px]",

                  selectedSlot === slot.label
                    ? "bg-[var(--grey-1)] border-[var(--grey-1)] text-[var(--grey-2)]"
                    : "bg-transparent border-[var(--grey-1)] text-[var(--grey-2)] hover:border-[var(--teal-1)]"
                )}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;
