// The Size Profile drawer works in snake_case (ring_size, necklace_length…);
// the API's /storefront/size-profiles uses camelCase. These map between them.

export const toApi = (body = {}) => ({
  name: body.name,
  ringSize: body.ring_size,
  weddingBandSize: body.wedding_band_size,
  braceletSize: body.bracelet_size,
  necklaceLength: body.necklace_length,
});

export const fromApi = (p = {}) => ({
  id: p.id,
  name: p.name || "",
  ring_size: p.ringSize || "",
  wedding_band_size: p.weddingBandSize || "",
  bracelet_size: p.braceletSize || "",
  necklace_length: p.necklaceLength || "",
});

// useCrudApi throws with this message on a non-2xx response. Only the API's
// validation messages (400, e.g. "Give the profile a name") are shown as-is.
export const apiError = (result, fallback) => ({
  status: false,
  message: (result.status === 400 && result.raw?.message) || fallback,
});
