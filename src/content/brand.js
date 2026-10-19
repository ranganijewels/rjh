// Verified brand facts (owner-supplied): family experience of 50+ years,
// metals offered are 10K/14K/18K gold and 925 sterling silver. Story copy
// anywhere on the site should be built from these, not from template text.
export const BRAND_FACTS = {
  experience: "more than 50 years",
  metals: "10K, 14K and 18K gold and 925 sterling silver",
};

// Owner-authored "Why Rangani" band (mirrors the CMS pdp-content.difference).
export const DIFFERENCE_DEFAULT = {
  heading: "Why Rangani",
  body:
    "There is more behind a Rangani piece than the finished jewellery you see here. Our family has spent more than 50 years working with diamonds, beginning in natural diamond manufacturing and later building our own lab-grown diamond growing and manufacturing capabilities. Today, that experience continues into our jewellery manufacturing as well.",
  linkText: "Our Story",
  linkUrl: "/about-us",
  items: [
    {
      title: "How Is My Diamond Certified?",
      body:
        "It depends on the piece. Solitaire centre diamonds come with an individual IGI or GIA grading report; jewellery set with smaller diamonds comes with an SGL jewellery certificate. The product page states which applies.",
    },
    {
      title: "What Metal Is This Jewellery Made In?",
      body: `We work in ${BRAND_FACTS.metals}. The metal and purity options for each design are shown in its product specifications, and gold is hallmarked for purity.`,
    },
    {
      title: "How Will My Rangani Jewellery Arrive?",
      body:
        "Every order is checked and prepared before dispatch, and arrives insured in Rangani packaging.",
    },
  ],
};
