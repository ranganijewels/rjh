// Transform a CMS "hero-banner" section's content (keys the CMS Banners & Hero
// editor writes: heading, subHeading, cta1Text/cta1Link, cta2Text/cta2Link,
// imageUrl, videoUrl, mobileImageUrl, mobileVideoUrl) into the shape the
// storefront hero (HeroSection + page routes) reads. One place so the CMS edits
// actually reach the page (previously routes only read heading + imageUrl).
export function heroFromCms(hero = {}) {
  const buttons = [
    hero.cta1Text ? { button_text: hero.cta1Text, button_url: hero.cta1Link || "#" } : null,
    hero.cta2Text ? { button_text: hero.cta2Text, button_url: hero.cta2Link || "#" } : null,
  ].filter(Boolean);
  const file = hero.videoUrl || hero.imageUrl || "";
  const mobileFile = hero.mobileVideoUrl || hero.mobileImageUrl || "";
  return {
    title: hero.heading || "",
    hero_text: hero.heading || "",
    description: hero.subHeading || "",
    hero_description: hero.subHeading || "",
    file,
    mobileFile,
    buttons,
  };
}

// Whether a transformed hero actually has CMS content worth showing.
export function heroHasContent(h) {
  return !!(h && (h.title || h.file || (h.buttons && h.buttons.length)));
}
