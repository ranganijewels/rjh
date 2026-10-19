// /product URL params → /api/product payload. Mirrors listingParamsToFilter()
// in the API's products.service.ts, which the menu link check uses — keep both
// in step so a menu link and the listing it opens always agree.
const DEPARTMENTS = new Set(["engagement", "wedding", "jewellery", "jewelry"]);

export function listingPayloadFromParams(params) {
  const payload = {};
  const collection = params.get("collection");
  if (collection) {
    if (DEPARTMENTS.has(collection.toLowerCase())) payload.department = collection;
    else payload.collection = collection;
  }
  const category = params.get("category_id") || params.get("category");
  if (category) payload.category = category;
  if (params.get("subcat")) payload.sub_category = params.get("subcat");
  if (params.get("shape")) payload.diamond_shape = params.get("shape");
  if (params.get("metal")) payload.metal_color = params.get("metal");
  if (params.get("search")) payload.search = params.get("search");
  if (params.get("sort_by")) payload.sort_by = params.get("sort_by");
  return payload;
}
