"use client";

import React, { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button/Button";
import Modal from "@/components/ui/Modal/Modal";
import { useCrudApi } from "@/hooks/useCrudApi";
import toast from "react-hot-toast";
import AddressForm from "@/commomPages/Cart/checkout/AddressForm";
import { addressLines } from "@/commomPages/Cart/checkout/DeliveryAddress";
import { AccountPageTitle, EmptyState, Skeleton } from "./ui";

// Profile ▸ Addresses. Adding and editing use the same side panel and form as
// checkout's "Add new delivery address", so both save the same fields.
const toPayload = (v) => ({
  label: v.label,
  name: v.name,
  phone: v.phone,
  address_line1: v.address_line1,
  address_line2: v.address_line2,
  city: v.city,
  state: v.state,
  pincode: v.pincode,
  country: v.country,
});

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [panel, setPanel] = useState(null); // null | { mode: "add" } | { mode: "edit", address }
  const [saving, setSaving] = useState(false);
  const { fetchAll, create, update, remove } = useCrudApi("/api/address");

  const reload = useCallback(async () => {
    const res = await fetchAll().catch(() => null);
    const list = res?.data || [];
    setAddresses(list);
    setLoaded(true);
    return list;
  }, [fetchAll]);

  useEffect(() => {
    reload();
  }, [reload]);

  const save = async (values) => {
    setSaving(true);
    try {
      const editing = panel?.mode === "edit" ? panel.address : null;
      const res = editing ? await update(editing.id, toPayload(values)) : await create(toPayload(values));
      if (res && res.status === false) throw new Error(res.message);
      const savedId = editing?.id || res?.data?.id;

      // The API makes only a customer's first address the default and never
      // clears the old one, so set and clear it here.
      if (values.is_default && savedId) {
        await update(savedId, { is_default: 1 });
        for (const a of addresses) if (a.id !== savedId && a.is_default) await update(a.id, { is_default: 0 });
      }

      await reload();
      setPanel(null);
      toast.success(editing ? "Address updated" : "Address added");
    } catch (err) {
      toast.error(err?.message || "Could not save the address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (address) => {
    try {
      await remove(address.id);
      await reload();
      toast.success("Address deleted");
    } catch {
      toast.error("Could not delete the address. Please try again.");
    }
  };

  return (
    <>
      <AccountPageTitle
        title="Addresses"
        description="Saved delivery addresses. Your default is picked first at checkout."
        action={<Button title="add new address" className="h-[37px] items-center flex" onClick={() => setPanel({ mode: "add" })} />}
      />

      {!loaded ? (
        <div className="grid md:grid-cols-3 grid-cols-1 gap-[16px]">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      ) : addresses.length === 0 ? (
        <EmptyState title="No saved addresses yet" text="Add one now, or save it the first time you check out." />
      ) : (
        <div className="grid md:grid-cols-3 grid-cols-1 xl:gap-[30px] gap-[20px]">
          {addresses.map((a) => (
            <div key={a.id} className="flex flex-col justify-between gap-[24px] w-full bg-[var(--product-bg)] p-[20px] xl:p-[28px]">
              <div className="space-y-[12px]">
                <div className="flex flex-wrap items-center gap-[8px]">
                  {a.is_default ? (
                    <span className="inline-flex items-center px-[10px] py-[4px] text-[11px] font-[500] leading-none tracking-[0.08em] uppercase bg-[var(--teal-1)] text-[var(--grey-0)]">
                      Default
                    </span>
                  ) : null}
                  <span className="inline-flex items-center px-[10px] py-[4px] text-[11px] leading-none tracking-[0.08em] uppercase border border-[var(--teal-3)] text-[var(--grey-2)]">
                    {a.label}
                  </span>
                </div>
                <h2 className="lg:text-[22px] text-[16px] font-[500] text-[var(--teal-1)] break-words">{a.name || "—"}</h2>
                <div className="text-[14px] leading-[1.6] text-[var(--grey-2)] break-words">
                  {addressLines(a).map((l) => (
                    <div key={l}>{l}</div>
                  ))}
                  {a.phone && <div>Phone: {a.phone}</div>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[16px]">
                <Button title="edit" onClick={() => setPanel({ mode: "edit", address: a })} />
                <Button title="delete" variant="outlineTeal" onClick={() => handleDelete(a)} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!panel}
        onClose={() => setPanel(null)}
        title={panel?.mode === "edit" ? "Edit address" : "Add new address"}
      >
        {panel && (
          <AddressForm
            key={panel.mode === "edit" ? panel.address.id : "new"}
            initial={panel.mode === "edit" ? { ...panel.address, is_default: !!panel.address.is_default } : undefined}
            showDefault
            submitting={saving}
            submitLabel={panel.mode === "edit" ? "Save changes" : "Save address"}
            onSubmit={save}
            onCancel={() => setPanel(null)}
          />
        )}
      </Modal>
    </>
  );
};

export default Addresses;
