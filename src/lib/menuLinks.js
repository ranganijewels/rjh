import { rjApi } from "@/lib/apiHandler";

const isListingLink = (l) => typeof l === "string" && l.startsWith("/product");

// Live product count for each /product?... link (one API call for the batch).
// On failure every link is treated as non-empty so the menu still renders.
export async function listingLinkCounts(links) {
  const unique = [...new Set(links.filter(isListingLink))];
  if (!unique.length) return {};
  try {
    const res = await rjApi("POST", "/products/link-counts", { body: { links: unique } });
    const map = res.raw?.data ?? res.raw;
    return res.ok && map && typeof map === "object" ? map : {};
  } catch {
    return {};
  }
}

export const linkIsEmpty = (counts, link) => isListingLink(link) && counts[link] === 0;
