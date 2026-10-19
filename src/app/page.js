import { preload } from "react-dom";
import HomepageLayout from "@/commomPages/Home";
import { buildHomeData } from "@/lib/homeData";

// Server-render the homepage with its CMS content so the hero and sections are
// in the first HTML (faster LCP, no layout shift from late-loading data).

export default async function Home() {
  const homeData = await buildHomeData();
  // The hero poster is the LCP image on phones — fetch it first.
  const poster = homeData?.hero_section?.[0]?.poster;
  if (poster) preload(poster, { as: "image", fetchPriority: "high" });
  return <HomepageLayout initialData={homeData} />;
}
