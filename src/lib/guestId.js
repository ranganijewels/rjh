// Persistent anonymous identity for guest checkout — lets the cart live in
// Redis under this id (via the `x-guest-id` header) before the shopper has
// an account. Never sent once a real Bearer token exists.
export function getGuestId() {
  if (typeof window === "undefined") return null;
  try {
    let id = localStorage.getItem("rj_guest_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("rj_guest_id", id);
    }
    return id;
  } catch {
    return null;
  }
}
