"use client";
import React, { useState } from "react";
import Support from "../Account/Support";
import Input from "@/components/ui/Input/Input";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import Button from "@/components/ui/Button/Button";
import Typography from "@/components/ui/Typography/Typography";
import PageHeading from "@/components/ui/Heading/PageHeading";
import { useCrudApi } from "@/hooks/useCrudApi";
import toast from "react-hot-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    query: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const { create } = useCrudApi("/api/contact-us");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim())
      newErrors.full_name = "Full name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is not valid.";
    }
    if (!formData.query.trim()) newErrors.query = "Please select a query.";
    if (!formData.message.trim()) newErrors.message = "Message is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await create(formData);

      if (
        response &&
        (response?.status === 200 || response?.id || !response.error)
      ) {
        toast.success("Your message has been sent successfully.");
        setFormData({ full_name: "", email: "", query: "", message: "" });
      } else {
        toast.error(
          response?.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("ContactUs submission error:", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  return (
    <section>
      <PageHeading title={"Contact Us"} />

      <div className="2xl:py-[100px] gap-[40px] lg:py-[54px] py-[40px] 2xl:px-[421px] xl:px-[320px] lg:px-[155px] md:px-[40px] px-[18px]">
        <Support />

        <div className="space-y-[30px] pt-[40px]">
          <div className="grid md:grid-cols-2 md:gap-[60px] grid-cols-1 gap-[30px]">
            <div>
              <Input
                borderBottom
                label={"Full Name"}
                placeholder="Full Name"
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
              />
              {errors.full_name && (
                <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
              )}
            </div>
            <div>
              <Input
                borderBottom
                label={"Email Address"}
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>
          <Dropdown
            label={"Query Related"}
            placeholder="Select Query"
            options={["Order", "Payment", "Refund", "Other"]}
            value={formData.query}
            onChange={(val) => handleChange("query", val)}
            containerClass={"flex !items-start !flex-col"}
            borderBottom
            fullWidth
          />
          {errors.query && (
            <p className="text-red-500 text-sm mt-1">{errors.query}</p>
          )}

          <label className="block text-[16px] font-[400] text-[var(--grey-2)] mb-1">
            Message
          </label>
          <textarea
            borderBottom
            label="Message"
            placeholder="Type your message"
            className="border-b xl:text-[16px] text-[12px] font-[400] border-[var(--placeholder)] focus:border-b-2 focus:border-[var(--teal-2)] focus:outline-0 p-[20px_11px] w-full"
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}

          <Button
            title={"Send message"}
            className="mt-[30px] w-full"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
