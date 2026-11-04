"use client";

import React, { useState } from "react";
import Typography from "@/components/ui/Typography/Typography";
import Modal from "@/components/ui/Modal/Modal";
import CenterDialog from "./CenterDialog";
import AddressForm from "./AddressForm";

const SHOWN = 4;

/** "Name\nLine 1, Line 2\nCity, State PIN, Country" in 2–3 short lines. */
export const addressLines = (a) =>
  [
    [a.address_line1, a.address_line2].filter(Boolean).join(", "),
    [[a.city, a.state].filter(Boolean).join(", "), a.pincode].filter(Boolean).join(" ") +
      (a.country ? `, ${a.country}` : ""),
  ].filter((l) => l.trim());

const AddressCard = ({ address, selected, onSelect }) => (
  <label
    className={`flex gap-3 p-[14px] border cursor-pointer transition-colors ${
      selected ? "border-[var(--teal-1)] bg-[var(--grey-00)]" : "border-[var(--teal-3)] hover:border-[var(--teal-1)]"
    }`}
  >
    <input
      type="radio"
      name="delivery-address"
      aria-label={`Deliver to ${address.name || address.label}, ${addressLines(address).join(", ")}`}
      className="mt-1 accent-[var(--teal-1)]"
      checked={selected}
      onChange={() => onSelect(address)}
    />
    <div className="min-w-0 text-[14px] leading-[1.5]">
      <div className="flex items-center gap-2">
        <span className="font-[600] text-[var(--teal-1)]">{address.name || "—"}</span>
        <span className="text-[11px] uppercase tracking-wide border border-[var(--teal-3)] px-1.5">{address.label}</span>
        {address.is_default ? <span className="text-[11px] text-[var(--grey-2)]">Default</span> : null}
      </div>
      {addressLines(address).map((l) => (
        <div key={l} className="text-[var(--grey-2)]">{l}</div>
      ))}
      {address.phone && <div className="text-[var(--grey-2)]">Phone: {address.phone}</div>}
    </div>
  </label>
);

/**
 * Checkout's delivery address. Two flows only:
 *  - Saved addresses: "Delivering to" the default (or chosen) one, with
 *    Change → saved list (4, then "Show more") and "Add new delivery address"
 *    in a pop-up.
 *  - No saved address: "Add new delivery address" opens a side panel. For a
 *    signed-in customer the address is saved to My Address.
 * Guests enter the address (and email) the same way; it's used for this
 * order only, since there's no account to save it to.
 */
const DeliveryAddress = ({ addresses, selected, onSelect, onAdd, isGuest, guestEmail, defaultCountry, loading }) => {
  const [changing, setChanging] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const hasSaved = addresses.length > 0;
  const visible = showAll ? addresses : addresses.slice(0, SHOWN);

  const save = async (values, close) => {
    setSaving(true);
    try {
      const ok = await onAdd(values);
      if (ok) {
        close();
        setChanging(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const form = (close) => (
    <AddressForm
      askEmail={isGuest}
      initial={isGuest && selected ? { ...selected, email: guestEmail } : undefined}
      defaultCountry={defaultCountry}
      submitting={saving}
      submitLabel={isGuest ? "Deliver here" : "Save and deliver here"}
      onSubmit={(v) => save(v, close)}
      onCancel={close}
    />
  );

  return (
    <div className="border border-[var(--teal-3)] p-[16px] lg:p-[24px]">
      <div className="flex items-start justify-between gap-4">
        <Typography variant="h4" className="font-[500]">
          {selected && !changing ? "Delivering to" : "Delivery address"}
        </Typography>
        {selected && !changing && (
          <button
            type="button"
            onClick={() => (hasSaved ? setChanging(true) : setPanelOpen(true))}
            className="text-[13px] uppercase tracking-wide text-[var(--teal-1)] underline underline-offset-4"
          >
            Change
          </button>
        )}
      </div>

      {loading ? (
        <div className="mt-4 h-[60px] animate-pulse bg-[var(--grey-00)]" />
      ) : selected && !changing ? (
        <div className="mt-3 text-[14px] leading-[1.6]">
          <div className="font-[600] text-[var(--teal-1)]">
            {selected.name}
            {selected.phone ? <span className="font-[400] text-[var(--grey-2)]"> · {selected.phone}</span> : null}
          </div>
          {addressLines(selected).map((l) => (
            <div key={l} className="text-[var(--grey-2)]">{l}</div>
          ))}
        </div>
      ) : hasSaved ? (
        <div className="mt-4 space-y-[10px]">
          {visible.map((a) => (
            <AddressCard
              key={a.id}
              address={a}
              selected={selected?.id === a.id}
              onSelect={(addr) => {
                onSelect(addr);
                setChanging(false);
                setShowAll(false);
              }}
            />
          ))}
          {addresses.length > SHOWN && !showAll && (
            <button type="button" onClick={() => setShowAll(true)} className="text-[13px] text-[var(--teal-1)] underline underline-offset-4">
              Show more addresses ({addresses.length - SHOWN})
            </button>
          )}
          <button
            type="button"
            onClick={() => setPopupOpen(true)}
            className="w-full border border-dashed border-[var(--teal-1)] p-[12px] text-[14px] text-[var(--teal-1)] hover:bg-[var(--grey-00)]"
          >
            + Add new delivery address
          </button>
          {selected && (
            <button type="button" onClick={() => setChanging(false)} className="text-[13px] text-[var(--grey-2)] underline underline-offset-4">
              Keep the current address
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="mt-4 w-full border border-dashed border-[var(--teal-1)] p-[16px] text-[14px] text-[var(--teal-1)] hover:bg-[var(--grey-00)]"
        >
          + Add new delivery address
        </button>
      )}

      {/* Saved-address users: pop-up */}
      <CenterDialog isOpen={popupOpen} onClose={() => setPopupOpen(false)} title="Add new delivery address">
        {popupOpen && form(() => setPopupOpen(false))}
      </CenterDialog>

      {/* First address: side panel */}
      <Modal isOpen={panelOpen} onClose={() => setPanelOpen(false)} title={selected && isGuest ? "Edit delivery address" : "Add new delivery address"}>
        <div className="px-[30px] pb-[30px] overflow-y-auto max-h-[calc(100vh-80px)]">
          {panelOpen && form(() => setPanelOpen(false))}
        </div>
      </Modal>
    </div>
  );
};

export default DeliveryAddress;
