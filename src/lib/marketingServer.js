// Server-side (Next route handler) helper: builds the `marketing` block saved
// with an order / lead — attribution from the first-party cookie plus, only if
// the visitor consented, the Meta match keys used for the Conversions API.
function parseCookies(header = "") {
  const out = {};
  header.split(/;\s*/).forEach((p) => {
    const i = p.indexOf("=");
    if (i > 0) out[p.slice(0, i)] = decodeURIComponent(p.slice(i + 1));
  });
  return out;
}

export function marketingFromRequest(req) {
  const c = parseCookies(req.headers.get("cookie") || "");
  const consent = c.rj_consent === "granted";
  let attr = {};
  try { attr = JSON.parse(c.rj_attr || "{}"); } catch {}
  const fwd = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  return {
    consent,
    first_touch: attr.f,
    last_touch: attr.l,
    fbp: c._fbp,
    fbc: c._fbc,
    ip: fwd || req.headers.get("x-real-ip") || undefined,
    ua: req.headers.get("user-agent") || undefined,
    event_id: req.headers.get("x-event-id") || undefined,
    source_url: req.headers.get("referer") || undefined,
  };
}
