"use client";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { useCrudApi } from "@/hooks/useCrudApi";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useCustomize } from "@/context/CustomizeContext";
import { cleanCarat, formatCarat, formatRange } from "@/utils/string";
import toast from "react-hot-toast";

const ContactInfoForm = () => {
  const { create } = useCrudApi("/api/customize");
  const { referenceForm } = useCustomize();
  const searchParams = useSearchParams();
  const sizeSlug = searchParams.get("size");
  const categoryId = searchParams.get("category_id");
  const sizeCategoryId = searchParams.get("size_category_id");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
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
    if (submitting) return;

    try {
      setSubmitting(true);
      setErrors({});
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

      const caratValue = referenceForm.customCarat?.trim()
        ? Number(referenceForm.customCarat)
        : referenceForm.selectedCarat
          ? Number(cleanCarat(referenceForm.selectedCarat))
          : 0;

      const payload = {
        category_id: Number(sizeCategoryId),

        file: filesBase64,
        description: referenceForm.description || "",
        // API reads `reference_url` (a string); urls is an array — join them so the
        // customer's reference links aren't silently dropped from the request.
        reference_url: Array.isArray(referenceForm.urls)
          ? referenceForm.urls.filter(Boolean).join(", ")
          : referenceForm.urls || "",

        shape: referenceForm.shape?.label || "",

        carat: caratValue,
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

      const res = await create(payload, { normalizeError: true });

      router.push("/customize/form/thank-you");
    } catch (err) {
      const apiErrors = err?.errors;

      if (apiErrors) {
        setErrors(apiErrors);
      } else {
        toast.error(err.message || "Something went wrong");
      }
    } finally {
      setSubmitting(false);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[42px]">
          <div>
            {" "}
            <Input
              label="Full Name *"
              name="fullName"
              placeholder="Enter Full Name"
              borderBottom
              className=" !border-[var(--teal-3)]"
              value={form.fullName}
              onChange={handleChange}
              hasError={!!errors?.full_name}
            />
            {errors?.full_name && (
              <p className="text-red-500 text-sm mt-1">{errors.full_name[0]}</p>
            )}
          </div>

          <div>
            <Input
              label="Phone Number *"
              name="phone"
              placeholder="Enter Phone Number"
              borderBottom
              className=" !border-[var(--teal-3)]"
              value={form.phone}
              onChange={handleChange}
              type="tel"
              pattern="[0-9]{10}"
              hasError={!!errors?.phone}
            />
            {errors?.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>
            )}
          </div>
        </div>
        <div>
          <Input
            label="Email Address *"
            name="email"
            placeholder="Enter Email Address"
            borderBottom
            className=" !border-[var(--teal-3)]"
            value={form.email}
            onChange={handleChange}
            hasError={!!errors?.email}
          />
          {errors?.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[42px]">
          <div>
            <Input
              label="Country"
              name="country"
              placeholder="Enter Country"
              borderBottom
              className=" !border-[var(--teal-3)]"
              containerClass="w-full"
              value={form.country}
              onChange={handleChange}
              hasError={!!errors?.country}
            />
            {errors?.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country[0]}</p>
            )}
          </div>
          <div>
            <Input
              label="State"
              name="state"
              placeholder="Enter State"
              value={form.state}
              onChange={handleChange}
              className=" !border-[var(--teal-3)]"
              borderBottom
              containerClass="w-full"
              hasError={!!errors?.state}
            />
            {errors?.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state[0]}</p>
            )}
          </div>
          <div>
            <Input
              label="Town/City :"
              name="city"
              placeholder="Enter City"
              value={form.city}
              onChange={handleChange}
              className=" !border-[var(--teal-3)]"
              borderBottom
              containerClass="w-full"
              hasError={!!errors?.city}
            />
            {errors?.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city[0]}</p>
            )}
          </div>

          <div>
            <Input
              label="Zipcode :"
              name="zipcode"
              placeholder="Enter zipcode"
              value={form.zipcode}
              onChange={handleChange}
              className=" !border-[var(--teal-3)]"
              borderBottom
              containerClass="w-full"
              hasError={!!errors?.zip_code}
            />
            {errors?.zip_code && (
              <p className="text-red-500 text-sm mt-1">{errors.zip_code[0]}</p>
            )}
          </div>
        </div>
        <div className="flex gap-[14px]">
          <input
            type="checkbox"
            className="w-[26px] h-[26px] accent-[var(--teal-1)]"
            checked={form.agreed}
            onChange={handleCheckbox}
          />
          <div>
            <label className="block md:text-[16px] text-[12px] font-[400] text-[var(--grey-2)] mb-1">
              I agree to the Privacy Policy *
            </label>

            {errors?.agree_privacy && (
              <p className="text-red-500 text-sm mt-1">
                {errors.agree_privacy[0]}
              </p>
            )}
          </div>
        </div>
      </form>

      <div className="flex gap-[10px] items-end justify-end">
        <Button
          title="Previous"
          variant="outlineTeal"
          onClick={() =>
            router.push(
              `/customize/form/review?size=${sizeSlug}&size_category_id=${sizeCategoryId}`
            )
          }
        />
        <Button
          title={submitting ? "Submitting..." : "Submit"}
          onClick={handleSubmit}
        />
      </div>
    </section>
  );
};

export default ContactInfoForm;
