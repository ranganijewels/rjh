"use client";

import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import Typography from "@/components/ui/Typography/Typography";
import { useState } from "react";
import { useCrudApi } from "@/hooks/useCrudApi";

export function ReturnRepair() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    jewelryType: "",
    jewelryName: "",
    issueDescription: "",
    uploadedPhotos: [],
    previouslyRepaired: "",
    preferredAction: "",
    shippingAddress: "",
    city: "",
    postalCode: "",
    country: "",
    policyAgreement: false,
    shippingCostAgreement: false,
    turnaroundAgreement: false,
    additionalComments: "",
    signature: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Correct backend endpoint
  const { create } = useCrudApi("/api/return-repair");

  // Handlers
  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleCheckbox = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.checked }));

  const handleRadio = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleFileUpload = (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    setFormData((prev) => ({
      ...prev,
      uploadedPhotos: [...prev.uploadedPhotos, ...files],
    }));
  };

  const removePhoto = (index) =>
    setFormData((prev) => ({
      ...prev,
      uploadedPhotos: prev.uploadedPhotos.filter((_, i) => i !== index),
    }));

  const alterationMap = {
    Yes: "yes",
    No: "no",
    "Not sure": "not_sure",
  };

  const actionMap = {
    "Repair under warranty (within 12 months)": "warranty_repair",
    "Paid repair (out of warranty)": "paid_repair",
    "Not sure — please assess": "assessment_needed",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    fd.append("order_id", 5 || "N/A");
    fd.append("full_name", formData.fullName);
    fd.append("phone_number", formData.phoneNumber);
    fd.append("email", formData.emailAddress);
    fd.append("jewellery_type", formData.jewelryType.toLowerCase());
    fd.append("product_name", formData.jewelryName);
    fd.append("issue_description", formData.issueDescription);
    fd.append(
      "jewellery_alteration",
      alterationMap[formData.previouslyRepaired]
    );
    fd.append("preferred_action", actionMap[formData.preferredAction]);

    fd.append("street_address", formData.shippingAddress);
    fd.append("city", formData.city);
    fd.append("postal_code", formData.postalCode);
    fd.append("country", formData.country);

    fd.append("ack_assessment", formData.policyAgreement ? 1 : 0);
    fd.append("ack_shipping_cost", formData.shippingCostAgreement ? 1 : 0);
    fd.append("ack_turnaround_time", formData.turnaroundAgreement ? 1 : 0);

    fd.append("additional_comments", formData.additionalComments);
    fd.append("digital_signature", formData.signature);

    formData.uploadedPhotos.forEach((file) => {
      fd.append("files[]", file);
    });

    try {
      // ⭐ IMPORTANT ⭐
      const res = await create(null, {
        body: fd,
        headers: {}, // allow browser to set multipart content-type
      });

      if (res?.status) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (err) {}
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl">
      {submitted ? (
        // 🎉 THANK YOU MESSAGE
        <div className="p-10 text-center bg-white rounded-2xl shadow-md">
          <Typography variant="h3" className="mb-4 text-amber-600">
            Thank You!
          </Typography>
          <Typography variant="h5" className="mb-2">
            Your repair request has been submitted successfully.
          </Typography>
          <Typography variant="p">
            Our team will review your request and contact you shortly.
          </Typography>
        </div>
      ) : (
        <>
          {/* ------------------------
               Section 1: Customer Info
             ------------------------ */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Typography variant="h4">Customer Information</Typography>
            </div>

            <div className="space-y-5">
              <div>
                <Typography variant="h5" className="mb-2">
                  Full Name
                </Typography>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange("fullName")}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg bg-white"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Typography variant="h5" className="mb-2">
                    Phone Number
                  </Typography>
                  <Input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange("phoneNumber")}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg bg-white"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>

                <div>
                  <Typography variant="h5" className="mb-2">
                    Email Address
                  </Typography>
                  <Input
                    type="email"
                    value={formData.emailAddress}
                    onChange={handleChange("emailAddress")}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg bg-white"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mb-10"></div>

          {/* ------------------------
               Section 2: Product Details
             ------------------------ */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Typography variant="h4">Product Details</Typography>
            </div>

            <div className="space-y-6">
              <div>
                <Typography variant="h5" className="mb-2">
                  Type of Jewellery
                </Typography>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Ring",
                    "Necklace",
                    "Bracelet",
                    "Earrings",
                    "Pendant",
                    "Others",
                  ].map((type) => (
                    <label
                      key={type}
                      className="flex items-center justify-center gap-2 p-4 border-2 border-stone-200 rounded-lg cursor-pointer hover:border-amber-300 hover:bg-amber-50/50"
                    >
                      <input
                        type="radio"
                        name="jewelryType"
                        value={type}
                        checked={formData.jewelryType === type}
                        onChange={() => handleRadio("jewelryType", type)}
                        required
                      />
                      <Typography variant="h6">{type}</Typography>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Typography variant="h5" className="mb-2">
                  Jewelry Name / Product Name
                </Typography>
                <Input
                  type="text"
                  value={formData.jewelryName}
                  onChange={handleChange("jewelryName")}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg bg-white"
                  placeholder="e.g., Eternal Love Diamond Ring"
                  required
                />
              </div>

              <div>
                <Typography variant="h5" className="mb-2">
                  Description of Issue
                </Typography>
                <textarea
                  value={formData.issueDescription}
                  onChange={handleChange("issueDescription")}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg resize-none bg-white"
                  placeholder="Describe the issue..."
                  required
                />
              </div>

              <div>
                <Typography variant="h5" className="mb-4">
                  Upload Clear Photos
                </Typography>

                <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="photo-upload"
                  />

                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer block"
                  >
                    <img
                      src="/public/icons/shapes/asscher.svg"
                      alt="Upload"
                      className="w-12 h-12 mx-auto mb-3 opacity-70"
                    />

                    <p className="text-sm text-stone-600 mb-1">
                      Click to upload photos
                    </p>
                    <p className="text-xs text-stone-500">JPG, PNG (max 5MB)</p>
                  </label>
                </div>

                {formData.uploadedPhotos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.uploadedPhotos.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
                      >
                        <span className="text-sm text-stone-700 truncate flex-1">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="text-xs text-red-600 hover:text-red-800 ml-3"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mb-10"></div>

          {/* ------------------------
               Section 3: Repair Details
             ------------------------ */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Typography variant="h4">Repair Details</Typography>
            </div>

            <div className="space-y-6">
              <div>
                <Typography variant="h5" className="mb-4">
                  Has the jewellery been altered before?
                </Typography>

                <div className="space-y-2">
                  {["Yes", "No", "Not sure"].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer ${
                        formData.previouslyRepaired === option
                          ? "border-amber-600 bg-amber-50"
                          : "border-stone-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="previouslyRepaired"
                        checked={formData.previouslyRepaired === option}
                        onChange={() =>
                          handleRadio("previouslyRepaired", option)
                        }
                      />
                      <span className="text-stone-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Typography variant="h5" className="mb-2">
                  Preferred Action
                </Typography>

                <div className="space-y-2">
                  {[
                    "Repair under warranty (within 12 months)",
                    "Paid repair (out of warranty)",
                    "Not sure — please assess",
                  ].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer ${
                        formData.preferredAction === option
                          ? "border-amber-600 bg-amber-50"
                          : "border-stone-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferredAction"
                        checked={formData.preferredAction === option}
                        onChange={() => handleRadio("preferredAction", option)}
                      />
                      <span className="text-stone-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mb-10"></div>

          {/* ------------------------
               Section 4: Shipping Address
             ------------------------ */}
          <div className="mb-10">
            <Typography variant="h4" className="mb-6">
              Return Shipping Address
            </Typography>

            <div className="space-y-5">
              <div>
                <Typography variant="h5" className="mb-2">
                  Street Address
                </Typography>
                <Input
                  type="text"
                  value={formData.shippingAddress}
                  onChange={handleChange("shippingAddress")}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg bg-white"
                  placeholder="Enter full address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Typography variant="h5" className="mb-2">
                    City
                  </Typography>
                  <Input
                    type="text"
                    value={formData.city}
                    onChange={handleChange("city")}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg bg-white"
                    placeholder="City"
                  />
                </div>

                <div>
                  <Typography variant="h5" className="mb-2">
                    Postal Code
                  </Typography>
                  <Input
                    type="text"
                    value={formData.postalCode}
                    onChange={handleChange("postalCode")}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg bg-white"
                    placeholder="Postal Code"
                  />
                </div>
              </div>

              <div>
                <Typography variant="h5" className="mb-2">
                  Country
                </Typography>
                <Input
                  type="text"
                  value={formData.country}
                  onChange={handleChange("country")}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg bg-white"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mb-10"></div>

          {/* ------------------------
               Section 5: Repair Policy
             ------------------------ */}
          <div className="mb-10">
            <Typography variant="h4" className="mb-6">
              Repair Policy Acknowledgement
            </Typography>

            <div className="space-y-4 bg-stone-50 p-6 rounded-xl border border-stone-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <Input
                  type="checkbox"
                  checked={formData.policyAgreement}
                  onChange={handleCheckbox("policyAgreement")}
                />
                <Typography variant="h6">
                  I understand that repair assessment depends on inspection.
                </Typography>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Input
                  type="checkbox"
                  checked={formData.shippingCostAgreement}
                  onChange={handleCheckbox("shippingCostAgreement")}
                />
                <Typography variant="h6">
                  I agree that shipping for out-of-warranty repairs is paid by
                  customer.
                </Typography>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Input
                  type="checkbox"
                  checked={formData.turnaroundAgreement}
                  onChange={handleCheckbox("turnaroundAgreement")}
                />
                <Typography variant="h6">
                  I understand repair turnaround may take 10–21 business days.
                </Typography>
              </label>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mb-10"></div>

          {/* ------------------------
               Section 6: Final Confirmation
             ------------------------ */}
          <div className="mb-8">
            <Typography variant="h4" className="mb-6">
              Final Confirmation
            </Typography>

            <div className="space-y-5">
              <div>
                <Typography variant="h5" className="mb-2">
                  Additional Comments (Optional)
                </Typography>
                <textarea
                  value={formData.additionalComments}
                  onChange={handleChange("additionalComments")}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg resize-none bg-white"
                  placeholder="Any additional details or instructions..."
                />
              </div>

              <div>
                <Typography variant="h5" className="mb-2">
                  Signature / Digital Confirmation
                </Typography>
                <Typography variant="h6" className="mt-2 mb-2">
                  Type your full name to confirm all details are correct.
                </Typography>
                <Input
                  type="text"
                  value={formData.signature}
                  onChange={handleChange("signature")}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg bg-white"
                  placeholder="Your full name"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              title="SUBMIT"
              type="submit"
              variant="primary"
              // disabled={!isFormValid()}
            />
          </div>
        </>
      )}
    </form>
  );
}
