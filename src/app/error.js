"use client";

import Link from "next/link";

// Branded runtime-error boundary — a live store must never show a raw stack.
export default function Error({ error, reset }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-[var(--grey-00)]">
      <p className="text-[12px] tracking-[0.3em] uppercase text-[var(--placeholder)] mb-4">
        Something went wrong
      </p>
      <h1
        className="text-[40px] leading-tight text-[var(--teal-1)] mb-3"
        style={{ fontFamily: "var(--font-cormorant), serif" }}
      >
        A momentary flaw in the setting
      </h1>
      <p className="text-[15px] text-[var(--grey-2)] max-w-[440px] mb-8">
        Our artisans have been notified. Please try again — or return to the
        collection while we polish things up.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="px-7 py-3 rounded-full bg-[var(--teal-1)] text-white text-[13px] font-[600] hover:opacity-90 transition"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-7 py-3 rounded-full border border-[var(--teal-1)] text-[var(--teal-1)] text-[13px] font-[600] hover:bg-[var(--teal-1)] hover:text-white transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
