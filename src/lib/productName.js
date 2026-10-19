// Mirrors fallbackProductName() in the API's seo.service.ts so the PDP h1,
// <title> and Product schema agree when a product has no admin-entered name.
export function displayProductName(p = {}) {
  const name = String(p.productName || p.name || "").trim();
  if (name) return name;
  const shape = p.centerStoneShape || p.diamondShape;
  const category = String(p.category || "Jewelry").replace(/s$/i, "");
  const parts = [shape, "Lab-Grown Diamond", category].filter(Boolean);
  return `${parts.join(" ")}${p.productCode ? ` ${p.productCode}` : ""}`.trim();
}
