export const NAV_MENUS = [
  { label: "Engagement", link: "/product?collection=Engagement" },
  { label: "Wedding", link: "/product?collection=Wedding" },
  { label: "Jewelry", link: "/product?collection=Jewellery" },
  { label: "Customize", link: "/customize" },
  { label: "About us", link: "/about-us" },
];

export const MENUS_OPTIONS = [
  {
    title: "Engagement",
    categories: [
      {
        title: "SHOP BY STYLE",
        items: [
          { label: "Solitaire", link: "/product?subcat=Solitaire&collection=Engagement" },
          { label: "Side stone", link: "/product?subcat=Side+Stone&collection=Engagement" },
          { label: "Halo", link: "/product?subcat=Halo&collection=Engagement" },
          { label: "Three stone", link: "/product?subcat=Three+Stone&collection=Engagement" },
          { label: "Hidden halo", link: "/product?subcat=Hidden+Halo&collection=Engagement" },
          { label: "Vintage & antique", link: "/product?subcat=Vintage&collection=Engagement" },
          { label: "Bridal sets", link: "/product?subcat=Bridal+Sets&collection=Engagement" },
          { label: "Gemstone", link: "/product?subcat=Gemstone&collection=Engagement" },
          { label: "Two Stone", link: "/product?subcat=Two+Stone&collection=Engagement" },
          { label: "Pave", link: "/product?subcat=Pave&collection=Engagement" },
        ],
      },
      {
        title: "SHOP BY SHAPE",
        items: [
          { label: "Round", link: "/product?shape=Round&collection=Engagement" },
          { label: "Princess", link: "/product?shape=Princess&collection=Engagement" },
          { label: "Oval", link: "/product?shape=Oval&collection=Engagement" },
          { label: "Radiant", link: "/product?shape=Radiant&collection=Engagement" },
          { label: "Pear", link: "/product?shape=Pear&collection=Engagement" },
          { label: "Emerald", link: "/product?shape=Emerald&collection=Engagement" },
          { label: "Marquise", link: "/product?shape=Marquise&collection=Engagement" },
          { label: "Heart", link: "/product?shape=Heart&collection=Engagement" },
          { label: "Cushion", link: "/product?shape=Cushion&collection=Engagement" },
          { label: "Asscher", link: "/product?shape=Asscher&collection=Engagement" },
        ],
      },
      {
        title: "METAL",
        items: [
          { label: "Yellow Gold", link: "/product?metal=yellow&collection=Engagement" },
          { label: "White Gold", link: "/product?metal=white&collection=Engagement" },
          { label: "Rose Gold", link: "/product?metal=rose&collection=Engagement" },
          { label: "Two Tone", link: "/product?metal=Two+Tone&collection=Engagement" },
        ],
      },
      {
        title: "CUSTOM & SERVICES",
        items: [
          { label: "Design Your Own Ring", link: "/customize?category=ring" },
          { label: "Virtual Consultation", link: "/book-consultancy" },
          "Free Resizing",
          { label: "Jewelry Care", link: "/jewelry-care" },
        ],
      },
    ],
    imageSection: [
      {
        imageUrl: "/images/home/engagement-rings.jpg",
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
      {
        title: "SHOP BY STYLE",
        items: [
          { label: "Solitaire", link: "/product?subcat=Solitaire&collection=Wedding" },
          { label: "Side stone", link: "/product?subcat=Side+Stone&collection=Wedding" },
          { label: "Halo", link: "/product?subcat=Halo&collection=Wedding" },
          { label: "Three stone", link: "/product?subcat=Three+Stone&collection=Wedding" },
          { label: "Vintage & antique", link: "/product?subcat=Vintage&collection=Wedding" },
          { label: "Bridal sets", link: "/product?subcat=Bridal+Sets&collection=Wedding" },
          { label: "Two Stone", link: "/product?subcat=Two+Stone&collection=Wedding" },
          { label: "Pave", link: "/product?subcat=Pave&collection=Wedding" },
        ],
      },
      {
        title: "SHOP BY SHAPE",
        items: [
          { label: "Round", link: "/product?shape=Round&collection=Wedding" },
          { label: "Princess", link: "/product?shape=Princess&collection=Wedding" },
          { label: "Oval", link: "/product?shape=Oval&collection=Wedding" },
          { label: "Radiant", link: "/product?shape=Radiant&collection=Wedding" },
          { label: "Pear", link: "/product?shape=Pear&collection=Wedding" },
          { label: "Emerald", link: "/product?shape=Emerald&collection=Wedding" },
          { label: "Marquise", link: "/product?shape=Marquise&collection=Wedding" },
          { label: "Heart", link: "/product?shape=Heart&collection=Wedding" },
          { label: "Cushion", link: "/product?shape=Cushion&collection=Wedding" },
          { label: "Asscher", link: "/product?shape=Asscher&collection=Wedding" },
        ],
      },
      {
        title: "METAL",
        items: [
          { label: "Yellow Gold", link: "/product?metal=yellow&collection=Wedding" },
          { label: "White Gold", link: "/product?metal=white&collection=Wedding" },
          { label: "Rose Gold", link: "/product?metal=rose&collection=Wedding" },
          { label: "Two Tone", link: "/product?metal=Two+Tone&collection=Wedding" },
        ],
      },
      {
        title: "Mens",
        items: [
          { label: "Men's Diamond Ring", link: "/product?search=mens&collection=Wedding" },
          { label: "Diamond & Gemstone", link: "/product?search=gemstone&collection=Wedding" },
        ],
      },
    ],
    imageSection: [
      {
        imageUrl: "/images/home/wedding.jpg",
        callToAction: {
          text: "Explore Matching Bands",
          url: "/product?collection=Wedding",
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
          { label: "Rings", link: "/product?category_id=ring&collection=Jewellery" },
          { label: "Earrings", link: "/product?category_id=earring&collection=Jewellery" },
          { label: "Necklaces", link: "/product?category_id=necklace&collection=Jewellery" },
          { label: "Bracelets", link: "/product?category_id=bracelet&collection=Jewellery" },
          { label: "Pendant", link: "/product?category_id=pendant&collection=Jewellery" },
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
          { label: "New Arrivals", link: "/product?sort_by=createdAt_desc" },
          { label: "Bestsellers", link: "/#best-seller" },
          "Limited Editions",
          "Curated by RJ HOUSE",
        ],
      },
      {
        title: "STYLE & EDUCATION",
        items: [
          "Jewelry Styling Guide",
          "How to Layer & Stack",
          "Jewelry Care",
          "Metals & Materials",
          "Lab-Grown Diamond Info",
        ],
      },
    ],
    imageSection: [
      {
        imageUrl: "/images/home/jewellery.jpg",
        callToAction: {
          text: "EXPLORE THE COLLECTION",
          url: "/product",
        },
        additionalTitle: "Modern Heirlooms. Effortlessly Iconic",
        additionalDescription:
          "Discover fine jewelry crafted with intention — minimalist lines, timeless materials, and international craftsmanship.",
      },
    ],
  },
  {
    title: "Customize",
    categoriesWithMedia: true,
    mediaCategories: [
      // Land on /customize with a per-category hero banner; its Start button
      // opens the form pre-scoped (category_id + size) — see /api/customize
      // CATEGORY_HEROES.
      {
        label: "Engagement Rings",
        image: "/images/customize/proposal-ring.png",
        link: "/customize?category=ring",
      },
      {
        label: "Wedding Bands",
        image: "/images/customize/twin-band-design.png",
        link: "/customize?category=band",
      },
      {
        label: "Bracelets",
        image: "/images/home/Bracelets-collection.png",
        link: "/customize?category=bracelet",
      },
      {
        label: "Necklaces",
        image: "/images/home/Necklaces-collection.png",
        link: "/customize?category=necklace",
      },
      {
        label: "Earrings",
        image: "/images/home/Earrings-collection.png",
        link: "/customize?category=earring",
      },
    ],
    categories: [],
  },
  {
    title: "About us",
    categories: [
      {
        title: "Our Story",
        items: [
          { label: "The RJ HOUSE Journey", link: "/about-us#our-story" },
          { label: "Our Mission & Values", link: "/about-us#mission-values" },
          { label: "The Meaning Behind the Name", link: "/about-us#meaning-name" },
          { label: "What Makes Us Different", link: "/about-us#what-different" },
        ],
      },
      {
        title: "Craftsmanship",
        items: [
          { label: "Craft of an RJ HOUSE Piece", link: "/craftsmanship#craft" },
          { label: "Our Design Philosophy", link: "/craftsmanship#design-philosophy" },
          { label: "Behind the Atelier", link: "/craftsmanship#atelier" },
          { label: "Materials & Sourcing", link: "/craftsmanship#materials" },
        ],
      },
      {
        title: "Sustainability",
        items: [
          { label: "Our Ethical Promise", link: "/sustainability#ethical-promise" },
          { label: "Lab-Grown Diamond Commitment", link: "/sustainability#lab-grown" },
          { label: "Responsible Sourcing", link: "/sustainability#responsible-sourcing" },
          { label: "Environmental Impact", link: "/sustainability#environmental-impact" },
        ],
      },
      {
        title: "Customer Love",
        items: [
          { label: "Testimonials", link: "/customer-love#testimonials" },
          { label: "Reviews", link: "/customer-love#reviews" },
          { label: "Client Stories", link: "/customer-love#client-stories" },
          { label: "Real Moments", link: "/customer-love#real-moments" },
        ],
      },
    ],
  },
];

export const SWIPER_MESSAGES = [
  "Get a free gift with every purchase over $999",
  "Our New Summer Collection is here",
  "Sign up & Get 10% OFF + early access to drops!",
  "Ethically Crafted | Thoughtfully Designed",
];
