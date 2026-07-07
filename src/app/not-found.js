import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

// Branded 404 — keeps lost visitors shopping instead of bouncing.
export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-[var(--grey-00)]">
      <p className="text-[12px] tracking-[0.3em] uppercase text-[var(--placeholder)] mb-4">
        Error 404
      </p>
      <h1 className="font-cormorant text-[20px] sm:text-[28px] md:text-[32px] lg:text-[44px] leading-tight text-[var(--teal-1)] mb-3">
        This page has slipped away
      </h1>
      <p className="text-[15px] text-[var(--grey-2)] max-w-[440px] mb-8">
        Like a rare diamond, what you&apos;re looking for is one of a kind — but it
        isn&apos;t here. Let us guide you back to the collection.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="px-7 py-3 rounded-full bg-[var(--teal-1)] text-white text-[13px] font-[600] hover:opacity-90 transition"
        >
          Back to Home
        </Link>
        <Link
          href="/product"
          className="px-7 py-3 rounded-full border border-[var(--teal-1)] text-[var(--teal-1)] text-[13px] font-[600] hover:bg-[var(--teal-1)] hover:text-white transition"
        >
          Explore the Collection
        </Link>
      </div>
    </div>
  );
}
