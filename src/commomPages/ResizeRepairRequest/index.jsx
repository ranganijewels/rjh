"use client";
import Button from "@/components/ui/Button/Button";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import PageHeading from "@/components/ui/Heading/PageHeading";
import Input from "@/components/ui/Input/Input";
import Typography from "@/components/ui/Typography/Typography";
import { useCrudApi } from "@/hooks/useCrudApi";
import { fetchFilters } from "@/store/slices/filtersSlice";
import { fileToBase64 } from "@/utils/string";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ResizeRepairRequest = () => {
  const dispatch = useDispatch();
  const { create } = useCrudApi("/api/resize-repair");
  const {
    data: filters,
    loading,
    error,
    loaded,
  } = useSelector((state) => state.filters);
  const [formErrors, setFormErrors] = useState({});
  const [addresses, setAddresses] = useState([]);
  const { fetchAll } = useCrudApi("/api/address");
  useEffect(() => {
    fetchAll()
      .then((res) => setAddresses(res.data || []))
      .catch((err) => console.error("Error fetching addresses", err));
  }, [fetchAll]);

  const defaultAddress = addresses.find((e) => e.is_default === 1);

  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    email: "",
    category_id: null,
    request_type: "resize", // resize | repair
    issue_type: "",
    product_name: "",
    invoice_number: "",
    new_size: "",
    issue_description: "",
    product_fitness: "",
    files: [],
    address_type: "default", // default | new
    default_address: "",
    additional_notes: "",
    issue_description: "",
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    dispatch(fetchFilters());
  }, [dispatch]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    const base64Files = await Promise.all(
      files.map((file) => fileToBase64(file))
    );

    setFormData((prev) => ({
      ...prev,
      files: base64Files,
    }));
  };

  const getRequestSpecificPayload = () => {
    if (formData.request_type === "resize") {
      return {
        new_size: formData.new_size,
        product_fitness: formData.product_fitness,
      };
    }

    return {
      issue_type: formData.issue_type,
      issue_description: formData.issue_description,
    };
  };

  const FIT_OPTIONS = [
    { label: "Very tight", value: "very_tight" },
    { label: "Slightly tight", value: "slightly_tight" },
    { label: "Perfect fit", value: "perfect_fit" },
    { label: "Slightly loose", value: "slightly_loose" },
    { label: "Very loose", value: "very_loose" },
  ];

  const handleSubmit = async () => {
    try {
      setFormErrors({}); // reset old errors

      const payload = {
        full_name: formData.full_name,
        mobile_number: formData.mobile_number,
        email: formData.email,
        pickup_address: formData.default_address,
        request_type: formData.request_type,
        category_id: formData.category_id,
        product_name: formData.product_name,
        invoice_number: formData.invoice_number,
        new_size: formData?.new_size,
        file: formData.files,
        address_type: formData.address_type,
        additional_notes: formData.additional_notes,

        ...getRequestSpecificPayload(),
      };

      await create(payload);

      toast.success("Request submitted successfully");
    } catch (err) {
      const apiErrors = err?.response?.data || err?.data || err;

      if (typeof apiErrors === "object") {
        setFormErrors(apiErrors);

        // show first error as toast (optional)
        const firstKey = Object.keys(apiErrors)[0];
        if (firstKey) {
          toast.error(apiErrors[firstKey][0]);
        }
      } else {
        toast.error("Submission failed");
      }
    }
  };

  useEffect(() => {
    if (formData.address_type === "default" && defaultAddress) {
      const formattedAddress = `${defaultAddress.street_address}, ${defaultAddress.city}, ${defaultAddress.state}, ${defaultAddress.zip_code}`;

      setFormData((prev) => ({
        ...prev,
        default_address: formattedAddress,
      }));
    }
  }, [formData.address_type, defaultAddress]);

  return (
    <section>
      <PageHeading title={"Resize/Repair Request"} />

      <div className="max-w-4xl mx-auto space-y-[100px] mt-[100px]">
        <div className="space-y-[52px]">
          <div className="space-y-5">
            <Typography variant="h5">
              {" "}
              At Elova, we believe every detail matters—including the fit. When
              you find the perfect ring, it should feel as flawless on your
              finger as it looks in the box. That's why we offer complimentary
              resizing within 60 days of your purchase.{" "}
            </Typography>
            <Typography variant="h5">
              Whether your ring feels a touch too snug or slightly loose, our
              expert jewelers are here to make it just right. Our resizing
              service maintains the integrity of your original design, ensuring
              the final result is seamless and secure. All resizing is done in
              our in-house atelier by artisans who know every Elova piece
              intimately.{" "}
            </Typography>{" "}
            <Typography variant="h5">
              We also provide a printable Ring Size Guide and a complimentary
              sizer upon request to help you get the most accurate measurement.
              Still unsure? Our jewelry consultants are available for virtual
              sizing support. With Elova, comfort and beauty go hand in hand.
            </Typography>
          </div>

          <div className="space-y-[30px]">
            <p className="text-[24px] font-[500]">Resize/Repair Request Form</p>

            <div className="flex gap-[30px]">
              <Input
                borderBottom
                label={"Full Name"}
                containerClass="w-full"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
              />

              <Input
                borderBottom
                containerClass="w-full"
                label={"Mobile Number"}
                placeholder="Mobile Number"
                value={formData.mobile_number}
                onChange={(e) => handleChange("mobile_number", e.target.value)}
              />
              {formErrors.mobile_number && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.mobile_number[0]}
                </p>
              )}
            </div>
            <Input
              borderBottom
              containerClass="w-full"
              label={"Email Address"}
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="space-y-[30px]">
            <p className="text-[24px] font-[500]">Order Information</p>
            <div className="flex gap-[22px] mt-[22px]">
              {[
                { label: "Resize", value: "resize" },
                { label: "Repair", value: "repair" },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.request_type === option.value}
                    onChange={() => handleChange("request_type", option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-y-[30px] gap-x-[60px]">
              <Dropdown
                label={"Select Product Category"}
                placeholder="Select Product Category"
                options={filters?.category}
                onChange={(val) => {
                  handleChange("category_id", val.id);
                }}
                containerClass={"flex !items-start !flex-col"}
                borderBottom
                fullWidth
              />
              <Input
                borderBottom
                label={"Product Name"}
                containerClass="w-full"
                placeholder="Enter Product Name or SKU Number"
                value={formData.product_name}
                onChange={(e) => handleChange("product_name", e.target.value)}
              />

              <Input
                borderBottom
                label={"Invoice Number"}
                containerClass="w-full"
                placeholder="Enter invoice number of your product"
                value={formData.invoice_number}
                onChange={(e) => handleChange("invoice_number", e.target.value)}
              />
              {formData.request_type === "resize" ? (
                <>
                  <Input
                    borderBottom
                    label={"New Size"}
                    containerClass="w-full"
                    placeholder="Size of your product in US/Inches"
                    value={formData.new_size}
                    onChange={(e) => handleChange("new_size", e.target.value)}
                  />
                  <Dropdown
                    label={"How does the product fit ?"}
                    placeholder="Select Product Category"
                    options={FIT_OPTIONS}
                    onChange={(val) =>
                      handleChange("product_fitness", val.label)
                    }
                    containerClass={"flex !items-start !flex-col"}
                    borderBottom
                    fullWidth
                  />{" "}
                </>
              ) : (
                <>
                  <Dropdown
                    label={"Select Issue Type"}
                    placeholder="Select Issue Type"
                    options={[
                      "Loose Diamond / Stone",
                      "Missing Diamond / Stone",
                      "Stone Chipped or Cracked",
                      "Prong Damage (Bent / Broken)",
                    ]}
                    onChange={(val) => handleChange("issue_type", val)}
                    containerClass={"flex !items-start !flex-col"}
                    borderBottom
                    fullWidth
                  />
                  <Input
                    borderBottom
                    label={"Describe the Issue"}
                    containerClass="w-full"
                    placeholder="Provide details about the issue or damage"
                    value={formData.issue_description}
                    onChange={(e) =>
                      handleChange("issue_description", e.target.value)
                    }
                  />
                </>
              )}

              <div className="w-full">
                {/* Label */}
                <p className="text-[14px] text-[#111] mb-2">
                  Upload Image/Videos (max 10MB)
                </p>

                {/* Clickable file input */}
                <label className="flex items-center gap-2 cursor-pointer border-b border-[#CFCFCF] pb-2 text-[#9A9A9A] hover:text-black transition">
                  <span className="text-[18px] leading-none">+</span>
                  <span className="text-[14px]">
                    Attach images/videos of product worn
                  </span>

                  {/* Hidden input */}
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-[30px]">
            <p className="text-[24px] font-[500]">Pickup/Drop Preferences</p>
            <div className="flex gap-[22px] mt-[22px]">
              {[
                { label: "Default Address", value: "default" },
                { label: "New Address", value: "new" },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.address_type === option.value}
                    onChange={() => {
                      handleChange("address_type", option.value);

                      if (option.value === "new") {
                        handleChange("default_address", "");
                      }
                    }}
                    className="cursor-pointer"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-[30px]">
              <>
                <Input
                  label="Pickup Address"
                  value={
                    formData.address_type === "default"
                      ? defaultAddress?.street_address +
                        " , " +
                        defaultAddress?.city +
                        " , " +
                        defaultAddress?.state +
                        " , " +
                        defaultAddress?.zip_code
                      : formData.default_address
                  }
                  placeholder="Set your pickup address"
                  containerClass="w-full"
                  onChange={(e) =>
                    handleChange("default_address", e.target.value)
                  }
                  borderBottom
                />
              </>

              <Input
                borderBottom
                containerClass="w-full"
                label={"Additional Notes"}
                placeholder="Any additional query"
                value={formData.additional_notes}
                onChange={(e) =>
                  handleChange("additional_notes", e.target.value)
                }
              />
            </div>
          </div>

          <Button
            title={"Send request to store"}
            className="w-full"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </section>
  );
};

export default ResizeRepairRequest;
