"use client";

import Dropdown from "../Dropdown/Dropdown";
import Button from "../Button/Button";
import { usePreferences } from "@/context/PreferencesContext";
import { useEffect, useState, useMemo } from "react";
import { useCrudApi } from "@/hooks/useCrudApi";
import { store } from "@/store/store";
import { toast } from "react-hot-toast";
import clsx from "clsx";

const CountryCurrencyModal = ({ setIsModalOpen, isModalOpen }) => {
  const { selectedCountry, setSelectedCountry } = usePreferences();
  const state = store.getState();
  const customerId = state.auth?.customer?.id;
  const { fetchAll, create } = useCrudApi("/api/countries");

  const [countries, setCountries] = useState([]);
  const [localCountry, setLocalCountry] = useState(selectedCountry);
  const [typedKey, setTypedKey] = useState("");

  useEffect(() => {
    fetchAll()
      .then((res) => setCountries(res.data || []))
      .catch((err) => console.error("Error fetching countries", err));
  }, [fetchAll]);

  const formattedCountries = useMemo(
    () =>
      countries.map((c) => ({
        ...c,
        label: c.name,
        value: c.iso_alpha2,
      })),
    [countries]
  );

  const handleSave = async () => {
    if (!localCountry) return;

    const payload = {
      country: localCountry.name,
      ...(localCountry.currency_code
        ? { currency: localCountry.currency_code }
        : {}),
    };

    try {
      const response = await create(payload, {
        headers: { "x-customer-id": customerId },
      });

      if (response && response.status !== false) {
        setSelectedCountry({
          value: (localCountry.iso_alpha2 || "").toLowerCase(),
          label: localCountry.name,
          currency: localCountry.currency_code || localCountry.currency || "",
          symbol: localCountry.currency_symbol || "",
          rate: Number(localCountry.rate) || 1,
        });
        toast.success("Country saved successfully!");
        setIsModalOpen(false);
      } else {
        const errorMsg =
          response?.error?.country?.[0] ||
          response?.message ||
          "Something went wrong";
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      console.error(err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      const newTypedKey = typedKey + e.key.toLowerCase();
      setTypedKey(newTypedKey);

      const match = formattedCountries.find((c) =>
        c.name.toLowerCase().startsWith(newTypedKey)
      );

      if (match) setLocalCountry(match);
    } else if (e.key === "Backspace") {
      setTypedKey(typedKey.slice(0, -1));
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyPress}
      className={clsx(
        "xl:w-[25%] lg:w-[40%] md:w-[50%] w-full bg-white shadow-lg flex flex-col gap-[25px] p-[40px_48px] absolute top-[50px] outline-none",
        isModalOpen
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-10"
      )}
    >
      <img
        src="/icons/rj-house-logo.svg"
        alt="RJ House Logo"
        className="md:w-auto w-[100px] h-[28px]"
      />
      <img
        src={"/icons/close.svg"}
        className="w-[15px] h-[15px] absolute right-5 top-5 cursor-pointer"
        onClick={() => setIsModalOpen(false)}
      />

      <Dropdown
        label="Select your country for shipping and currency"
        fullWidth
        containerClass="flex-col items-start"
        options={formattedCountries}
        value={localCountry}
        onChange={setLocalCountry}
        searchable={true}
        customWidth={"w-full"}
        placeholder={localCountry ? localCountry.name : "Select an Option"}
        itemClassName={(option) =>
          option.value === localCountry?.value ? "bg-[var(--grey-00)]" : ""
        }
      />

      <div className="flex flex-col gap-[10px]">
        <Button title="SAVE" onClick={handleSave} />
        <Button
          onClick={() => setIsModalOpen(false)}
          className="text-sm text-gray-600 hover:underline"
          title="Close"
          variant="secondary"
        />
      </div>
    </div>
  );
};

export default CountryCurrencyModal;
