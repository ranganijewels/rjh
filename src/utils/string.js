// Converts a string to Title Case. Ignores certain small words unless they are the first word.
export function toTitleCase(str) {
  if (!str || typeof str !== "string") return "";

  const lowerWords = ["and", "of", "the"];
  return str
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word, index) =>
      lowerWords.includes(word) && index !== 0
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export const formatCarat = (value) => {
  if (!value) return "";

  // If value is "Custom", return as-is
  if (String(value).toLowerCase() === "custom") {
    return "Custom";
  }

  const str = String(value).trim();

  // Already contains ct or ctw
  const hasCT = /ctw?|ct/i.test(str);
  return hasCT ? str : `${str} CT`;
};

export const formatRange = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return "";
  if (arr.length === 1) return arr[0];
  return `${arr[0]}-${arr[arr.length - 1]}`;
};

export const cleanCarat = (value) =>
  value ? String(value).replace(/[^0-9.]/g, "") : "";

// Removes non-numeric characters except the decimal point.
export const normalizeCarat = (value) => {
  if (value === null || value === undefined || value === "") return "";

  const num = Number(String(value).replace(/[^0-9.]/g, ""));

  if (Number.isNaN(num)) return "";

  return Number.isInteger(num) ? String(num) : String(num);
};

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const getPreviewUrl = (file) => {
  if (!file) return null;

  if (file instanceof File || file instanceof Blob) {
    return URL.createObjectURL(file);
  }

  if (typeof file === "string") {
    return file;
  }

  if (file?.preview) return file.preview;
  if (file?.url) return file.url;

  return null;
};

// Converts yyyy-mm-dd to dd-mm-yyyy
export const displayFormat = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  if (parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  }
  return dateStr;
};

// Converts dd-mm-yyyy to yyyy-mm-dd
export const standardFormat = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  if (parts[2].length === 4) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  return dateStr;
};

export const stringToDate = (value) => {
  if (!value) return undefined;
  const [dd, mm, yyyy] = value.split("-");
  return new Date(yyyy, mm - 1, dd);
};

export const dateToString = (date) => {
  if (!date) return "";
  return `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${date.getFullYear()}`;
};
