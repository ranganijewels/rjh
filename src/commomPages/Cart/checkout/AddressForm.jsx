"use client";

import React, { useEffect, useRef, useState } from "react";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import Checkbox from "@/components/ui/Checkbox/Checkbox";

const LABELS = ["Home", "Work", "Other"];

const EMPTY = {
  label: "Home",
  name: "",
  phone: "",
  email: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
};

const t = (v) => String(v ?? "").trim();

/**
 * The delivery address form, shown in a side panel by checkout and by
 * Profile ▸ Addresses. The contact person (name, phone) belongs to the
 * address. `askEmail` adds an email field for guests, who have no account
 * email to fall back on; `showDefault` adds "Set as my default address".
 */
const AddressForm = ({ initial, askEmail = false, showDefault = false, defaultCountry = "India", submitting, submitLabel, onSubmit, onCancel }) => {
  const [values, setValues] = useState({ ...EMPTY, country: defaultCountry, ...(initial || {}) });
  const [errors, setErrors] = useState({});
  const firstRef = useRef(null);

  useEffect(() => {
    // Focus the first field once the panel has slid in.
    const id = setTimeout(() => firstRef.current?.querySelector("input")?.focus(), 250);
    return () => clearTimeout(id);
  }, []);

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };
  // Inputs are named "addr-<field>" so their ids can't clash with the page.
  const onField = (e) => {
    const name = e.target.name.replace(/^addr-/, "");
    const { value } = e.target;
    set(name, name === "phone" ? value.replace(/[^\d+\s-]/g, "").slice(0, 16) : value);
  };

  const validate = () => {
    const e = {};
    if (!t(values.name)) e.name = "Enter the name of the person receiving the order.";
    const digits = t(values.phone).replace(/\D/g, "");
    if (!digits) e.phone = "Enter a contact number.";
    else if (digits.length < 7 || digits.length > 15) e.phone = "Enter a valid contact number, including area code.";
    if (askEmail) {
      if (!t(values.email)) e.email = "Enter your email for the order confirmation.";
      else if (!/^\S+@\S+\.\S+$/.test(t(values.email))) e.email = "Enter a valid email address.";
    }
    if (!t(values.address_line1)) e.address_line1 = "Enter the house number and street.";
    if (!t(values.city)) e.city = "Enter the town or city.";
    if (!t(values.state)) e.state = "Enter the state.";
    if (!t(values.pincode)) e.pincode = "Enter the PIN / ZIP code.";
    if (!t(values.country)) e.country = "Enter the country.";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      document.getElementById(`addr-${first}`)?.focus();
      return;
    }
    const clean = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, typeof v === "boolean" ? v : t(v)])
    );
    await onSubmit?.(clean);
  };

  const field = (name, label, props = {}) => (
    <div className={props.wrapClass || "w-full"}>
      <Input
        label={label}
        placeholder={props.placeholder || label.replace(" *", "")}
        borderBottom
        containerClass="w-full"
        name={`addr-${name}`}
        type={props.type || "text"}
        value={values[name]}
        onChange={onField}
        hasError={!!errors[name]}
        autoComplete={props.autoComplete}
      />
      {errors[name] && (
        <p id={`addr-${name}-error`} className="text-[var(--color-error)] text-sm mt-1">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-[20px]">
      <div className="flex gap-2" role="radiogroup" aria-label="Address type">
        {LABELS.map((l) => (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={values.label === l}
            onClick={() => set("label", l)}
            className={`px-4 py-1.5 text-[13px] border transition-colors ${
              values.label === l
                ? "border-[var(--teal-1)] bg-[var(--teal-1)] text-[var(--grey-0)]"
                : "border-[var(--teal-3)] text-[var(--grey-2)] hover:border-[var(--teal-1)]"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div ref={firstRef}>{field("name", "Contact name *", { autoComplete: "name" })}</div>
      {field("phone", "Contact number *", { type: "tel", autoComplete: "tel" })}
      {askEmail && field("email", "Email *", { type: "email", autoComplete: "email" })}
      {field("address_line1", "House no. and street *", { autoComplete: "address-line1" })}
      {field("address_line2", "Apartment, landmark (optional)", { autoComplete: "address-line2" })}
      <div className="flex gap-[20px]">
        {field("city", "Town / City *", { autoComplete: "address-level2" })}
        {field("state", "State *", { autoComplete: "address-level1" })}
      </div>
      <div className="flex gap-[20px]">
        {field("pincode", "PIN / ZIP code *", { autoComplete: "postal-code" })}
        {field("country", "Country *", { autoComplete: "country-name" })}
      </div>

      {showDefault && (
        <Checkbox
          name="addr-default"
          label="Set as my default address"
          checked={!!values.is_default}
          onChange={() => set("is_default", !values.is_default)}
        />
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          disabled={submitting}
          title={submitting ? "Saving…" : submitLabel || "Save and deliver here"}
        />
        {onCancel && (
          <Button type="button" variant="outlineTeal" onClick={onCancel} disabled={submitting} title="Cancel" />
        )}
      </div>
    </form>
  );
};

export default AddressForm;
