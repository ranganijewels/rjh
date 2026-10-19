"use client";
import { createContext, useContext } from "react";
import { BUSINESS } from "@/config/business";

const fallback = {
  email: BUSINESS.email,
  phone: "",
  phoneHref: "",
  hours: BUSINESS.hours,
  social: BUSINESS.social,
  sameAs: Object.values(BUSINESS.social),
};

const SiteContactContext = createContext(fallback);

export function SiteContactProvider({ value, children }) {
  return (
    <SiteContactContext.Provider value={value || fallback}>
      {children}
    </SiteContactContext.Provider>
  );
}

export const useSiteContact = () => useContext(SiteContactContext);
