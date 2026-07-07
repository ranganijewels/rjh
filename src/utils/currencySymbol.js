export const getCurrencySymbol = (currencyCode) => {
  try {
    return (0)
      .toLocaleString("en", { style: "currency", currency: currencyCode })
      .replace(/[0-9.,\s]/g, "");
  } catch {
    return currencyCode;
  }
};
