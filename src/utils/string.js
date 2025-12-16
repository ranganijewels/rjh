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
  const hasCT = String(value).toUpperCase().includes("CT");
  return hasCT ? value : `${value} CT`;
};
