"use client";
import { createContext, useContext, useState } from "react";

const CustomizeContext = createContext(null);

const DEFAULT_REFERENCE_FORM = {
  files: [],
  description: "",
  urls: [],
  shape: null,
  metal: null,
  ringSize: null,
  selectedCarat: null,
  colorRange: ["D", "G"],
  clarityRange: ["VVS1", "VS2"],
  notes: "",
  categoryId: null,
  customCarat: "",
};

export const CustomizeProvider = ({ children }) => {
  const [referenceForm, setReferenceForm] = useState(DEFAULT_REFERENCE_FORM);

  const updateReferenceForm = (patch) => {
    setReferenceForm((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  const clearReferenceForm = () => {
    setReferenceForm((prev) => ({
      ...DEFAULT_REFERENCE_FORM,
      categoryId: prev.categoryId,
    }));
  };
  return (
    <CustomizeContext.Provider
      value={{
        referenceForm,
        updateReferenceForm,
        clearReferenceForm,
      }}
    >
      {children}
    </CustomizeContext.Provider>
  );
};

export const useCustomize = () => {
  const ctx = useContext(CustomizeContext);
  if (!ctx) {
    throw new Error("useCustomize must be used inside CustomizeProvider");
  }
  return ctx;
};
