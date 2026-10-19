export const buildMenus = (apiData, options) => {
  const { style = [], shape = [], metal = [] } = apiData;
  const metalOptions =
    options
      .find((menu) => menu.title === "Engagement")
      ?.categories.find((category) => category.title === "METAL")?.items || [];

  const buildHref = (collection, key, value) => {
    const base = `/product?collection=${encodeURIComponent(
      collection
    )}&${key}=${encodeURIComponent(value)}`;
    return collection === "Engagement" ? `${base}&category=ring` : base;
  };

  // Shared category builder
  const getSharedCategories = (collection) => [
    {
      title: "SHOP BY STYLE",
      items: style?.data?.map((s) => ({
        label: s.title,
        href: buildHref(collection, "style", s.title),
      })),
    },
    {
      title: "SHOP BY SHAPE",
      items: shape?.data?.map((s) => ({
        label: s.title,
        href: buildHref(collection, "shape", s.title),
      })),
    },
    {
      title: "METAL",
      items: metalOptions?.map((m) => ({
        label: m,
        href: buildHref(collection, "metal", m),
      })),
    },
  ];
  return [
    {
      title: "Engagement",
      categories: [
        ...getSharedCategories("Engagement"),
        {
          title: "CUSTOM & SERVICES",
          items: [
            { label: "Design Your Own Ring", href: "/customize-form" },
            "Start with a Diamond",
            "Virtual Consultation",
            // "Ready-to-Ship Rings",
            { label: "Lifetime Warranty", href: "/lifetime-warranty" },
            { label: "Jewelry Care", href: "/jewelry-care" },
          ],
        },
      ],
      imageSection: [
        {
          imageUrl: "/images/home/book-a-virtual-appointment.png",
          callToAction: {
            text: "BOOK A VIRTUAL APPOINTMENT",
            url: "#book-appointment",
          },
          additionalTitle: "Not Sure Where to Start?",
          additionalDescription:
            "Our jewelry experts are here to guide you — from choosing the perfect diamond to customizing your forever ring.",
        },
      ],
    },
    {
      title: "Wedding",
      categories: [
        ...getSharedCategories("Wedding"),
        {
          title: "Mens",
          items: ["Men’s Diamond Ring", "Diamond & Gemstone"],
        },
        // {
        //   title: "CUSTOM & SERVICES",
        //   items: [
        //     "Design Your Wedding Band",
        //     "Pair with Engagement Ring",
        //     "Choose Your Metal",
        //     "Add an Engraving",
        //   ],
        // },
      ],
      imageSection: [
        {
          imageUrl: "/images/home/explore-matching-bands.png ",
          callToAction: {
            text: "Explore Matching Bands",
            url: "#book-appointment",
          },
          additionalTitle: "Bands That Tell Your Story",
          additionalDescription:
            "From timeless classics to modern silhouettes, our bands are crafted to mark a lifetime of moments.",
        },
      ],
    },
    {
      title: "Jewelry",
      categories: [
        {
          title: "Shop by Category",
          items: [
            { label: "Necklaces", href: "/product?category=Necklace" },
            { label: "Earrings", href: "/product?category=Earring" },
            { label: "Bracelets", href: "/product?category=Bracelet" },
            { label: "Stacking Rings", href: "/product?category=Ring" },
            { label: "Jewelry Sets", href: "/product?category=Sets" },
          ],
        },

        {
          title: "SHOP BY OCCASION",
          items: [
            "Everyday Essentials",
            "Bridal & Ceremony",
            "Gifting Favourites",
            "Milestone Moments",
            "Red Carpet Edit",
            "Travel-Friendly Luxury",
          ],
        },
        {
          title: "FEATURED",
          items: [
            "New Arrivals",
            "Bestsellers",
            "Limited Editions",
            "Curated by RJ HOUSE",
            "Jewelry Under $1000",
          ],
        },
        {
          title: "STYLE & EDUCATION ",
          items: [
            "Jewelry Styling Guide",
            "How to Layer & Stack",
            { label: "Jewelry Care", href: "/jewelry-care" },
            "Metals & Materials",
            {
              label: "Lab-Grown Diamond Info",
              href: "/diamond-education",
            },
          ],
        },
      ],
      imageSection: [
        {
          imageUrl: "/images/home/explore-the-collection.png ",
          callToAction: {
            text: "EXPLORE THE COLLECTION",
            url: "#book-appointment",
          },
          additionalTitle: "Modern Heirlooms. Effortlessly Iconic",
          additionalDescription:
            "Discover fine jewelry crafted with intention — minimalist lines, timeless materials, and international craftsmanship.",
        },
      ],
    },
    {
      title: "Customize",
      categories: [
        {
          title: "Customize Jewelry",
          items: [
            { label: "Engagement Ring", href: "/customize-form" },
            { label: "Wedding Band", href: "/customize-form" },
            { label: "Necklace", href: "/customize-form" },
            { label: "Bracelet", href: "/customize-form" },
            { label: "Earrings", href: "/customize-form" },
          ],
        },
        {
          title: "Guides & Support",
          items: [
            "Customization Guide",
            {
              label: "Diamond Selection Guide",
              href: "/diamond-education",
            },
            {
              label: "Metal & Setting Options",
              href: "/diamond-education",
            },
            { label: "Ring Size Guide", href: "/ring-size-guide" },
          ],
        },
        {
          title: "Inspiration Gallery",
          items: [
            "Past Custom Designs",
            "Customer Stories",
            { label: "Behind the Craft", href: "/craftsmanship" },
            "Explore Signature Details",
          ],
        },
        {
          title: "STYLE & EDUCATION",
          items: [
            {
              label: "Jewelry Styling Guide",
              href: "/blog",
            },
            { label: "How to Layer & Stack", href: "/blog" },
            { label: "Jewelry Care", href: "/jewelry-care" },
            "Metals & Materials",
            {
              label: "Lab-Grown Diamond Info ",
              href: "/diamond-education",
            },
          ],
        },
      ],
      // imageSection: [
      //   {
      //     imageUrl: "/images/home/start-designing.png ",
      //     callToAction: {
      //       text: "START DESIGNING",
      //       url: "/customize-form",
      //     },
      //     additionalTitle: "Your Vision. Our Craft.",
      //     additionalDescription:
      //       "From modern minimalism to timeless romance — design bespoke pieces that reflect you.",
      //   },
      // ],
    },
    {
      title: "About us",
      categories: [
        {
          title: "Our Story",
          items: [
            "The RJ HOUSE Journey",
            "Our Mission & Values",
            "The Meaning Behind the Name",
            "What Makes Us Different",
          ],
        },
        {
          title: "Craftsmanship",
          items: [
            "Craft of an RJ HOUSE Piece",
            "Our Design Philosophy",
            "Behind the Atelier",
            "Materials & Sourcing",
          ],
        },
        {
          title: "Sustainability",
          items: [
            "Our Ethical Promise",
            "Lab-Grown Diamond",
            "Responsible Sourcing",
            "Environmental Impact ",
          ],
        },
        {
          title: "Customer Love",
          items: ["Testimonials", "Reviews", "Client Stories", "Real Moments"],
        },
        {
          title: "Press & Features",
          items: [
            "In the News",
            "Magazine Features",
            "Influencer Collaborations",
            "Awards & Recognitions",
          ],
        },
      ],
    },
  ];
};
