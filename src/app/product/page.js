import { preload } from "react-dom";
import ListingPage from "./ListingPage";
import { buildListingHero, heroPoster } from "@/lib/listingHero";

// The listing banner (the LCP element) is resolved on the server and sent with
// the HTML; products still load client-side as before.
export default async function Page({ searchParams }) {
  const sp = (await searchParams) || {};
  const hero = await buildListingHero({ category_id: sp.category_id, collection: sp.collection });
  const poster = heroPoster(sp.banner || hero?.file);
  if (poster) preload(poster, { as: "image", fetchPriority: "high" });
  return <ListingPage initialHero={hero} />;
}
