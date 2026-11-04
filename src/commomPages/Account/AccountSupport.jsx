"use client";

import React from "react";
import Link from "next/link";
import { useSiteContact } from "@/context/SiteContactContext";
import { AccountPageTitle, Card } from "./ui";

const HELP_LINKS = [
  { label: "Track an order", href: "/track-order" },
  { label: "Returns", href: "/easy-return" },
  { label: "Resize & repair", href: "/resize-repair-request" },
  { label: "Book an appointment", href: "/book-an-appointment" },
  { label: "Ring size guide", href: "/ring-size-guide" },
  { label: "FAQs", href: "/faqs" },
];

// Opens the site-wide live chat (components/chat/LiveChat) through its button.
const openLiveChat = () => document.querySelector('button[aria-label="Open live chat"]')?.click();

/** Account ▸ Support. (components/…/Support stays as the block on the contact pages.) */
const AccountSupport = () => {
  const contact = useSiteContact();
  return (
    <>
      <AccountPageTitle title="Support" description="Questions about an order, sizing or care? We're here to help." />

      <div className="grid md:grid-cols-3 grid-cols-1 gap-[16px] mb-[24px]">
        {contact.phone && (
          <Card className="flex flex-col gap-[8px]">
            <h2 className="text-[16px] font-[600] text-[var(--color-text)]">Call us</h2>
            <a href={contact.phoneHref} className="text-[15px] font-[600] text-[var(--color-primary)] hover:underline">
              {contact.phone}
            </a>
            {contact.hours && <p className="text-[13px] text-[var(--color-text-muted)]">{contact.hours}</p>}
          </Card>
        )}
        {contact.email && (
          <Card className="flex flex-col gap-[8px]">
            <h2 className="text-[16px] font-[600] text-[var(--color-text)]">Email us</h2>
            <a href={`mailto:${contact.email}`} className="text-[15px] font-[600] text-[var(--color-primary)] hover:underline break-all">
              {contact.email}
            </a>
            <p className="text-[13px] text-[var(--color-text-muted)]">Our jewellery team replies by email.</p>
          </Card>
        )}
        <Card className="flex flex-col gap-[8px]">
          <h2 className="text-[16px] font-[600] text-[var(--color-text)]">Live chat</h2>
          <p className="text-[13px] text-[var(--color-text-muted)]">Chat with us here on the website.</p>
          <button
            type="button"
            onClick={openLiveChat}
            className="self-start mt-auto px-[18px] py-[10px] text-[13px] uppercase tracking-[0.28px] bg-[var(--color-primary)] text-[var(--color-text-on-dark)] hover:bg-[var(--color-primary-hover)]"
          >
            Start chat
          </button>
        </Card>
      </div>

      <h2 className="text-[13px] uppercase tracking-[0.1em] text-[var(--color-text-muted)] mb-[10px]">Help with</h2>
      <div className="grid md:grid-cols-3 grid-cols-2 gap-[12px]">
        {HELP_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="border border-[var(--border-subtle)] p-[14px] text-[14px] font-[500] text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
};

export default AccountSupport;
