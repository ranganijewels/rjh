"use client";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import Input from "@/components/ui/Input/Input";
import toast from "react-hot-toast";

const StepFour = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    Fullname: "",
    Email: "",
    Country: "",
    City: "",
    Phone: "",
    preferredContactMethod: "",
    isChecked: false,
  });

  useImperativeHandle(ref, () => ({
    validateAndGetData: () => {
      const {
        Fullname,
        Email,
        Country,
        City,
        Phone,
        preferredContactMethod,
        isChecked,
      } = formData;

      // Validation rules
      const newErrors = {
        Fullname: !Fullname.trim() ? "Full Name is required." : "",
        Email: !Email.trim()
          ? "Email is required."
          : !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Email)
          ? "Enter a valid email address."
          : "",
        Country: !Country.trim() ? "Country is required." : "",
        City: !City.trim() ? "City is required." : "",
        Phone: !Phone.trim()
          ? "Phone Number is required."
          : !/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
              Phone
            )
          ? "Enter a valid phone number."
          : "",
        preferredContactMethod: !preferredContactMethod
          ? "Preferred contact method is required."
          : "",
        isChecked: !isChecked ? "You must agree to the Privacy Policy." : "",
      };

      for (let key in newErrors) {
        if (newErrors[key]) {
          toast.error(newErrors[key]);
          return null;
        }
      }

      return formData;
    },
    reset: () => {
      setFormData({
        Fullname: "",
        Email: "",
        Country: "",
        City: "",
        Phone: "",
        preferredContactMethod: "",
        isChecked: false,
      });
    },
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (value) => {
    setFormData((prev) => ({ ...prev, preferredContactMethod: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, isChecked: e.target.checked }));
  };

  return (
    <div>
      <div className="pb-[32px]">
        <p className="xl:text-[24px] font-[500] text-[18px]">
          Your Contact Information
        </p>
        <p className="xl:text-[18px] font-[500] text-[14px] text-[var(--placeholder)]">
          Let us know how to reach you—we’ll be in touch soon with next steps
          and design ideas!
        </p>
      </div>
      <hr className="hr-teal-3" />
      <form className="py-[60px] space-y-[30px] lg:w-[642px] w-full">
        <Input
          label="Full Name"
          name="Fullname"
          placeholder="Enter Full Name"
          value={formData.Fullname}
          onChange={handleChange}
        />

        <Input
          label="Email Address"
          name="Email"
          placeholder="Enter Email Address"
          value={formData.Email}
          onChange={handleChange}
        />

        <Dropdown
          label="Preferred Contact Method"
          options={["Phone", "Email"]}
          onChange={handleDropdownChange}
          buttonStyle="bg-white"
        />

        <Input
          label="Phone Number"
          name="Phone"
          placeholder="Enter Phone Number"
          value={formData.Phone}
          onChange={handleChange}
          className="bg-white border-white"
          type="tel"
          pattern="[0-9]{10}"
        />

        <div className="flex gap-[88px]">
          <Input
            label="City"
            name="City"
            placeholder="Enter City"
            value={formData.City}
            onChange={handleChange}
            className="bg-white border-white"
          />

          <Input
            label="Country"
            name="Country"
            placeholder="Enter Country"
            value={formData.Country}
            onChange={handleChange}
            className="bg-white border-white"
          />
        </div>

        <div>
          <label className="block text-[16px] font-[400] text-[var(--grey-2)] mb-1">
            Anything Else We Should Know?
          </label>
          <textarea
            placeholder="Enter text..."
            className="bg-white p-[20px_11px] w-full"
          />
        </div>

        <div className="flex gap-[14px]">
          <input
            type="checkbox"
            className="w-[26px] h-[26px] accent-[var(--teal-1)]"
            checked={formData.isChecked}
            onChange={handleCheckboxChange}
          />
          <label className="block text-[16px] font-[400] text-[var(--grey-2)] mb-1">
            I agree to the Privacy Policy
          </label>
        </div>
      </form>
    </div>
  );
});

export default StepFour;
