"use client";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { useCrudApi } from "@/hooks/useCrudApi";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useCustomize } from "@/context/CustomizeContext";
import { formatCarat, formatRange } from "@/utils/string";
import toast from "react-hot-toast";

const ContactInfoForm = () => {
  const { create } = useCrudApi("/api/customize");
  const { referenceForm, clearReferenceForm } = useCustomize();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id");
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    country: "",
    state: "",
    city: "",
    zipcode: "",
    agreed: false,
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e) => {
    setForm((prev) => ({ ...prev, agreed: e.target.checked }));
  };
  const handleSubmit = async () => {
    try {
      const validFiles = referenceForm.files.filter((f) => f instanceof File);

      const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

      const filesBase64 = await Promise.all(
        validFiles.map((file) => fileToBase64(file))
      );

      const payload = {
        category_id: Number(categoryId),

        file: filesBase64,
        description: referenceForm.description || "",
        url: referenceForm.urls || "",

        shape: referenceForm.shape?.label || "",

        carat: referenceForm.selectedCarat
          ? Number(formatCarat(referenceForm.selectedCarat))
          : 0,
        color: formatRange(referenceForm.colorRange).toString() || "",
        clarity: formatRange(referenceForm.clarityRange).toString() || "",

        metal: referenceForm.metal?.karat?.value || "",
        metal_color: referenceForm.metal?.color || "",

        ring_size: referenceForm.ringSize || "",

        full_name: form.fullName,
        phone: form.phone,
        email: form.email,
        country: form.country,
        state: form.state,
        city: form.city,
        zip_code: form.zipcode,

        agree_privacy: form.agreed,
        notes: referenceForm.notes || "",
      };

      const res = await create(payload);
      if (res?.status === false) {
        const err = new Error(res.message || "Validation failed");
        err.data = res; // attach backend payload
        throw err;
      }

      router.push("/customize/thank-you");
    } catch (err) {
      const apiErrors = err?.data?.error;

      if (apiErrors) {
        setErrors(apiErrors);
        return;
      }

      toast.error(err?.message || "Failed to submit customization request");
    }
  };

  return (
    <section className="md:space-y-[60px] space-y-[30px]">
      <div>
        <p className="xl:text-[24px] font-[500] text-[18px]">
          Your Contact Information
        </p>
        <p className="xl:text-[18px] font-[500] text-[14px] text-[var(--placeholder)]">
          Let us know how to reach you—we’ll be in touch soon with next steps
          and design ideas!
        </p>
      </div>

      <form className="space-y-[52px] w-full">
        <div className="grid grid-cols-2 gap-[42px]">
          <Input
            label="Full Name"
            name="fullName"
            placeholder="Enter Full Name"
            borderBottom
            className=" !border-[var(--teal-3)]"
            value={form.fullName}
            onChange={handleChange}
            error={errors?.full_name?.[0]}
          />
          <Input
            label="Phone Number"
            name="phone"
            placeholder="Enter Phone Number"
            borderBottom
            className=" !border-[var(--teal-3)]"
            value={form.phone}
            onChange={handleChange}
            type="tel"
            pattern="[0-9]{10}"
            error={errors?.phone?.[0]}
          />
        </div>

        <Input
          label="Email Address"
          name="email"
          placeholder="Enter Email Address"
          borderBottom
          className=" !border-[var(--teal-3)]"
          value={form.email}
          onChange={handleChange}
          error={errors?.email?.[0]}
        />

        <div className="grid grid-cols-2 gap-[42px]">
          <Input
            label="Country"
            name="country"
            placeholder="Enter Country"
            borderBottom
            className=" !border-[var(--teal-3)]"
            containerClass="w-full"
            value={form.country}
            onChange={handleChange}
          />
          <Input
            label="State"
            name="state"
            placeholder="Enter State"
            value={form.state}
            onChange={handleChange}
            className=" !border-[var(--teal-3)]"
            borderBottom
            containerClass="w-full"
          />
          <Input
            label="Town/City :"
            name="city"
            placeholder="Enter City"
            value={form.city}
            onChange={handleChange}
            className=" !border-[var(--teal-3)]"
            borderBottom
            containerClass="w-full"
          />

          <Input
            label="Zipcode :"
            name="zipcode"
            placeholder="Enter zipcode"
            value={form.zipcode}
            onChange={handleChange}
            className=" !border-[var(--teal-3)]"
            borderBottom
            containerClass="w-full"
          />
        </div>

        <div className="flex gap-[14px]">
          <input
            type="checkbox"
            className="w-[26px] h-[26px] accent-[var(--teal-1)]"
            checked={form.agreed}
            onChange={handleCheckbox}
          />
          <label className="block md:text-[16px] text-[12px] font-[400] text-[var(--grey-2)] mb-1">
            I agree to the Privacy Policy
          </label>

          {errors?.agree_privacy && (
            <p className="text-red-500 text-sm mt-1">
              {errors.agree_privacy[0]}
            </p>
          )}
        </div>
      </form>

      <div className="flex gap-[10px] items-end justify-end">
        <Button
          title="Previous"
          variant="outlineTeal"
          onClick={() =>
            router.push(`/customize/form/review??category_id=${categoryId}`)
          }
        />
        <Button title={"Submit"} onClick={handleSubmit} />
      </div>
    </section>
  );
};

export default ContactInfoForm;
