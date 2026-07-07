import DeleteIcon from "@/components/Icons/DeleteIcon";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import toast from "react-hot-toast";

const StepOne = forwardRef(
  ({ files, setFiles, description, setDescription }, ref) => {
    const [errors, setErrors] = useState({ file: "", description: "" });
    useImperativeHandle(ref, () => ({
      validate: () => {
        toast.dismiss();
        const newErrors = { file: "", description: "" };
        let isValid = true;

        if (!files?.length) {
          newErrors.file = "You need to upload at least one image.";
          toast.error(newErrors.file);
          isValid = false;
        }

        if (!description.trim()) {
          newErrors.description = "Description cannot be empty.";
          toast.error(newErrors.description);
          isValid = false;
        }

        setErrors(newErrors);
        return { isValid, data: isValid ? { files, description } : null };
      },
    }));

    const handleFileChange = (selectedFiles) => {
      const valid = selectedFiles.every((file) =>
        ["image/jpeg", "image/png", "application/pdf"].includes(file.type)
      );

      if (!valid) {
        toast.error("Please upload valid images (JPG, PNG) or PDFs.");
        return;
      }

      setFiles((prev) => [...prev, ...selectedFiles]);
      setErrors((prev) => ({ ...prev, file: "" }));
    };

    const handleDrop = (e) => {
      e.preventDefault();
      handleFileChange(Array.from(e.dataTransfer.files));
    };

    const handleDelete = (index) => {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      if (!updatedFiles.length) {
        setErrors((prev) => ({
          ...prev,
          file: "You need to upload at least one image.",
        }));
      }
    };

    return (
      <div className="xl:space-y-[54px] space-y-[40px]">
        {/* Header */}
        <div className="pb-[32px]">
          <p className="xl:text-[24px] text-[18px] font-[500]">
            Share Your Vision
          </p>
          <p className="xl:text-[18px] text-[14px] font-[500] text-[var(--placeholder)]">
            Upload sketches, photos, or references that capture your idea.
          </p>
        </div>
        <hr className="hr-teal-3" />

        {/* Upload area */}
        <div
          className="flex items-center justify-center w-full"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 
                     outline-2 outline-[var(--teal-2)] outline-offset-2 
                     outline-dashed rounded-lg cursor-pointer"
          >
            <p className="mb-2 text-[16px] font-[500] text-[var(--grey-2)]">
              Drop your image here, or browse
            </p>
            <p className="text-[12px] font-[500] text-[var(--placeholder)]">
              Supports: JPG, PNG, PDF (Max 10MB each)
            </p>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              multiple
              onChange={(e) => handleFileChange(Array.from(e.target.files))}
            />
          </label>
        </div>
        {errors.file && (
          <p className="text-red-500 text-sm mt-1">{errors.file}</p>
        )}

        {/* Preview */}
        <div className="flex gap-3 flex-wrap">
          {files?.map((file, index) => (
            <div
              key={index}
              className="relative w-[120px] h-[120px] xl:w-[223px] xl:h-[223px]"
            >
              <img
                src={URL.createObjectURL(file)}
                alt="Selected"
                className="rounded-lg w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="absolute top-2 right-2 bg-white p-1 rounded-full"
              >
                <DeleteIcon />
              </button>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-[16px] font-[400]">
            Describe what you’re envisioning or why this inspiration is
            meaningful to you.
          </label>
          <textarea
            placeholder="Enter text..."
            className={`bg-white p-3 resize-none focus:outline-[var(--teal-1)] focus:outline-1 
            ${errors.description ? "border border-red-500" : ""}`}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: "" }));
            }}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>
      </div>
    );
  }
);

export default StepOne;
