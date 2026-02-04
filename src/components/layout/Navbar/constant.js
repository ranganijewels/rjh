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
          { label: "Solitaire", link: "/product" },
          { label: "Side stone", link: "/product" },
          { label: "Halo", link: "/product" },
          { label: "Three stone", link: "/product" },
          { label: "Hidden halo", link: "/product" },
          { label: "Vintage & antique", link: "/product" },
          { label: "Bridal sets", link: "/product" },
          { label: "Gemstone", link: "/product" },
          { label: "Two Stone", link: "/product" },
          { label: "Pave", link: "/product" },
        ],
      },
      {
        title: "SHOP BY SHAPE",
        items: [
          { label: "Round", link: "/product?shape=11&category_id=10" },
          { label: "Princess", link: "/product?shape=9&category_id=10" },
          { label: "Oval", link: "/product?shape=7&category_id=10" },
          { label: "Radiant", link: "/product?shape=10&category_id=10" },
          { label: "Pear", link: "/product?shape=8&category_id=10" },
          { label: "Emerald", link: "/product?shape=4&category_id=10" },
          { label: "Marquise", link: "/product?shape=6&category_id=10" },
          { label: "Heart", link: "/product?shape=5&category_id=10" },
          { label: "Cushion", link: "/product?shape=3&category_id=10" },
          { label: "Asscher", link: "/product?shape=1&category_id=10" },
        ],
      },
      {
        title: "METAL",
        items: [
          {
            label: "Yellow Gold",
            link: "/product?metal=yellow&category_id=10",
          },
          {
            label: "White Gold",
            link: "/product?metal=white&category_id=10",
          },
          {
            label: "Rose Gold",
            link: "/product?metal=rose&category_id=10",
          },
          {
            label: "Two Tone",
            link: "/product?metal=two tone&category_id=10",
          },
          // {
          //   label: "White & Yellow",
          //   link: "/product?metal=white/yellow&category_id=10",
          // },
          // {
          //   label: "White & Rose",
          //   link: "/product?metal=white/rose&category_id=10",
          // },
        ],
      },
      {
        title: "CUSTOM & SERVICES",
        items: [
          {
            label: "Design Your Own Ring",
            link: "/customize?category=ring",
          },
          // {
          //   label: "Start with a Diamond",
          //   link: "/customize",
          // },
          {
            label: "Virtual Consultation",
            link: "/book-consultancy",
          },
          // "Ready-to-Ship Rings",
          "Free Resizing",
          {
            label: "Jewelry Care",
            link: "/jewelry-care",
          },
          ,
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
          "Solitaire",
          "Side stone",
          "Halo",
          "Three stone",
          "Hidden halo",
          "Vintage & antique",
          "Bridal sets",
          "Gemstone",
          "Two Stone",
          "Pave",
        ],
      },
      {
        title: "SHOP BY SHAPE",
        items: [
          {
            label: "Round",
            link: "/product?shape=11&collection=wedding&category_id=1",
          },
          {
            label: "Princess",
            link: "/product?shape=9&collection=wedding&category_id=1",
          },
          {
            label: "Oval",
            link: "/product?shape=7&collection=wedding&category_id=1",
          },
          {
            label: "Radiant",
            link: "/product?shape=10&collection=wedding&category_id=1",
          },
          {
            label: "Pear",
            link: "/product?shape=8&collection=wedding&category_id=1",
          },
          {
            label: "Emerald",
            link: "/product?shape=4&collection=wedding&category_id=1",
          },
          {
            label: "Marquise",
            link: "/product?shape=6&collection=wedding&category_id=1",
          },
          {
            label: "Heart",
            link: "/product?shape=5&collection=wedding&category_id=1",
          },
          {
            label: "Cushion",
            link: "/product?shape=3&collection=wedding&category_id=1",
          },
          {
            label: "Asscher",
            link: "/product?shape=1&collection=wedding&category_id=1",
          },
        ],
      },
      {
        title: "METAL",
        items: [
          {
            label: "Yellow Gold",
            link: "/product?metal=yellow&collection=wedding&category_id=1",
          },
          {
            label: "White Gold",
            link: "/product?metal=white&collection=wedding&category_id=1",
          },
          {
            label: "Rose Gold",
            link: "/product?metal=rose&collection=wedding&category_id=1",
          },
          {
            label: "Two Tone",
            link: "/product?metal=two tone&category_id=1",
          },
          // {
          //   label: "White & Yellow",
          //   link: "/product?metal=white/yellow&collection=wedding",
          // },
          // {
          //   label: "White & Rose",
          //   link: "/product?metal=white/rose&collection=wedding",
          // },
        ],
      },
      {
        title: "Mens",
        items: [
          { label: "Men’s Diamond Ring", link: "/product?gender=male" },
          { label: "Diamond & Gemstone", link: "/product?gender=male" },
        ],
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
        imageUrl: "/images/home/wedding.jpg ",
        callToAction: {
          text: "Explore Matching Bands",
          url: "/product?collection=wedding&category_id=1",
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
        title: "Shop by Category ",
        items: [
          {
            label: "Rings",
            link: "/product?category_id=10&collection=jewellery",
          },
          {
            label: "Earrings",
            link: "/product?category_id=4&collection=jewellery",
          },
          {
            label: "Necklaces",
            link: "/product?category_id=6&collection=jewellery",
          },
          {
            label: "Bracelets",
            link: "/product?category_id=3&collection=jewellery",
          },
          {
            label: "Pendant",
            link: "/product?category_id=8&collection=jewellery",
          },
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
          {
            label: "New Arrivals",
            link: "/product?sort_by=new_arrival",
          },
          {
            label: "Bestsellers",
            link: "/#best-seller",
          },

          "Limited Editions",
          "Curated by ELOVA",
          "Jewelry Under $1000",
        ],
      },
      {
        title: "STYLE & EDUCATION ",
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
        imageUrl: "/images/home/jewellery.jpg ",
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
      {
        label: "Engagement Rings",
        image: "/images/customize/engagement.jpg",
        link: "/customize/form/reference?category_id=10&size=ring",
      },
      {
        label: "Wedding Bands",
        image: "/images/customize/band.jpg",
        link: "/customize/form/reference?category_id=1&size=band",
      },
      {
        label: "Bracelets",
        image: "/images/customize/bracelet.jpg",
        link: "/customize/form/reference?category_id=3&size=bracelet",
      },
      {
        label: "Necklaces",
        image: "/images/customize/necklace.jpg",
        link: "/customize/form/reference?category_id=6&size=necklace",
      },
      {
        label: "Earrings",
        image: "/images/customize/earring.jpg",
        link: "/customize/form/reference?category_id=4&size=earring",
      },
    ],
    categories: [],
  },

  // {
  //   title: "Customize",
  //   // categoriesWithMedia: true,
  //   // mediaCategories: [
  //   //   {
  //   //     label: "Engagement Rings",
  //   //     image: "/images/customize/engagement.jpg",
  //   //     link: "/customize-form?category_id=10&size=ring",
  //   //   },

  //   //   {
  //   //     label: "Wedding Bands",
  //   //     image: "/images/customize/engagement.jpg",
  //   //     link: "/customize-form?category_id=10&size=ring",
  //   //   },
  //   //   {
  //   //     label: "Necklace & Pendants",
  //   //     image: "/images/customize/engagement.jpg",
  //   //     link: "/customize-form?category_id=10&size=ring",
  //   //   },
  //   //   {
  //   //     label: "Bracelets",
  //   //     image: "/images/customize/engagement.jpg",
  //   //     link: "/customize-form?category_id=10&size=ring",
  //   //   },
  //   //   {
  //   //     label: "Earring",
  //   //     image: "/images/customize/engagement.jpg",
  //   //     link: "/customize-form?category_id=10&size=ring",
  //   //   },
  //   // ],
  //   categories: [
  //     {
  //       title: "Customize Jewelry",
  //       items: [
  //         {
  //           label: "Engagement Ring",
  //           link: "/customize-form?category_id=10&size=ring",
  //         },
  //         {
  //           label: "Wedding Band",
  //           link: "/customize-form?category_id=1&size=band",
  //         },
  //         {
  //           label: "Necklace",
  //           link: "/customize-form?category_id=6&size=necklace",
  //         },
  //         {
  //           label: "Bracelet",
  //           link: "/customize-form?category_id=3&size=bracelet",
  //         },
  //         // { label: "Earrings", link: "/customize-form?category_id=4" },
  //       ],
  //     },
  //     {
  //       title: "Guides & Support",
  //       items: [
  //         { label: "Customization Guide", link: "/customize" },
  //         { label: "Diamond Selection Guide", link: "/customize" },
  //         { label: "Metal & Setting Options", link: "/customize" },
  //         { label: "Ring Size Guide", link: "/customize" },
  //       ],
  //     },
  //     {
  //       title: "Inspiration Gallery",
  //       items: [
  //         { label: "Past Custom Designs", link: "/customize" },
  //         { label: "Customer Stories", link: "/customize" },
  //         { label: "Behind the Craft", link: "/customize" },
  //         { label: "Explore Signature Details", link: "/customize" },
  //       ],
  //     },
  //     {
  //       title: "STYLE & EDUCATION",
  //       items: [
  //         { label: "Jewelry Styling Guide", link: "/jewelry" },
  //         { label: "How to Layer & Stack", link: "/jewelry" },
  //         { label: "Jewelry Care", link: "/jewelry" },
  //         { label: "Metals & Materials", link: "/jewelry" },
  //         { label: "Lab-Grown Diamond Info", link: "/jewelry" },
  //       ],
  //     },
  //   ],
  //   imageSection: [
  //     {
  //       imageUrl: "/images/home/start-designing.png ",
  //       callToAction: {
  //         text: "START DESIGNING",
  //         url: "/customize",
  //       },
  //       additionalTitle: "Your Vision. Our Craft.",
  //       additionalDescription:
  //         "From modern minimalism to timeless romance — design bespoke pieces that reflect you.",
  //     },
  //   ],
  // },
  {
    title: "About us",
    categories: [
      {
        title: "Our Story",
        items: [
          { label: "The ELOVA Journey", link: "/about-us" },
          { label: "Our Mission & Values", link: "/about-us" },
          { label: "The Meaning Behind the Name", link: "/about-us" },
          { label: "What Makes Us Different", link: "/about-us" },
        ],
      },
      {
        title: "Craftsmanship",
        items: [
          { label: "Craft of an ELOVA Piece", link: "/about-us" },
          { label: "Our Design Philosophy", link: "/about-us" },
          { label: "Behind the Atelier", link: "/about-us" },
          { label: "Materials & Sourcing", link: "/about-us" },
        ],
      },
      {
        title: "Sustainability",
        items: [
          { label: "Our Ethical Promise", link: "/about-us" },
          { label: "Lab-Grown Diamond Commitment", link: "/about-us" },
          { label: "Responsible Sourcing", link: "/about-us" },
          { label: "Environmental Impact ", link: "/about-us" },
        ],
      },
      {
        title: "Customer Love",
        items: [
          { label: "Testimonials", link: "/about-us" },
          { label: "Reviews", link: "/about-us" },
          { label: "Client Stories", link: "/about-us" },
          { label: "Real Moments", link: "/about-us" },
        ],
      },
      {
        title: "Press & Features",
        items: [
          { label: "In the News", link: "/about-us" },
          { label: "Magazine Features", link: "/about-us" },
          { label: "Influencer Collaborations", link: "/about-us" },
          { label: "Awards & Recognitions", link: "/about-us" },
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
