// One mapping between the storefront's address shapes and the API's
// /storefront/addresses (label, recipientName, phone, addressLine1/2, city,
// state, pincode, country, isDefault). Checkout and Profile ▸ My Address
// both use /api/address, so both shapes are accepted and returned.

const str = (v) => (v == null ? "" : String(v).trim());

/** Body from checkout or the profile form → API payload. */
export function toApiAddress(body = {}, { partial = false } = {}) {
  const fullName =
    str(body.name || body.recipient_name || body.contact_name) ||
    [str(body.first_name), str(body.last_name)].filter(Boolean).join(" ");
  const payload = {
    label: str(body.label || body.address_type) || (partial ? undefined : "Home"),
    recipientName: fullName || undefined,
    phone: str(body.phone || body.contact_phone) || undefined,
    addressLine1: str(body.address_line1 || body.street_address || body.street || body.address) || undefined,
    addressLine2: body.address_line2 !== undefined ? str(body.address_line2) : undefined,
    city: str(body.city) || undefined,
    state: str(body.state) || undefined,
    pincode: str(body.pincode || body.zip_code || body.postal_code) || undefined,
    country: str(body.country) || (partial ? undefined : "India"),
    isDefault: body.is_default === undefined ? undefined : !!Number(body.is_default) || body.is_default === true,
  };
  // PATCH sends only what changed; POST fills the required fields.
  return Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));
}

/** API address → the fields both checkout and the profile read. */
export function fromApiAddress(a = {}) {
  const name = str(a.recipientName || a.contactName || a.name);
  const [first, ...rest] = name.split(/\s+/);
  const line1 = str(a.addressLine1 || a.street);
  const pincode = str(a.pincode || a.postalCode);
  const label = str(a.label || a.addressType) || "Home";
  return {
    id: a.id,
    address_id: a.id,
    label,
    address_type: label,
    name,
    first_name: first || "",
    last_name: rest.join(" "),
    phone: str(a.phone),
    address_line1: line1,
    street_address: line1,
    address_line2: str(a.addressLine2),
    city: str(a.city),
    state: str(a.state),
    pincode,
    zip_code: pincode,
    country: str(a.country) || "India",
    is_default: a.isDefault ? 1 : 0,
  };
}
