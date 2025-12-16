"use client";
import Button from "@/components/ui/Button/Button";
import React, { useEffect, useRef, useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import { StepIndicator } from "./StepIndicator";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useCrudApi } from "@/hooks/useCrudApi";

const StepperForm = () => {
  const steps = [
    "Share Your Vision",
    "Customize Your Jewelry",
    "Review Your Selections",
    "Your Contact Information",
  ];
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const convertFilesToBase64 = async (files) => {
    const base64Files = await Promise.all(
      files.map((file) => fileToBase64(file))
    );
    return base64Files;
  };

  const { create } = useCrudApi("/api/customize");
  const [currentStep, setCurrentStep] = useState(0);
  const stepWrapperRef = useRef(null);
  const formWrraperRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const stepOneRef = useRef();
  const stepTwoRef = useRef();
  const stepThreeRef = useRef();
  const stepFourRef = useRef();
  const [stepTwoData, setStepTwoData] = useState({
    colorRange: ["D", "E", "F", "G", "H", "I"],
    cutRange: ["Excellent", "Ideal", "Very Good", "Good"],
    clarityRange: ["SI1", "SI2", "VS1", "VS2", "VVS1", "VVS2"],
    ringSize: null,
    metal: null,
    selectedDesignNo: null,
    selectedWeight: null,
  });

  const formatRange = (arr) => {
    if (!arr || arr.length === 0) return null;
    if (arr.length === 1 || arr[0] === arr[arr.length - 1]) {
      return arr[0];
    }
    return `${arr[0]} - ${arr[arr.length - 1]}`;
  };

  const nextStep = () => {
    toast.dismiss();
    let isValid = true;

    if (currentStep === 1) {
      const result = stepTwoRef.current?.validate();
      if (!result?.isValid) return;

      setStepTwoData(result.data);
    }

    if (currentStep === 0) {
      const result = stepOneRef.current?.validate();
      isValid = result?.isValid;
      if (!isValid) return;

      setFiles(result.data.files);
      setDescription(result.data.description);
    }

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }

    setTimeout(() => {
      formWrraperRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const transformPayload = (data) => ({
    category_id: data.category_id,
    description: data.description,
    shape: data.diamondShapeLabel,
    carat: parseFloat(data.diamondWeight),
    color: formatRange(data.colorRange),
    cut: formatRange(data.cutRange),
    clarity: formatRange(data.clarityRange),
    metal: `${data.metal?.karat?.value || ""} ${
      data.metal?.color || ""
    }`.trim(),
    ring_size: data.ringSize,
    full_name: data.Fullname,
    email: data.Email,
    contact_method: data.preferredContactMethod,
    phone: data.Phone,
    city: data.City,
    country: data.Country,
    notes: data.additionalNotes,
    agree_privacy: data.isChecked,
    file: data.files ?? [],
  });

  const handleCustomSubmit = async () => {
    const stepFourData = stepFourRef.current?.validateAndGetData();
    if (!stepFourData) return;
    const base64Files = await convertFilesToBase64(files);

    const fullData = {
      files: base64Files,
      description,
      additionalNotes,
      ...stepTwoData,
      ...stepFourData,
    };

    const apiPayload = transformPayload(fullData);

    try {
      const res = await create(apiPayload);

      if (!res.status) throw new Error("Failed to create request");

      toast.success("Form submitted successfully!");
      stepFourRef.current?.reset();
      setFiles([]);
      setDescription("");
      setAdditionalNotes("");
      setStepTwoData({
        colorRange: ["D", "E", "F", "G", "H", "I"],
        cutRange: ["Excellent", "Ideal", "Very Good", "Good"],
        clarityRange: ["SI1", "SI2", "VS1", "VS2", "VVS1", "VVS2"],
        ringSize: null,
        metal: null,
        selectedDesignNo: null,
        selectedWeight: null,
      });
      setCurrentStep(0);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepOne
            ref={stepOneRef}
            files={files}
            setFiles={setFiles}
            description={description}
            setDescription={setDescription}
          />
        );
      case 1:
        return (
          <StepTwo
            ref={stepTwoRef}
            data={stepTwoData}
            setData={setStepTwoData}
          />
        );

      case 2:
        return (
          <StepThree
            ref={stepThreeRef}
            files={files}
            description={description}
            additionalNotes={additionalNotes}
            setAdditionalNotes={setAdditionalNotes}
            {...stepTwoData}
          />
        );
      case 3:
        return <StepFour ref={stepFourRef} />;
      default:
        return null;
    }
  };

  return (
    <section
      className="flex xl:flex-row flex-col xl:p-[80px_63px] lg:p-[40px_30px] p-[40px_18px]"
      ref={formWrraperRef}
    >
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        onStepChange={(step) => setCurrentStep(step)}
      />
      {/* Step Content & Navigation */}
      <div className="bg-[var(--product-bg)] xl:p-[53px] lg:p-[40px] p-[40px_10px] xl:w-[80%] xl:space-y-[54px] space-y-[40px]">
        <div ref={stepWrapperRef}>{renderStep()}</div>

        {/* Navigation Buttons */}
        <div className="flex xl:gap-[20px] gap-[16px] justify-end">
          <Button
            variant="outlineTeal"
            title="Previous"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-gray-200 disabled:opacity-50"
          />

          {currentStep === steps.length - 1 ? (
            <Button
              title="Send My Custom Request"
              onClick={handleCustomSubmit}
            />
          ) : (
            <Button title="Next" onClick={nextStep} />
          )}
        </div>
      </div>
    </section>
  );
};

export default StepperForm;
