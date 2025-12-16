"use client";
import { createContext, useState, useContext, useEffect } from "react";

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  // Load from localStorage if available
  const [selectedCountry, setSelectedCountry] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedCountry");
      return saved
        ? JSON.parse(saved)
        : { value: "ca", label: "Canada", currency: "CAD" };
    }
    return { value: "ca", label: "Canada", currency: "CAD" };
  });

  const [selectedLanguage, setSelectedLanguage] = useState("English");

  useEffect(() => {
    localStorage.setItem("selectedCountry", JSON.stringify(selectedCountry));
  }, [selectedCountry]);

  const handleLanguageChange = (language) => setSelectedLanguage(language);
  const handleCountryChange = (country) => setSelectedCountry(country);

  return (
    <PreferencesContext.Provider
      value={{
        selectedLanguage,
        selectedCountry,
        handleLanguageChange,
        handleCountryChange,
        setSelectedCountry,
        setSelectedLanguage,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferencesContext);
