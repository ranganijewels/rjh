"use client";
import { createContext, useState, useContext, useEffect } from "react";

const PreferencesContext = createContext();

// Base/default country until IP geo-detection or a saved preference resolves.
const DEFAULT_COUNTRY = {
  value: "us",
  label: "United States",
  currency: "USD",
  symbol: "$",
  rate: 1,
};

export const PreferencesProvider = ({ children }) => {
  // Load from localStorage if a prior choice exists; otherwise use the US base.
  const [selectedCountry, setSelectedCountry] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedCountry");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return DEFAULT_COUNTRY;
        }
      }
    }
    return DEFAULT_COUNTRY;
  });

  const [selectedLanguage, setSelectedLanguage] = useState("English");

  // On first visit (no saved country), auto-detect from the visitor's IP.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("selectedCountry");
    if (saved) return; // respect an explicit prior choice
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/geo", { cache: "no-store" });
        const json = await res.json();
        const c = json?.data;
        if (!cancelled && c && c.iso_alpha2) {
          setSelectedCountry({
            value: c.iso_alpha2.toLowerCase(),
            label: c.name,
            currency: c.currency_code,
            symbol: c.currency_symbol,
            rate: Number(c.rate) || 1,
          });
        }
      } catch {
        /* keep the US default */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
