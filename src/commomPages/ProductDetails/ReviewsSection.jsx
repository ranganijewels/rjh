"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

const cormorant = { fontFamily: "var(--font-cormorant), serif" };

// Five stars; `value` (0–5) controls how many are filled.
function Stars({ value = 0, size = 16 }) {
  const v = Math.round(Number(value) || 0);
  return (
    <span
      className="inline-flex items-center"
      style={{ gap: 2, lineHeight: 1 }}
      aria-label={`${v} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= v ? "var(--teal-1)" : "none"}
          stroke="var(--teal-1)"
          strokeWidth="1.5"
          style={{ display: "block" }}
        >
          <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.77l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94L12 2.5z" />
        </svg>
      ))}
    </span>
  );
}

// Interactive 1–5 star picker for the form.
function StarPicker({ value, onChange }) {
  return (
    <span className="inline-flex items-center" style={{ gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          className="p-2 -m-1 transition-transform hover:scale-110"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <svg
            width={26}
            height={26}
            viewBox="0 0 24 24"
            fill={i <= value ? "var(--teal-1)" : "none"}
            stroke="var(--teal-1)"
            strokeWidth="1.5"
            style={{ display: "block" }}
          >
            <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.77l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94L12 2.5z" />
          </svg>
        </button>
      ))}
    </span>
  );
}

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const EMPTY_FORM = { name: "", email: "", rating: 5, title: "", body: "" };

const ReviewsSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ count: 0, average: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const [rRes, sRes] = await Promise.all([
        fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`, { cache: "no-store" }),
        fetch(`/api/reviews/summary?productId=${encodeURIComponent(productId)}`, { cache: "no-store" }),
      ]);
      const rJson = await rRes.json().catch(() => ({}));
      const sJson = await sRes.json().catch(() => ({}));
      setReviews(Array.isArray(rJson?.data) ? rJson.data : []);
      setSummary({
        count: Number(sJson?.data?.count) || 0,
        average: Number(sJson?.data?.average) || 0,
      });
    } catch {
      setReviews([]);
      setSummary({ count: 0, average: 0 });
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSuccessMsg("");

    if (!form.name.trim() || !form.email.trim() || !form.body.trim() || !form.rating) {
      toast.error("Please add your name, email, rating and review.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          customerName: form.name.trim(),
          email: form.email.trim(),
          rating: Number(form.rating),
          title: form.title.trim(),
          body: form.body.trim(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json?.status) {
        const msg =
          json.message ||
          "Thank you! Your review has been submitted and will appear once approved.";
        toast.success(msg);
        setSuccessMsg(msg);
        setForm(EMPTY_FORM);
      } else {
        toast.error(json?.message || "Could not submit your review. Please try again.");
      }
    } catch {
      toast.error("Could not submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!productId) return null;

  const inputClass =
    "w-full rounded-lg border border-[var(--grey-1)] bg-white px-4 py-3 text-[14px] text-[var(--grey-2)] outline-none focus:border-[var(--teal-1)] transition-colors";

  return (
    <section className="w-full px-[18px] md:px-[30px] py-[48px] border-t border-[var(--teal-3)]">
      {/* Ecksand-style centered summary header */}
      <div className="max-w-[680px] mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--teal-2)] mb-[10px]">
          What Our Clients Say
        </p>
        <h2
          className="text-[28px] md:text-[36px] font-[500] text-[var(--grey-2)]"
          style={cormorant}
        >
          Customer Reviews
        </h2>
        <div className="flex items-center justify-center gap-3 mt-[14px]">
          <Stars value={summary.average} size={20} />
          <span className="text-[16px] font-[600] text-[var(--grey-2)]">
            {summary.average ? summary.average.toFixed(1) : "0.0"}
          </span>
          <span className="text-[14px] text-[var(--placeholder)]">
            {summary.count === 1 ? "1 review" : `${summary.count} reviews`}
          </span>
        </div>
        {/* "Write a Review" button removed per feedback (reviews arrive via
            post-purchase email instead). */}
      </div>

      {/* Reviews list */}
      <div className="max-w-[820px] mx-auto mt-[36px]">
        {loading ? (
          <p className="text-[14px] text-center text-[var(--placeholder)]">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="text-[14px] text-center text-[var(--placeholder)]">
            No reviews yet. Be the first to share your experience.
          </p>
        ) : (
          <ul className="flex flex-col">
            {reviews.map((r, idx) => (
              <li
                key={r.id || idx}
                className={`py-[22px] ${idx > 0 ? "border-t border-[var(--teal-3)]" : ""}`}
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <Stars value={r.rating} size={15} />
                    <div className="text-[13px] font-[500] uppercase tracking-[0.06em] text-[var(--teal-1)] mt-[8px]">
                      {r.customerName || r.name || "Anonymous"}
                    </div>
                  </div>
                  <span className="text-[12px] text-[var(--placeholder)] whitespace-nowrap">
                    {formatDate(r.createdAt || r.created_at || r.date)}
                  </span>
                </div>
                {r.title ? (
                  <div
                    className="text-[19px] font-[500] text-[var(--grey-2)] mt-1"
                    style={cormorant}
                  >
                    {r.title}
                  </div>
                ) : null}
                {r.body ? (
                  <p className="text-[14px] leading-[1.7] text-[var(--grey-2)] mt-1">
                    {r.body}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Write a review — revealed by the button above (Ecksand pattern) */}
      {showForm && (
        <div className="max-w-[680px] mx-auto mt-[28px] border border-[var(--teal-3)] bg-white p-6">
          <h3
            className="text-[22px] font-[500] text-[var(--teal-1)] mb-1"
            style={cormorant}
          >
            Write a Review
          </h3>
          <p className="text-[12px] text-[var(--placeholder)] mb-5">
            All reviews are moderated before they appear.
          </p>

          {successMsg ? (
            <p className="mb-4 rounded-lg bg-[var(--teal-3)] px-4 py-3 text-[13px] text-[var(--teal-1)]">
              {successMsg}
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label htmlFor="review-name" className="sr-only">
              Your name
            </label>
            <input
              id="review-name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={setField("name")}
              className={inputClass}
              required
            />
            <label htmlFor="review-email" className="sr-only">
              Your email
            </label>
            <input
              id="review-email"
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={setField("email")}
              className={inputClass}
              required
            />

            <div className="flex items-center gap-3">
              <span className="text-[13px] text-[var(--grey-2)]">Rating</span>
              <StarPicker
                value={Number(form.rating)}
                onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
              />
            </div>

            <label htmlFor="review-title" className="sr-only">
              Review title (optional)
            </label>
            <input
              id="review-title"
              type="text"
              placeholder="Review title (optional)"
              value={form.title}
              onChange={setField("title")}
              className={inputClass}
            />
            <label htmlFor="review-body" className="sr-only">
              Your review
            </label>
            <textarea
              id="review-body"
              placeholder="Share your thoughts about this piece…"
              value={form.body}
              onChange={setField("body")}
              rows={4}
              className={`${inputClass} resize-y`}
              required
            />

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 rounded-lg bg-[var(--teal-1)] px-5 py-3 text-[14px] font-[600] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
