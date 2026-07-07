"use client";
import { useState } from "react";
import toast from "react-hot-toast";

// Ecksand-style "Get in touch with one of our Expert Designers" block.
// Submissions post to /api/customize (the custom-requests pipeline), so they
// arrive in the CMS Custom Requests inbox alongside bespoke design enquiries.
// Copy is CMS-driven via pdp-content `expert_contact`.
const EMPTY = { name: "", email: "", phone: "", message: "" };

const ExpertContact = ({ config, productName }) => {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  if (config && config.enabled === false) return null;

  const eyebrow = config?.eyebrow || "Here To Help";
  const heading = config?.heading || "Get in touch with one of our Expert Designers";
  const description =
    config?.description ||
    "Questions about this piece, sizing, or a bespoke idea? Our designers reply within one business day.";

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please add your name, email and message.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/customize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          jewelry_type: "Expert Designer Enquiry",
          description: `${productName ? `Product: ${productName}\n` : ""}${form.message.trim()}`,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json?.status) {
        setSent(true);
        setForm(EMPTY);
        toast.success("Thank you — a designer will be in touch shortly.");
      } else {
        toast.error(json?.message || "Could not send your message. Please try again.");
      }
    } catch {
      toast.error("Could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-[var(--teal-3)] bg-white px-4 py-3 text-[14px] text-[var(--grey-2)] outline-none focus:border-[var(--teal-1)] transition-colors";

  return (
    <section className="md:px-[30px] px-[18px]">
      <div className="max-w-[680px] mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--teal-2)] mb-[10px]">
          {eyebrow}
        </p>
        <h2 className="font-[var(--font-cormorant)] text-[28px] md:text-[36px] font-medium leading-[1.15] text-[var(--grey-2)]">
          {heading}
        </h2>
        <p className="text-[14px] md:text-[15px] leading-[1.8] text-[var(--placeholder)] mt-[14px]">
          {description}
        </p>

        {sent ? (
          <p className="mt-[26px] border border-[var(--teal-3)] bg-white px-5 py-4 text-[14px] text-[var(--teal-1)]">
            Thank you — your message is with our designers. We'll reply within
            one business day.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-[26px] grid grid-cols-1 md:grid-cols-2 gap-[12px] text-left">
            <label htmlFor="expert-name" className="sr-only">Your name</label>
            <input id="expert-name" type="text" placeholder="Your name*" value={form.name} onChange={setField("name")} className={inputClass} required />
            <label htmlFor="expert-email" className="sr-only">Your email</label>
            <input id="expert-email" type="email" placeholder="Your email*" value={form.email} onChange={setField("email")} className={inputClass} required />
            <label htmlFor="expert-phone" className="sr-only">Phone (optional)</label>
            <input id="expert-phone" type="tel" placeholder="Phone (optional)" value={form.phone} onChange={setField("phone")} className={`${inputClass} md:col-span-2`} />
            <label htmlFor="expert-message" className="sr-only">Your message</label>
            <textarea id="expert-message" placeholder="How can we help?*" rows={4} value={form.message} onChange={setField("message")} className={`${inputClass} md:col-span-2 resize-y`} required />
            <div className="md:col-span-2 flex justify-center">
              <button
                type="submit"
                disabled={submitting}
                className="mt-[6px] inline-flex items-center bg-[var(--teal-1)] px-[34px] py-[12px] text-[12px] uppercase tracking-[0.1em] text-white transition-colors hover:bg-[var(--teal-2)] disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send Message"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default ExpertContact;
