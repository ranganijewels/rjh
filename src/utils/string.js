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

// Adds "CT" suffix if not already present.
export const formatCarat = (value) => {
  if (!value) return "";
  const hasCT = String(value).toUpperCase().includes("CT");
  return hasCT ? value : `${value} CT`;
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
